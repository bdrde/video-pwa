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

        /*
        <button class="captureBack">Capture back</button>
        <button class="captureFront">Capture front</button>
        <button class="fullscreen">Full screen</button>

                          <img src="./images/patient-cartoon.jpeg" id="video-peer"></img> \

        */
        render(html`
            <div class="video">
                <div id="video-peer">
                  <img src="./images/patient-cartoon.jpeg"></img>
                  </div>
                <div class="left-space">
                    <div style="display:flex;width:100%; justify-content:center">
                      <div style="display:flex;flex-direction:column;">
                        <button class="round-button" @click=${_ => this.fullscreen()}>&#8632;</button>
                        </br>
                        <button class="round-button" @click=${_ => this.toggleAll()}>&#9205;&#9208;</button>
                      </div>
                    </div>
                    <video id="video-self" autoplay></video>
                    <div style="display:flex;width:100%; justify-content:center">                        
                        <button class="round-button" style="border-color:red;" @click=${_ => this.end()}>&#9209;</button>
                    </div>
                </div>
                
                <!-- horizontale Buttonleiste. erstmal ausgeblendet -->
                <div class="video-controls" style="display:none;" >
                    <ul>
                        <li><button class="round-button" @click=${_ => this.fullscreen()}>&#8632;</button> </li>\
                        <li><button class="round-button" @click=${_ => this.end()}>&#9209;</button> </li>\
                        <li><button class="round-button" @click=${_ => this.toggleAll()}>&#9205;&#9208;</button> </li>\
                    </ul>
                </div>
            </div>
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
            .then((stream) => {
                document.querySelector("#video-self").srcObject = stream;
                this.stream = stream;
            })
            .catch((error) => { console.error("Error: ", error); });

    }

    setCustomHeader() {

        /*
        render(html` \
            <span class="blink"></span>`
            , document.querySelector('#custom-header'));
            */
        render('', document.querySelector('#data-header'));
    }


    toggleAll() {
        this.toggle('video');
        this.toggle('audio');
    }
    /**
     * 
     * @param {*} trackType 'audio', 'video'
     */
    toggle(trackType) {
        this.stream.getTracks().forEach((track) => {
            if (track.readyState == 'live' && track.kind == trackType) {
                track.enabled = !track.enabled;
            }
        });
    }

    /**
     * 
     */
    end() {
        this.stream.getTracks().forEach((track) => {
            track.stop();
            this.stream = null;
        });


        document.querySelector('.video').style.display= 'none';
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
