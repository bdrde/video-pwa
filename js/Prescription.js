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
            <div id="prescription-header">
                <div class="data-bubble">
                    <div class="data-bubble-title">Name, Vorname</div>
                    <div class="data-bubble-content">Maximann, Max</div>
                </div>
                <div class="data-bubble">
                    <div class="data-bubble-title">Krankenkasse bzw. Kostenträger</div>
                    <div class="data-bubble-content">DAK-Gesundheit</div>
                </div>
                <div class="data-bubble">
                    <div class="data-bubble-title">Vertragsarzt</div>
                    <div class="data-bubble-content">
                    Dr. med. Markus Heinze
                    </br>Musterallee 25
                    </br>12976 Musterstadt
                    </div>
                </div>
            </div>
            
            <div id="presc-1" class="presc">
                <div class="presc-header">
                    <button id="sign-prescription-button" @click=${_ => this.sign()} style="width:100pt;"> \
                        <img src="./images/sign-me.svg"></img> \
                    </button> \
                    <div id="signing_done" style="display:none; width:100%; text-align:right;">
                        <img style="height:100%;"src="./images/siegel-blau-gruen.png"></img>
                    </div>
                </div>

                <div class="presc-body">
                    <div class="data-bubble">
                        <div class="data-bubble-title">Datum</div>
                        <div class="data-bubble-content datum">${this.currentDateFormatted()}</div>
                    </div>
                    <div class="data-bubble">
                        <div class="data-bubble-title">
                            Medikament
                        </div>
                        <div class="data-bubble-content">
                            <textarea class="data-bubble-input" rows="3" >Cardio Plus 7000\n(2x täglich)</textarea>
                        </div>
                    </div>

                    <div id="bubble-template" class="data-bubble" style="display:block;">
                        <div class="data-bubble-title">
                            Medikament
                        </div>
                        <div class="data-bubble-content">
                            <textarea class="data-bubble-input" rows="3" ></textarea>
                        </div>
                    </div>

                    <div id="last-element" style="width:100%; text-align:right; margin-top:10px;">
                        <button @click=${_ => this.addNew(_)} style="background-color: #FEE8EB; border:none;">
                            <img src="./images/plus.png" style="height: 25px; background-color: #FEE8EB; "></img>
                        </button>
                    </div>
                </div>
            </div>

         </div> \
        `, this);
    }

    addNew(){
        const template = this.querySelector("#bubble-template");
        const newBubble = template.cloneNode(true);

        const last = this.querySelector("#last-element");
        template.parentElement.insertBefore(newBubble, last);
    }

    currentDateFormatted() {
        var dt = new Date ();
        var month = "" + (dt.getMonth() + 1);
        var day = "" + dt.getDate();
        var year = dt.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        const dateF = [day, month, year].join(".");
        
        return dateF;
    }


    setCustomHeader() {
    }

    sign() {
        //alert('TODO: sign with sign-me');
        const w=300;
        const h=600;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    
        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom ;
        const top = (height - h) / 2 / systemZoom ;


        signPopupRef = window.open(
            //domain + '/video-pwa/sign-me/start.html'
            domain + '/sign-me/start.html?doc_id=1'
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

        document.querySelector('#signing_done').style.display = 'block';
        document.querySelector('#sign-prescription-button').style.display = 'none';

        /*
        render(html`\
           <img class="header-image" src="./images/checkmark_boxed.png"></img>\
        `, document.querySelector('#custom-header'));

        render(html`\
           signiert am ${new Date().toLocaleString()}\
        `, document.querySelector('#data-header'));
*/
        signPopupRef.close();
    }
}

customElements.define('x-prescription-view', Prescription)