/* eslint-disable no-console */
import 'normalize.css';
import "../sass/main.sass";
import axios from 'axios';

/* eslint-disable no-undef */
const hearts = document.querySelectorAll("form[class='icon']");
const counter = document.querySelector(".likes-count");
/* eslint-enable no-undef */

function ajaxHeart(e) {
  e.preventDefault();
  axios.post(this.action)
    .then(data => {
      this.likes.classList.toggle("on");
      counter.textContent = data.data.likes.length;
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
          <a href="${res.data.slug}"> ${res.data.username} </a>
          <span> ${res.data.comment.text}
        </li>
      `
      commentList.insertAdjacentHTML("beforeend", render);
      text.value = "";
    })

}

comments.forEach(comment => comment.addEventListener("submit", ajaxComment));
