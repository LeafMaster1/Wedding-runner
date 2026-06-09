<script lang="ts">
    import { supabase } from "../../lib/supabaseClient";
    import { registerUploadedImage } from "$lib/imageStore";
    import imageCompression from 'browser-image-compression';
    

    let files = $state<FileList | null>(null);
    let uploading = $state(false);
    let success = $state(false);
    let previewUrl = $state<string | null>(null);
    let uploadProgress = $state("");

    

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            files = target.files;
            previewUrl = URL.createObjectURL(files[0]);
            success = false;
        }
    }
    function homePage() {
        window.location.href = "/";
    }

    async function uploadImage() {
        console.log("--- UPPLADDNING STARTAD ---");
        if (!files || files.length === 0) {
            console.log("Fel: ingen fil hittades");
            return;
        }

        uploading = true;
        uploadProgress = "Bearbetar bild...";

        try {
            const file = files[0];
            let fileToUpload = file;
            let extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            
            console.log(`Originalfil: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB), Typ: ${file.type}`);

            // HEIC/HEIF (iPhone) måste konverteras för att kunna visas i webbläsaren
            const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || extension === 'heic' || extension === 'heif';

            if (isHeic) {
                uploadProgress = "Konverterar iPhone-bild (HEIC)...";
                console.log("Konverterar HEIC till JPG för kompatibilitet...");
                
                // Om filtypen är tom (vanligt på Windows), tvinga den till image/heic så att komprimeraren godkänner den
                const processFile = (file.type === '') 
                    ? new File([file], file.name, { type: 'image/heic' }) 
                    : file;

                const options = {
                    maxSizeMB: 20,           
                    maxWidthOrHeight: 16000, 
                    useWebWorker: true,
                    fileType: 'image/jpeg',
                    initialQuality: 1        
                };
                
                try {
                    fileToUpload = await imageCompression(processFile, options);
                    extension = 'jpg';
                    console.log(`Konvertering klar. Ny storlek: ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
                } catch (compressionError) {
                    console.error("Kunde inte konvertera HEIC lokalt:", compressionError);
                    // Om det misslyckas (t.ex. på en webbläsare som inte alls fattar HEIC), 
                    // så försöker vi ladda upp originalet ändå, men varnar
                    uploadProgress = "Laddar upp original (konvertering misslyckades)...";
                }
            } else {
                console.log("Använder originalfilen (ingen komprimering).");
            }

            uploadProgress = "Laddar upp...";
            const fileName = `${Math.random().toString(36).slice(2)}.${extension}`;

            // Ladda upp filen (original eller konverterad HEIC)
            const { error: uploadError } = await supabase.storage
                .from("wedding_images")
                .upload(fileName, fileToUpload, {
                    contentType: fileToUpload.type || 'image/jpeg',
                    upsert: false,
                });

            if (uploadError) {
                console.error("Supabase Storage Error:", uploadError);
                throw uploadError;
            }

            // Registrera bilden i databastabellen
            await registerUploadedImage(fileName);

            console.log("Uppladdning lyckades!");
            success = true;
        } catch (error: any) {
            alert("Gick inte att ladda upp bilden. Försök igen!");
            console.error(error);
        } finally {
            uploading = false;
            uploadProgress = "";
        }
    }

    const iconCamera = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0
     0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0
     2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;

    const iconGallery = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0
     0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9"
     cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

    const iconSend = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0
     24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13
     2 9 22 2"/></svg>`;

    const iconBack = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0
     24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
</script>

<svelte:head>
    <title>Ladda upp bröllopsbild</title>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
    />
</svelte:head>

<div class="upload-page">
    <div class="card">
        <h1>BILDUPPLADDNING</h1>
        <p class="subtitle">Dela ett ögonblick med brudparet!</p>

        {#if !success}
            <div class="upload-area">
                {#if previewUrl}
                    <div class="preview">
                        <img src={previewUrl} alt="Preview" />
                    </div>
                {/if}
                <!-- dolt fält för kamera -->
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    id="camera-input"
                    onchange={handleFileChange}
                    style="display: none;"
                />

                <!-- dolt för galleriet -->
                <input
                    type="file"
                    accept="image/*"
                    id="gallery-input"
                    style="display: none;"
                    onchange={handleFileChange}
                />

                {#if files}
                    <button
                        class="upload-btn"
                        onclick={uploadImage}
                        disabled={uploading}
                    >
                        <span class="icon">{@html iconSend} </span>
                        {uploading ? "LADDAR UPP..." : "SKICKA BILD"}
                    </button>
                {/if}
                <div class="button-grid">
                    <button
                        class="action-btn camera-btn"
                        onclick={() =>
                            document.getElementById("camera-input")?.click()}
                    >
                        <span class="icon">{@html iconCamera} </span> Ta Ett Kort
                    </button>
                    <button
                        class="action-btn gallery-btn"
                        onclick={() =>
                            document.getElementById("gallery-input")?.click()}
                    >
                        <span class="icon">{@html iconGallery}</span> Välj Från galleriet
                    </button>
                    <button class="action-btn back-btn" onclick={homePage}>
                        <span class="icon">{@html iconBack}</span>
                        backa till menyn
                    </button>
                </div>
            </div>
        {:else}
            <div class="success-msg">
                <div class="icon">❤️</div>
                <h2 class="subtitle">TACK!</h2>
                <p class="subtitle">
                    Din bild har skickats och kommer snart dyka upp i galleriet
                    i spelet.
                </p>
                <button
                    class="reset-btn"
                    onclick={() => {
                        success = false;
                        files = null;
                        previewUrl = null;
                    }}
                >
                    LADDA UPP EN TILL
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
        font-family: sans-serif;
    }

    .upload-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        box-sizing: border-box;
        background-image: url("/assets/background.png");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        position: relative;
    }

    .upload-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
    }

    .card {
        position: relative;
        z-index: 10;
        background: rgba(255, 255, 255, 0.95);
        padding: 1.5rem;
        border-radius: 25px;
        width: 100%;
        max-width: 400px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        background-image: url("/assets/paret-wedding.png");
        background-size: auto 100%;
        background-position: center;
        overflow-y: auto;
    }

    h1 {
        color: #e712d1;
        font-size: clamp(1.5rem, 5vh, 2.2rem);
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: black;
        margin-bottom: 2rem;
    }

    .upload-area {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .preview {
        width: 100%;
        height: 150px;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        background: #eee;
    }

    .preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .button-grid {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        width: 100%;
        margin-top: 1rem;
    }

    .action-btn,
    .upload-btn,
    .reset-btn,
    .back-btn {
        padding: 1.2rem 1.5rem;
        font-size: clamp(1.1rem, 5vw, 1.5rem);
        font-weight: bold;
        border: 2px solid white;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        width: 100%;
        background: rgba(231, 18, 209, 0.3);
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .action-btn:hover,
    .upload-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        color: #e712d1;
        border: 2px solid #e712d1;
    }

    .action-btn:active,
    .upload-btn:active:not(:disabled) {
        transform: scale(0.95);
    }

    .upload-btn:disabled {
        background: #ccc;
        border-color: #999;
        cursor: not-allowed;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (min-width: 500px) {
        .button-grid {
            flex-direction: column; /* Behåll mobil-känsla även på desktop */
            align-items: center;
        }
    }

    @media (orientation: landscape) and (max-height: 500px) {
        .card { padding: 1rem; }
        h1 { font-size: 1.5rem; }
        .preview { height: 120px; }
        .action-btn, .upload-btn, .back-btn { padding: 0.8rem 1rem; font-size: 0.9rem; }
    }
</style>