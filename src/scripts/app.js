"use strict";

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)


const menuToogle = document.querySelector('.menu--toggle');
menuToogle.addEventListener('click', menuOpen)
function menuOpen() {
    document.body.classList.toggle("menu--open");
}



const menuToggle = document.getElementById('menuToggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

const body = document.body;

menuToggle.addEventListener('click', () => {
    if (menuToggle.classList.contains('active')) {
        body.classList.add('overflow-hidden');
    } else {
        body.classList.remove('overflow-hidden');
    }
});
