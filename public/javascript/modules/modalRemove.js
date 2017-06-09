import axios from 'axios';
import { add } from './shortDom';

function renderModal (parent, href) {
  if (this.nextElementSibling) return;

  const render =  `
  <div class="sure-modal row">
    <span class="sure-modal__question">are you sure?</span>
    <a class="sure-modal__yes" href=${href}> ✔︎ </a>
    <span class="sure-modal__no"> ✘ </span>
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

  axios.get(this.href)
    .then(res => renderModal.call(this, parent, `/p/${res.data}/remove-confirm`))
}


function removeAvatar(e) {
  e.preventDefault()
  const parent = this.parentNode;

  renderModal.call(this, parent, `/remove-avatar-confirm`)
}

export { removeImage, removeAvatar }
