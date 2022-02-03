import './Info.js'
import './Video.js'
import './Prescription.js'
import {Router} from './vaadin-router.js';

console.log('I am running!');

const outlet = document.querySelector('main');
const router = new Router(outlet);
router.setRoutes([
  {path: '/',     component: 'x-login-view'},
  {path: '/info',  component: 'x-info-view'},
  {path: '/video', component: 'x-video-view'},
  {path: '/prescription', component: 'x-prescription-view'}
  //{path: '(.*)', component: 'x-login-view'},
]);
