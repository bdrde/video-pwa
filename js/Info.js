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
            <div class="card">
                <h3>Ihr Gesprächspartner</h3> \
                <img src="./images/dak-egk.png" style="width:100%;"/>
                <h4>Angaben</h4>
                <p>
                    <ul>
                        <li> Kopfschmerzen
                        <li> Erschöpfung
                        <li> Ohrenschmerzen (links)
                    </ul>
                </p>
            </div>
            <div class="card">
                <h3>Sie</h3> \
                <p><ul> \
                    <li>Name</li> \
                    <li>Beruf</li> \
                </ul></p> \
                </div>
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