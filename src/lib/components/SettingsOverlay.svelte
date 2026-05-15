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

            <div class="spacer"></div>

            <div class="setting-item">
                <button 
                    class="btn" 
                    on:click={toggleMute}>
                    {$audioSettings.isMuted ? 'LJUD PÅ' : 'LJUD AV'}
                </button>
            </div>
                <div class="setting-item">
                    <button class="btn" on:click={onClose}>TILLBAKA</button>
                </div>
        </div>
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
        align-items: flex-start;
        z-index: 1000;
        padding: var(--overlay-padding);
        box-sizing: border-box;
        overflow-y: auto;
    }

    .settings-card {
        background-image: url('/assets/boat.png');
        background-size: cover;
        background-position: center;
        border-radius: 30px;
        width: var(--card-width);
        max-width: 500px;
        margin: auto 0;
        display: flex;
        flex-direction: column;
        text-align: center;
        box-shadow: 0 0 40px var(--color-primary);
        position: relative;
        overflow: hidden;
        background-blend-mode: lighten;
    }

    h2 {
        /* font-size: var(--font-size-title); */
        font-size: clamp(1.4rem, 6vw, 2.6rem);
        margin: 1.5rem 0;
        color: var(--color-primary);
        font-family: 'Arial Black', sans-serif;
        text-shadow: 2px 2px 0px white, -2px -2px 0px white;

        letter-spacing: -1px;
        max-width: 100%;
        overflow-wrap: break-word;
        line-height: 1.1;
    }

    .settings-content {
        margin: 0 1.5rem 1.5rem 1.5rem;
        padding: 1rem;
        border-radius: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        /* gap: 5rem; */
        gap: 1rem;
        /* justify-content: space-between; */
    }
    .spacer{
        flex-grow: 1;
        min-height: 5rem;
    }
    .btn{
        display: flex;
        gap: 0.8;
        width: 100%;
        min-height: 55px;
        align-items: center;
        text-align: center;
        justify-content: center;
        white-space: nowrap;
        
    }

    .setting-item {
        display: flex;
        flex-direction: column;
        /* gap: 10px; */
        text-align: left;
        
    }

    label {
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--color-primary);
        text-shadow: 1px 1px 0px white, -1px -1px 0px white;
        font-family: sans-serif;
    }

    input[type="range"] {
        width: 100%;
        accent-color: var(--color-primary);
        cursor: pointer;
        height: 2rem;
    }
    @media(max-height: 500px){
        .spacer{
            display: none;
        }
        .settings-card{
            width: 98%;
            max-width: 800px;
            height: 98%;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }
        h2{
            font-size: 1.5rem;
            margin: 0.5rem 0;
        }
        .settings-content{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
            padding: 0.5rem;
            align-items: end;
        }
        .setting-item:first-child{
            grid-column: span 2;
        }
        .setting-item{
            width: 100%;
        }
        
        :global(.btn){
            height: 100% !important;
            min-height: 50px !important;
            padding: 0.5rem !important;
            font-size: 1.1rem !important;
        }

        
        
    }
</style>
