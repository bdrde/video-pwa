class Info extends HTMLElement {

    constructor() {
        super();
    }

    // analog zu @PostConstruct
    // aufgerufen wenn Browser das Element mit dem DOM verknüpft
    // DOM-spezifische Operationen kommen hier rein
    connectedCallback() {
        this.innerHTML= '<h2>Information</h2> \
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> \
        <p><button>LOGIN</button></p> \
        <h3>Method 1 (custom scheme, Android)</h3> \
        <p><a href="openid://">LOGIN</a></p> \
        <h3>Method 2 (http-redirect, iOS)</h3> \
        <p><a href="http://192.168.178.50:9999/authenticate?callback=https://bdrde.github.io/video-pwa/">LOGIN</a></p> \
        <h3>Method 3 (external html redirect)</h3> \
        <p><a href="https://bdrde.github.io/authN/">LOGIN</a></p> \
        ';
    }

}

customElements.define('x-info-view', Info)