/* eslint-disable no-console */
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');
const fs = require('fs');
const promisify = require("es6-promisify");
const { siteName } = require('../helpers');

const Image = require('../models/Image');
const User = require('../models/User');
const Comment = require('../models/Comment');

// ======== Home page ======== //
exports.recentImages = async (req, res) => {
  if (!req.user) return res.redirect('/login');

  const page = req.params.page || 1;
  const limit = 12
  const skip = (page * limit) - limit

  // Search only my images and the images of the ppl. I follow.
  const following = req.user.following;
  following.push(req.user._id)

  const imagesP = Image.find( { author: following })
  .sort({ created: 'desc' })
  .skip(skip)
  .limit(limit)
  .populate('author comments');

  const countP = Image.count({ author: following });

  const [images, count] = await Promise.all([ imagesP, countP ]);

  const pages = Math.ceil(count / limit);

  if(!images.length && skip) {
    req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
    res.redirect(`/page/${pages}`);
    return;
  }

  if (!images.length) {
    const user = await User.findById(req.user._id)
    const profiles = await User.getSusggestions(user)
    res.render('tutorial', { title: 'Welcome!', text: `Welocome to ${siteName}!`, profiles })
    return;
  }
  res.render('main', { title: "Home", images, page, pages, count });

}

// ======== Upload Image ======== //
exports.imageForm = (req, res) => {
  res.render('share-image', {title: 'Share an Image'})
}

exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next ({ message: `That filetype isn't allowed!`}, false);
    }
  }
}).single('photo');

exports.resize = async (req, res, next) => {
  if (req.body.caption && req.body.caption.length > 140) {
    req.flash('error', 'Upload failed, apparently you have written too much')
    return res.redirect('back')
  }
  //rename
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(600, jimp.AUTO).quality(70);
  await photo.write(`./public/uploads/${req.body.photo}`);

  await photo.cover(290, 290, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
  await photo.write(`./public/uploads/gallery/${req.body.photo}`);

  next();
}

// ======== Avatar resize/crop middleware ======== //
exports.makeAvatar = async (req, res, next) => {
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(300, jimp.AUTO).quality(70);
  await photo.cover(150, 150, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);

  if (req.user.avatar && !req.user.avatar.includes('http')) {
    const remove = promisify(fs.unlink)
    await remove(`${__dirname}/../public/uploads/avatar/${req.user.avatar}`)
  }
  await photo.write(`./public/uploads/avatar/${req.body.photo}`);

  next();
}

// ======== Save image ======== //
exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;

  const image = (new Image(req.body)).save();
  req.flash('success', 'You have shared a new image!');

  const user = User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { posts: 1 } }
  );

  await Promise.all([ image, user ])

  res.redirect(`back`);
}

// ======== Show Profile Image / Find prev and next ======== //
exports.showImage = async (req, res) => {
  const current = await Image.findOne({ url: req.params.image }).populate('author comments')

  if (!current) return res.redirect('/');

  const [p, n] = await Promise.all([
    Image.find({ _id: { $gt: current._id }, author: current.author._id }).sort({ _id: 1 }).limit(1),
    Image.find({ _id: { $lt: current._id }, author: current.author._id }).sort({ _id: -1 }).limit(1)
  ])

  const prev = p[0] && p[0].url
  const next = n[0] && n[0].url

  res.render('image', { title: current.caption, current, prev, next });
}

// ======== Show Liked Image / Find prev and next ======== //
exports.showLike = async (req, res) => {

  const [current, user] = await Promise.all([
    Image.findOne({ url: req.params.image }).populate('author comments'),
    User.findOne({ _id: req.user._id }).populate('likes')
  ])

  if (!current) return res.redirect('/');

  const [n, p] = await Promise.all([
    Image.find({ _id: { $in: user.likes, $gt: current._id } }).sort({ _id: 1 }).limit(1),
    Image.find({ _id: { $in: user.likes, $lt: current._id } }).sort({ _id: -1 }).limit(1)
  ])

  const prev = p[0] && p[0].url
  const next = n[0] && n[0].url

  res.render('image', { title: current.caption, current, prev, next, like: true });
}

// ======== Add likes ======== //
exports.findImg = async (req, res, next) => {
  const img = await Image.findOne( { _id: req.params.id } );
  req.body.img = img;
  next();
}

exports.addLike = async (req, res, next) => {
  const img = req.body.img;
  const likes = img.likes.map(obj => obj.toString());
  const operator = likes.includes(req.user.id) ? '$pull' : '$addToSet';

  const image = await Image.findOneAndUpdate(
    { _id: req.params.id },
    { [operator]: { likes: req.user.id } },
    { new: true }
  )
  res.json(image.likes.length)

  // next -> notification
  req.body.id = image.author
  req.body.image = { url: image.url, name: image.photo }
  req.body.text = 1;
  req.body.notify = operator === "$pull" ? false : true
  next()
}

// ======== Show Likes ======== //
exports.showLikes = async (req, res) => {
  const img = await Image.findOne( { url: req.params.image } ).populate('likes');

  const likes = [...img.likes.map(like => {
    return {
      name: like.name,
      username: like.username,
      slug: like.slug,
      gravatar: like.gravatar,
      avatar: like.avatar
    }
  })]

  if (req.path.includes('api')) {
    res.json(likes)
    return;
  }

  res.render('list', { title: "Likes", list: likes })
}

// ======== Remove image ======== //
exports.removeQuestion = async (req, res) => {
  const img = await Image.findOne( { url: req.params.image } )
  res.json(img.url)
}

exports.removeImage = async (req, res, next) => {
  const img = await Image.findOne( { url: req.params.image } ).populate('comments')

  req.body.img = img;

  if (img.author.toString() !== req.user.id) {
    req.flash('error', `You can't remove that image.`);
    res.redirect('/')
    return;
  }

  if (img.comments.length) {
    await Comment.find({
      _id: img.comments.map(comment => comment._id)
    }).remove()
  }

  const remove = img.remove();
  const user = User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { posts: -1 } }
  );

  await Promise.all([user, remove])

  fs.unlinkSync(`${__dirname}/../public/uploads/${img.photo}`);
  fs.unlinkSync(`${__dirname}/../public/uploads/gallery/${img.photo}`);



  // to removeNotification
  next()
}
