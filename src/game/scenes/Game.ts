import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;
    gameActive: boolean = true;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.score = 0;
        this.gameActive = true;

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        // Använd din bakgrundsbild
        this.background = this.add.image(512, 384, 'gamebackground').setDepth(0);
        this.background.setAlpha(0.3);

        // Skapa poängtexten i hörnet
        this.scoreText = this.add.text(20, 20, 'POÄNG: 0', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#e712d1', strokeThickness: 4
        }).setDepth(100);

        // Test-knapp för att dö (ersätt med din krock-logik sen)
        const dieButton = this.add.text(512, 700, 'KLICKA HÄR FÖR ATT DÖ (TEST)', {
            fontSize: 24, color: '#ffffff', backgroundColor: '#e712d1', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        dieButton.on('pointerdown', () => this.gameOver());

        EventBus.emit('current-scene-ready', this);
    }

    update (time: number, delta: number)
    {
        if (!this.gameActive) return;

        // Öka poängen långsamt över tid (1 poäng var 100:e millisekund ungefär)
        this.score += delta * 0.1;
        this.scoreText.setText('POÄNG: ' + Math.floor(this.score));
    }

    gameOver ()
    {
        this.gameActive = false;
        // Skicka med poängen till nästa scen
        this.scene.start('GameOver', { score: Math.floor(this.score) });
    }
}
