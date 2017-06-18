import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';



function addLike(e) {
  e.preventDefault();
  const counter = this.nextSibling;

  axios.post(this.action)
    .then(res => {
      this.likes.classList.toggle("on");
      counter.textContent = `${res.data} likes`;
    })
    .catch(err => console.log(err.message));
}

function showLikes(e) {
  e.preventDefault()

  const modal = get(".modal");
  const content = get(".modal__content", modal);

  axios.get(`/api${this.pathname}`)
    .then(res => {
      content.innerHTML = `
        <div class="header row"> Likes </div>
        <ul class="contact-list">
          ${renderModal(res.data).join(" ")}
        </ul>
      `
      showModal()
    })
    .catch(err => console.log(err.message));
}

export { addLike, showLikes }
