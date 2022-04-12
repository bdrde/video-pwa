import './Info.js'
import './Video.js'
import './Prescription.js'
import { Router } from './vaadin-router.js';

const outlet = document.querySelector('main');
const router = new Router(outlet);
router.setRoutes([
  { path: '/video-pwa/', component: 'x-login-view' },
  { path: '/video-pwa/info', component: 'x-info-view' },
  { path: '/video-pwa/video', component: 'x-video-view' },
  { path: '/video-pwa/prescription', component: 'x-prescription-view' }
  //{path: '(.*)', component: 'x-login-view'},
]);


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idToken = urlParams.get('id_token')

if (null == idToken) {
  document.querySelectorAll("#login-overlay").forEach((tag) => {
    tag.style.display = 'block';
    //tag.style.display = 'none'
  })
} else {
  document.querySelectorAll("#login-overlay").forEach((tag) => {
    tag.style.display = 'none';
  })


  // nachfolgender Code sorgt für Umgehung eines seltsamen Verhaltens auf iPhone 13
  var returnFromSigning = false;
  const jsonPrescriptions = window.localStorage.getItem('prescriptions');
  if (null == jsonPrescriptions || jsonPrescriptions.length == 0) {
    //jsonPrescriptions = '[{}]';
  } else {
    const currentPrescriptions = JSON.parse(jsonPrescriptions);
    if (currentPrescriptions.length > 0 && currentPrescriptions[0].signed) {
      returnFromSigning = true;
    }
  }

  if (returnFromSigning) {
    Router.go('/video-pwa/prescription');
  } else {
    Router.go('/video-pwa/video');
  }
}