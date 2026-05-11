<script lang="ts">
    import { EventBus } from "../../game/EventBus";
    import  { audioSettings } from "../audioStore";
    
    export {audioSettings}
    export let onClose: () => void;
    
    // let volume = 50;
    // let soundEnabled = true;

    function handleVolumeChange(e: Event)
    {
        const input = e.target as HTMLInputElement;
        const rawValue = parseInt(input.value);

        const val = rawValue / 100;

        // const val = parseInt((e.target as HTMLInputElement).value) /100;
        
        audioSettings.update(s => ({...s, volume:val}));
        
        EventBus.emit('change-volume',val);
    }
    function toggleMute()
    {
        audioSettings.update(s => {
            const newMuted= !s.isMuted;
            EventBus.emit('change-muted',newMuted);
            return {...s,isMuted: newMuted};
        });
    }
  

   
</script>

<div class="settings-overlay">
    <div class="settings-card">
        <h2>INSTÄLLNINGAR</h2>
        
        <div class="settings-content">
            <div class="setting-item">
                <label for="volume">VOLYM: {Math.round($audioSettings.volume *100)}%</label>
                <input
                 id="volume"
                 type="range"
                 min="0"
                 max="100"
                 step="1"
                value={$audioSettings.volume * 100}
                on:input={handleVolumeChange} />
            </div>

            <div class="setting-item">
                <!-- <label>LJUD: {$audioSettings.isMuted ? 'PÅ' : 'AV'}</label> -->
                <button 
                    class="toggle-btn" 
                    on:click={toggleMute}>
                    {$audioSettings.isMuted ? 'LJUD PÅ' : 'LJUD AV'}
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
        /* background-color: rgba(255, 255, 255, 0.3); */
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
        /* backdrop-filter: blur(0); */
        border-radius: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 5rem;
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
        color: var(--color-primary);
        text-shadow: 1px 1px 0px var(--color-primary), -1px -1px 0px var(--color-white);
        font-family: sans-serif;
    }

    input[type="range"] {
        width: 100%;
        accent-color: var(--color-primary);
        cursor: pointer;
    }

    .toggle-btn {
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
        .toggle-btn:hover {
    background: var(--color-white);
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }
    .toggle-btn:hover.active{
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
