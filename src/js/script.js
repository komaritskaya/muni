'use strict';

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  const navMain = document.querySelector('.main-nav');
  const navToggle = document.querySelector('.page-header__nav-toggle');

  if (navMain && navToggle) {
    navMain.classList.remove('main-nav--nojs');
    navToggle.classList.remove('page-header__nav-toggle--nojs');

    navToggle.addEventListener('click', function() {
      if (navMain.classList.contains('main-nav--closed')) {
        navMain.classList.remove('main-nav--closed');
        navMain.classList.add('main-nav--opened');
        navToggle.classList.remove('page-header__nav-toggle--closed');
        navToggle.classList.add('page-header__nav-toggle--opened');
      } else {
        navMain.classList.add('main-nav--closed');
        navMain.classList.remove('main-nav--opened');
        navToggle.classList.add('page-header__nav-toggle--closed');
        navToggle.classList.remove('page-header__nav-toggle--opened');
      }
    });
  }

  // библиотека popup
    const popupLibrary = {
      popUp: null,
      trigger: null,
      popupClose: null,
      isActive: false,

      // инициализация popup
      init(trig) {
        this.popUp = document.querySelector('.popup');
        this.popUpWindow = document.querySelector('.popup-body');
        const that = this;

        this.popUp.addEventListener('click', function(e) { that.close(e); });
        this.popUpWindow.addEventListener('click', function(e) { e.stopPropagation(); } );

        this.popUpClose = document.querySelector('.popup-close');
        this.popUpClose.addEventListener('click', function(e) {
          that.close(e);
        });

        if (trig) {
          this.trigger = trig;
          this.trigger.addEventListener('click', function(e) {
            that.open(e, popupHTML);
          });
        }

        window.addEventListener("keyup", function(e) {
          if (e.key === 'Escape') {
            that.close();
          }
        }, true);
      },

      // открытие popup
      open(someHTML) {
        if (someHTML) {
          this.popUp
            .querySelector('.popup-inner')
            .innerHTML = someHTML;
        }

        this.popUp.style.display = 'block';
        this.isActive = true;
      },

      // закрытие popup
      close() {
        this.popUp.style.display = 'none';
        this.isActive = false;
      },

      // сброс popup
      reset() {
        this.popUp = null;
        this.trigger.removeEventListener('click', this.open);
        this.trigger = null;
      }
    };

  popupLibrary.init();

  // popup c Сообщением об успешном заказе
  const offerForm = document.querySelector('.offer-form');
  if (offerForm) {
    offerForm.addEventListener('submit', e => {
      e.preventDefault();
    });
  }

  let successOrderInnerHTML=`
    <div class="success-order">
    <div class="success-order__message">
      <div class="success-order__title">Спасибо за заказ !</div>
      <div class="success-order__text">Наш менеджер свяжется с&nbsp;вами для&nbsp;уточнения деталей</div>
    </div>
    <img src="img/success-order-popup.webp" alt="Спасибо за заказ!" class="success-order__img">
  </div>
  `;

  const successPopup = () => {
    popupLibrary.open(successOrderInnerHTML);
  }

  const placeOrderButton = document.querySelector('.offer-form__submit-btn');

  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', successPopup);
  }
}
);