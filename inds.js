// inds.js

// --- Ваши существующие функции (calcD, min, max, equal) ---
// ... (оставляем их как есть) ...
function calcD(a,b,c) { return b*b - 4*a*c; }
function min(a,b) { return a < b ? a : b; }
function max(a,b) { return a > b ? a : b; }
function equal(a,b) { return a == b; }


// --- Глобальные переменные состояния ---
let anketaSubmitted = false; // Флаг, что анкета была успешно отправлена/проверена

// --- Валидаторы (Пункт 2) ---
function isValidName(name) {
    // Только буквы (русские и английские) и пробелы, не пустая строка
    return /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name.trim()) && name.trim() !== "";
}

function isValidGender(gender) {
    const g = gender.trim().toUpperCase();
    return g === "М" || g === "Ж";
}

// --- Функция для запроса и валидации данных (Пункт 2) ---
function requestAndValidateInput(promptMessage, validationFunction, errorMessage, currentValue = "") {
    let value;
    let isValid;
    do {
        value = prompt(promptMessage, currentValue);
        if (value === null) return null; // Пользователь нажал "Отмена"
        isValid = validationFunction(value);
        if (!isValid) {
            alert(errorMessage);
        }
    } while (!isValid);
    return value.trim();
}


// --- Индивидуальное задание 3: Уточнение возраста (адаптировано) ---
function runAgeConfirmationAndUpdateResume() {
    let ageConfirmed = false;
    let userAge;
    const resumeAgeElement = document.getElementById('resumeAge');

    do {
        let ageInput = prompt("Пожалуйста, введите ваш возраст для резюме:", resumeAgeElement.textContent === "Уточняется..." ? "" : resumeAgeElement.textContent);

        if (ageInput === null) {
            alert("Ввод возраста отменен. Возраст в резюме не будет изменен.");
            return null; // Возвращаем null, чтобы показать, что ввод отменен
        }

        if (ageInput.trim() === "") {
            alert("Вы не ввели возраст. Пожалуйста, введите ваш возраст.");
            continue;
        }

        if (isNaN(ageInput) || !Number.isInteger(parseFloat(ageInput)) || parseInt(ageInput) < 0 || parseInt(ageInput) > 120) {
            alert("Пожалуйста, введите корректный возраст (целое число от 0 до 120).");
            continue;
        }

        let isCorrect = confirm("Вам " + ageInput + " лет?");

        if (isCorrect) {
            userAge = ageInput.trim();
            ageConfirmed = true;
            if (resumeAgeElement) {
                resumeAgeElement.textContent = userAge;
            }
        } else {
            alert("Пожалуйста, введите возраст снова.");
        }
    } while (!ageConfirmed);
    return userAge;
}

