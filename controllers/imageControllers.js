/* eslint-disable no-console */
const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');
const fs = require('fs');

const Image = mongoose.model('Image');
const User = mongoose.model('User');

// Home page
exports.recentImages = async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  const page = req.params.page || 1;
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
  res.render('main', { title: "Home", images, page, pages, count });

}

exports.imageForm = (req, res) => {
  res.render('uploadImage', { title: "Upload" });
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
  await photo.resize(600, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  await photo.cover(290, 290, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
  await photo.write(`./public/uploads/gallery/${req.body.photo}`);

  next();
}


exports.makeCover = async (req, res, next) => {

  if (req.user.avatar) {
    fs.unlinkSync(`${__dirname}/../public/uploads/avatar/${req.user.avatar}`);
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(300, jimp.AUTO);
  await photo.cover(150, 150, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
  await photo.write(`./public/uploads/avatar/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;
  const imageP = (new Image(req.body)).save();
  req.flash('success', 'You have shared a new image!');

  const userP = User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { posts: 1 } }
  );
  const [image, user] = await Promise.all([ imageP, userP])
  res.redirect(`/p/${image.url}`);
}

exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image }).populate('author comments');
  res.render('image', { title: image.caption, image });
}

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
  res.json(image.likes)

  // next -> notification
  req.body.id = image.author
  req.body.image = { url: image.url, name: image.photo }
  req.body.text = 1;
  req.body.notify = operator === "$pull" ? false : true
  next()
}

exports.showLikes = async (req, res) => {
  const img = await Image.findOne( { _id: req.params.id } ).populate('likes');
  res.json(img.likes)
}

exports.removeQuestion = async (req, res) => {
  const img = await Image.findOne( { url: req.params.image } )
  res.json(img.url)
}

exports.removeImage = async (req, res) => {
  const img = await Image.findOne( { url: req.params.image } )

  if (img.author.toString() !== req.user.id) {
    req.flash('error', `You can't remove that image.`);
    res.redirect('/')
    return;
  }
  await fs.unlinkSync(`${__dirname}/../public/uploads/${img.photo}`);
  await fs.unlinkSync(`${__dirname}/../public/uploads/gallery/${img.photo}`);
  const remove = img.remove();

  const user = User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { posts: -1 } }
  );

  Promise.all([user, remove])

  req.flash('success', 'You have removed the image!');
  res.redirect('/')
}
