import axios from 'axios';

import { get } from './shortDom';
import { showModal, renderModal } from './modal';

function showFollowers(e) {
  const modal = get(".modal");
  const header = get(".header", modal);
  const ul = get(".contact-list", modal);

  e.preventDefault()
  axios.get(`/api${this.pathname}`)
    .then(res => {
      header.innerHTML = "Followers";
      ul.innerHTML = renderModal(res.data).join(" ")
      showModal()
    })
    .catch(error => console.log(err.message));
}

function showFollowing(e) {
  const modal = get(".modal");
  const header = get(".header", modal);
  const ul = get(".contact-list", modal);

  e.preventDefault()
  axios.get(`/api${this.pathname}`)
    .then(res => {
      header.innerHTML = "Following";
      ul.innerHTML = renderModal(res.data).join(" ")
      showModal()
    })
    .catch(error => console.log(err.message));
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
    .catch(error => console.log(err.message));
}

export { showFollowers, showFollowing, addFollower }
