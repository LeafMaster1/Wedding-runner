<script lang="ts">
    export let onPlay: () => void;
    export let onShowHighscore: () => void;
    export let onShowSettings: () => void;
    export let onShowPictures: () => void;
</script>

<div class="menu-container">
    <header>
        <h1>WEDDING RUNNER</h1>
    </header>

    <footer class="button-group">
        <button class="play-btn" on:click={onPlay}>
            SPELA NU
        </button>
        <button class="settings-btn" on:click={onShowSettings}>
            INSTÄLLNINGAR
        </button>
        <button class="highscore-btn" on:click={onShowHighscore}>
            HIGHSCORE
        </button>
        <button class="picture-btn" on:click={onShowPictures}>
            BILDER
        </button>
    </footer>
</div>

<style>
    .menu-container {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
        box-sizing: border-box;
        padding: 60px 20px;
    }

    header {
        pointer-events: auto;
        text-align: center;
    }

    h1 {
        color: var(--color-white);
        font-size: clamp(2.5rem, 12vw, 5rem);
        margin: 0;
        text-shadow: 4px 4px 0px var(--color-primary);
        line-height: 1.1;
        letter-spacing: 2px;
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        width: 100%;
        max-width: 400px;
        pointer-events: auto;
        padding-bottom: 20px;
    }

    button {
        padding: 1.2rem 1.5rem;
        font-size: clamp(1.4rem, 6vw, 1.8rem);
        font-weight: bold;
        border: 2px solid var(--color-white);
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        width: 100%;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        background: var(--color-primary);
        color: var(--color-white);
        backdrop-filter: blur(5px);
    }

    button:hover {
        background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }

    button:active { transform: scale(0.95); }

    @media (max-height: 500px) {
        .menu-container { padding: 20px; }
        .button-group { flex-direction: row; max-width: 850px; }
    }
</style>
