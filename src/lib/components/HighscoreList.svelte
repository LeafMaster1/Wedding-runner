<script lang="ts">
    import { onMount } from 'svelte';
    import { highscores, fetchHighScores } from '$lib/highscoreStore';
    export let onClose: () => void;

    onMount(() => {
        fetchHighScores();
    });
</script>

<div class="highscore-overlay">
    <div class="highscore-card">
        <h2>TOPPLISTA</h2>
        
        <div class="score-list">
            {#if $highscores.length === 0}
                <p class="empty-msg">Inga poäng än. Ut och spring!</p>
            {:else}
                {#each $highscores as s, i}
                    <div class="score-item" class:top-leader={i === 0}>
                        {#if i === 0}
                            <span class="leader-badge">LEADER</span>
                        {/if}
                        <span class="rank">{i + 1}.</span>
                        <span class="name">{s.name}</span>
                        <span class="points">{s.score}p</span>
                    </div>
                {/each}
            {/if}
        </div>

        <button on:click={onClose}>TILLBAKA</button>
    </div>
</div>

<style>
    .highscore-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
        box-sizing: border-box;
    }

    .highscore-card {
        background-image: url('/assets/boat.png');
        background-size: cover;
        background-position: center;
        color: black;
        font-family: Helvetica;
        padding: 2.5rem 1.5rem;
        border-radius: 25px;
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 0 30px var(--color-primary);
        position: relative;
        background-blend-mode: overlay;
        background-color: rgba(255, 255, 255, 0.4); 
        padding: 0;
    }

    h2 {
        font-size: 2.2rem;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--color-primary);
        font-family: 'Arial Black', sans-serif;
        letter-spacing: 2px;
    }

    .score-list {
        margin: 1.5rem;
        max-height: 50vh;
        overflow-y: scroll; /* Alltid rullbar */
        -webkit-overflow-scrolling: touch; /* Mjuk rullning på iPhone */
        padding: 10px;
        
        /* Dölj scrollbar för alla webbläsare */
        -ms-overflow-style: none;  /* IE/Edge */
        scrollbar-width: none;     /* Firefox */
    }

    .score-list::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 1rem;
        margin-bottom: 8px;
        border-bottom: 1px solid #eee;
        font-size: 1.1rem;
        font-family: sans-serif;
        position: relative;
    }

    /* --- SPECIALSTIL FÖR LEDAREN --- */
    .top-leader {
        background: rgba(231, 18, 209, 0.15); 
        border: 3px solid var(--color-primary);
        border-radius: 15px;
        padding: 1.2rem 1rem;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 1.5rem ;
        box-shadow: 0 0 15px var(--color-primary);
        color: black;
    }

    .leader-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: var(--color-white);
        padding: 2px 18px;
        font-weight: bold;
        border-radius: 20px;
        font-size: 1rem;
        letter-spacing: 1px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .rank { width: 30px; text-align: left; opacity: 0.90; }
    .name { flex-grow: 1; text-align: left; padding-left: 10px; font-weight: bold; }
    .points { font-weight: bold; }
    .empty-msg { opacity: 0.6; font-style: italic; }

    button {
        width: calc(100% - 3rem);
        margin: 0 1.5rem 1.5rem 1.5rem;
        padding: 1.1rem;
        background: var(--color-primary);
        color: var(--color-white);
        border: 2px solid var(--color-white);
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.1rem;
    }
    button:hover {
        background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }
    button:active { transform: scale(0.95); }
</style>
