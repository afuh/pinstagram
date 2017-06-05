import 'normalize.css';
import "../sass/main.sass";
import { get, getAll, add, addEach } from './modules/shortDom';

/*
  ==== Comments ====
*/
const comments = getAll('form.comment');
import handleComments from './modules/handleComments'
addEach(comments, 'submit', handleComments)


/*
  ==== Modal ====
*/
const overlay = get(".modal__overlay");
import { closeModal } from './modules/modal';
add(overlay, 'click', closeModal)

/*
  ==== Likes ====
*/
const hearts = getAll('form.icon');
const likeList = getAll('a.likes');

import { addLike, showLikes } from './modules/handleLikes'

addEach(hearts, 'submit', addLike)
addEach(likeList, 'click', showLikes)

/*
  ==== Follow ====
*/
const follow = get("form.follow");
const follower = get("a.followers");
const following = get("a.following");

import { showFollowers, showFollowing, addFollower } from './modules/handleFollow';

add(follower, 'click', showFollowers)
add(following, 'click', showFollowing)
add(follow, 'submit', addFollower)
