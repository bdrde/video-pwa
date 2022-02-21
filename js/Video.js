import { html, render } from './lit-html/lit-html.js';
class Video extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.setCustomHeader();
        render(html`\
        <div class="video"> \
            <img src="./images/patient-cartoon.jpeg" id="video-peer"></img> \
            <div class="left-space"> \
                <img src="./images/arzt-cartoon.jpeg" id="video-self"></img> \
            </div> \
        </div> \
        `, this);
    }

    setCustomHeader() {
        render(html` \
            <span class="blink"></span>`
            , document.querySelector('#custom-header'));

        render('', document.querySelector('#data-header'));

    }

}

customElements.define('x-video-view', Video)