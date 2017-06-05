import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';

const modal = get(".modal");
const header = get(".header", modal);
const ul = get(".contact-list", modal);

function addLike(e) {
  e.preventDefault();

  const sibling = this.parentNode.nextSibling;
  const likes = get(".likes", sibling);

  axios.post(this.action)
    .then(res => {
      this.likes.classList.toggle("on");
      likes.textContent = `${res.data.length} likes`;
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



export { addLike, showLikes }




// /* eslint-disable no-undef */
// const hearts = document.querySelectorAll("form[class='icon']");
// const counter = document.querySelector(".likes-count");
// /* eslint-enable no-undef */
//
// function ajaxHeart(e) {
//   e.preventDefault();
//
//   const sibling = this.parentNode.nextSibling;
//   const likes = sibling.querySelector(".likes");
//
//   axios.post(this.action)
//     .then(res => {
//       const [userLikes, imgLikes] = res.data;
//       this.likes.classList.toggle("on");
//       counter.textContent = userLikes.length;
//       likes.textContent = `${imgLikes.length} likes`;
//     })
//     .catch(error => console.log(error));
// }
//
// hearts.forEach(heart => heart.addEventListener('submit', ajaxHeart));
