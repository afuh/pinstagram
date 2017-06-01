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
