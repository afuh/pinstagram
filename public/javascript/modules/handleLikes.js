import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';



function addLike(e) {
  e.preventDefault();
  const counter = this.nextSibling;

  axios.post(this.action)
    .then(res => {
      const n = res.data
      const likes = n === 1 ? `${n} like` : n === 0 ? `Be the first to like this` : `${n} likes`
      this.likes.classList.toggle("on");
      counter.textContent = likes;
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
