"use strict";

// IMPORT GSAP & SCROLLTRIGGER

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

// BURGER MENU

const buttonToggle = document.querySelector('.menu--toggle');
const menu = document.querySelector('.menu');
const body = document.body;
const html = document.documentElement;

if (buttonToggle && menu) {
    buttonToggle.addEventListener('click', menuOpen);
}

function menuOpen() {
    menu.classList.toggle("active");
    buttonToggle.classList.toggle("active");

    if (menu.classList.contains('active')) {
        body.classList.add('menu--open');
        html.classList.add('menu--open');
    } else {
        body.classList.remove('menu--open');
        html.classList.remove('menu--open');
    }
}

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
                behavior: "smooth",
            });
        }
    });
});

const menuLinks = document.querySelectorAll('.menu__el a');

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        buttonToggle.classList.remove('active');
        body.classList.remove('menu--open');
        html.classList.remove('menu--open');
    });
});

// PROGRESS BAR

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

// STICKY NAV

const headerSticky = document.querySelector('.header--sticky');
if (headerSticky) {
    headerSticky.classList.add('visible');

    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop) {
            headerSticky.classList.remove('visible');
        } else {
            headerSticky.classList.add('visible');
        }
        lastScrollTop = currentScroll;
    });
}

// MOUSE

const circleElement = document.querySelector('.circle');
if (circleElement) {
    const mouse = { x: 0, y: 0 };
    const previousMouse = { x: 0, y: 0 };
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
    };
    tick();
}

// ETAT ACTIF NAV

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav__el");

function updateMenuActiveState(activeIndex) {
    navLinks.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add("nav__el--active");
        } else {
            item.classList.remove("nav__el--active");
        }
    });
}

sections.forEach((section, index) => {
    const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
            updateMenuActiveState(index - 1);
        },
        onLeaveBack: () => {
            updateMenuActiveState(index - 2);
        },
    });

    const resizeObserver = new ResizeObserver(() => {
        trigger.refresh();
    });
    resizeObserver.observe(section);
});

// ANIM WRITE TEXT

function splitTextToSpans(element) {
    const text = element.innerText;
    element.innerHTML = "";
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        element.appendChild(span);
    });
}

const textMoi = document.querySelector('.home__text--moi');
const textPortfolio = document.querySelector('.home__text--portfolio');

if (textMoi) {
    splitTextToSpans(textMoi);
}
if (textPortfolio) {
    splitTextToSpans(textPortfolio);
}

gsap.set('.home__text span', { opacity: 0 });

gsap.to('.home__text--moi span', {
    opacity: 1,
    duration: 0.01,
    stagger: 0.01,
    ease: 'power1.inOut',
    onComplete: () => {
        gsap.to('.home__text--portfolio span', {
            opacity: 1,
            duration: 0.01,
            stagger: 0.01,
            ease: 'power1.inOut',
        });
    }
});

// ANIM TEXT SCROLL GSAP

const blockText = document.querySelector('.animated-block__text');
if (blockText) {
    const wordList = blockText.textContent.split(' ').filter(w => w.trim().length > 0);
    const spanList = wordList.map(w => '<span>' + w + '</span>');
    blockText.innerHTML = spanList.join(' ');

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.animated-block span', {
        opacity: 0.2,
        stagger: 0.5,
        scrollTrigger: {
            trigger: '.animated-block',
            start: '-10% top',
            end: '100% top',
            scrub: true,
            pin: true,
        }
    });
}

// SLIDER GSAP

const slider = gsap.utils.toArray(".projets__content");
if (slider.length > 0) {
    let tween = gsap.to(slider, {
        xPercent: -95 * (slider.length - 0),
        scrollTrigger: {
            trigger: ".projets__slider",
            start: "top 20%",
            pin: true,
            scrub: 1,
        },
    });
}

// MODAL

var modals = document.querySelectorAll('.modal');
var links = document.querySelectorAll('.projets__content');

links.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        var modalId = link.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
            html.classList.add('modal--open');
            document.body.style.overflow = "hidden";
        }
    });
});

modals.forEach(function (modal) {
    var closeButton = modal.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            html.classList.remove('modal--open');
        });
    }

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            html.classList.remove('modal--open');
        }
    });
});

// SLIDER

const initializeSlider = (slider) => {
    const sliderList = slider.querySelector('.slider__list');
    const sliderElements = slider.querySelectorAll('.slider__el');
    const prevButton = slider.querySelector('.slider__prev');
    const nextButton = slider.querySelector('.slider__next');

    let currentIndex = 0;
    const totalSlides = sliderElements.length;

    const goToSlide = (index) => {
        sliderList.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(currentIndex);
    };

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    }

    setInterval(nextSlide, 5000);

    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
};

