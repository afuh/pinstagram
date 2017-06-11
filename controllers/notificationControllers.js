const mongoose = require('mongoose');
const User = mongoose.model('User');

// ==================================================================
// Versión haciendo a mano el campo directamente en el usuario
// ==================================================================
exports.addNotification = async (req, res) => {
  const flag = req.body.notify
  // console.log({id: req.body.id, image: req.body.image, text: req.body.text, flag});

  if (!flag) return res.end()
  // don't send a notification to yourself
  if (req.body.id.toString() === req.user._id.toString()) return res.end()

  const notify = req.body.text
  const image = req.body.image

  const text = [
    "started following you",
    "liked your photo",
    "commented your photo"
  ];

  await User.findOneAndUpdate(
    { _id: req.body.id },
    { $addToSet: { notifications: {
        author: {
          username: req.user.username,
          slug: req.user.slug,
          avatar: req.user.avatar || req.user.gravatar,
        },
        image: {
          url: image.url || null,
          name: image.name || null
        },
        notify: text[notify]
    }}}
  )
  res.end()
}

exports.showNotifications = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user })
  const notify = user.notifications.reverse();

  res.json({notify, user: req.params.user})
}

exports.clearNotifications = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { slug: req.params.user },
    { notifications: [] }
  )
  res.redirect('back')
}
