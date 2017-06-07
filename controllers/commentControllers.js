const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
  if (req.body.text.length > 140) {
    req.flash('error', 'Comment failed, apparently you have written too much')
    return res.redirect('/')
  }
  req.body.author = req.user._id
  req.body.image = req.params.id
  const slug = req.user.slug
  const username = req.user.username

  const comment = await new Comment(req.body).save()
  res.json({ comment, slug, username })
}
