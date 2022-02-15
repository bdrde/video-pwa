class Info extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.setCustomHeader();
        this.innerHTML= '<h2>Information</h2> \
        <h3>Ihr Gesprächspartner</h3> \
        <p><ul> \
            <li>Name</li> \
            <li>Krankenkasse</li> \
        </ul></p> \
        <h3>Sie</h3> \
        <p><ul> \
            <li>Name</li> \
            <li>Beruf</li> \
        </ul></p> \
        ';
    }

    setCustomHeader() {
        document.querySelector('#custom-header').innerHTML='';
    }

}

customElements.define('x-info-view', Info)