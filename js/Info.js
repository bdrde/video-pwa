import { html, render } from './lit-html/lit-html.js';
class Info extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.setCustomHeader();
        render(html`
        <div class="info">
            <div class="logo">
                <img id="top" src="./images/cloud-icon-128.png" style="width: 50pt;" />
                <img id="icon" src="./images/h-icon.svg" style="width: 50pt;" />
            </div>

            <h1>Videosprechstunde</h1>
        </div>
        `, this);
    }

    setCustomHeader() {
//        document.querySelector('#left-header').innerHTML = '';
        render('', document.querySelector('#left-header'));
        //render('', document.querySelector('#center-header'));
    }

}

customElements.define('x-info-view', Info)