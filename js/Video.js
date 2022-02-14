class Video extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.innerHTML = '\
        <div class="video"> \
          <img src="./images/arzt-cartoon.jpeg" class="video-peer"></img> \
          <div class="video-self"><img src="./images/patient-cartoon.jpeg"></img></div> \
        </div> \
        '
    }

}

customElements.define('x-video-view', Video)