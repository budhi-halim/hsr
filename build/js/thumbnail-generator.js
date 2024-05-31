"use strict";
// Elements
const radioInputs = document.getElementsByClassName('radio');
const titleInput = document.getElementById('title');
const imageInput = document.getElementById('image');
const dropArea = document.getElementById('drop-area');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasDownload = document.getElementById('canvas-download');
const templateButton = document.getElementById('template-button');
const customButton = document.getElementById('custom-button');
const templateSection = document.getElementById('template');
const customSection = document.getElementById('custom');
// Fonts
const DIN = new FontFace('DIN Bold', 'url(../font/DIN/DIN-Bold.ttf)');
// Variables
const fontSize = 180;
const margin = 32;
const letterSpacing = -4;
// Default Input Values
let gameMode = null;
let title = '';
let image = null;
;
const gameModeDict = {
    'memory-of-chaos': ['Memory of Chaos', '36 Stars'],
    'pure-fiction': ['Pure Fiction', '12 Stars'],
    'apocalyptic-shadow': ['Apocalyptic Shadow', '36 Stars']
};
// Functions
function getTexts() {
    for (let i = 0; i < radioInputs.length; i++) {
        if (radioInputs[i].checked) {
            gameMode = gameModeDict[radioInputs[i].id];
            break;
        }
        ;
    }
    ;
    title = titleInput.value;
}
;
function prevents(e) {
    e.preventDefault();
}
;
function active() {
    dropArea.classList.add('drag-active');
}
;
function inactive() {
    dropArea.classList.remove('drag-active');
}
;
function drawText() {
    let line1 = '';
    let line2 = '';
    let line3 = '';
    if (state === 'template') {
        getTexts();
        line1 = gameMode[1];
        line2 = gameMode[0];
        line3 = title;
    }
    else {
        const line1Input = document.getElementById('line-1');
        const line2Input = document.getElementById('line-2');
        const line3Input = document.getElementById('line-3');
        line1 = line1Input.value;
        line2 = line2Input.value;
        line3 = line3Input.value;
    }
    ;
    const leftMargin = margin;
    const bottomMargin = 2 * margin;
    ctx.fillStyle = 'white';
    ctx.font = `bold ${fontSize}px DIN Bold`;
    ctx.letterSpacing = `${letterSpacing}px`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.fillText(line1, leftMargin, canvas.height - (bottomMargin + fontSize * 2));
    ctx.fillText(line2, leftMargin, canvas.height - (bottomMargin + fontSize));
    ctx.fillText(line3, leftMargin, canvas.height - bottomMargin);
    ctx.strokeText(line1, leftMargin, canvas.height - (bottomMargin + fontSize * 2));
    ctx.strokeText(line2, leftMargin, canvas.height - (bottomMargin + fontSize));
    ctx.strokeText(line3, leftMargin, canvas.height - bottomMargin);
}
;
function downloadImage() {
    const imageURL = canvas.toDataURL('image/jpeg');
    canvasDownload.href = imageURL;
    canvasDownload.download = title;
    canvasDownload.click();
}
;
function renderImage() {
    getTexts();
    image = new Image();
    const logo = new Image();
    image.addEventListener('load', function () {
        if (state === 'template' && gameMode === null || state === 'template' && title === '') {
            alert('Error: Game Mode and Title cannot be empty.');
            return;
        }
        ;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.drawImage(logo, canvas.width - (logo.width + margin), margin);
        DIN.load().then(function () {
            document.fonts.add(DIN);
            drawText();
            downloadImage();
        });
    });
    image.src = URL.createObjectURL(imageInput.files[0]);
    logo.src = '../img/HSR-logo.png';
}
;
// Event Listeners
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eName) {
    dropArea.addEventListener(eName, prevents);
});
['dragenter', 'dragover'].forEach(function (eName) {
    dropArea.addEventListener(eName, active);
});
dropArea.addEventListener('dragleave', function (e) {
    if (!dropArea.contains(e.relatedTarget))
        inactive();
});
dropArea.addEventListener('drop', function (e) {
    inactive();
    imageInput.files = e.dataTransfer.files;
    renderImage();
    imageInput.value = '';
});
imageInput.addEventListener('change', function () {
    renderImage();
    imageInput.value = '';
});
templateButton.addEventListener('click', function () {
    templateSection.removeAttribute('hidden');
    customSection.setAttribute('hidden', 'true');
    state = 'template';
});
customButton.addEventListener('click', function () {
    customSection.removeAttribute('hidden');
    templateSection.setAttribute('hidden', 'true');
    state = 'custom';
});
// Initialize App
templateSection.removeAttribute('hidden');
customSection.setAttribute('hidden', 'true');
let state = 'template';
