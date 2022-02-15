class Video extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.setCustomHeader();
        this.innerHTML = '\
        <div class="video"> \
            <img src="./images/patient-cartoon.jpeg" id="video-peer"></img> \
            <div class="left-space"> \
                <img src="./images/arzt-cartoon.jpeg" id="video-self"></img> \
            </div> \
        </div> \
        '
    }

    setCustomHeader() {
        document.querySelector('#custom-header').innerHTML='<span class="blink"></span>';
    }

}

customElements.define('x-video-view', Video)