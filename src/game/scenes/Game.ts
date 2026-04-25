import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    score: number = 0;
    player: Phaser.Physics.Arcade.Sprite;
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

        // Bakgrund
        this.background = this.add.image(512, 384, 'gamebackground').setDepth(0);
        this.background.setDisplaySize(1024, 768);
        this.background.setAlpha(0.5);

        // 1. Mark (Osynlig rektangel)
        const ground = this.add.rectangle(512, 750, 1024, 20, 0x00ff00, 0);
        this.physics.add.existing(ground, true); 

        // 2. Animationer
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 3] }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 2 }],
            frameRate: 1
        });

        // 3. Spelaren
        this.player = this.physics.add.sprite(100, 400, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.4); 
        
        // 4. Hitbox-justering
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setSize(100, 350); 
        body.setOffset(25, 30); 

        // 5. Kollision
        this.physics.add.collider(this.player, ground);

        // 6. Mobilkontroller
        this.setupControls();

        // Poängtext
        this.scoreText = this.add.text(20, 20, 'POÄNG: 0', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#e712d1', strokeThickness: 4
        }).setDepth(100);

        // Test-knapp för att dö
        const dieButton = this.add.text(512, 50, 'KLICKA HÄR FÖR ATT DÖ (TEST)', {
            fontSize: 24, color: '#ffffff', backgroundColor: '#e712d1', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(100);

        dieButton.on('pointerdown', () => this.gameOver());

        EventBus.emit('current-scene-ready', this);
    }

    update (time: number, delta: number)
    {
        if (!this.gameActive) return;

        this.handleInput();

        // Hantera animationer baserat på rörelse
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (!body.touching.down) {
            this.player.play('jump', true);
        } else if (body.velocity.x !== 0) {
            this.player.play('run', true);
        } else {
            this.player.anims.stop();
            this.player.setFrame(0);
        }

        // Uppdatera poäng
        this.score += delta * 0.1;
        this.scoreText.setText('POÄNG: ' + Math.floor(this.score));
    }

    handleInput()
    {
        const cursors = this.input.keyboard!.createCursorKeys();
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        // Tangentbord X-axel
        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            // Vi nollställer bara om vi inte rör oss via mobilknappar (vilket vi kollar i setupControls)
            // För att hålla det enkelt nollställer vi om inga pilar är nere.
            // Om man vill ha mjukare stopp kan man använda drag.
            if (this.player.data && !this.player.data.get('isMovingMobile')) {
                this.player.setVelocityX(0);
            }
        }

        // Hopp (Tangentbord)
        if ((cursors.up.isDown || cursors.space.isDown) && body.touching.down) {
            this.player.setVelocityY(-800);
        }
    }

    setupControls()
    {
        this.player.setData('isMovingMobile', false);

        // Hopp-knapp
        const jumpButton = this.add.image(900, 650, 'mobile-controls')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.5)
            .setScrollFactor(0);
        
        jumpButton.on('pointerdown', () => {
            if (this.player.body!.touching.down) {
                this.player.setVelocityY(-800);
            }
        });

        // Vänster-knapp
        const leftButton = this.add.image(750, 650, 'mobile-controls')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.5)
            .setScrollFactor(0)
            .setFlipX(true); // Vänd på bilden om det är en pil

        leftButton.on('pointerdown', () => {
            this.player.setData('isMovingMobile', true);
            this.player.setVelocityX(-300);
        });

        leftButton.on('pointerup', () => {
            this.player.setData('isMovingMobile', false);
            this.player.setVelocityX(0);
        });

        // Höger-knapp
        const rightButton = this.add.image(850, 650, 'mobile-controls')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.5)
            .setScrollFactor(0);

        rightButton.on('pointerdown', () => {
            this.player.setData('isMovingMobile', true);
            this.player.setVelocityX(300);
        });

        rightButton.on('pointerup', () => {
            this.player.setData('isMovingMobile', false);
            this.player.setVelocityX(0);
        });
    }

    gameOver ()
    {
        this.gameActive = false;
        this.scene.start('GameOver', { score: Math.floor(this.score) });
    }
}
