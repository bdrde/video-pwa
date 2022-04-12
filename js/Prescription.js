import { html, render } from './lit-html/lit-html.js';
import { Router } from './vaadin-router.js';

var signPopupRef = null;
//var domain = 'http://localhost:5500';
var domain = 'https://bdrde.github.io';

class Prescription extends HTMLElement {

    constructor() {
        super();

    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {

        // load prescription entries
        let jsonPrescriptions = window.localStorage.getItem('prescriptions');
        if (null == jsonPrescriptions || jsonPrescriptions.length == 0) {
            //this.currentPrescriptions = JSON.parse('[{"signed":"false","rp":[{"rp-1":"Antistressin Impfstoff Amp. 10 x 0.5 ml\\nMuster Pharma GmbH"}, {"rp-2":"other"}]}]');
            //jsonPrescriptions = '[{"signed":false,"rp":{"rp-0":"Antistressin Impfstoff Amp. 10 x 0.5 ml\\nMuster Pharma GmbH", "rp-1":"other"} }]';
            jsonPrescriptions = '[{"signed":false,"rp":{} }]';
        }

        this.currentPrescriptions = JSON.parse(jsonPrescriptions);

        if (this.currentPrescriptions.length > 0) {
            this.rpKeys = Object.keys(this.currentPrescriptions[0].rp);
        } else {
            this.rpKeys = [];
        }

        this.update();
    }

    update() {
        render(html`\
         <div class="prescription"> \
            <div id="prescription-header">
                <div class="data-bubble">
                    <div class="data-bubble-title">Name, Vorname</div>
                    <div class="data-bubble-content">Maximann, Max <br>U635662485</div>
                </div>
                <div class="data-bubble">
                    <div class="data-bubble-title">Krankenkasse bzw. Kostenträger</div>
                    <div class="data-bubble-content">DAK-Gesundheit <br>101575519</div>
                </div>
                <div class="data-bubble">
                    <div class="data-bubble-title">Vertragsarzt</div>
                    <div class="data-bubble-content">
                    Dr. med. Erika Mustermann
                    </br>Musterallee 25
                    </br>12976 Musterstadt
                    </div>
                </div>
            </div>
            
            <div id="presc-1" class="presc">
                <div class="presc-header">
                    <img src="./images/Euclid gematik E-Rezept Logo vert rgb.svg" style="width:55px; height:55px;" />
                    <!--img src="./images/Euclid gematik E-Rezept Logo vert rgb.svg" style="width:55px; height:55px; background-color:white; border-radius:8px;" /-->

                    <div ?hidden=${this.rpKeys.length > 0}>
                        <button id="add-prescription-btn" class="presc-header-field" @click=${_ => this.addPrescription()}>
                            <img src="./images/plus.png" style="height: 35px; width: 35px;background-color: transparent; " />
                            <span style="display:block;">neu</span>
                        </button>
                    </div>

                    <div id="signing_done" class="presc-header-field" ?hidden=${!this.isSigned()}>
                        <img style="height:55px;"src="./images/zertifikat_siegel_d-trust_rgb_72dpi.png"></img>
                        <span style="display:none;">signiert</span>
                    </div>
                </div>

                <div id="prescription-body-1" class="presc-body" ?hidden=${this.rpKeys.length == 0}>
                    <div class="data-bubble">
                        <div class="data-bubble-title">Datum</div>
                        <div class="data-bubble-content datum">${this.currentDateFormatted()}</div>
                    </div>

                    
                    ${this.rpKeys.map((key) =>
                    html`
                        <div class="data-bubble">
                            <div class="data-bubble-title">
                                Rp.
                            </div>
                            <div class="data-bubble-content">
                                <textarea class="data-bubble-input" rows="3" id=${key} .value=${this.currentPrescriptions[0].rp[key]} @keyup=${e => this.onChangeRp(e)} ?disabled=${this.currentPrescriptions[0].signed}></textarea>
                            </div>
                        </div>
                    `)}

                    <div id="last-element" style="width:100%; text-align:right; align-content:center;margin-top:10px;">
                        <button @click=${_ => this.onAddRp(_)} style="background-color: #FEE8EB; border:none;" ?hidden=${this.isSigned()}>
                            <img src="./images/plus.png" style="height: 25px; background-color: #FEE8EB; "></img>
                        </button>

                        <div ?hidden=${this.isSigned()}> <!-- wrapped in block-element, cause hidden wouldn't work otherwise -->
                            <button id="sign-prescription-button" @click=${_ => this.sign()} style="display:block; width:fit-content;">
                                <img src="./images/sign-me-dark.svg" style="width:100pt;"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         </div> \
         <div id="debug"></div>
        `, this);
    }


    disconnectedCallback() {
        this.saveState();
    }

    saveState() {
        console.log("store: " + JSON.stringify(this.currentPrescriptions));
        window.localStorage.setItem('prescriptions', JSON.stringify(this.currentPrescriptions));
    }

    isSigned() {
        return this.currentPrescriptions.length > 0 && this.currentPrescriptions[0].signed;
    }

    onChangeRp(e) {
        this.currentPrescriptions[0].rp[e.target.id] = e.target.value;
    }

    onAddRp() {
        const len = this.rpKeys.length;
        const newId = 'rp-' + len;

        this.rpKeys.push(newId);
        this.currentPrescriptions[0].rp[newId] = "";

        //this.currentPrescriptions[0].signed = true;   // test-only
        this.update();

    }

    addPrescription() {
        const len = this.rpKeys.length;
        var value = "";
        if (0 == len) {
            // first Rp -> use a default
            value = "Antistressin Impfstoff Amp. 10 x 0.5 ml\nMuster Pharma GmbH"
        }
        const newId = 'rp-' + len;

        this.rpKeys.push(newId);
        this.currentPrescriptions[0].rp[newId] = value;

        this.update();
    }

    
    currentDateFormatted() {
        var dt = new Date();
        var month = "" + (dt.getMonth() + 1);
        var day = "" + dt.getDate();
        var year = dt.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        const dateF = [day, month, year].join(".");

        return dateF;
    }


    sign() {
        //alert('TODO: sign with sign-me');
        const w = 300;
        const h = 600;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom;
        const top = (height - h) / 2 / systemZoom;


        signPopupRef = window.open(
            domain + '/video-pwa/sign-me/start-touch.html?doc_id=1'
            //domain + '/sign-me/start-touch.html?doc_id=1'
            ,'Signieren'
            , `
            popup
            ,width=${w / systemZoom}
            ,height=${h / systemZoom}
            ,top=${top}
            ,left=${left}
            ,scrollbars=yes
            ,status=no
            ,location=no
            ,toolbar=no
            `);
        window.addEventListener('message', (event) => this.onSignDone(event), false);
    }

    onSignDone(event) {
        console.log("signing finished: ", event)

        if (event.origin !== domain) return;

        this.currentPrescriptions[0].signed = true;

        this.saveState();
        //this.update();

        //signPopupRef.close();
        Router.go('/video-pwa/prescription');
    }
}

customElements.define('x-prescription-view', Prescription)