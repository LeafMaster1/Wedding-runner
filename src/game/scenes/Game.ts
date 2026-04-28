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
    enemy: Phaser.Physics.Arcade.Sprite;

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

        // 1. Mark (Flyttad upp till 600 för att ge plats åt footern)
        const groundY = 600;
        const ground = this.add.rectangle(512, groundY, 1024, 20, 0x00ff00, 0);
        this.physics.add.existing(ground, true); 

        // 2. Skapa Footer/Kontrollpanel längst ner
        const footerHeight = 168; // 768 - 600
        const footer = this.add.rectangle(512, 684, 1024, footerHeight, 0x000000, 0.7);
        footer.setDepth(90).setScrollFactor(0);

        // 3. Animationer
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

        // 4. Spelaren
        this.player = this.physics.add.sprite(100, groundY - 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.4); 
        
        // 5. Hitbox-justering
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setSize(100, 350); 
        body.setOffset(25, 30); 

        // 6. Kollision
        this.physics.add.collider(this.player, ground);

        // 7. Mobilkontroller
        this.setupControls();

        this.enemy = this.physics.add.sprite(800, groundY - 100, 'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy, ground);
        this.physics.add.overlap(this.player, this.enemy, () => this.gameOver(), undefined, this);

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

    // TODO: if sats som kollar om spelare krockar med fiende, isåfall gameover
    // TODO: fiender som spawnar och rör sig mot spelaren
    // TODO: power-ups som spawnar och ger poäng eller tillfälliga förmågor
    // TODOD: extra poäng om spelaren hoppar över fiender eller samlar power-ups
    
    update (time: number, delta: number)
    {
        if (!this.gameActive) return;

        this.handleInput();

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (!body.touching.down) {
            this.player.play('jump', true);
        } else if (body.velocity.x !== 0) {
            this.player.play('run', true);
        } else {
            this.player.anims.stop();
            this.player.setFrame(0);
        }

        this.score += delta * 0.1;
        this.scoreText.setText('POÄNG: ' + Math.floor(this.score));
    }

    handleInput()
    {
        const cursors = this.input.keyboard!.createCursorKeys();
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            if (this.player.data && !this.player.data.get('isMovingMobile')) {
                this.player.setVelocityX(0);
            }
        }

        if ((cursors.up.isDown || cursors.space.isDown) && body.touching.down) {
            this.player.setVelocityY(-600);
        }
    }

    setupControls()
    {
        this.player.setData('isMovingMobile', false);
        const buttonY = 684; // Mitten av footern

        // Hopp-knapp (Längst till höger)
        const jumpButton = this.add.image(900, buttonY, 'mobile-controls-jump')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);
        
        jumpButton.on('pointerdown', () => {
            if (this.player.body!.touching.down) {
                this.player.setVelocityY(-900);
            }
        });

        // Vänster-knapp
        const leftButton = this.add.image(100, buttonY, 'mobile-controls-left')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);

        leftButton.on('pointerdown', () => {
            this.player.setData('isMovingMobile', true);
            this.player.setVelocityX(-350);
        });

        leftButton.on('pointerup', () => {
            this.player.setData('isMovingMobile', false);
            this.player.setVelocityX(0);
        });

        // Höger-knapp
        const rightButton = this.add.image(300, buttonY, 'mobile-controls-right')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);

        rightButton.on('pointerdown', () => {
            this.player.setData('isMovingMobile', true);
            this.player.setVelocityX(350);
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
