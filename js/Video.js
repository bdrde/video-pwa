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
                    <img id="top" class="bounce" src="./images/cloud-icon-128.png" style="width: 50pt;" />
                    <div id="title">
                        <img class="logo-corner" src="./images/dtr-logo-corner.svg" />
                        <h1 id="text">Videosprechstunde</h1>
                        <img class="logo-dot" src="./images/dtr-logo-dot.svg" />
                    </div>        
                    <img id="icon" src="./images/h-icon.svg" style="width: 50pt;" />
                    <img id="sep" src="./images/lines.svg" style="width: 110pt;" />
                </div>

                <div id="video-waiting">
                <h2>Es befindet sich ein Patient im Warteraum</h2>
                <button class="button" @click=${_ => this.startVideo()} style="height:40px;">
                    <!-- <img class="button-logo" src="./images/camera-filled.svg"/> -->
                    <div class="button-text">Video starten</div>
                </button>
                </div>
            </div>

            <div id="video-all">
                <div class="top-overlay-space" style="display:none;">
                    <h4>Max Maximann</h4>
                    <div id="clock">0:00</div>
                </div>
                <div id="video-peer">
                  <img src="./images/patient-3.jpeg"></img>
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

    time() {
        const strCntSeconds = window.localStorage.getItem('cntSeconds');

        if ( strCntSeconds == null ||  strCntSeconds === "") {
            return;
        }

        var cntSeconds = parseInt(strCntSeconds);
        
        cntSeconds += 1;
        window.localStorage.setItem('cntSeconds', cntSeconds.toString());

        const mins = Math.floor(cntSeconds / 60);
        const secs = cntSeconds % 60;

        document.querySelector("#clock").textContent = mins + ':' + (secs < 10 ? '0' + secs : secs);
    }

    startVideo() {
        this.displayVideo(true);
        this.initCamera();

        document.querySelector('#video-on').style.display = 'inline-block';

        this.cntSeconds = window.localStorage.getItem('cntSeconds');
        if (this.cntSeconds == null) {
            window.localStorage.setItem('cntSeconds', 0);
            this.clockInterval = setInterval(this.time, 1000);
        };

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

        render('', document.querySelector('#left-header'));
        render(html`
        <h4 style="margin:0;">Max Maximann</h4>
        <span id="video-on" class="blink" style="display:none;"></span><span id="clock">0:00</span>`, document.querySelector('#center-header'));
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

        document.querySelector('#video-on').style.display = 'none';
        
        this.displayVideo(false);

        clearInterval(this.clockInterval);

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
