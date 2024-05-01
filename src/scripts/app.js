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





let links = document.querySelectorAll(".linktab");
for (let link of links) {
    link.addEventListener("click", linkTrigger)
}

function linkTrigger(event) {

    let list = event.currentTarget.closest("ul");
    let activeLinks = list.querySelectorAll(".linktab--active")
    for (let activeLink of activeLinks) {
        activeLink.classList.remove("linktab--active");
    }


    let links = list.querySelectorAll(".linktab")
    for (let linkTab of links) {
        let tabId = linkTab.getAttribute("href")
        let tabElement = document.querySelector(tabId);
        tabElement.classList.add("hidden");
    }

    let clickedLink = event.currentTarget;
    clickedLink.classList.add("linktab--active");

    let contentId = clickedLink.getAttribute("href")
    let content = document.querySelector(contentId);
    content.classList.remove("hidden");

}

