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

    <div class="spacer"></div>

    <footer class="button-group">
        <button class="btn" on:click={onPlay}> SPELA NU </button>
        <button class="btn" on:click={onShowSettings}> INSTÄLLNINGAR </button>
        <button class="btn" on:click={onShowHighscore}> HIGHSCORE </button>
        <button class="btn" on:click={onShowPictures}> BILDER </button>
    </footer>
</div>

<style>
    .menu-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
        box-sizing: border-box;
        padding: 20px 20px;
    }
    .spacer{
        flex-grow: 1;
        width: 100%;
    }

    header {
        pointer-events: auto;
        text-align: center;
        flex-shrink: 0;
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
        gap: 0.6rem;
        width: var(--card-width);
        max-width: 350px;
        pointer-events: auto;
        padding-bottom: 20px;
        /* opacity: 0.7; */
    }
    .button-group :global(.btn){
        padding: 0.8rem 1rem;
        font-size: 1.1rem;
    }

    /* button {
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

    :global(button):hover {
        background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    } */

    /* button:active { transform: scale(0.95); } */

    @media (max-height: 500px) {
        .menu-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 20px 5%;
        }
        .spacer{
            flex-grow: 1;
            min-width: 25%;

        }
        header {
            max-width: 45%;
            text-align: left;
            margin: 0;
        }
        h1{
            font-size: clamp(1.2rem, 6vw, 2.5rem);
        }
        .button-group {
            /* flex-direction: row; */
            /* flex-wrap: wrap; */
            justify-content: bottom;
            max-width: 40%;
            margin: 0;
            display: grid;
            padding: 0;
            grid-template-columns: 1fr, 1fr;
            gap: 0.5rem;
            
        }
        .button-group :global(.btn) {
            /* Två knappar per rad */
            width: 100%;

            padding: 0.6rem; /* Mindre padding */
            font-size: 1rem; /* Mindre text */
            margin: 0;
        }
    }
   
</style>
