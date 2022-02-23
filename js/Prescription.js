import { html, render } from './lit-html/lit-html.js';
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
        this.setCustomHeader();

        render(html`\
            <div class="prescription"> \
            <div id="receipt"> \
                <div id="receipt-title">Datum</div> \
                <div id="receipt-text">25. September 2019</div> \

                <div id="receipt-title">Krankenkasse bzw. Kostenträger</div> \
                <div id="receipt-text">AOK Nordost</div> \

                <div id="receipt-title">Vertragsarzt</div> \
                <div id="receipt-text">Dr. med. Markus Heinze
                </br>Musterallee 25
                </br>12976 Musterstadt</div> \

                <div id="receipt-title">Rp.</div> \
                <div id="receipt-text">Cardio Plus 7000</div> \

                <img src="./images/qr-code.png"></img> \

            </div> \
            </div> \
        `, this);
    }

    setCustomHeader() {
        render(html`\
            <button id="sign-prescription-button" @click=${_ => this.sign()}> \
                <img src="./images/sign-me.svg"></img> \
            </button> \
        `, document.querySelector('#custom-header'));
    }

    sign() {
        //alert('TODO: sign with sign-me');
        const w=100;
        const h=300;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    
        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom ;
        const top = (height - h) / 2 / systemZoom ;


        signPopupRef = window.open(
            domain + '/video-pwa/sign-me.html'
            //domain + '/sign-me.html'
            ,'Signieren'
            ,`
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
        if (event.origin !== domain) return;

        console.log(event);
        console.log('Signing done...');

        render(html`\
           <img class="header-image" src="./images/checkmark_boxed.png"></img>\
        `, document.querySelector('#custom-header'));

        render(html`\
           signiert am ${new Date().toLocaleString()}\
        `, document.querySelector('#data-header'));

        signPopupRef.close();
    }
}

customElements.define('x-prescription-view', Prescription)