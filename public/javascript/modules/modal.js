export const closeModal = (e) => {
  modal.classList.remove("modal__show");
  e.stopPropagation()
}

export const showModal = () => modal.classList.add("modal__show");

export const renderModal = (res) => {
  return res.map(data => {
    // Check if the avatar is an original image, a facebook cover or a gravatar
    const checkAvatar = !data.avatar ?  `${data.gravatar}&s=30` : (data.avatar.includes("http") ? data.avatar : `/uploads/avatar/${data.avatar}`);
    return `
      <li class="row" data-user=${data.username}>
        <a href="/${data.slug}" class="img">
          <img src="${checkAvatar}" alt="${data.username}'s avatar">
        </a>
        <div class="user-name col">
          <a href="/${data.slug}">${data.username}</a>
          <span> ${data.name ? data.name : ''} </span>
        </div>
      </li>
    `;
  })
}
