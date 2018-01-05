import axios from 'axios';
import { get, getAll, addEach } from './shortDom';
import dompurify from 'dompurify';

const { error } = console

function addComment(e) {
  e.preventDefault()
  const sibling = this.parentNode.previousSibling;
  const ul = get("ul.comments", sibling);
  const input = this.firstChild;
  const trim = input.value.trim()
  const text = dompurify.sanitize(trim)

  // used for autoscroll to the last comment
  const cont = get('div.content__comments', sibling);

  if (text.length < 1) return;

  axios.post(this.action, { text } )
    .then(res => {
      const render = `
        <li>
          <div class="row">
            <a href="/${res.data.slug}">${res.data.username}</a>
            <span>${text}</span>
          </div>
          <a class="remove-comment" href="/comment/${res.data.comment._id}/remove">✕</a>
        </li>
      `
      ul.insertAdjacentHTML("beforeend", render);
      input.value = "";

      // autoscroll
      const scroll = Math.max(cont.scrollHeight, cont.clientHeight);
      cont.scrollTop = scroll - cont.clientHeight

      const remove = getAll('a.remove-comment');
      addEach(remove, 'click', removeComment)
    })
    .catch(err => error(err.message))
}

function removeComment(e) {
  e.preventDefault()
  const comment = this.parentNode;

  axios.get(`/api${this.pathname}`)
    .then(() => comment.parentNode.removeChild(comment))
    .catch(err => error(err.message))
}


export { addComment, removeComment };
