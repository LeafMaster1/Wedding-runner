import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    score: number = 0;
    player!: Phaser.Physics.Arcade.Sprite;
    scoreText!: Phaser.GameObjects.Text;
    gameActive: boolean = true;
    // enemy!: Phaser.Physics.Arcade.Sprite;
    enemies!: Phaser.Physics.Arcade.Group;
    currentSpeed: number = 250;
    powerUps!: Phaser.Physics.Arcade.Group;

    constructor() {
        super("Game");
    }

    create() {
        this.restartGame();
        this.score = 0;
        this.gameActive = true;

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        // Bakgrund
        this.background = this.add
            .image(512, 384, "gamebackground")
            .setDepth(0);
        this.background.setDisplaySize(1024, 768);
        this.background.setAlpha(0.5);

        // 1. Mark (Flyttad upp till 600 för att ge plats åt footern)
        const groundY = 600;
        const ground = this.add.rectangle(512, groundY, 1024, 20, 0x00ff00, 0);
        this.physics.add.existing(ground, true);

        // 2. Skapa Footer/Kontrollpanel längst ner
        const footerHeight = 168; // 768 - 600
        const footer = this.add.rectangle(
            512,
            684,
            1024,
            footerHeight,
            0x000000,
            0.7,
        );
        footer.setDepth(90).setScrollFactor(0);

        // 3. Animationer
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [0, 1, 3],
            }),
            frameRate: 10,
            repeat: -1,
        });
        // enemy animation
        if (!this.anims.exists("enemy-run")) {
            this.anims.create({
                key: "enemy-run",
                frames: this.anims.generateFrameNumbers("enemyRun", {
                    start: 0,
                    end: 7, // 3 orginal || walk 7
                }),
                frameRate: 10, // 8 orginal || walk 7
                repeat: -1,
            });
        }
        if (!this.anims.exists("enemy-walk")) {
            this.anims.create({
                key: "enemy-walk",
                frames: this.anims.generateFrameNumbers("enemyWalk", {
                    start: 0,
                    end: 7,
                }),
                frameRate: 10,
                repeat: -1,
            });
        }

        this.enemies = this.physics.add.group();

        // Skapa fienden och starta dess animation
        // this.enemy.setFlipX(true);  Vänd fienden så den ser mot vänster

        // this.enemy = this.physics.add.sprite(1100, groundY - 300, "enemy"); // 1100 -300
        // this.enemy.setVelocityX(-200); // Fienden rör sig mot vänster
        // this.enemy.setScale(0.4);
        // this.enemy.anims.play("enemy-walk");
        // this.enemy.setCollideWorldBounds(false);
        // this.enemy.setBodySize(200, 300, true); // Gör hitboxen större än sprite för bättre kollisionsdetektion
        // this.physics.add.collider(this.enemies, ground);

        // spawna fler enemies
        // spwana en enemy först
        this.spawnEnemy();
        this.time.addEvent({
            delay: 2500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true,
        });

        this.anims.create({
            key: "jump",
            frames: [{ key: "player", frame: 2 }],
            frameRate: 1,
        });

        // 4. Spelaren
        this.player = this.physics.add.sprite(100, groundY - 100, "player");
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);

        // 5. Hitbox-justering
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setSize(100, 250);
        body.setOffset(25, 30);

        // 6. Kollision
        this.physics.add.collider(this.player, ground);
        // this.physics.add.collider(this.enemy, ground);
        this.physics.add.collider(this.enemies, ground);

        this.physics.add.overlap(
            this.player,
            this.enemies,
            () => this.gameOver(),
            undefined,
            this,
        );

        // POWER UP!
       
        this.powerUps = this.physics.add.group();

        this.physics.add.overlap(
            this.player,
            this.powerUps,
            (player,item) => {
                this.collectPowerUp(player, item);

            },
            undefined,
            this,
        );

        this.time.addEvent({
            delay: 5000,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true,
        });

        // 7. Mobilkontroller
        this.setupControls();

        // this.enemy = this.physics.add.sprite(800, groundY - 100, 'enemy');
        // this.enemy.setCollideWorldBounds(true);
        // this.physics.add.collider(this.enemy, ground);
        // this.physics.add.overlap(this.player, this.enemy, () => this.gameOver(), undefined, this);

        // Poängtext
        this.scoreText = this.add
            .text(20, 20, "POÄNG: 0", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#e712d1",
                strokeThickness: 4,
            })
            .setDepth(100);

        // Test-knapp för att dö
        const dieButton = this.add
            .text(512, 50, "KLICKA HÄR FÖR ATT DÖ (TEST)", {
                fontSize: 24,
                color: "#ffffff",
                backgroundColor: "#e712d1",
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(100);

        dieButton.on("pointerdown", () => this.gameOver());

        EventBus.emit("current-scene-ready", this);
    }

    // TODO: power-ups som spawnar och ger poäng eller tillfälliga förmågor
    // TODOD: extra poäng om spelaren hoppar över fiender eller samlar power-ups

    update(time: number, delta: number) {
        if (!this.gameActive || !this.enemies) return;

        this.handleInput();

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (!body.touching.down) {
            this.player.play("jump", true);
        } else if (body.velocity.x !== 0) {
            this.player.play("run", true);
        } else {
            this.player.anims.stop();
            this.player.setFrame(0);
        }

        this.enemies.getChildren().forEach((enemy: any) => {
            if (!enemy.getData("scored") && enemy.x < this.player.x) {
                // Ge extra poäng
                this.score += 10;

                // Markera fienden som "poängsatt" så vi inte ger poäng igen nästa frame
                enemy.setData("scored", true);

                // Valfritt: Logga i konsolen för att se att det händer
                console.log("+10 POÄNG FÖR HOPP!");

                // kanske ska tabort senare beror på
                this.scoreText.setColor("#1dff09"); // Blir grön för en sekund
                this.time.delayedCall(500, () => {
                    this.scoreText.setColor("#ffffff"); // Tillbaka till vit
                });
            }
            if (enemy.x < -100) {
                enemy.destroy(); // Tar bort fienden permanent när den är utanför bild
            }
            this.powerUps.getChildren().forEach((item: any) => {
                if (item.getData("isPowerUp")) {
                    // Sick-sack formel:
                    // time * 0.005 styr hur snabbt den svänger (frekvens)
                    // 50 styr hur högt/lågt den svänger (amplitud)
                    const movement = Math.sin(time * 0.005) * 50;
                    item.y = item.getData("startY") + movement;
                }

                // Ta bort om den flyger utanför skärmen
                if (item.x < -100) item.destroy();
            });
        });

        // if (this.enemy.x < -100) {
        //     this.enemy.x = 1100; // Starta om fienden från höger
        //     this.enemy.setVelocityX(-200 + Math.random() * 200); // Variera hastigheten lite
        // }

        this.currentSpeed += delta * 0.005;

        this.score += delta * 0.02;
        this.scoreText.setText("POÄNG: " + Math.floor(this.score));
    }

    spawnPowerUp() {
        if(!this.gameActive)return;

        const types = [
            {key:'beer', type: 'invincible'},
            {key:'chips', type: 'high-jump'}
        ];
        const pick = Phaser.Utils.Array.GetRandom(types);

        const startY = 300; //höjd
        const item = this.powerUps.create(1100, startY, pick.key);
        item.setScale(0.2);
         if (item.body) {
            item.body.allowGravity = false; 
        }
        item.setVelocityX(-200); // Flyger mot spelaren

        // Vi sparar starttiden och start-Y för att räkna ut sick-sack-rörelsen i update
        item.setData("powerUpType", pick.type);
        item.setData("startY", startY);
        item.setData("isPowerUp", true);
    }

    collectPowerUp(player:any,item:any){
        const type = item.getData("powerUpType");
        item.destroy();

        if(type === 'high-jump'){
            this.activateHighJump();
        }else if(type === 'invincible'){
            this.activateInvincibility();
        }
    }
    activateHighJump(){
        console.log("CHIPS! hoppar högre!");
        this.player.setTint(0xffff00);
        this.player.setData('isHighJumper',true);

        this.time.delayedCall(7000, () => {
            this.player.setData('isHighJumper', false);
            this.player.clearTint();
        });
    }
    activateInvincibility() {
        console.log("ÖL! Odödlig!");

        this.player.setAlpha(0.5);
        this.player.setTint(0x00ff00);
        this.player.setData('isInvincible', true);

        this.time.delayedCall(7000, () => {
            this.player.setData('isInvincible', false);
            this.player.clearTint();
            this.player.setAlpha(1);
        });
    }


    handleInput() {
        const cursors = this.input.keyboard!.createCursorKeys();
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            if (this.player.data && !this.player.data.get("isMovingMobile")) {
                this.player.setVelocityX(0);
            }
        }

        if ((cursors.up.isDown || cursors.space.isDown) && body.touching.down) {
            const jumpPower = this.player.getData('isHighJumper') ? -900 : -600;
            this.player.setVelocityY(jumpPower);
        }
    }

    setupControls() {
        this.player.setData("isMovingMobile", false);
        const buttonY = 684; // Mitten av footern

        // Hopp-knapp (Längst till höger)
        const jumpButton = this.add
            .image(900, buttonY, "mobile-controls-jump")
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);

        jumpButton.on("pointerdown", () => {
            if (this.player.body!.touching.down) {
                const jumpPower = this.player.getData('isHighJumper') ? -900 : -600;
                this.player.setVelocityY(jumpPower);
            }
        });

        // Vänster-knapp
        const leftButton = this.add
            .image(100, buttonY, "mobile-controls-left")
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);

        leftButton.on("pointerdown", () => {
            this.player.setData("isMovingMobile", true);
            this.player.setVelocityX(-300);
        });

        leftButton.on("pointerup", () => {
            this.player.setData("isMovingMobile", false);
            this.player.setVelocityX(0);
        });

        // Höger-knapp
        const rightButton = this.add
            .image(300, buttonY, "mobile-controls-right")
            .setInteractive({ useHandCursor: true })
            .setDepth(100)
            .setScale(0.3)
            .setScrollFactor(0);

        rightButton.on("pointerdown", () => {
            this.player.setData("isMovingMobile", true);
            this.player.setVelocityX(300);
        });

        rightButton.on("pointerup", () => {
            this.player.setData("isMovingMobile", false);
            this.player.setVelocityX(0);
        });
    }
    spawnEnemy() {
        if (!this.enemies || !this.gameActive) return;

        // skapar en array av fienderna
        const enemyTypes = [
            { key: "enemyWalk", anim: "enemy-walk" },
            { key: "enemyRun", anim: "enemy-run" },
        ];
        const type = Phaser.Utils.Array.GetRandom(enemyTypes);

        // Skapa en ny fiende i gruppen
        const groundY = 600;
        const enemy = this.enemies.create(1100, groundY - 100, type.key);

        // Använd din befintliga logik:
        enemy.setVelocityX(-this.currentSpeed); // samma speed som spelare
        enemy.setScale(0.4);
        enemy.anims.play(type.anim);

        enemy.setBodySize(200, 300, true);
        // Valfritt: Slumpmässig hastighet för att göra det svårare
        // enemy.setVelocityX(-(200 + Math.random() * 200));
    }
    gameOver() {
        if(this.player.getData('isInvincible'))return;
        if (this.gameActive === false) return;

        this.gameActive = false;

        console.log("krock !!");
        this.physics.pause();
        this.player.anims.stop();
        this.scene.start("GameOver", { score: Math.floor(this.score) });
    }

    restartGame(){
        this.currentSpeed =250;
        this.score = 0;
        this.gameActive = true;

    }
}
