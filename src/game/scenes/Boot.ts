import { Scene } from 'phaser';


export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // this.load.image('background', 'assets/bg.png');
        this.load.audio('theme', 'assets/Whiskey_And_War.mp3');
        this.load.image('home', 'assets/homeScreen-3D.png');
        this.load.audio('homeSound', 'assets/stockholms-bimbo.mp3');
        this.load.image('boat', 'assets/boat.png');
        
        
        
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
