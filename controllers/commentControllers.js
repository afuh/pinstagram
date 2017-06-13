const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');
const Image = mongoose.model('Image');

exports.addComment = async (req, res, next) => {
  if (req.body.text.length > 140) {
    req.flash('error', 'Comment failed, apparently you have written too much, please try again')
    return res.redirect('/')
  }
  req.body.author = req.user._id
  req.body.image = req.params.id
  const slug = req.user.slug
  const username = req.user.username

  const comment = await new Comment(req.body).save()
  res.json({ comment, slug, username })

  // next -> notification
  const image = await Image.findOne({ _id: req.params.id })
  req.body.id = image.author
  req.body.image = { url: image.url, name: image.photo }
  req.body.text = 2;
  req.body.notify = true
  next()
}

exports.removeComment = async (req, res) => {
  const comment = await Comment.findOne( { _id: req.params.id } )

  if (comment.author._id.toString() !== req.user.id) {
      req.flash('error', `You can't remove that comment.`);
      res.redirect('/')
      return;
    }

  await comment.remove()
  res.json(comment._id)
}
