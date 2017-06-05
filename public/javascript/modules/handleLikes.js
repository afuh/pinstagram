import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';

const modal = get(".modal");
const header = get(".header", modal);
const ul = get(".contact-list", modal);

function addLike(e) {
  e.preventDefault();
  const counter = this.nextSibling;

  axios.post(this.action)
    .then(res => {
      this.likes.classList.toggle("on");
      counter.textContent = `${res.data.length} likes`;
    })
    .catch(error => console.log(error));
}

function showLikes(e) {
  e.preventDefault()
  axios.get(this.href)
    .then(res => {
      header.innerHTML = "Likes";
      ul.innerHTML = renderModal(res.data).join(" ")
      showModal()
    })
    .catch(error => console.log(error));
}

function countLikes() {

}


export { addLike, showLikes }
