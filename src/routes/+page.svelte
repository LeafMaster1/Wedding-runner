<script lang="ts">
    import type { Scene } from "phaser";
    import PhaserGame from "../PhaserGame.svelte";
    import MainMenuOverlay from "$lib/components/MainMenuOverlay.svelte";
    import HighscoreList from "$lib/components/HighscoreList.svelte";
    import GameOverOverlay from "$lib/components/GameOverOverlay.svelte";
    import SettingsOverlay from "$lib/components/SettingsOverlay.svelte";
    import Galleri from "$lib/components/Galleri.svelte";

    import { EventBus } from "../game/EventBus";

    let phaserRef = $state({ game: null, scene: null });
    let currentSceneName = $state("Boot");
    let showHighscore = $state(false);
    let showSettings = $state(false);
    let showGallery = $state(false);
    let currentScore = $state(0);

    const currentScene = (scene: Scene) => {
        currentSceneName = scene.scene.key;
        if (currentSceneName === "GameOver") {
            currentScore = (scene as any).finalScore || 0;
        }
    };

    const startPlaying = () => {
        phaserRef.scene.scene.start('Game');
    };

    // Mobilkontroller-funktioner
    const moveLeft = () => EventBus.emit('mobile-move-left');
    const moveRight = () => EventBus.emit('mobile-move-right');
    const stopMove = () => EventBus.emit('mobile-stop');
    const jump = () => EventBus.emit('mobile-jump');

</script>

<div id="app">
    <div class="game-wrapper">
        <PhaserGame bind:phaserRef={phaserRef} currentActiveScene={currentScene} />
        
        {#if currentSceneName === "Game"}
            <div class="mobile-ui">
                <div class="left-controls">
                    <button 
                        class="ctrl-btn left" 
                        on:touchstart|preventDefault={moveLeft} 
                        on:touchend|preventDefault={stopMove}
                        on:mousedown|preventDefault={moveLeft}
                        on:mouseup|preventDefault={stopMove}
                        aria-label="Vänster"
                    ></button>
                    <button 
                        class="ctrl-btn right" 
                        on:touchstart|preventDefault={moveRight} 
                        on:touchend|preventDefault={stopMove}
                        on:mousedown|preventDefault={moveRight}
                        on:mouseup|preventDefault={stopMove}
                        aria-label="Höger"
                    ></button>
                </div>
                <div class="right-controls">
                    <button 
                        class="ctrl-btn jump" 
                        on:touchstart|preventDefault={jump}
                        on:mousedown|preventDefault={jump}
                        aria-label="Hoppa"
                    ></button>
                </div>
            </div>
        {/if}
    </div>

    {#if currentSceneName === "MainMenu"}
        {#if showHighscore}
            <HighscoreList onClose={() => showHighscore = false} />
        {:else if showSettings}
            <SettingsOverlay onClose={() => showSettings = false} />
        {:else if showGallery}
            <Galleri onClose={() => showGallery = false} />
        {:else}
            <MainMenuOverlay 
                onPlay={startPlaying} 
                onShowHighscore={() => showHighscore = true} 
                onShowSettings={() => showSettings = true}
                onShowPictures={() => showGallery = true}
            />
        {/if}
    {/if}

    {#if currentSceneName === "GameOver"}
        <GameOverOverlay 
            score={currentScore} 
            onRestart={() => phaserRef.scene.scene.start('Game')} 
            onToMenu={() => phaserRef.scene.scene.start('MainMenu')}
        />
    {/if}
</div>

<style>
    #app {
        width: 100%;
        height: 100dvh;
        overflow: hidden;
        position: relative;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .game-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        justify-content: center;
    }

    .mobile-ui {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 40px 50px;
        pointer-events: none;
        z-index: 1000;
        box-sizing: border-box;
    }

    .ctrl-btn {
        pointer-events: auto;
        width: 85px;
        height: 85px;
        background-color: rgba(255, 255, 255, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        background-size: 55%;
        background-repeat: no-repeat;
        background-position: center;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .ctrl-btn:active {
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(0.9);
        border-color: rgba(255, 255, 255, 0.8);
    }

    .left-controls {
        display: flex;
        gap: 30px;
    }

    .left { background-image: url('/assets/arrow-left.png'); }
    .right { background-image: url('/assets/arrow-right.png'); }
    .jump { 
        background-image: url('/assets/arrow-jump.png');
        width: 110px;
        height: 110px;
        background-size: 50%;
    }

    /* Anpassningar för Landscape */
    @media (orientation: landscape) {
        .mobile-ui {
            padding: 20px 20px;
            align-items: center; /* Centrera knapparna vertikalt i landscape */
        }
        
        .left-controls {
            flex-direction: column; /* Stapla pilarna ovanpå varandra */
            gap: 40px;
            justify-content: center;
        }

        .right-controls {
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .ctrl-btn {
            width: 100px;
            height: 100px;
        }

        .jump {
            width: 130px;
            height: 130px;
        }
    }

    /* Göm kontrollerna på desktop */
    @media (min-width: 1025px) {
        .mobile-ui {
            display: none;
        }
    }
</style>
