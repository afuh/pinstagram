import axios from 'axios';
import { get, getAll, addEach } from './shortDom';
import dompurify from 'dompurify';

function addComment(e) {
  e.preventDefault()
  const sibling = this.parentNode.previousSibling;
  const commentList = get("ul.comments", sibling);
  const input = this.firstChild;
  const trim = input.value.trim()
  const text = dompurify.sanitize(trim)

  if (text.length < 1) return;

  axios.post(this.action, { text } )
    .then(res => {
      const render = `
        <li class="row">
          <div class="row">
            <a href="/${res.data.slug}">${res.data.username}</a>
            <span>${text}</span>
          </div>
          <a class="remove-comment" href="/api/comment/${res.data.comment._id}/remove">✕</a>
        </li>
      `
      commentList.insertAdjacentHTML("beforeend", render);
      input.value = "";

      const comment = getAll('a.remove-comment');
      addEach(comment, 'click', removeComment)
    })
}

function removeComment(e) {
  e.preventDefault()
  const comment = this.parentNode;

  axios.get(this.href)
    .then(() => comment.parentNode.removeChild(comment))
}


export { addComment, removeComment };
