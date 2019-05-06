"use strict";

import validate from 'jquery-validation';
import mask from 'jquery-mask-plugin';

(function () {

    $('body').on('click', '.scroll-btn-js', function (event) {
        event.preventDefault();
        $("html, body").stop().animate({ scrollTop: $('.form').offset().top }, 500);
    });
    
    $('.js-phone-mask').mask('+7 (000) 000-00-00');

    $('.form-js').validate({
        errorClass:"form__error",
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                minlength: 17
            }
        },
        messages: {
            name: {
                required: "Введите имя",
                minlength: "Минимальная длина: 3 символа"
            },
            email: {
                required: "Введите e-mail",
                email: "Некоррекктный e-mail"
            },
            phone: {
                required: "Введите телефон",
                minlength: "Некоррекктный телефон"
            }
        }
        
    });
}());