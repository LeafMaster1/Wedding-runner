<script lang="ts">
    import type { Scene } from "phaser";
    import PhaserGame from "../PhaserGame.svelte";
    import MainMenuOverlay from "$lib/components/MainMenuOverlay.svelte";
    import HighscoreList from "$lib/components/HighscoreList.svelte";
    import GameOverOverlay from "$lib/components/GameOverOverlay.svelte";
    import SettingsOverlay from "$lib/components/SettingsOverlay.svelte";
    import Galleri from "$lib/components/Galleri.svelte";

    let phaserRef: any = { game: null, scene: null };
    let currentSceneName = "Boot";
    let showHighscore = false;
    let showSettings = false;
    let showGallery = false;
    let currentScore = 0;

    const currentScene = (scene: Scene) => {
        currentSceneName = scene.scene.key;
        if (currentSceneName === "GameOver") {
            currentScore = (scene as any).finalScore || 0;
        }
    };

    const startPlaying = () => {
        phaserRef.scene.scene.start('Game');
    };
</script>

<div id="app">
    <PhaserGame bind:phaserRef={phaserRef} currentActiveScene={currentScene} />

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
        height: 100vh;
        overflow: hidden;
        position: relative;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
