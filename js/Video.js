import { html, render } from './lit-html/lit-html.js';

const video = document.querySelector("video");
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");
const fullscreenButton = document.querySelector(".fullscreen");

class Video extends HTMLElement {


  constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        render(html`
          <button class="captureBack">Capture back</button>
          <button class="captureFront">Capture front</button>
          <button class="fullscreen">Full screen</button>

          <video autoplay></video>
        `, this);

      this.capture(".captureFront", "user");
      this.capture(".captureBack", "environment");

      fullscreenButton.onclick = function () {
        if (video.webkitEnterFullScreen) {
          video.webkitEnterFullScreen(); // Mobile Safari
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          // Regular Safari
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          // IE11
          video.msRequestFullscreen();
        }
      };
    }

    setCustomHeader() {
        render(html` \
            <span class="blink"></span>`
            , document.querySelector('#custom-header'));
    }

  handleSuccess(stream) {
    video.srcObject = stream;
  }

  handleError(error) {
    console.error("Error: ", error);
  }

  capture(elementSelector, facingMode) {
    const element = document.querySelector(elementSelector);

    const constraints = {
      video: { facingMode: facingMode },
    };

    element.onclick = function () {
      navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    };
  }



}

customElements.define('x-video-view', Video)
