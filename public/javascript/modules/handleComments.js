import axios from 'axios';
import { get } from './shortDom';

function handleComments(e) {
  e.preventDefault()
  const sibling = this.parentNode.previousSibling;
  const commentList = get("ul.comments", sibling);
  const text = this.firstChild;

  axios.post(this.action, { text: text.value } )
    .then(res => {
      const render = `
        <li>
          <a href="/${res.data.slug}">${res.data.username}</a><span>${res.data.comment.text}</span>
        </li>
      `
      commentList.insertAdjacentHTML("beforeend", render);
      text.value = "";
    })
}

export default handleComments;
