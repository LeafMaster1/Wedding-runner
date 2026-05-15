<script lang="ts">
    import { addHighScore } from '../highscoreStore';
    
    export let score: number;
    export let onRestart: () => void;
    export let onToMenu: () => void;
    export let showPictures: (() => void) | undefined = undefined;

    let playerName = "";
    let submitted = false;

    const handleSubmit = () => {
        if (playerName.trim().length > 0 && !submitted) {
            addHighScore(playerName, score);
            submitted = true;
        }
    };
</script>

<div class="game-over-overlay">
    <div class="game-over-card">
        <div class="header-section">
            <h1>GAME OVER</h1>
            <p class="score-display">Dina poäng: <span>{score}</span></p>
        </div>

        <div class="main-section">
            {#if !submitted}
                <div class="input-section">
                    <p>Skriv in ditt namn för topplistan!</p>
                    <input 
                        type="text" 
                        bind:value={playerName} 
                        placeholder="DITT NAMN" 
                        maxlength="15"
                    />
                    <button class="btn" on:click={handleSubmit} disabled={playerName.trim().length === 0}>
                        SPARA POÄNG
                    </button>
                </div>
            {:else}
                <div class="submitted-msg">
                    <p>Poängen är sparad!</p>
                    <button class="btn btn-outline" on:click={onToMenu}>TILL MENYN</button>
                </div>
            {/if}
        </div>

        <div class="footer-buttons">
            <button class="btn" on:click={onRestart}>SPELA IGEN</button>
            {#if showPictures}
                <button class="btn btn-outline" on:click={showPictures}>SE BILDER</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .game-over-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: var(--overlay-padding);
        box-sizing: border-box;
    }

    .game-over-card {
        background: #fff;
        color: #000;
        padding: 2.5rem;
        border-radius: 25px;
        width: var(--card-width);
        max-width: 450px;
        text-align: center;
        box-shadow: 0 0 40px var(--color-primary);
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
    }

    h1 {
        font-family: 'Arial Black', sans-serif;
        color: var(--color-primary);
        font-size: var(--font-size-title);
        margin-bottom: 0.5rem;
        line-height: 1;
    }

    .score-display {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        color: #444;
    }

    .score-display span {
        font-weight: 900;
        color: var(--color-primary);
        font-size: 2.5rem;
        display: block;
        margin-top: 0.2rem;
    }

    .input-section p {
        margin-bottom: 0.8rem;
        font-weight: bold;
        color: #666;
        font-size: 1rem;
    }

    input {
        width: 100%;
        padding: 1.2rem;
        font-size: 1.5rem;
        text-align: center;
        border: 3px solid #eee;
        border-radius: 15px;
        margin-bottom: 1.2rem;
        box-sizing: border-box;
        text-transform: uppercase;
        color: var(--color-dark);
        background: #f9f9f9;
        /* -webkit-appearance: none; */
    }

    input::placeholder {
        color: #bbb;
    }

    input:focus {
        border-color: var(--color-primary);
        background: #fff;
        outline: none;
        box-shadow: 0 0 10px rgba(231, 18, 209, 0.2);
    }

    .submitted-msg {
        margin-bottom: 1.5rem;
        color: #27ae60;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .btn {
        display: flex;
        width: 100%;
        min-height: 55px;
        align-items: center;
        text-align: center;
        justify-content: center;
        white-space: nowrap;
        margin-bottom: 0.8rem;
    }

    .footer-buttons {
        margin-top: 1rem;
        border-top: 2px dashed #eee;
        padding-top: 1.5rem;
        padding-bottom: env(safe-area-inset-bottom, 0);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    /* Landscape layout optimization */
    @media (max-height: 500px) {
        .game-over-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: 
                "header main"
                "footer main";
            gap: 0.8rem;
            max-width: 700px;
            text-align: left;
            padding: 1rem !important;
            align-items: start;
        }

        .header-section {
            grid-area: header;
        }

        .main-section {
            grid-area: main;
            display: flex;
            flex-direction: column;
            justify-content: center;
            /* Ta bort height: 100% för att förhindra stretching av children */
            height: auto;
            align-self: center; /* Centrera hela sektionen vertikalt i dess grid-area */
        }

        .footer-buttons {
            grid-area: footer;
            border-top: none;
            padding-top: 0;
            margin-top: 0;
            align-self: end;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        h1 {
            font-size: 1.5rem;
            margin-bottom: 0.1rem;
        }

        .score-display {
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
        }

        .score-display span {
            font-size: 1.8rem;
            display: inline;
            margin-left: 0.5rem;
        }

        input {
            padding: 2rem;
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .input-section p {
            margin-bottom: 0.3rem;
            font-size: 0.85rem;
        }

        /* Tvinga alla knappar till exakt samma höjd i landscape */
        .btn {
            height: 50px !important;
            min-height: 50px !important;
            padding: 0 1rem !important;
            font-size: 1rem !important;
            margin-bottom: 0 !important;
        }

        .submitted-msg {
            margin-bottom: 0.5rem;
        }
    }

    @media (max-width: 400px) and (min-height: 501px) {
        .game-over-card {
            padding: 1.5rem;
        }
        .score-display span {
            font-size: 2rem;
        }
    }
</style>