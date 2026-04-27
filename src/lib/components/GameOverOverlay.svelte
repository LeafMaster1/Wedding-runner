<script lang="ts">
    import { addHighScore } from '$lib/highscoreStore';
    
    export let score: number;
    export let onRestart: () => void;
    export let onToMenu: () => void;
    export let showPictures: () => void;

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
        <h1>GAME OVER</h1>
        <p class="score-display">Dina poäng: <span>{score}</span></p>

        {#if !submitted}
            <div class="input-section">
                <p>Skriv in ditt namn för topplistan!</p>
                <input 
                    type="text" 
                    bind:value={playerName} 
                    placeholder="DITT NAMN" 
                    maxlength="15"
                />
                <button class="save-btn" on:click={handleSubmit} disabled={playerName.trim().length === 0}>
                    SPARA POÄNG
                </button>
            </div>
        {:else}
            <div class="submitted-msg">
                <p>Poängen är sparad!</p>
                <button class="menu-btn" on:click={onToMenu}>TILL MENYN</button>
            </div>
        {/if}

        <div class="footer-buttons">
            <button class="restart-btn" on:click={onRestart}>SPELA IGEN</button>
            <button class="pictures-btn" on:click={showPictures}>BILDER</button>
        </div>
    </div>
</div>

<style>
    .game-over-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: 20px;
        box-sizing: border-box;
    }

    .game-over-card {
        background: #fff;
        color: #000;
        padding: 2.5rem;
        border-radius: 25px;
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 0 40px var(--color-primary);
        font-family: sans-serif;
    }

    h1 {
        font-family: 'Arial Black', sans-serif;
        color: var(--color-primary);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .score-display {
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    .score-display span {
        font-weight: bold;
        color: var(--color-primary);
        font-size: 2rem;
    }

    .input-section p {
        margin-bottom: 1rem;
        font-weight: bold;
        color: #555;
    }

    input {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        text-align: center;
        border: 2px solid #ddd;
        border-radius: 10px;
        margin-bottom: 1rem;
        box-sizing: border-box;
        text-transform: uppercase;
    }

    input:focus {
        border-color: var(--color-primary);
        outline: none;
    }

    button {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: bold;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .save-btn {
        background: var(--color-primary);
        color: #fff;
    }

    .save-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .submitted-msg {
        margin-bottom: 2rem;
        color: #27ae60;
        font-weight: bold;
    }

    .menu-btn {
        background: #333;
        color: #fff;
        margin-top: 10px;
    }

    .restart-btn {
        background: transparent;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        margin-top: 2rem;
    }

    button:active {
        transform: scale(0.95);
    }
</style>
