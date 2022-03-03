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
            <div id="video-other">
                <h1>Willkommen</h1>
                <div class="logo">
                    <img class="bounce" src="./images/cloud-icon-128.png" style="width: 50pt;" />
                    <img src="./images/h-icon.svg" style="width: 50pt;" />
                </div>
                <h2>Es befindet sich ein Patient im Warteraum</h2>
                <button class="button light" @click=${_ => this.startVideo()} style="height:40px;">
                    <img class="button-logo" src="./images/camera-filled.svg" />
                    <div class="button-text">Video starten</div>
                </button>
            </div>

            <div id="video-all">
                <div id="video-peer">
                  <img src="./images/patient-cartoon.jpeg"></img>
                  </div>
                <div class="bottom-overlay-space">
                    <div class="control-button-group">
                    <!--
                      <div style="display:flex;flex-direction:column;">
                      -->
                        <button class="round-button" style="background-image: url('./images/microphone.svg');" @click=${_ => this.toggleAll()}></button>
                        <!--
                        </div>
                        -->
                    </div>
                    <video id="video-self" autoplay></video>
                    <div class="control-button-group">
                        <button class="round-button" style="background-color: red; background-image: url('./images/phone.svg');background-repeat: no-repeat;background-position: center;" @click=${_ => this.end()}></button>
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

        /* Video bereits an aus früherer Aktion */
        this.videoOn = window.localStorage.getItem('videoOn');
        this.videoOn == null ? false : this.videoOn;

        if (this.videoOn) {
            this.startVideo();
        }
    }

    startVideo() {
        this.displayVideo(true);
        this.initCamera();
    }

    initCamera() {
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
        render('', document.querySelector('#custom-header'));
        render('', document.querySelector('#data-header'));
    }

    displayVideo(show) {
        if (show) {
            document.querySelector('#video-other').style.display = 'none';
            document.querySelector('#video-all').style.display = 'flex';
            /* im lokalen Speicher ablegen, dass das Video an ist */

            window.localStorage.setItem('videoOn', true);
        } else {
            document.querySelector('#video-other').style.display = 'flex';
            document.querySelector('#video-all').style.display = 'none';
        }


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
        });
        this.stream = null;


        this.displayVideo(false);
        /* lokalen Speicher leeren. Default ist damit wieder 'false' */
        window.localStorage.clear();
    }

    /*
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
    */
}

customElements.define('x-video-view', Video)