// --- Основная логика страницы ---
document.addEventListener('DOMContentLoaded', function() {
    // Получение элементов DOM
    const resumeNameInput = document.getElementById('resumeNameInput');
    const resumeSurnameInput = document.getElementById('resumeSurnameInput');
    const resumeGenderInput = document.getElementById('resumeGenderInput');
    const resumeAgeSpan = document.getElementById('resumeAge'); // Для отображения возраста
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const additionalInfoTextarea = document.getElementById('additionalInfo');

    const randomBgButton = document.getElementById('randomBgButton');
    const checkEqualButton = document.getElementById('checkEqualButton');
    // ... (элементы для equalA, equalB, equalResult)

    const submitAnketaButton = document.getElementById('submitAnketaButton');
    const hireMeElement = document.getElementById('hireMeElement');
    const allSkillCheckboxes = document.querySelectorAll('.skill-checkbox'); // Все чекбоксы навыков

    // Первоначальный запрос возраста
    let currentAge = runAgeConfirmationAndUpdateResume();
    if (currentAge === null && resumeAgeSpan) { // Если пользователь отменил ввод возраста при загрузке
        resumeAgeSpan.textContent = "Не указан";
    }


    // Валидация при потере фокуса для Имени, Фамилии, Пола (Пункт 2 - интерактивная)
    resumeNameInput.addEventListener('blur', function() {
        if (!isValidName(this.value)) {
            alert("Имя должно содержать только буквы и пробелы и не быть пустым.");
            this.focus(); // Вернуть фокус на поле
            this.style.borderColor = "red";
        } else {
            this.style.borderColor = ""; // Сброс рамки
        }
    });

    resumeSurnameInput.addEventListener('blur', function() {
        if (!isValidName(this.value)) { // Используем ту же валидацию, что и для имени
            alert("Фамилия должна содержать только буквы и пробелы и не быть пустой.");
            this.focus();
            this.style.borderColor = "red";
        } else {
            this.style.borderColor = "";
        }
    });

    resumeGenderInput.addEventListener('blur', function() {
        if (!isValidGender(this.value)) {
            alert("Пол должен быть указан как 'М' или 'Ж'.");
            this.focus();
            this.style.borderColor = "red";
        } else {
            this.style.borderColor = "";
            this.value = this.value.trim().toUpperCase(); // Приводим к верхнему регистру
        }
    });

    // Кнопка "Проверить и Сохранить Анкету" (Пункт 3, 4, 5)
    submitAnketaButton.addEventListener('click', function() {
        if (anketaSubmitted) {
            alert("Анкета уже была успешно отправлена.");
            return;
        }

        // Пункт 2: Полная проверка всех обязательных полей перед "отправкой"
        let isFormValid = true;
        let errorMessages = [];

        // Проверка Имени
        if (!isValidName(resumeNameInput.value)) {
            isFormValid = false;
            errorMessages.push("Имя введено некорректно.");
            resumeNameInput.style.borderColor = "red";
        } else {
            resumeNameInput.style.borderColor = "";
        }

        // Проверка Фамилии
        if (!isValidName(resumeSurnameInput.value)) {
            isFormValid = false;
            errorMessages.push("Фамилия введена некорректно.");
            resumeSurnameInput.style.borderColor = "red";
        } else {
            resumeSurnameInput.style.borderColor = "";
        }

        // Проверка Пола
        if (!isValidGender(resumeGenderInput.value)) {
            isFormValid = false;
            errorMessages.push("Пол введен некорректно (должен быть М или Ж).");
            resumeGenderInput.style.borderColor = "red";
        } else {
            resumeGenderInput.style.borderColor = "";
            resumeGenderInput.value = resumeGenderInput.value.trim().toUpperCase();
        }
        
        // Проверка Возраста (уже должен быть установлен через prompt, но проверим что он не "Не указан")
        const ageText = resumeAgeSpan.textContent;
        if (ageText === "Уточняется..." || ageText === "Не указан" || isNaN(parseInt(ageText))) {
             isFormValid = false;
             errorMessages.push("Возраст не указан или некорректен. Пожалуйста, перезагрузите страницу или исправьте.");
             // Можно добавить кнопку "Уточнить возраст" рядом с полем возраста
        }


        // Проверка чекбокса "Согласен на обработку" (сделаем его обязательным)
        if (!agreeTermsCheckbox.checked) {
            isFormValid = false;
            errorMessages.push("Необходимо согласиться на обработку персональных данных.");
            agreeTermsCheckbox.parentElement.style.color = "red"; // Выделить родительский элемент
        } else {
            agreeTermsCheckbox.parentElement.style.color = "";
        }


        if (!isFormValid) {
            alert("Пожалуйста, исправьте ошибки в анкете:\n- " + errorMessages.join("\n- "));
            return; // Не продолжаем, если форма невалидна
        }

        // Если все проверки пройдены:
        anketaSubmitted = true;

        // Пункт 3: Показать элемент «меня возьмут»
        if (hireMeElement) {
            hireMeElement.style.display = 'block';
        }

        // Пункт 4: Запретить изменение всех checkbox
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });

        // Пункт 5: Скрыть элемент «заполнить анкету» (т.е. саму кнопку)
        if (submitAnketaButton) {
            submitAnketaButton.style.display = 'none';
            // Можно добавить сообщение "Анкета успешно отправлена!"
            const successMsg = document.createElement('p');
            successMsg.textContent = "Анкета успешно проверена и 'сохранена'!";
            successMsg.style.color = "green";
            successMsg.style.textAlign = "center";
            successMsg.style.fontWeight = "bold";
            submitAnketaButton.parentElement.appendChild(successMsg);
        }
        
        // Дополнительно: можно заблокировать и другие поля ввода
        resumeNameInput.disabled = true;
        resumeSurnameInput.disabled = true;
        resumeGenderInput.disabled = true;
        additionalInfoTextarea.disabled = true;

        alert("Анкета успешно проверена!");
        console.log("Данные анкеты:");
        console.log("Имя:", resumeNameInput.value);
        console.log("Фамилия:", resumeSurnameInput.value);
        console.log("Возраст:", resumeAgeSpan.textContent);
        console.log("Пол:", resumeGenderInput.value);
        console.log("Согласие:", agreeTermsCheckbox.checked);
        console.log("Доп. инфо:", additionalInfoTextarea.value);
        document.querySelectorAll('.skill-checkbox:checked').forEach(cb => console.log("Навык:", cb.dataset.skill));

    });


    // --- Логика для кнопки "Случайный цвет фона" ---
    if (randomBgButton) {
        randomBgButton.addEventListener('click', function() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            document.body.style.backgroundColor = randomColor;
        });
    }

    // --- Логика для панели функции equal ---
    const equalAInput = document.getElementById('equalA');
    const equalBInput = document.getElementById('equalB');
    const equalResultSpan = document.getElementById('equalResult');

    if (checkEqualButton && equalAInput && equalBInput && equalResultSpan) {
        checkEqualButton.addEventListener('click', function() {
            const valueA = equalAInput.value;
            const valueB = equalBInput.value;
            if (valueA === "" || valueB === "") {
                equalResultSpan.textContent = "Введите оба значения.";
                equalResultSpan.style.color = "orange";
                return;
            }
            const result = equal(valueA, valueB);
            equalResultSpan.textContent = result ? "Равны (true)" : "Не равны (false)";
            equalResultSpan.style.color = result ? "green" : "red";
        });
    }

    // Скрытие элемента #outputAdmin
    const outputAdminElement = document.getElementById('outputAdmin');
    if (outputAdminElement) {
        outputAdminElement.style.display = 'none';
    }
});