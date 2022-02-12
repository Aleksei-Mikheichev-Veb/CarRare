
// Маски для форм
$(document).ready(function () {
    $(".phone").mask("+7 (999) 999-99-99");
});

//Плавное движение
const menuLinks = document.querySelectorAll('.button-go[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;
            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}
// Аккордион
let accordionItems = document.querySelectorAll('.accordion__item');
accordionItems.forEach(item => {
    item.addEventListener("click", function (e) {
        if (item.style.maxHeight) {
            item.style.maxHeight = null;
            console.log(item);
        } else {
            item.style.maxHeight = item.scrollHeight + 'px';
        }
        item.classList.toggle('_active');
    })
})

// Попап
let windowW = document.documentElement.clientWidth;

// Модальное окно

let popupLinks = document.querySelectorAll('.popup__link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;
const timeout = 800;

for (let popupLink of popupLinks) {
    popupLink.addEventListener('click', function (e) {
        let popupName = popupLink.getAttribute('href').replace('#', '');
        let curentPopup = document.getElementById(popupName);
        popupOpen(curentPopup);
        e.preventDefault();
    })
}
let popupCloseIcons = document.querySelectorAll('.close-popup');
for (let popupCloseIcon of popupCloseIcons) {
    popupCloseIcon.addEventListener('click', function (e) {
        popupClose(this.closest('.popup'));
        e.preventDefault();
    })
}
function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        curentPopup.classList.add('open');
        curentPopup.addEventListener('click', function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        })
    }
}
function popupClose(popupActive, doUnlock = true) {
    popupActive.classList.remove('open');
}
(function () {
    // проверяем поддержку
    if (!Element.prototype.closest) {
        // реализуем
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function () {
    // проверяем поддержку
    if (!Element.prototype.matches) {
        // определяем свойство
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
})();

// Отправка форм

document.addEventListener('DOMContentLoaded', function () {
    // Сама тэг form
    const form = document.getElementById('form');
    // const forms = document.querySelectorAll('.form');
    // for (let form of forms) {
    // Событие отправки формы
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        // form = e.target;
        let error = formValidate(form);
        console.log(error);
        let formData = new FormData(form);

        if (error === 0) {
            let body = document.querySelector('.popup__body');
            console.log(error);

            body.classList.add('_sending');
            console.log(body);
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                form.reset();
                body.classList.remove('_sending');
            } else {
                alert("Ошибка");
                body.classList.remove('_sending');
            }
        } else {
            alert('Заполните обязательные поля');
        }

    }

    // Функция для проверки валидации
    function formValidate(form) {
        let error = 0;
        // Если в одной форме 2 обязательных поля, то ищем все классы _req в конкретной форме.
        let formReq = form.querySelectorAll('._req');

        //Переберем все инпуты с классом ._req т.е. которые должны быть обязательно заполнены
        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);
            //Если имеет класс _email то, используем функцию для проверки имейла
            if (input.classList.contains('_email')) {
                // Если имейл не прошел проверку то функция вернет true и тогда ей добавится класс _error
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
                // Если инпут является чекбоксом и он не нажат то снова добавится класс _error
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                //Проверяем заполнено ли поле
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
    // Добавим класс '_error' тем кто не прошел проверку
    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    // Уберем класс '_error' тем кто прошел проверку 
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    //Функция теста email
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
    // }



});
