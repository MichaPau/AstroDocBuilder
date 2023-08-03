import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import '../extern/ImageCard.js';

//const tagName = 'page-nav';

@customElement('page-nav')
export class PageNavigation extends LitElement {
    static styles = css`
        .link-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(24ch, 1fr));
            gap: 1rem;
            padding: 0;
        }
    `;

    @state()
    pages:Array<any> = [];

    @state()
    errorMessage:string = "";

    constructor() {
        super();
        //this.callFetchConfig();
        
    }

    callFetchConfig(): void {
        console.log("PageNavigation::fetchConfig");
        this.fetchConfig()
        .catch((err) => {
            console.log(err);
            this.errorMessage = "Error fetching page config file."
        })
        .then((result) => {
           
            this.pages = result;
            console.log("Pages: ",this.pages);
            //this.requestUpdate();
        });
        
        //console.log(config);
    }
    async fetchConfig() {
        const relative = '/data/page_config.json';
       // const url = new URL();
        //console.log(url);
        const configFile = await fetch(relative);
        const configJson = await configFile.json();
        return configJson;
       
        

    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        console.log('PageNavigation::firstUpdated');
        this.callFetchConfig();
    }
    render() {
        // <p>Pages length: ${this.pages.length}</p>
        //     <ul>
        //         ${this.pages.map((page) =>
        //             html`<li>${page.title}</li>`
        //         )}
        //     </ul>
        //     <button type="button" @click=${this.callFetchConfig}>Load</button>

        // <li class="link-card" id={id}>
        //                 <a href=${page.route}>
        //                     <h2>${page.title}<span>&rarr;</span></h2>
        //                     <p>${page.description !== "" ? page.description : 'No description found'}</p>
        //                 </a>
        //                 ${page.imgurl !== "" ? html`<img src='${page.imgurl}' class="thumbnail"/>` : html`<div>No image</div>`}
        //             </li>
        return html`
            
            <ul role="list" class="link-card-grid">
            ${this.pages.map((page) => 
                html`
                    <item-card title=${page.title} link=${page.route} bodyText=${page.description} imgUrl=${page.imgurl}></item-card>
                `
            )}
            
            </ul>
        `;
    }
}
//customElements.define(tagName, PageNavigation);