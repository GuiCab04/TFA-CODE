"use strict";

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)


// BOUTON BURGER
const buttonToggle = document.querySelector('.menu--toggle');
buttonToggle.addEventListener('click', menuOpen);

function menuOpen() {
    document.body.classList.toggle("menu--open");
}

// BURGER MENU
const menuToggle = document.getElementById('menuToggle');
const menu = document.querySelector('.menu');
const body = document.body;

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');

    if (menu.classList.contains('active')) {
        body.classList.add('overflow-hidden');
    } else {
        body.classList.remove('overflow-hidden');
    }
});

// SCROLL MENU BUTTON
const linkScrollMenu = document.querySelectorAll('a[href^="#"]');

linkScrollMenu.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            let offsetTop;
            if (window.innerWidth >= 1200) {
                offsetTop = target.offsetTop - 100;
            } else {
                offsetTop = target.offsetTop - 50;
            }
            window.scrollTo({
                top: offsetTop,
            });
        }
    });
});



// RESET BURGER MENU CLICK BUTTON
const menuLinks = document.querySelectorAll('.menu__el a');

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('overflow-hidden');
        document.body.classList.remove("menu--open");
    });
});



//TAB

const buttonTab = document.querySelectorAll(".linktab");
buttonTab.forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const list = event.currentTarget.closest("ul");
        const activeButtons = list.querySelectorAll(".linktab--active");
        activeButtons.forEach(activeButton => {
            activeButton.classList.remove("linktab--active");
        });

        button.classList.add("linktab--active");

        const buttonsTabs = list.querySelectorAll(".linktab");
        buttonsTabs.forEach(buttonTab => {
            const tabId = buttonTab.dataset.target;
            const tabElement = document.querySelector(tabId);
            tabElement.classList.add("hidden");
        });
        const contentId = button.dataset.target;
        const content = document.querySelector(contentId);
        content.classList.remove("hidden");
    });
});



//PROGRESS BAR

const scrollBarProgress = document.querySelector(".progressBar");
if (scrollBarProgress) {
    window.addEventListener("scroll", scrollListener);
}

function scrollListener() {
    let maxScroll = document.body.scrollHeight - window.innerHeight;
    let currentScroll = window.scrollY;
    let readPercentage = (currentScroll / maxScroll) * 100;
    scrollBarProgress.style.width = readPercentage + '%';
}


//STICKY NAV

document.querySelector('.header--sticky').classList.add('visible');

let lastScrollTop = 0;

window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        document.querySelector('.header--sticky').classList.remove('visible');
    } else {
        document.querySelector('.header--sticky').classList.add('visible');
    }
    lastScrollTop = currentScroll;
});




//MOUSE



const circleElement = document.querySelector('.circle');
const mouse = { x: 0, y: 0 };
const previousMouse = { x: 0, y: 0 }
const circle = { x: 0, y: 0 };

let currentScale = 0;
let currentAngle = 0;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
const buttonsAndLinks = document.querySelectorAll('button, a');

buttonsAndLinks.forEach(element => {
    element.addEventListener('mouseenter', () => {
        circleElement.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        circleElement.classList.remove('hover');
    });
});

const speed = 1;
const tick = () => {
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;
    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;
    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    if (mouseVelocity > 20) {
        currentAngle = angle;
    }
    const rotateTransform = `rotate(${currentAngle}deg)`;
    circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

    window.requestAnimationFrame(tick);
}
tick();