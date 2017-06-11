import 'normalize.css';
import "../sass/main.sass";
import { get, getAll, add, addEach } from './modules/shortDom';

// if (window.performance && window.performance.navigation.type == 2) {
//   window.location.reload();
// }
/*
  ==== Comments ====
*/
const comments = getAll('form.comment');
const removeButton = getAll('a.remove-comment');

import { addComment, removeComment } from './modules/handleComments'

if (comments) addEach(comments, 'submit', addComment)
if (removeButton) addEach(removeButton, 'click', removeComment)

/*
  ==== Modal ====
*/
const overlay = get(".modal__overlay");
import { closeModal } from './modules/modal';
if (overlay) add(overlay, 'click', closeModal)

/*
  ==== Likes ====
*/
const hearts = getAll('form.icon');
const likeList = getAll('a.likes');

import { addLike, showLikes } from './modules/handleLikes'

if (hearts) addEach(hearts, 'submit', addLike)
if (likeList) addEach(likeList, 'click', showLikes)

/*
  ==== Remove ====
*/
const image = getAll('a.remove-image');
const avatar = get('a.remove-avatar');

import { removeImage, removeAvatar } from './modules/modalRemove'

if (image) addEach(image, 'click', removeImage);
if (avatar) add(avatar, 'click', removeAvatar);


/*
  ==== Follow ====
*/
const follow = get("form.follow");
const follower = get("a.followers");
const following = get("a.following");

import { showFollowers, showFollowing, addFollower } from './modules/handleFollow';

if (follower) add(follower, 'click', showFollowers)
if (following) add(following, 'click', showFollowing)
if (follow) add(follow, 'submit', addFollower)

/*
  ==== Notifications ====
*/
const notification = get("a.notifications")
import showNotifications from './modules/handleNotifications'
if (notification) add(notification, 'click', showNotifications)
