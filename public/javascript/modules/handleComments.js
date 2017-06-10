import axios from 'axios';
import { get, getAll, addEach } from './shortDom';

function addComment(e) {
  e.preventDefault()
  const sibling = this.parentNode.previousSibling;
  const commentList = get("ul.comments", sibling);
  const text = this.firstChild;

  axios.post(this.action, { text: text.value } )
    .then(res => {
      const render = `
        <li class="row">
          <div class="row">
            <a href="/${res.data.slug}">${res.data.username}</a>
            <span>${res.data.comment.text}</span>
          </div>
          <a class="remove-comment" href="/api/comment/${res.data.comment._id}/remove">✕</a>
        </li>
      `
      commentList.insertAdjacentHTML("beforeend", render);
      text.value = "";

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
