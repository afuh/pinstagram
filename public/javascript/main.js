import 'normalize.css';
import "../sass/main.sass";
import axios from 'axios';

/* eslint-disable no-undef */
const hearts = document.querySelectorAll("form[class='icon']");
const counter = document.querySelector(".likes-count");
/* eslint-enable no-undef */

function ajaxHeart(e) {
  e.preventDefault();

  const sibling = this.parentNode.nextSibling;
  const likes = sibling.querySelector(".likes");

  axios.post(this.action)
    .then(res => {
      const [userLikes, imgLikes] = res.data;
      this.likes.classList.toggle("on");
      counter.textContent = userLikes.length;
      likes.textContent = `${imgLikes.length} likes`;
    })
    .catch(error => console.log(error));
}

hearts.forEach(heart => heart.addEventListener('submit', ajaxHeart));


/*
  ==== Comments ====
*/

/* eslint-disable no-undef */
const comments = document.querySelectorAll("form[class='comment']");
/* eslint-enable no-undef */

function ajaxComment(e) {
  e.preventDefault()
  const sibling = this.parentNode.previousSibling;
  const commentList = sibling.querySelector("ul.comments");
  const text = this.firstChild;

  axios.post(this.action, { text: text.value } )
    .then(res => {
      const render = `
        <li>
          <a href="/${res.data.slug}">${res.data.username}</a><span>${res.data.comment.text}</span>
        </li>
      `
      commentList.insertAdjacentHTML("beforeend", render);
      text.value = "";
    })

}

comments.forEach(comment => comment.addEventListener("submit", ajaxComment));


/*
  ==== Modal ====
*/
/* eslint-enable no-undef */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal__overlay");
const buttons = document.querySelectorAll(".modal__open");
/* eslint-enable no-undef */

function closeModal(e) {
  modal.classList.remove("modal__show");
  e.stopPropagation()
}

function showModal() {
  modal.classList.add("modal__show");
}

overlay.addEventListener("click", closeModal)
buttons.forEach(button => button.addEventListener("click", showModal))


/*
  ==== Follow ====
*/
/* eslint-enable no-undef */
const follow = document.querySelector("form.follow");
const follower = document.querySelector(".followers");
const following = document.querySelector(".following");

const followerList = modal.querySelector(".contact-list");

/* eslint-enable no-undef */

function handleFollow(e) {
  e.preventDefault()
  axios.post(this.action)
    .then(res => {
      follower.textContent = `${res.data.length} followers`;
      res.data.map(profile => {
        const render = `
          <li class="row">
            <a href="/${profile.slug}" class="img">
              <img src="${profile.gravatar}" alt="${profile.username}'s avatar">
            </a>
            <div class="user-name col">
              <a href="/${profile.slug}">${profile.username}</a>
              <span> ${profile.name ? profile.name : ""}
            </div>
          </li>
        `
        followerList.insertAdjacentHTML("beforeend", render);
      })
    })
    .catch(error => console.log(error));
}

follow.addEventListener("submit", handleFollow)
