import { decode as atob, encode as btoa } from 'base-64';

if (typeof global.atob === 'undefined') {
  // @ts-ignore
  global.atob = atob;
}

if (typeof global.btoa === 'undefined') {
  // @ts-ignore
  global.btoa = btoa;
}




