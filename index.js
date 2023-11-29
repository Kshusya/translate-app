function getData() {
    fetch('https://api.mymemory.translated.net/get?q=Hello,%20how%20are%20you?!&langpair=en|fr')
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        })

}
// getData();

// User input
const textarea = document.getElementById('text-to-translate');

const countOfDigit = document.getElementById('digit-count');

function getTranslate() {
    const textToTranslate = textarea.value;
    const textLength = textToTranslate.length;
    countOfDigit.textContent = `${textLength}/500`

    const queryString = new URLSearchParams({
        q: textToTranslate,
        langpair: 'en|fr',
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

textarea.addEventListener('keyup', getTranslate);

// add translated text to html
function postTranslate(translatedText) {
    const paragraph = document.getElementById('translated');

    // if (translatedText.length === 0) paragraph.textContent ='Bonjour, comment allez-vous?';

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