import { corruptText } from "./effects/text-corruption.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const link = document.querySelector("#news-link");

    if (link) {
        link.classList.add('corruptable-text');
        corruptText(link.parentElement);
    } else {
        console.log('no link');
    }


});