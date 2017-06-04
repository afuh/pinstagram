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
/* eslint-disable no-undef */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal__overlay");
const ul = modal.querySelector(".contact-list");
const header = modal.querySelector(".header");
/* eslint-enable no-undef */

function closeModal(e) {
  modal.classList.remove("modal__show");
  e.stopPropagation()
}

function showModal() {
  modal.classList.add("modal__show");
}

overlay.addEventListener("click", closeModal)
// buttons.forEach(button => button.addEventListener("click", showModal))


/*
  ==== Follow ====
*/
/* eslint-disable no-undef */
const follow = document.querySelector("form.follow");
const follower = document.querySelector("a.followers");
const following = document.querySelector("a.following");
/* eslint-enable no-undef */

const render = (res) => {
  return res.map(data => {
    return `
      <li class="row" data-user=${data.username}>
        <a href="/${data.slug}" class="img">
          <img src="${data.gravatar}" alt="${data.username}'s avatar">
        </a>
        <div class="user-name col">
          <a href="/${data.slug}">${data.username}</a>
          <span> ${data.name ? data.name : ''} </span>
        </div>
      </li>
    `;
  })
}

function showFollowers(e) {
  e.preventDefault()
  axios.get(this.href)
    .then(res => {
      header.innerHTML = "Followers";
      ul.innerHTML = render(res.data).join(" ")
      showModal()
    })
    .catch(error => console.log(error));
}

follower.addEventListener("click", showFollowers)

function showFollowing(e) {
  e.preventDefault()
  axios.get(this.href)
    .then(res => {
      header.innerHTML = "Following";
      ul.innerHTML = render(res.data).join(" ")
      showModal()
    })
    .catch(error => console.log(error));
}

following.addEventListener("click", showFollowing)



function addFollower(e) {
  e.preventDefault()
  axios.post(this.action)
    .then(res => {
      const followers = `${res.data.length} followers`
      const button = this.firstChild;
      follower.innerHTML = followers;
      button.classList.toggle("Following");
      button.classList.value.includes('Following') ?
        button.innerHTML = "Following" :
        button.innerHTML = "Follow"
    })
    .catch(error => console.log(error));
}

follow.addEventListener("submit", addFollower)
