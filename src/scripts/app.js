"use strict";

// IMPORT GSAP & SCROLLTRIGGER

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// BURGER MENU

const buttonToggle = document.querySelector('.menu__nav--toggle');
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

const scrollBarProgress = document.querySelector(".bar--progress");
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

    const interactiveElements = document.querySelectorAll('.projets--cursorBig, button, a');

    interactiveElements.forEach(element => {
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

const homeTextSpan = document.querySelectorAll('.home__text span');
if (homeTextSpan.length > 0) {
    gsap.set(homeTextSpan, { opacity: 0 });
}

if (textMoi && textPortfolio) {
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
}

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
window.onload = function () {
    for (let i = 0; i < slider.length; i++) {
        let img = new Image();
        img.src = slider[i].querySelector(".projets__img").src;
    }
};
if (slider.length > 0) {
    let tween = gsap.to(slider, {
        xPercent: -95 * (slider.length - 0),
        scrollTrigger: {
            trigger: ".projets__slider",
            start: "top 20%",
            pin: true,
            scrub: 1,
            onUpdate: function () {
                gsap.to(slider.map(item => item.querySelector('.projets__img')), {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
        },
    });
}



// MODAL

const modals = document.querySelectorAll('.modal');
const links = document.querySelectorAll('.projets__content');

links.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const modalId = link.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
            html.classList.add('modal--open');
            document.body.style.overflow = "hidden";
            gsap.set(modal, { y: '100%' });
            gsap.to(modal, {
                duration: 0.5,
                y: 0,
                ease: 'power4.out'
            });
        }
    });
});

modals.forEach(modal => {
    const closeButton = modal.querySelector('.modal__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            gsap.to(modal, {
                duration: 0.5,
                y: '100%',
                ease: 'power4.in',
                onComplete: () => {
                    modal.style.display = "none";
                }
            });
            document.body.style.overflow = "auto";
            html.classList.remove('modal--open');
        });
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            gsap.to(modal, {
                duration: 0.5,
                y: '100%',
                ease: 'power4.in',
                onComplete: () => {
                    modal.style.display = "none";
                }
            });
            document.body.style.overflow = "auto";
            html.classList.remove('modal--open');
        }
    });
});
const suggestionLinks = document.querySelectorAll('.modal__suggestionImage a');

suggestionLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const currentModal = link.closest('.modal');
        gsap.to(currentModal, {
            duration: 0.5,
            y: '100%',
            ease: 'power4.in',
            onComplete: () => {
                currentModal.style.display = "none";

                const targetModalId = link.getAttribute('href').trim();
                const targetModal = document.getElementById(targetModalId);
                if (targetModal && targetModal.classList.contains('modal')) {
                    targetModal.style.display = "block";
                    html.classList.add('modal--open');
                    document.body.style.overflow = "hidden";
                    gsap.set(targetModal, { y: '100%' });
                    gsap.to(targetModal, {
                        duration: 0.5,
                        y: 0,
                        ease: 'power4.out'
                    });
                }
            }
        });
        document.body.style.overflow = "auto";
        html.classList.remove('modal--open');
    });
});



// SLIDER

const initializeSlider = slider => {
    const sliderList = slider.querySelector('.slider__list');
    const sliderElements = slider.querySelectorAll('.slider__el');
    const prevButton = slider.querySelector('.slider__prev');
    const nextButton = slider.querySelector('.slider__next');

    let currentIndex = 0;
    const totalSlides = sliderElements.length;

    const goToSlide = index => {
        sliderList.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(currentIndex);
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    };

    let sliderInterval = setInterval(nextSlide, 5000);

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    }

    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
};

const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => {
    initializeSlider(slider);
});

// JEU

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
let isFirstClick = true;
let correctAnswerClicked = false;
let timerId = null;

const scorePhrases = {
    0: "Autant abandonner... 🫠",
    1: "Ouf, l'honneur est sauf 🙂‍↕️",
    2: "Hehe, tout pile la moitié 🥴",
    3: "Personne n'est parfait 🤷‍♂️",
    4: "Point faible, trop fort 😎"
};

