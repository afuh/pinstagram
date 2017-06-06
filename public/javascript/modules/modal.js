export const closeModal = (e) => {
  modal.classList.remove("modal__show");
  e.stopPropagation()
}

export const showModal = () => modal.classList.add("modal__show");

export const renderModal = (res) => {
  return res.map(data => {
    return `
      <li class="row" data-user=${data.username}>
        <a href="/${data.slug}" class="img">
          <img src="${data.avatar || data.gravatar}" alt="${data.username}'s avatar">
        </a>
        <div class="user-name col">
          <a href="/${data.slug}">${data.username}</a>
          <span> ${data.name ? data.name : ''} </span>
        </div>
      </li>
    `;
  })
}
