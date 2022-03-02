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
            <div id="data"> \
                <div id="data-element"> \
                    <div id="data-title">Name, Vorname</div> \
                    <div id="data-text">Maximann, Max</div> \
                </div> \

                <div id="space"> </div> \

                <div id="data-element"> \
                    <div id="data-title">Krankenkasse bzw. Kostenträger</div> \
                    <div id="data-text">AOK Nordost</div> \
                </div> \

                <div id="space"> </div> \

                <div id="data-element"> \
                    <div id="data-title">Vertragsarzt</div> \
                    <div id="data-text">Dr. med. Markus Heinze
                    </br>Musterallee 25
                    </br>12976 Musterstadt</div> \
                </div> \
                <div id="space"> </div> \
            </div> \
            <div id="receipt"> \
                <div id="receipt-title" style="padding-left: 10px; display:flex;">
                    <button id="sign-prescription-button" @click=${_ => this.sign()} style="width:80pt;"> \
                        <img src="./images/sign-me.svg"></img> \
                        </button> \

                    <div id="signing_done" style="display:none; width:100%; text-align:right;">
                        <img style="width: 48px;"src="./images/checkmark_boxed.png"></img>
                    </div>
                </div> \

                <div id="space"> </div> \

                <div id="receipt-data"> \
                    <div id="receipt-title">Datum</div> \
                    <div id="receipt-text" class="datum"><p></p></div> \
                </div> \

                <div id="space"> </div> \

                <div id="receipt-data"> \
                    <div id="receipt-title">Rp. \
                       <button id="addRp" @click=${_ => this.addRp()} style="background-color: #FDF6F7; "> \
                         <img id="addRp" src="./images/plus.png" style="height: 10pt; background-color: #FDF6F7; "></img> \
                      </button> \
                   </div> \
               </div> \

                <div id="space"> </div> \

                <div id="receipt-element"> \
                    <div id="receipt-text" contentEditable="true">Cardio Plus 7000</div> \
                </div> \

                <div id="space"> </div> \

                <div id="receipt-element"> \
                    <div id="receipt-text" contentEditable="true">ASS 100</div> \
            </div> \

         </div> \
         </div> \
        `, this);

        this.setToDay();
    }

    insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    addRp(){
        var elSpace = document.createElement("div");
        elSpace.id = "space";
        var el = document.createElement("div");
        el.id = "receipt-element";
        var el2 = document.createElement("div");
        el2.id = "receipt-text";
        el2.innerHTML = "";
        el2.contentEditable = true;
        el.appendChild(el2);

        var div = document.getElementById("receipt-element");
        this.insertAfter(div, elSpace);
        this.insertAfter(div, el);
        this.insertAfter(div, elSpace);
    }

    setToDay() {
        var dt = new Date ();
        var month = "" + (dt.getMonth() + 1);
        var day = "" + dt.getDate();
        var year = dt.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        const dateF = [day, month, year].join(".");
        var x = document.getElementById("receipt-data");
        x.querySelector(".datum").innerHTML = dateF;
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