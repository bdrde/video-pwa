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
                <img id="top" class="bounce" src="./images/cloud-icon-128.png" style="width: 50pt;" />
                <div id="title">
                    <img class="logo-corner" src="./images/dtr-logo-corner.svg" />
                    <h1 id="text">Videosprechstunde</h1>
                    <img class="logo-dot" src="./images/dtr-logo-dot.svg" />
                </div>        
                <img id="icon" src="./images/h-icon.svg" style="width: 50pt;" />
                <img id="sep" src="./images/lines.svg" style="width: 110pt;" />
            </div>
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