const resetGameElements = () => {
    correctAnswers = 0;
    notesAndImages = [];
    currentNoteIndex = 0;
    isFirstClick = true;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    imgElements.forEach(img => {
        img.removeEventListener('click', handleImageClick);
    });

    const playButton = document.querySelector('.annexe__button');
    if (playButton) {
        playButton.removeEventListener('click', playNote);
    }

    const resultElement = document.querySelector('.annexe__result');
    if (resultElement) {
        resultElement.style.display = 'none';
    }
    const testElement = document.querySelector('.annexe__h2--test');
    if (testElement) {
        testElement.style.display = 'block';
    }


    initGameElements();
    initRandomNotesAndImages();
    const jeuElement = document.querySelector('.annexe__jeu');
    if (jeuElement) {
        jeuElement.style.display = 'grid';
    }

    currentManche = 0;

};


const resetGameAnimation = () => {
    const jeuElement = document.querySelector('.annexe__jeu');
    const resultElement = document.querySelector('.annexe__result');
    const testTitle = document.querySelector('.annexe__h2--test');
    const compteurElement = document.querySelector('.annexe__compteur');

    if (jeuElement && resultElement && testTitle && compteurElement) {
        gsap.to([resultElement], {
            duration: 0.5,
            opacity: 0,
            y: -20,
            onComplete: () => {
                resultElement.style.display = 'none';

                testTitle.style.display = 'block';
                gsap.set(testTitle, {
                    opacity: 0,
                    y: 20
                });
                compteurElement.style.display = 'block';
                gsap.set(compteurElement, {
                    opacity: 0,
                    y: 20
                });
                gsap.set(jeuElement, {
                    display: 'grid',
                    opacity: 0,
                    y: 20,
                    onComplete: () => {
                        resetGameElements();
                        gsap.to([jeuElement, testTitle, compteurElement], {
                            duration: 0.5,
                            opacity: 1,
                            y: 0

                        });
                    }
                })
            }
        })
    }
}
const updateMancheCounter = () => {
    const compteurElement = document.querySelector('.annexe__compteur--chiffre');
    if (compteurElement) {
        compteurElement.textContent = currentManche;
    }
};

const initGameElements = () => {
    imgElements = document.querySelectorAll('.annexe__img');
    if (imgElements.length > 0) {
        imgElements.forEach((img) => {
            img.addEventListener('click', handleImageClick);
        });
    }

    const playButton = document.querySelector('.annexe__button');
    if (playButton) {
        playButton.addEventListener('click', playNote);
    }

    const refreshButton = document.getElementById('annexe__button--refresh');
    if (refreshButton) {
        refreshButton.addEventListener('click', resetGameAnimation);
    }

    const regleButton = document.getElementById('annexe__buttonRegle');
    if (regleButton) {
        regleButton.addEventListener('click', animateGameGrid);
    }

};

const handleImageClick = (event) => {
    if (timerId) return;

    const img = event.target;
    const correctImage = notesAndImages[0].correctImage;

    imgElements.forEach(image => {
        image.classList.remove('annexe__answer--correct', 'annexe__answer--incorrect');
    });

    if (notesAndImages[0] && (img.src.includes(correctImage.src) || img.srcset.includes(correctImage.srcset))) {
        if (isFirstClick) {
            correctAnswers++;
            correctAnswerClicked = true;
        }
        img.classList.add('annexe__answer--correct');
    } else {
        img.classList.add('annexe__answer--incorrect');
        imgElements.forEach(image => {
            if (image.src.includes(correctImage.src) || image.srcset.includes(correctImage.srcset)) {
                image.classList.add('annexe__answer--correct');
            }
        });
        correctAnswerClicked = false;
    }

    isFirstClick = false;

    disableImageClicks();
    timerId = setTimeout(() => {
        timerId = null;
        notesAndImages.shift();
        updateImages();
        currentNoteIndex = 0;
        enableImageClicks();
    }, 3000);
};

let currentManche = 0;

const updateImages = () => {
    const nextNotesAndImages = notesAndImages[0];
    if (nextNotesAndImages) {
        imgElements.forEach((img, index) => {
            img.classList.remove('annexe__answer--incorrect', 'annexe__answer--correct');
            img.src = nextNotesAndImages.allImages[index].src;
            img.srcset = nextNotesAndImages.allImages[index].srcset;
            img.alt = nextNotesAndImages.allImages[index].alt;
        });
        isFirstClick = true;
        currentManche++;
    } else {
        showResultGrid();

        const scoreNowElement = document.getElementById('score-now');
        if (scoreNowElement) {
            scoreNowElement.textContent = correctAnswers;
        }
        if (correctAnswers > bestScore) {
            bestScore = correctAnswers;
        }

        const scoreBestElement = document.getElementById('score-best');
        if (scoreBestElement) {
            scoreBestElement.textContent = bestScore;
        }
        const phraseElement = document.getElementById('phrase');
        if (phraseElement) {
            phraseElement.textContent = scorePhrases[correctAnswers] || '';
        }
    }
    updateMancheCounter();
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
    currentAudio = new Audio(`assets/son/${note}.mp3`);
    currentAudio.play();
    currentNoteIndex++;
};

