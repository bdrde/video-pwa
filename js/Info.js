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
                <img src="./images/cloud-icon-128.png" style="width: 50pt;" />
                <img src="./images/h-icon.svg" style="width: 50pt;" />
            </div>

            <h2>Teleclinic</h2>
            <h3>Online Health Consultation</h3>
        </div>
        `, this);
    }

    setCustomHeader() {
//        document.querySelector('#custom-header').innerHTML = '';
        render('', document.querySelector('#custom-header'));
        render('', document.querySelector('#data-header'));
    }

}

customElements.define('x-info-view', Info)