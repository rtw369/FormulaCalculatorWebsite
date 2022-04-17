import {initialize, calculate, degOrRad} from './DOM.js';

const inputBtn = document.querySelector('#inputBtn');
const calculateBtn = document.querySelector('#calculate');
const degRad = document.querySelector('#degRad');

degRad.addEventListener('click', () => degOrRad());
inputBtn.addEventListener('click', () =>initialize());
calculateBtn.addEventListener('click', () => calculate());