import './Info.js'
import './Video.js'
import './Prescription.js'
import {Router} from './vaadin-router.js';

console.log('I am running!');

const outlet = document.querySelector('main');
const router = new Router(outlet);
router.setRoutes([
  {path: '/video-pwa/',     component: 'x-login-view'},
  {path: '/video-pwa/info',  component: 'x-info-view'},
  {path: '/video-pwa/video', component: 'x-video-view'},
  {path: '/video-pwa/prescription', component: 'x-prescription-view'}
  //{path: '(.*)', component: 'x-login-view'},
]);
