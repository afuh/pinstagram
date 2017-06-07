/* eslint-disable no-console */
const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');

const Image = mongoose.model('Image');
const User = mongoose.model('User');

// Home page
exports.recentImages = async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  const page = req.params.page || 1;
  const limit = 3
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
  // rename
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(1080, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;
  const image = await (new Image(req.body)).save();
  req.flash('success', 'You have shared a new image!');

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { posts: 1 } }
  );
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
  next()
}

exports.showLikes = async (req, res) => {
  const img = await Image.findOne( { _id: req.params.id } ).populate('likes');
  res.json(img.likes)
}
