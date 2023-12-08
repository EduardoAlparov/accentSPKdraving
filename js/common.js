document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  document.body.classList.remove('preload');

  // header behavior:
  const header = document.querySelector('.header');
  if(header) {
    ScrollTrigger.create({
      start: header.offsetHeight,
      end: "max",
      onUpdate: self => {
        let directionBool;

        if(self.direction > 0) {
          directionBool = true;
        } else {
          directionBool = false;
        }

        header.classList.toggle('header--hide', directionBool);
      }
    });
  }


  // burger menu:
  let btnMenu = document.getElementsByClassName("btn-menu");
  for (var i = 0; i < btnMenu.length; i++) {
    btnMenu[i].addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  // search behavior:
  const search = document.querySelector('.search');
  const searchButton = document.querySelector('.js-search-button');

  if(searchButton) {
    searchButton.addEventListener('click', (e) => {
      e.target.closest('.search').classList.add('is-open');
      e.target.closest('.search').querySelector('.search__input').focus();

      window.addEventListener('click', (e) => {
        if(!e.target.closest('.search')
        && search.classList.contains('is-open')
        && !e.target.closest('.search__button')) {
          search.classList.remove('is-open');
        }
      })
    })
  }

  if(search) {
    search.onsubmit = () => {
      console.log('submit');
      search.classList.remove('is-open');
    };
  }

  // intro swiper logic:
  if(document.getElementById('introSwiperSlider')) {
    const introSwiper = new Swiper('#introSwiperSlider', {
      slidePerView: 1,

      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },

      on: {
        init: function () {
          const thumbs = document.querySelectorAll('.thumb');

          Array.from(thumbs).forEach( thumb => {
            thumb.addEventListener('mouseover', () => {
              Array.from(thumbs).forEach( t => {
                t.classList.remove('thumb--active');
              })

              thumb.classList.add('thumb--active');
              let num = thumb.dataset.num;

              introSwiper.slideTo(num);
            })

            thumb.addEventListener('mouseout', () => {
              thumb.classList.remove('thumb--active');
            })
          })
        },
      },
    })
  }

  // about swiper:
  if(document.getElementById('aboutSliderSwiper')) {
    const aboutSwiper = new Swiper('#aboutSliderSwiper', {
      slidePerView: 1,

      navigation: {
        nextEl: '.slider-about__swiper-button-next',
        prevEl: '.slider-about__swiper-button-prev',
      },

      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
    })
  }

  // custom validation forms:
  const forms = document.querySelectorAll('form');

  if(forms) {
    Array.from(forms).forEach( form => {
      form.querySelector('.js-btn-submit')?.addEventListener('click', () => {
        let validateBool = true;

        Array.from(form.querySelectorAll("[data-required]")).forEach( input => {
          input.classList.remove('input-block__input--invalid');
          if(!input.value) {
            input.classList.add('input-block__input--invalid');
            input.placeholder = input.dataset.required;
            validateBool = false;
          } else {
            validateBool = true;
          }
        })

        if(validateBool) {
          form.closest('.modal').querySelector('.modal__close-button').click();
          form.closest('.modal').querySelector('.modal__popup-button')?.click();

          setTimeout(() => {
            form.submit();
          }, 1000);
        }
      })
    })
  }

  // modals open pattern:
  const modalsButtons = document.querySelectorAll('.js-modal-btn[data-target]');
  const modals = document.querySelectorAll('.modal');

  Array.from(modalsButtons).forEach( btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let modal = document.querySelector(`[data-modal=${btn.dataset.target}]`);
      modal.classList.add('modal--is-open');
      document.body.classList.add('modal-opened');
    })
  })

  Array.from(modals).forEach(modal => {
    modal.addEventListener('click', (e) => {
      if(!modal.classList.contains('modal--is-open')) {
        return;
      } else {
        if(e.target.closest('.modal__close-button') || !e.target.closest('.modal__body')) {
          modal.classList.remove('modal--is-open');
          document.body.classList.remove('modal-opened');
          document.body.classList.remove('menu-open');
        }
      }
    })
  })

  // projects map:
  if(document.getElementById('projects-yamap')) {
    ymaps.ready(init);

    function init() {
      let myMap = new ymaps.Map("projects-yamap", {
        center: [53.920726, 102.049060],
        zoom: 4,
        controls: [],
        behaviors: ['drag'],
        type: 'yandex#hybrid'
      }),

      points = [
        {
          id: '0',
          name: "Архангельск",
          coords: [64.539911, 40.515762],
          projects: [
            {
              id: 01,
              name: 'ХХХХХХХХХ',
              haveDesc: true,
            }
          ]
        },
        {
          id: '1',
          name: "Омск",
          coords: [54.989346, 73.368203],
          projects: [
            {
              id: 01,
              name: 'YYYYYYYYY',
              haveDesc: true,
            },
            {
              id: 02,
              name: 'ZZZZZZZZZ',
              haveDesc: false,
            },
          ]
        },
        {
          id: '2',
          name: "Хабаровск",
          coords: [48.480229, 135.071917],
          projects: [
            {
              id: 01,
              name: 'YYYYYYYYY',
              haveDesc: false,
            },
          ]
        },
      ],

      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(['<div class="yamaps-icon">',
        '<svg class="icon">',
          '<use xlink:href="./images/sprite.svg#map-marker"></use>',
        '</svg>',
      '</div>'].join('')),

      MyIconContentLayoutHover = ymaps.templateLayoutFactory.createClass(['<div class="yamaps-icon yamaps-icon--hover">',
        '<svg class="icon">',
          '<use xlink:href="./images/sprite.svg#map-marker"></use>',
        '</svg>',
      '</div>'].join(''));

      points.forEach( (point) => {
        placemark = new ymaps.Placemark(point.coords,
          {
            hasBalloon: false,
          },
          {
            iconLayout: 'default#imageWithContent',
            iconContentLayout: MyIconContentLayout,
            iconImageHref: '',
            iconImageSize: [42, 42],
            iconImageOffset: [-21, -21]
          }
        );

        // hover placemark start:
        placemark.events.add('mouseenter', function (e) {
          e.get('target').options.set('iconContentLayout', MyIconContentLayoutHover);
        })

        placemark.events.add('mouseleave', function (e) {
          e.get('target').options.set('iconContentLayout', MyIconContentLayout);
        });
        // hover placemark end:

        // open balloons:
        placemark.events.add(['click'],  function (e) {
          let target = e.get('target');
          myMap.panTo(target.geometry.getCoordinates(), {useMapMargin: true});

          clickHandler(target.geometry.getCoordinates());
        })

        myMap.geoObjects.add(placemark);
      })

      function clickHandler(coords) {
        const balloon = document.querySelector('.balloon');

        balloon.classList.remove('balloon--simple');
        balloon.classList.remove('balloon--desc');
        balloon.classList.remove('balloon--list');

        points.forEach(point => {
          if(point.coords === coords) {
            if(point.projects.length <=1) {
              if(point.projects.length && point.projects[0].haveDesc) {
                balloon.classList.add('is-open');
                balloon.classList.add('balloon--desc');
              } else if((point.projects.length && !point.projects[0].haveDesc)) {
                balloon.classList.add('is-open');
                balloon.classList.add('balloon--simple');
              } else if(!point.projects.length)  {
                return;
              }
            } else if(point.projects.length > 1) {
              balloon.classList.add('is-open');
              balloon.classList.add('balloon--simple');
              balloon.classList.add('balloon--list');
            } else {
              return;
            }
          }
        })
      }

      myMap.margin.addArea({
        top: 0,
        right: 0,
        width: '25%',
        height: '100%'
      });
    }
  }

  // partners carousel:
  const partnersSwiperContainer = document.querySelector('.partners-swiper');

  if(partnersSwiperContainer) {
    const partnersSwiper = new Swiper(partnersSwiperContainer, {
      slidesPerView: 2,
      spaceBetween: 20,
      height: 100,

      navigation: {
        nextEl: '.partners__swiper-button--next',
        prevEl: '.partners__swiper-button--prev',
      },

      pagination: {
        el: ".partners__swiper-pagination",
        type: "progressbar",
      },

      breakpoints: {
        576: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 62,
        }
      }
    })
  }

  // licenses carousel:
  const licensesSwiperContainer = document.querySelector('.licenses-swiper');
  if(licensesSwiperContainer) {
    const licensesSwiper = new Swiper(licensesSwiperContainer, {
      slidesPerView: 2,
      spaceBetween: 10,

      navigation: {
        nextEl: '.licenses__swiper-button--next',
        prevEl: '.licenses__swiper-button--prev',
      },

      pagination: {
        el: ".licenses__swiper-pagination",
        type: "progressbar",
      },

      breakpoints: {
        576: {
          slidesPerView: 3,
          spaceBetween: 10
        },
        992: {
          slidesPerView: 6,
          spaceBetween: 20
        }
      }
    })
  }

  // reviews carousel: reviews-swiper
  const reviewsSwiperContainer = document.querySelector('.reviews-swiper');
  if(reviewsSwiperContainer) {
    const reviewsSwiper = new Swiper(reviewsSwiperContainer, {
      slidesPerView: 1,
      spaceBetween: 0,

      pagination: {
        el: ".reviews__swiper-pagination ",
        type: "progressbar",
      },

      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20,

          navigation: {
            nextEl: '.reviews__swiper-button--next',
            prevEl: '.reviews__swiper-button--prev',
          },
        }
      }
    })
  }

  // faq buttons behavior:
  const faqButtons = document.querySelectorAll('.faq__button');
  if(faqButtons.length) {
    Array.from(faqButtons).forEach( btn => {
      btn.addEventListener('click', () => {
        if(btn.classList.contains('faq__button--open')) {
          btn.classList.remove('faq__button--open');
        } else {
          Array.from(faqButtons).forEach( b => {
            b.classList.remove('faq__button--open');
          })

          btn.classList.add('faq__button--open');
        }
      })
    })
  }

  // partners switch
  const partnersBtns = document.querySelectorAll('.js-partners__link');

  Array.from(partnersBtns).forEach( btn => {
    btn.addEventListener('click', () => {
      let dataRole = btn.dataset.role;

      btn.closest('.partners').querySelectorAll('.partners__body').forEach( item => {
        item.style.display = 'none';
      })

      btn.closest('.partners').querySelector(`#${dataRole}`).style.display = 'block';
    })
  })

  // certificates and licenses fancybox
  if(document.querySelectorAll('[data-fancybox]').length) {
    Fancybox.bind("[data-fancybox]", {
      compact: false,
      idle: false,
      dragToClose: false,

      contentClick: () =>
        window.matchMedia('(max-width: 578px), (max-height: 578px)').matches
          ? 'toggleMax'
          : 'toggleCover',

      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [
            "zoomIn",
            "zoomOut",
            "toggle1to1",
            "rotateCCW",
            "rotateCW",
            "flipX",
            "flipY",
          ],
          right: ["close"],
        },
      },

      Images: {
        Panzoom: {
          maxScale: 2,
        },
      },
    });
  }
  // youtube fancybox for button:
  const youtubeVideoBtn = document.querySelectorAll('.js-youtube-fancybox[data-fancybox-video]');

  if( youtubeVideoBtn.length ) {
    Fancybox.bind("[data-fancybox-video]",
      {
        type: "video",
        ratio: 16 / 10,
        width: 640,
        height: 360,
      },
    );
  }

  // contacts map:
  if(document.getElementById('contacts-map')) {
    ymaps.ready(init);

    function init() {
      let myMap = new ymaps.Map("contacts-map", {
        center: [55.775034, 49.136597],
        zoom: 18 ,
        controls: [],
        behaviors: ["drag", "scrollZoom"],
        type: "yandex#map"
      }),

      points = [
        [55.775034, 49.136597]
      ];

      points.forEach( (point) => {
        placemark = new ymaps.Placemark(point,
          {},
          {
            iconLayout: 'default#image',
            iconImageHref: '../images/pin.png',
            iconImageSize: [60, 105],
            iconImageOffset: [-30, -105]
          }
        );

        myMap.geoObjects.add(placemark);
      })
    }
  }

  if(document.querySelector('.about__video-button')) {
    document.querySelector('.about__video-button').addEventListener('click', () => {
      document.querySelector('.about-video-tag').setAttribute("controls","controls");
      document.querySelector('.about-video-tag').play();
      document.querySelector('.about__video-button').classList.add('visually-hidden');
    })
  }

  // toggle projects windows:
  const projectsWrapperSection = document.querySelector('.simple-page-section__projects');
  if(projectsWrapperSection) {
    const radioInputs = document.querySelectorAll('.projects__link-input');
    const windowsItems = document.querySelectorAll('.projects__toggle-item');

    radioInputs.forEach(radio => {
      radio.addEventListener('input', () => {
        Array.from(windowsItems).forEach( window => {
          window.classList.remove('projects__toggle-item--show');
        })
        projectsWrapperSection.querySelector(`[data-window=${radio.id}]`).classList.add('projects__toggle-item--show');
      })
    })
  }

  // balloon control:
  const balloon = document.querySelector('.balloon');

  if(balloon) {
    window.addEventListener('click', (e) => {
      if(e.target.closest('.balloon__close-button')) {
        balloon.classList.remove('is-open');
        balloon.classList.remove('balloon--simple');
        balloon.classList.remove('balloon--desc');
        balloon.classList.remove('balloon--list');
      }
    })
  }
})
