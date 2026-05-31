<script lang="ts">
    import { supabase } from "../../lib/supabaseClient";
    import imageCompression from "browser-image-compression";
    

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
        // TEST 1: Kollar om funktionen ens startar
        console.log("--- UPPLADDNING STARTAD ---");
        if (!files || files.length === 0) {
            // test för att kolla om den får någon fil att ladda upp
            console.log("Fek: ingen fil hittades i (files) variabeln");
            return;
        }

        uploading = true;
        uploadProgress = "Komprimerar bild...";

        try {
            const file = files[0];

            // logg för test !!!!!!!!!  för att kolla orginalstorlek på bilden
            console.log(
                `Orginalstorlek:${[(file.size / 1024 / 1024).toFixed(2)]}MB`,
            );

            // Inställningar för komprimering
            const options = {
                maxSizeMB: 3, // Max 1MB per bild (räcker gott för skärmar)
                maxWidthOrHeight: 3000, // Max Full-HD upplösning
                useWebWorker: true,
                fileType: "image/jpeg",
            };

            // startar kompremering
            console.log("Startar komprimering...");
            const compressedFile = await imageCompression(file, options);
            // komprimering klar!
            console.log("Komprimering klar!", compressedFile);

            // LOGG för att kolla filstorlek efter komprimering
            console.log(
                `Komprimerad storlek: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
            );
            console.log(
                `Efter: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
            );

            uploadProgress = "Laddar upp...";
            const fileName = `${Math.random().toString(36).slice(2)}.jpg`;
            // const fileExt = file.name.split('.').pop();
            // const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
            // const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("wedding_images")
                .upload(fileName, compressedFile, {
                    contentType: "image/jpeg", // Berätta för Supabase att det är en JPG
                    upsert: false,
                });

            if (uploadError) {
                // logg för att kolla om supabase nekar uppladdning
                console.error("Supabase Error:", uploadError);
                throw uploadError;
            }
            /// logg för att kolla om uppladdning lyckades

            console.log("uppladdning lyckades!!");
            success = true;
        } catch (error: any) {
            // Om felet kommer från RLS-policyn (t.ex. för stor fil)
            if (error.message?.includes("policy")) {
                alert(
                    "Bilden är tyvärr för stor eller har fel format, även efter komprimering.",
                );
            } else {
                alert("Gick inte att ladda upp bilden. Försök igen!");
            }
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

                <!-- <label class="file-label">
                    <input type="file" accept="image/*" onchange={handleFileChange} capture="environment" />
                    <span>{previewUrl ? 'VÄLJ EN ANNAN BILD' : 'TA ETT KORT / VÄLJ BILD'}</span>
                </label> -->

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
                <h2>TACK!</h2>
                <p>
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
        overflow-y: auto !important;
        position: static !important;
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
        font-family: sans-serif;
    }
    .mobile-controls {
            position: absolute;
            bottom: 20px; /* Hamnar i det svarta området längst ner */
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 50px;
            pointer-events: auto; /* Se till att de går att klicka på */
        }

    .upload-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        height: auto;
        padding: 40px 20px;
        box-sizing: border-box;

        /* BAKGRUNDSBILDEN */
        background-image: url("/assets/background.png"); /* Eller background.png */
        background-size: cover;
        background-position: center;
        background-attachment: fixed; /* Gör att bakgrunden inte scrollar på mobilen */
        position: relative;
        /* background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%); */
    }
    .upload-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3); /* Mörk överlägg för bättre kontrast */
        z-index: 1;
    }

    .card {
        position: relative;
        z-index: 10; /* Se till att kortet är ovanför bakgrunden */
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 2rem;
        border-radius: 25px;
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        background-image: url("/assets/paret-wedding.png");
        background-size: auto 100%;
        background-position: center;
        /* background-repeat: no-repeat; */

        /* background: rgba(255, 255, 255, 0.1) url('/assets/paret-wedding.png');  */
    }
    h1 {
        color: #e712d1;
        font-size: 2rem;
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
        /* 200px tidigare */
        border-radius: 10px;
        object-fit: cover;
        overflow: hidden;
        margin-bottom: 10px;
        background: #eee;
    }

    .preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* .file-label {
        background: #eee;
        padding: 1rem;
        border-radius: 10px;
        border: 2px dashed #ccc;
        cursor: pointer;
        display: block;
        font-weight: bold;
        color: #555;
    } */

    /* .file-label input {
        display: none;
    } */

    .upload-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .success-msg {
        padding: 2rem 0;
    }

    .icon, p , h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #e712d1;
        /* width: 24px;
        height: 24px; */
    }

    /* .reset-btn {
        margin-top: 1.5rem;
        background: none;
        border: 2px solid #e712d1;
        color: #e712d1;
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        font-weight: bold;
        cursor: pointer;
    }
    .button-grid {
        display: flex;
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    .action-btn {
      padding: 1.2rem;
      border-radius: 15px;
      border: 2px solid #e712d1;
      background: white;
      color: #e712d1;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn:active {
        transform: scale(0.95);
        background: var(--e712d1);
        color: white;
    } */
    /* Knapp-behållaren */
    .button-grid {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        width: 100%;
        margin-top: 1rem;
    }
    /* Den gemensamma stilen för ALLA knappar på sidan */
    .action-btn,
    .upload-btn,
    .reset-btn,
    .back-btn {
        padding: 1.2rem 1.5rem;
        font-size: clamp(
            1.1rem,
            5vw,
            1.5rem
        ); /* Något mindre text för att få plats */
        font-weight: bold;
        border: 2px solid white; /* Eller var(--color-white) om den är tillgänglig */
        border-radius: 50px;
        cursor: pointer;
        transition:
            transform 0.2s,
            background 0.2s;
        width: 100%;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0);
        background: rgba(
            231,
            18,
            209,
            0.3
        ); /* Din rosa färg (var--color-primary) */
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    /* Hover-effekt (samma som menyn) */
    .action-btn:hover,
    .upload-btn:hover:not(:disabled),
    .reset-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        color: #e712d1;
        border: 2px solid #e712d1;
    }
    /* Tryck-effekt */
    .action-btn:active,
    .upload-btn:active:not(:disabled),
    .reset-btn:active {
        transform: scale(0.95);
    }
    /* Grå färg om knappen är avstängd */
    .upload-btn:disabled {
        background: #ccc;
        border-color: #999;
        cursor: not-allowed;
        box-shadow: none;
    }

    .action-btn :global(svg) {
        stroke: white;
        transition: stroke 0.2s;
    }
    .action-btn:hover :global(svg) {
        stroke: #e712d1;
    }
    @media (min-width: 500px) {
        .button-grid {
            flex-direction: row;
            grid-template-columns: repeat(3, 1fr);
        }
    }

     /* Anpassning för liggande mobil (Landscape) */
     @media (orientation: landscape) and (max-height: 500px) {
        .card {
            padding: 1rem;
            width: 90%;
        }
        h1 {
            font-size: 1.5rem;
        }
        .subtitle {
            font-size: 0.9rem;
        }
        .preview {
            height: 120px;
        }
        .action-btn,
        .upload-btn,
        .reset-btn,
        .back-btn {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
        }
    }
</style>
