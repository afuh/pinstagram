import 'normalize.css';
import "../sass/main.sass";
import { get, getAll, add, addEach } from './modules/shortDom';

// ======== Comments ======== //
const comments = getAll('form.comment');
const removeButton = getAll('a.remove-comment');

import { addComment, removeComment } from './modules/handleComments'

if (comments) addEach(comments, 'submit', addComment)
if (removeButton) addEach(removeButton, 'click', removeComment)


// ======== Modal ======== //
const overlay = get(".modal__overlay");
import { closeModal } from './modules/modal';
if (overlay) add(overlay, 'click', closeModal)


// ======== Likes ======== //
const hearts = getAll('form.icon');
const likeList = getAll('a.likes');

import { addLike, showLikes } from './modules/handleLikes'

if (hearts) addEach(hearts, 'submit', addLike)
if (likeList) addEach(likeList, 'click', showLikes)


// ======== Remove image / Avatar ======== //
const image = getAll('a.remove-image');
const avatar = get('a.remove-avatar');
const label = get('label.avatar__change');

import { removeImage, removeAvatar, loaderAvatar } from './modules/modalRemove'

if (image) addEach(image, 'click', removeImage);
if (avatar) add(avatar, 'click', removeAvatar);
if (label) add(label, 'change' , loaderAvatar) ;


// ======== Follow ======== //
const follow = get("form.follow");
const follower = get("a.followers");
const following = get("a.following");

import { showFollowers, showFollowing, addFollower } from './modules/handleFollow';

if (follower) add(follower, 'click', showFollowers)
if (following) add(following, 'click', showFollowing)
if (follow) add(follow, 'submit', addFollower)


// ======== Notifications ======== //
const notification = get("a.notifications")
import showNotifications from './modules/handleNotifications'
if (notification) add(notification, 'click', showNotifications)


// ======== Upload images ======== //
const upload = get('a.upload__image')
const input = get('input.upload-image')
const imageForm = get('form.form__image')

import { uploadImage, preUpload, loader } from './modules/uploadImage';

if (upload) add(upload, "click", uploadImage)
if (input) input.onchange = () => preUpload(event)
if (imageForm) add(imageForm, 'submit', loader)


// ======== Prev / Next ======== //
add(window, 'keydown', e => {
  if (!window.location.pathname.includes('/p/')) return;
  const next = get('a.next');
  const prev = get('a.prev')
  if (e.keyCode === 39 && next) next.click()
  if (e.keyCode === 37 && prev) prev.click()
})


// ======== If the page was cached, reload ======== //
// window.onpageshow = event => {
//   if (event.persisted) window.location.reload()
// };
