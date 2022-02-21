import { html, render } from './lit-html/lit-html.js';

class Video extends HTMLElement {


    constructor() {
        super();
        this.video = null;
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.setCustomHeader();

        /*
        <button class="captureBack">Capture back</button>
        <button class="captureFront">Capture front</button>
        <button class="fullscreen">Full screen</button>

                          <img src="./images/patient-cartoon.jpeg" id="video-peer"></img> \

        */
        render(html`
        <div class="video"> \
                  <img src="./images/patient-cartoon.jpeg" id="video-peer"></img> \
                <div class="left-space"> \
                    <video id="video-self" autoplay></video>
                </div> \
            </div> \

        `, this);
        //        <video id="video-self" autoplay></video>

        this.video = document.querySelector("#video-self");
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("muted", "");
        this.video.setAttribute("playsinline", "");
        const fullscreenButton = document.querySelector(".fullscreen");

        const constraints = {
            video: { facingMode: 'user' }
        }

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: 'user' } })
            .then((stream) => { document.querySelector("#video-self").srcObject = stream; })
            .catch((error) => { console.error("Error: ", error); });

        /*
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' }})
        .then((stream) => {document.querySelector("#video-peer").srcObject = stream;})
        .catch((error) => {console.error("Error: ", error);});
    */
    }

    setCustomHeader() {

        /*
        render(html` \
            <span class="blink"></span>`
            , document.querySelector('#custom-header'));
            */
        render(html` \
            <button @click=${_ => this.videoOnOffToggle()}>On/Off</button> \
            <button @click=${_ => this.fullscreen()}>full</button> \
            `, document.querySelector('#custom-header'));

        render('', document.querySelector('#data-header'));
    }

    videoOnOffToggle () {
        navigator
            .mediaDevices
            .getUserMedia({ video: { facingMode: 'user' } })
            .then((stream) => { 
                var srcObject = document.querySelector("#video-self").srcObject;
                if (srcObject == null) {
                    document.querySelector("#video-self").srcObject = stream; 
                } else {
                    document.querySelector("#video-self").srcObject = null;
                }
            })
            .catch((error) => { console.error("Error: ", error); });
    }
    fullscreen() {
        const video = document.querySelector("#video-self");
        if (this.video.webkitEnterFullScreen) {
            this.video.webkitEnterFullScreen(); // Mobile Safari
        } else if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.webkitRequestFullscreen) {
            // Regular Safari
            this.video.webkitRequestFullscreen();
        } else if (this.video.msRequestFullscreen) {
            // IE11
            this.video.msRequestFullscreen();
        }
    }
}

customElements.define('x-video-view', Video)
