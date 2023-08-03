export default 
class PageNavigation extends HTMLElement {
    constructor() {
        super();
        console.log('PageNavigation::constructor');
        
    }

    connectedCallback() {
        console.log('PageNavigation::connectedCallback');
        this.render();
    }

    disconnectedCallback() {}

    render() {
        const div = document.createElement('div');
        div.innerHTML = 'This is a message from the web component';
        this.appendChild(div);
    }
}

customElements.define('page-navigation', PageNavigation);