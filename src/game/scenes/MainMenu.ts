import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { audioSettings } from '../../lib/audioStore';
import { get } from 'svelte/store';
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
            music.play({ volume: 0.4 });
        }

        const settings = get(audioSettings);
        this.sound.volume = settings.volume;
        this.sound.mute = settings.isMuted;
        
        // Background image
        const background = this.add.image(512, 384, 'home').setDepth(0);
        background.setDisplaySize(1024, 768);

        EventBus.on('change-volume', (newVolume: number) => {
            this.sound.setVolume(newVolume);
        });
        EventBus.on('change-muted', (isMuted: boolean) => {
            this.sound.setMute(isMuted);
        });

        // Tell Svelte that the scene is ready
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
