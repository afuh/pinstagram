import { get, add } from './shortDom';
import { showModal } from './modal';

function preUpload(event) {
  const [image] = event.target.files;
  const reader = new FileReader();

  const thumb = get("img.thumb");

  reader.onload = (event) => thumb.src = event.target.result;
  reader.readAsDataURL(image);
}

function uploadImage(e) {
  e.preventDefault()

  const modal = get(".modal");
  const content = get(".modal__content", modal);

  content.innerHTML = `
    <div class="upload form">
      <p class="upload__message"> Share a new image! </p>
      <form class="form__image col" action="/upload" method="POST" enctype="multipart/form-data">
        <label for="photo" class="upload__label col">
          <img class="thumb">
          <div class="icon-modal__upload"> ⬆︎ </div>
          <input type="file" name="photo" id="photo" accept="image/png, image/jpeg" required />
        </label>
        <textarea name="caption" placeholder="Write a caption..." maxlength="140"></textarea>
        <input class="button submit-image" type="submit" value="Share"/>
      </form>
    </div>
  `
  showModal()
  const input = get('input[type="file"]', modal)
  input.onchange = () => preUpload(event);

  const imageForm = get('form.form__image')
  add(imageForm, 'submit', loader)
}

function loader() {
  const submit = get('input.submit-image')
  const form = submit.parentNode
  form.removeChild(submit)

  const render = `
    <div class="loader-cont row">
      <div class="loader"></div>
    </div>
  `

  form.insertAdjacentHTML("beforeend", render);
}


export { uploadImage, preUpload, loader }
