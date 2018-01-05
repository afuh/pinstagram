const User = require('../models/User');

// ======== Add notifications ======== //
// Follow an user and like or comment a photo will send a notification to the user
exports.addNotification = async (req, res) => {
  // Unfollow, unlike or delete a comment set the flag as 'false'
  const flag = req.body.notify

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
  const user = await User.findOne({ _id: req.user._id })
  const notify = user.notifications.reverse();

  if (req.originalUrl.includes('api')) {
    res.json(notify)
    return;
  }

  res.render('list', { title: "Notifications", list: notify })
}

exports.clearNotifications = async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id  },
    { notifications: [] }
  )
  res.redirect('back')
}

// If the user delete an image, remove it from the notifications if it exists
exports.removeNotification = async (req, res) => {
  const img = req.body.img;
  const user = await User.findOne({ _id: img.author })

  const remove = user.notifications.filter(not => {
    return !not.image.url || !not.image.url.includes(img.url)
  });
  await user.update({ notifications: remove })

  req.flash('success', 'You have removed the image!');
  res.redirect('/')
}
