"use strict";
const request = new XMLHttpRequest();
request.open('GET', 'https://www.prydwen.gg/star-rail/characters/acheron', true);
request.send(null);
request.onreadystatechange = () => {
    if (request.readyState == 4)
        console.log(request.responseText);
};