const initRandomNotesAndImages = async () => {
    try {
        const data = await loadJSON('assets/data/son.json');

        while (notesAndImages.length < 4) {
            const randomFilm = getRandomElement(data);
            const notes = randomFilm.Notes;
            const correctImage = {
                src: randomFilm.Images,
                srcset: randomFilm.ImagesRetina,
                alt: randomFilm.AltText
            };
            const otherFilms = data.filter(film => film !== randomFilm);
            const otherImages = [];
            while (otherImages.length < 3) {
                const film = getRandomElement(otherFilms);
                if (!otherImages.some(image => image.src === film.Images)) {
                    otherImages.push({
                        src: film.Images,
                        srcset: film.ImagesRetina,
                        alt: film.AltText
                    });
                }
            }
            const allImages = [correctImage, ...otherImages];
            shuffleArray(allImages);
            notesAndImages.push({ notes, allImages, correctImage });
            data.splice(data.indexOf(randomFilm), 1);
        }
        updateImages();
    } catch (error) {
        console.error('Error initializing notes and images:', error);
    }
};

const disableImageClicks = () => {
    imgElements.forEach(img => {
        img.style.pointerEvents = 'none';
    });
};

const enableImageClicks = () => {
    imgElements.forEach(img => {
        img.style.pointerEvents = 'auto';
    });
};

const animateGameGrid = () => {
    const jeuElement = document.querySelector('.annexe__jeu');
    const instructionsElement = document.querySelector('.annexe__instructions');
    const instructionsTitle = document.querySelector('.annexe__h2--instructions');
    const researchText = document.querySelector('.annexe__rechercheText');
    const testTitle = document.querySelector('.annexe__h2--test');
    const compteurElement = document.querySelector('.annexe__compteur');

    if (jeuElement && instructionsElement && instructionsTitle && testTitle && researchText && compteurElement) {
        gsap.to([instructionsElement, instructionsTitle, researchText], {
            duration: 0.5,
            opacity: 0,
            y: -20,
            onComplete: () => {
                instructionsElement.style.display = 'none';
                instructionsTitle.style.display = 'none';
                researchText.style.display = 'none'
                testTitle.style.display = 'block';
                gsap.set(testTitle, {
                    opacity: 0,
                    y: 20
                });
                gsap.set(jeuElement, {
                    display: 'grid',
                    opacity: 0,
                    y: 20
                });
                gsap.set(compteurElement, {
                    display: 'flex',
                    opacity: 0,
                    y: 20
                });
                gsap.to([jeuElement, testTitle, compteurElement], {
                    duration: 0.5,
                    opacity: 1,
                    y: 0
                });
            }
        });
    }
};
const showResultGrid = () => {
    const jeuElement = document.querySelector('.annexe__jeu');
    const resultElement = document.querySelector('.annexe__result');
    const testTitle = document.querySelector('.annexe__h2--test');
    const compteurElement = document.querySelector('.annexe__compteur');

    if (jeuElement && resultElement && testTitle && compteurElement) {
        gsap.to([jeuElement, testTitle, compteurElement], {
            duration: 0.5,
            opacity: 0,
            y: -20,
            onComplete: () => {
                jeuElement.style.display = 'none';
                testTitle.style.display = 'none';
                compteurElement.style.display = 'none';
                gsap.set(resultElement, {
                    display: 'block',
                    opacity: 0,
                    y: 20
                });
                gsap.to([resultElement,], {
                    duration: 0.5,
                    opacity: 1,
                    y: 0
                });
            }
        });
    }
};
if (document.querySelector('.annexe__jeu')) {
    initGameElements();
    initRandomNotesAndImages();
}

const button = document.querySelector('.annexe__button');
if (button) {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
    });
}

// transition
const linksTransition = document.querySelectorAll(".link-transition");
linksTransition.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetUrl = link.getAttribute('href');

        gsap.to('body', {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                window.location.href = targetUrl;
            }
        });
    });
});

function transitionPage() {
    gsap.to('body', {
        duration: 0.5,
        opacity: 1,
        delay: 0.5
    });
}

transitionPage();
