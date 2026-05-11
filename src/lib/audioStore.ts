import { writable } from "svelte/store";

const savedVolume = typeof localStorage !=='undefined' ? localStorage.getItem('gameVolume') : '50';
const savedMuted = typeof localStorage !== 'undefined' ? localStorage.getItem('gameMuted') : 'false';

export const audioSettings = writable({
    volume: parseInt(savedVolume || '50') /100,
    isMuted: savedMuted === 'true'

});

audioSettings.subscribe(state => {
    if (typeof localStorage !== 'undefined'){
        localStorage.setItem('gameVolume',(state.volume * 100).toString());
        localStorage.setItem('gameMuted', state.isMuted.toString());
    }
});