const sliders = document.querySelectorAll('.slider');
sliders.forEach((slider) => {
    initializeSlider(slider);
});


// JEU


const elementAleatoire = (arr) => arr[Math.floor(Math.random() * arr.length)];
const loadJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load JSON from ${url}`);
    }
    return response.json();
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

let bestScore = 0;
let correctAnswers = 0;
let notesAndImages = [];
let currentNoteIndex = 0;
let currentAudio = null;
let imgElements = [];

const scorePhrases = {
    0: "Autant abandonné... 🫠",
    1: "Ouf, l'honneur est sauf 🙂‍↕️",
    2: "Hehe, tout pile la moitié🥴",
    3: "Personne n'est parfait 🤷‍♂️",
    4: "Point faible, trop fort 😎"
};

const jeuInitialisation = () => {
    imgElements = document.querySelectorAll('.annexe__img');
    imgElements.forEach((img, index) => {
        img.addEventListener('click', handleImageClick);
    });

    document.querySelector('.annexe__button').addEventListener('click', playNote);

    document.getElementById('annexe__button--refresh').addEventListener('click', () => {
        resetGame();
    });
};

const handleImageClick = (event) => {
    const img = event.target;
    if (notesAndImages[0] && img.src.includes(notesAndImages[0].correctImage)) {
        //console.log('Réponse correcte');
        correctAnswers++;
        //console.log('Nombre de réponses correctes:', correctAnswers);
    } else {
        //console.log('Réponse fausse');
    }
    notesAndImages.shift();
    updateImages();
    currentNoteIndex = 0;
};

const updateImages = () => {
    const nextNotesAndImages = notesAndImages[0];
    if (nextNotesAndImages) {
        imgElements.forEach((img, index) => {
            img.src = nextNotesAndImages.allImages[index];
        });
    } else {
        //console.log("Toutes les notes ont été jouées.");
        document.querySelector('.annexe__jeu').style.display = 'none';
        document.querySelector('.annexe__button').removeEventListener('click', playNote);
        document.getElementById('score-now').textContent = correctAnswers;
        if (correctAnswers > bestScore) {
            bestScore = correctAnswers;
        }
        document.getElementById('score-best').textContent = bestScore;
        document.getElementById('phrase').textContent = scorePhrases[correctAnswers] || '';
        document.querySelector('.annexe__result').style.display = 'block';
    }
};

const playNote = () => {
    if (notesAndImages.length === 0) {
        return;
    }

    const { notes } = notesAndImages[0];
    if (currentNoteIndex >= notes.length) {
        currentNoteIndex = 0;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const note = notes[currentNoteIndex];
    //console.log(`Playing note: ${note}`);
    currentAudio = new Audio(`assets/son/${note}.mp3`);
    currentAudio.play();
    currentNoteIndex++;
};

const resetGame = async () => {
    correctAnswers = 0;
    notesAndImages = [];
    currentNoteIndex = 0;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    imgElements.forEach(img => {
        img.removeEventListener('click', handleImageClick);
    });
    document.querySelector('.annexe__button').removeEventListener('click', playNote);
    document.querySelector('.annexe__result').style.display = 'none';
    jeuInitialisation();
    await initRandomNotesAndImages();
    document.querySelector('.annexe__jeu').style.display = 'grid';
};

const initRandomNotesAndImages = async () => {
    try {
        //console.log('Loading JSON...');
        const data = await loadJSON('assets/data/son.json');
        //console.log('JSON loaded:', data);

        while (notesAndImages.length < 4) {
            const randomFilm = elementAleatoire(data);
            const notes = randomFilm.Notes;
            const correctImage = randomFilm.Images;
            const otherFilms = data.filter(film => film !== randomFilm);
            const otherImages = [];
            while (otherImages.length < 3) {
                const film = elementAleatoire(otherFilms);
                if (!otherImages.includes(film.Images)) {
                    otherImages.push(film.Images);
                }
            }
            const allImages = [correctImage, ...otherImages];
            shuffleArray(allImages);
            notesAndImages.push({ notes, allImages, correctImage });
            data.splice(data.indexOf(randomFilm), 1);
        }

        //console.log('Notes and Images:', notesAndImages);
        updateImages();
    } catch (error) {
        //console.error('Error initializing notes and images:', error);
    }
};

jeuInitialisation();
initRandomNotesAndImages();

const button = document.querySelector('.annexe__button');
button.addEventListener('click', () => {
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 300);
});