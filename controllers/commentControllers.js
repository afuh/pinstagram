const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
  req.body.author = req.user._id
  req.body.image = req.params.id
  const slug = req.user.slug
  const username = req.user.username

  const comment = await new Comment(req.body).save()
  res.json({ comment, slug, username })
}
