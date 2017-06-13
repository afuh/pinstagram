import moment from 'moment';
import axios from 'axios';
import { get } from './shortDom';
import { showModal } from './modal';


const renderModal = (res) => {
  return res.map(data => {
    // Check if the avatar is an original image, a facebook cover or a gravatar
    const checkAvatar = !data.author.avatar ?  `${data.author.gravatar}&s=30` : (data.author.avatar.includes("http") ? data.author.avatar : `/uploads/avatar/${data.author.avatar}`);

    const time = moment(data.created).fromNow()

    const img = `
      <div>
        <a href="/p/${data.image.url}" class="profile-image">
          <img src="/uploads/gallery/${data.image.name}" alt="${data.image.name}">
        </a>
      </div>
      `

    return `
      <li class="row" data-user=${data.author.username}>
        <a href="/${data.author.slug}" class="img">
          <img src="${checkAvatar}" alt="${data.author.username}'s avatar">
        </a>
        <div class="user-name">
          <a href="/${data.author.slug}">${data.author.username}</a>
          <span style="color: #262626"> ${data.notify} </span>
          <span style="display: block; font-size: 12px"> <time datetime="${data.created}"> ${time} </time> </span>
        </div>
          ${data.image.name ? img : ''}
      </li>
    `;
  })
}

function showNotifications(e) {
  e.preventDefault()

  const modal = get(".modal");
  const header = get(".header", modal);
  const ul = get(".contact-list", modal);

  axios.get(this.href)
    .then(res => {
      const { notify, user } = res.data

      const headerContent = `
        ${notify.length} new notifications
        <a href="/api/${user}/notifications/clear"> clear all </a>
      `
      header.innerHTML = !notify.length ? 'No new notifications' : headerContent;
      ul.innerHTML = renderModal(notify).join(" ")
      showModal()
    })
}

export default showNotifications;
