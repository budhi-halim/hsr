"use strict";
// Elements
const radioInputs = document.getElementsByClassName('radio');
const titleInput = document.getElementById('title');
const imageInput = document.getElementById('image');
const dropArea = document.getElementById('drop-area');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasDownload = document.getElementById('canvas-download');
// Variables
const fontSize = 180;
const margin = 32;
const letterSpacing = -5;
// Default Input Values
let gameMode = null;
let title = '';
let image = null;
;
const gameModeDict = {
    'memory-of-chaos': ['Memory of Chaos', '36 Stars'],
    'pure-fiction': ['Pure Fiction', '12 Stars']
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
    getTexts();
    const leftMargin = margin;
    const bottomMargin = 2 * margin;
    ctx.fillStyle = 'white';
    ctx.font = `bold ${fontSize}px Segoe UI`;
    ctx.letterSpacing = `${letterSpacing}px`;
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.fillText(gameMode[1], leftMargin, canvas.height - (bottomMargin + fontSize * 2));
    ctx.fillText(gameMode[0], leftMargin, canvas.height - (bottomMargin + fontSize));
    ctx.fillText(title, leftMargin, canvas.height - bottomMargin);
    ctx.strokeText(gameMode[1], leftMargin, canvas.height - (bottomMargin + fontSize * 2));
    ctx.strokeText(gameMode[0], leftMargin, canvas.height - (bottomMargin + fontSize));
    ctx.strokeText(title, leftMargin, canvas.height - bottomMargin);
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
        if (gameMode === null || title === '') {
            alert('Error: Game Mode and Title cannot be empty.');
            return;
        }
        ;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.drawImage(logo, canvas.width - (logo.width + margin), margin);
        drawText();
        downloadImage();
    });
    image.src = URL.createObjectURL(imageInput.files[0]);
    logo.src = 'code/img/HSR-logo.png';
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
