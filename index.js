const textarea = document.getElementById('text-to-translate');
const paragraph = document.getElementById('translated');

const countOfCharacters = document.getElementById('characters-count');

const languagesButtons = document.querySelectorAll('.languages__parameter');
const inputLanguagesButtons = Array.from(document.querySelectorAll('.to-translate .languages__parameter'));
const outputLanguagesButtons = Array.from(document.querySelectorAll('.translated .languages__parameter'));

function updateCharactersCount() {
    countOfCharacters.textContent = `${textarea.value.length}/500`;
}

inputLanguagesButtons.forEach((button) => {
    button.addEventListener('click', changeLanguage);
});
outputLanguagesButtons.forEach((button) => {
    button.addEventListener('click', changeLanguage);
});

function changeLanguage(event) {
    const languagesButtons = Array.from(event.currentTarget.parentNode.querySelectorAll('.languages__parameter'));

    const inputButton = document.querySelector('.to-translate .languages__parameter.active');
    const inputLang = inputButton.dataset.language;
    const outputButton = document.querySelector('.translated .languages__parameter.active');
    const outputLang = outputButton.dataset.language;
    
    const clickedButton = event.target;

    // if selected language is pressed repeatedly, the next following code doesn't make swap
    if (clickedButton === inputButton || clickedButton === outputButton) return;

    // if clicked language is already active, make language swap
    if (clickedButton.dataset.language === inputLang || clickedButton.dataset.language === outputLang) {
        swapLanguages();
        return;
    }

    // remove active classes
    languagesButtons.forEach((button) => {
        button.classList.remove('active');
    })
    
    // add active class on selected button
    clickedButton.classList.add('active');
}

const reverseButton = document.getElementById('reverse-button');
reverseButton.addEventListener('click', swapLanguages);

function swapLanguages() {
    const inputLangButton = document.querySelector('.to-translate .languages__parameter.active');
    const outputLangButton = document.querySelector('.translated .languages__parameter.active');

    // remove active classes
    inputLangButton.classList.remove('active');
    outputLangButton.classList.remove('active');

    // make language swap
    document.querySelector(`.translated .languages__parameter[data-language="${inputLangButton.dataset.language}"]`).classList.add('active');
    document.querySelector(`.to-translate .languages__parameter[data-language="${outputLangButton.dataset.language}"]`).classList.add('active');

    // make text swap
    const backup = textarea.value;
    textarea.value = paragraph.textContent;
    paragraph.textContent = backup;

    updateCharactersCount();
}

function getTranslate() {
    const textToTranslate = textarea.value;
    const textLength = textToTranslate.length;
    updateCharactersCount();

    // remove placeholder after user has typed the text
    textarea.removeAttribute('placeholder');
    // remove translated text after user has deleted the text
    if (textLength === 0) {
        postTranslate('');
        return;
    }

    const inputLang = document.querySelector('.to-translate .languages__parameter.active').dataset.language;
    const outputLang = document.querySelector('.translated .languages__parameter.active').dataset.language;

    const queryString = new URLSearchParams({
        q: textToTranslate,
        langpair: `${inputLang}|${outputLang}`,
    }).toString();

    fetch(`https://api.mymemory.translated.net/get?${queryString}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            postTranslate(data.responseData.translatedText);
        })
        .catch(error => {
            console.log(error)
        })
}

const translateButton = document.getElementById('translate-button');

// translate triggers
languagesButtons.forEach((button) => {
    button.addEventListener('click', getTranslate);
});
textarea.addEventListener('keyup', getTranslate);
translateButton.addEventListener('click', getTranslate);

// add translated text to html
function postTranslate(translatedText) {
    paragraph.textContent = translatedText;
}

function copyToClipboard(isTranslated) {
    if (isTranslated) {
        const text = document.getElementById('translated');
        navigator.clipboard.writeText(text.textContent);
    } else {
        const text = document.getElementById('text-to-translate');
        navigator.clipboard.writeText(text.value);
    }
}