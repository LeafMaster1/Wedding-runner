import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        // Skalar spelet så det fyller hela skärmen
        // mode: Scale.ENVELOP, 
        mode: Scale.FIT, 
        // Skalar spelet så det passar skärmen
        autoCenter: Scale.CENTER_BOTH, 
        // Centrerar spelet
        width: 1024,
        height: 768
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200, x: 0 },
            debug: true // ska ändra till false innan release OBS!!!!!!!!
            
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
