<script lang="ts">
    export let onClose: () => void;
    
    let volume = 50;
    let soundEnabled = true;
</script>

<div class="settings-overlay">
    <div class="settings-card">
        <h2>INSTÄLLNINGAR</h2>
        
        <div class="settings-content">
            <div class="setting-item">
                <label for="volume">VOLYM: {volume}%</label>
                <input type="range" id="volume" bind:value={volume} min="0" max="100" />
            </div>

            <div class="setting-item">
                <label>LJUD: {soundEnabled ? 'PÅ' : 'AV'}</label>
                <button 
                    class="toggle-btn" 
                    class:active={soundEnabled} 
                    on:click={() => soundEnabled = !soundEnabled}
                >
                    {soundEnabled ? 'STÄNG AV' : 'SÄTT PÅ'}
                </button>
            </div>
        </div>

        <button class="back-btn" on:click={onClose}>TILLBAKA</button>
    </div>
</div>

<style>
    .settings-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 15px;
        box-sizing: border-box;
    }

    .settings-card {
        background-image: url('/assets/boat.png');
        background-size: cover;
        background-position: center;
        border-radius: 30px;
        width: 95%;
        max-width: 500px;
        min-height: 50vh;
        display: flex;
        flex-direction: column;
        text-align: center;
        box-shadow: 0 0 40px var(--color-primary);
        position: relative;
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.3);
        background-blend-mode: lighten;
    }

    h2 {
        font-size: 2.5rem;
        margin: 1.5rem 0;
        color: var(--color-primary);
        font-family: 'Arial Black', sans-serif;
        text-shadow: 2px 2px 0px white, -2px -2px 0px white;
    }

    .settings-content {
        margin: 0 1.5rem 1.5rem 1.5rem;
        padding: 2rem;
        /* background: rgba(255, 255, 255, 0.7); */
        backdrop-filter: blur(0);
        border-radius: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .setting-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        text-align: left;
    }

    label {
        font-weight: bold;
        font-size: 1.2rem;
        color: #000;
        font-family: sans-serif;
    }

    input[type="range"] {
        width: 100%;
        accent-color: var(--color-primary);
        cursor: pointer;
    }

    .toggle-btn {
        background: var(--color-primary);
        color: var(--color-white);
        border: 2px solid var(--color-white);
        padding: 0.8rem;
        border-radius: 10px;
        font-weight: bold;
        cursor: pointer;
    }

    .toggle-btn:hover {
        background: var(--color-primary);
        color: var(--color-white);
        border: 2px solid var(--color-primary);
    }
    .toggle-btn.active {
        /* background: var(--color-primary);
        color: var(--color-white); */
        background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }

    .back-btn {
        margin: 1rem 1.5rem 1.5rem 1.5rem;
        padding: 1.2rem;
        background: var(--color-primary);
        color: var(--color-white);
        border: 2px solid var(--color-white);
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.2rem;
    }
    .back-btn:hover {
        background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }
        .back-btn:active { transform: scale(0.95); }

    button:active { transform: scale(0.95); }
</style>
