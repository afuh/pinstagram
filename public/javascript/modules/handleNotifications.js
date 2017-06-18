import moment from 'moment';
import axios from 'axios';
import { get } from './shortDom';
import { showModal } from './modal';


const renderModal = (res) => {
  return res.map(data => {
    // Check if the avatar is an original image, a facebook cover or a gravatar
    const { username, slug, avatar } = data.author
    const { url, name } = data.image
    const checkAvatar = avatar.includes('http') ? avatar : `/uploads/avatar/${avatar}`

    const time = moment(data.created).fromNow()

    const img = `
      <div>
        <a href="/p/${url}" class="profile-image">
          <img src="/uploads/gallery/${name}" alt="${name}" class="thumb-img">
        </a>
      </div>
      `

    return `
      <li class="row" data-user=${username}>
        <a href="/${slug}" class="img">
          <img src="${checkAvatar}" alt="${username}'s avatar">
        </a>
        <div class="user-name">
          <a href="/${slug}">${username}</a>
          <span style="color: #262626"> ${data.notify} </span>
          <span style="display: block; font-size: 12px"> <time datetime="${data.created}"> ${time} </time> </span>
        </div>
          ${name ? img : ''}
      </li>
    `;
  })
}

function showNotifications(e) {
  e.preventDefault()

  const modal = get(".modal");
  const content = get(".modal__content", modal);

  axios.get(`/api${this.pathname}`)
    .then(res => {
      const notify = res.data

      const n = notify.length
      const notification = n === 1 ? `${n} new notification` : `${n} new notifications`

      const headerContent = `
        ${notification}
        <a href="/api/notifications/clear"> clear all </a>
      `
      content.innerHTML = `
        <div class="header row"> ${!n ? 'No new notifications' : headerContent} </div>
        <ul class="contact-list">
          ${renderModal(notify).join(" ")}
        </ul>
      `
      showModal()
    }).catch(err => console.log(err.message))
}

export default showNotifications;
