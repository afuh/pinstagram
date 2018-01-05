import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';

const { error } = console

const modal = get(".modal");
const content = get(".modal__content", modal);

function showFollowers(e) {
  e.preventDefault()
  axios.get(`/api${this.pathname}`)
    .then(res => {
      content.innerHTML = `
        <div class="header"> Followers </div>
        <ul class="contact-list">
          ${renderModal(res.data).join(" ")}
        </ul>
      `
      showModal()
    })
    .catch(err => error(err.message));
}

function showFollowing(e) {
  e.preventDefault()
  axios.get(`/api${this.pathname}`)
    .then(res => {
      content.innerHTML = `
        <div class="header"> Following </div>
        <ul class="contact-list">
          ${renderModal(res.data).join(" ")}
        </ul>
        `
      showModal()
    })
    .catch(err => error(err.message));
}

function addFollower(e) {
  const follower = get("a.followers");

  e.preventDefault()
  axios.post(this.action)
    .then(res => {
      const followers = `<div class="number">${res.data}</div><span>followers</span>`
      const button = this.firstChild;
      follower.innerHTML = followers;
      button.classList.toggle("Following");
      button.classList.value.includes('Following') ?
        button.innerHTML = "Following" :
        button.innerHTML = "Follow"
    })
    .catch(err => error(err.message));
}

export { showFollowers, showFollowing, addFollower }
