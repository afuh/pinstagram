import axios from 'axios';
import { add, get } from './shortDom';

function renderModal (parent, href) {
  if (this.nextElementSibling) return;

  const render =  `
  <div class="sure-modal row">
    <a class="sure-modal__yes" href=${href}> remove </a>
    <span class="sure-modal__no"> cancel </span>
  </div>
  `
  parent.insertAdjacentHTML("beforeend", render);

  // <span class="sure-modal__no>"
  const close = this.nextElementSibling.lastElementChild;

  // remove the entire modal
  add(close, 'click', function(){
    const modal = this.parentNode
    modal.parentNode.removeChild(modal)
  })
}


function removeImage(e){
  e.preventDefault()
  const parent = this.parentNode;

  axios.put(this.href)
    .then(res => renderModal.call(this, parent, `/p/${res.data}/remove-confirm`))
    .catch(err => console.log(err.message))
}


function removeAvatar(e) {
  e.preventDefault()
  const parent = this.parentNode;

  renderModal.call(this, parent, `/api/remove-avatar-confirm`)
}


function loaderAvatar() {
  const remove = get('a.remove-avatar');

  this.parentNode.removeChild(this)
  if (remove) remove.parentNode.removeChild(remove)

  const render = `
    <div class="loader-cont row">
      <div class="loader"></div>
    </div>
  `
  get('div.avatar').insertAdjacentHTML("beforeend", render);
}

export { removeImage, removeAvatar, loaderAvatar }
