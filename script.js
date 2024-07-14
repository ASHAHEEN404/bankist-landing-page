'use strict';

const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const overlay = document.querySelector('.overlay ');
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const navbarLink = document.querySelector('.nav__links');
const operationContainer = document.querySelector('.operations__tab-container');

const btnOperation = document.querySelectorAll('.operations__tab');
const operationContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHighet = nav.getBoundingClientRect().height;

const allSections = document.querySelectorAll('.section');

///////////////////////////////////////

// Modal Handling
const openModal = function (e) {
  e.preventDefault();
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
};

const closeModal = function (e) {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
};

// Open Modal Button
btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// close Modal Button
btnCloseModal.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});
/* //////////////////////////////////////////////////  */

// Learn More Anchor Handling
btnScrollTo.addEventListener('click', function (e) {
  // Old Way
  // const sec1Coords = section1.getBoundingClientRect();
  // window.scrollTo(
  //   sec1Coords.left + window.pageXOffset,
  //   sec1Coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // );

  // New Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* //////////////////////////////////////////////////  */
// Page Navigation Handling

// Using Event Delegation (Select The Parent)
navbarLink.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // 1) Get The ID by getAttribute('href')
    // 2) Attach a querySelector to it with scrollIntoView
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/* //////////////////////////////////////////////////  */
// Navigation Fading Handling

const handlerOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

navbarLink.addEventListener('mouseover', handlerOver.bind(0.5));
navbarLink.addEventListener('mouseout', handlerOver.bind(1));

////////////////////////////////////////////////  */

// Sticky Navigation

const stickyNav = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting === false) nav.classList.add('sticky');
  else {
    nav.classList.remove('sticky');
  }
};

const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHighet}px`,
});

observer.observe(header);
/* //////////////////////////////////////////////////  */
// Revel Section OnScroll

const showSection = function (entries, observer) {
  const [{ isIntersecting, target }] = entries;

  if (!isIntersecting) return;
  target.classList.remove('section--hidden');
  observer.unobserve(target);
};

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (sec) {
  sectionObserver.observe(sec);
  // sec.classList.add('section--hidden');
});
/* //////////////////////////////////////////////////  */
// Lazy Loading Image
const targetImg = document.querySelectorAll('img[data-src]');

const showOnScroll = function (entries, observe) {
  const [{ isIntersecting, target }] = entries;
  target.src = target.dataset.src;

  target.addEventListener('load', function () {
    target.classList.remove('lazy-img');
  });
  observer.unobserve(target);
};

const imgObserver = new IntersectionObserver(showOnScroll, {
  root: null,
  threshold: 0.15,
});

targetImg.forEach(img => imgObserver.observe(img));
/* //////////////////////////////////////////////////  */
// Tapped Component

operationContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  btnOperation.forEach(btn => btn.classList.remove('operations__tab--active'));
  operationContent.forEach((content, i) => {
    content.classList.remove('operations__content--active');
  });

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
/* //////////////////////////////////////////////////  */
// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnSlideRight = document.querySelector('.slider__btn--right');
  const btnSlideLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>
      `
      );
    });
  };

  const activeDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    console.log(`dots__dot[data-slide = ${slide}]`);

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  const perviousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activeDots(0);
  };
  init();

  // EventListeners
  btnSlideRight.addEventListener('click', nextSlide);
  btnSlideLeft.addEventListener('click', perviousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') perviousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDots(slide);
    }
  });
};
slider();
