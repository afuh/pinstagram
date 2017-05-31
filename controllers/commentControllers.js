const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
  req.body.author = req.user._id
  req.body.image = req.params.id

  const comment = new Comment(req.body);
  await comment.save()
  // req.flash("success", "blabla blas")
  res.redirect('back');
}
