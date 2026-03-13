import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Play music
        const music = this.sound.get('homeSound') || this.sound.add('homeSound', { loop: true });
        if (!music.isPlaying) {
            music.play({ volume: 0.2 });
        }
        
        // Background image
        const background = this.add.image(512, 384, 'home').setDepth(0);
        background.setDisplaySize(1024, 768);

        // Tell Svelte that the scene is ready
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
