import { LitElement, html } from 'lit';


const tagName = 'my-element';

export class MyElement extends LitElement {

    static properties = {
      mystate: {type: String},
    }

    constructor() {
      super();
      this.mystate = "some variable";
    }
  render() {
    return html` <p>Hello Lit! ${this.mystate}</p> `;
  }
}

customElements.define(tagName, MyElement);