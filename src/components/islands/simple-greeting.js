import {html, css, LitElement} from 'lit';

const tagName = 'simple-greeting';
export class SimpleGreeting extends LitElement {
  static styles = css`p { color: blue }`;

  static get properties() {
    return {
        name: {
            type: String,
        },
    };
}

  constructor() {
    super();
    this.name = 'Somebody';
  }

  changeName() {
    console.log("SimpleGreeting::changeName");
    this.name = 'Micha';
  }
  // connectedCallback() {
  //   //this.name = "Kitti";
  // }

  firstUpdated() {
    console.log("SimpleGreeting::firstUpdated");
  }

  render() {
    return html`
        <div>
        <p>Hello, ${this.name}!</p>
        <button type="button" @click=${this.changeName}>Change</button>
        </div>
    `;
  }
}
customElements.define(tagName, SimpleGreeting);