import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const tagName = 'simple-greeting';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'Somebody';

  _timerInterval:ReturnType<typeof setInterval> | undefined;

  connectedCallback() {
    super.connectedCallback();
    console.log("SimpleGreeting::connectionCallback:", this);
    addEventListener('keydown', this._handleKeydown);
    this.name = "Micha";
    
  }
  private _handleKeydown = () => {
    console.log("SimpleGreeting::_handleKeydown:", this);
    //this._timerInterval = setInterval(() => this.requestUpdate(), 1000);
    this.name = "Everybody";
  }
  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties); 
    
    console.log("SimpleGreeting::first updated:", this.name);
    
  }
  buttonHandler() {
    this.name = "Nobody";
  }
  render() {
    return html`
      <p>Hello, ${this.name}!</p>
      <button @click=${this.buttonHandler}>Click</button>
      `;
  }
}
//customElements.define(tagName, SimpleGreeting);