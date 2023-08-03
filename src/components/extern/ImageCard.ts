import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

const tagName = 'item-card';

  
@customElement('item-card')
export class ImageCard extends LitElement {
    static styles = css`
        .thumbnail {
            width: 100%;
            max-width: 100%;
            /* border: 1px solid black; */
            object-fit: contain;
        }

        .item-card {
            list-style:none;
            display:flex;
            height: 100%;

            background-color: white;
            background-image: none;
            box-shadow: 0px 0px 3px 0px rgba(157, 157, 157, 1);

        }
        .item-card:hover {
            box-shadow: 0px 0px 9px 0px rgba(157, 157, 157, 1);

        }
        .item {
            margin: 0.25em;
        }
        .item:first-child {
            // border: 1px solid red;
            flex: 1 1 70%;
        }

        .item:last-child {
            // border: 1px solid blue;
            flex: 1 1 30%;
        }
        a {
            text-decoration: none;
        }
        h2 {
            margin: 0;
            font-size: 1rem;
            // transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        p {
            margin-top: 0.5rem;
            margin-bottom: 0;
            color: #444;
        }
    `;

    @property({type:String})
    _id:string = "-1";

    @property({type:String})
    title:string = "Title";

    @property({type:String})
    bodyText:string = "Content";

    @property({type:String})
    imgUrl:string = "";

    @property({type:String})
    link:string = "";

    async checkImg() {
        const img = await fetch(this.imgUrl);
        if(img.status === 404) throw Error('image not found');
        return img;
    }
    constructor() {
        super();
        
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        if(this.imgUrl !== '') {
            this.checkImg()
           
            .catch((err) => {
                console.log('no image found for ', this.id);
                this.imgUrl = './assets/thumbnails/doc_default.png';
            });
        }
        

    }
    render() {
        return html`
        <li class="item-card" id=${this.id}>
            <a href=${this.link} class="item">
                <h2>${this.title}<span>&rarr;</span></h2>
                <p>${this.bodyText}</p>
            </a>
            <div class="item">
            ${this.imgUrl !== "" ? html`<img src='${this.imgUrl}' class="thumbnail"/>` : html`<img src='./assets/thumbnails/doc_default.png' class="thumbnail"/>`}
            </div>
        </li>
        `;
    }


}

