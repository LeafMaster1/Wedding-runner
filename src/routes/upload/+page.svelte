<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import imageCompression from 'browser-image-compression';

    let files: FileList | null = null;
    let uploading = false;
    let success = false;
    let previewUrl: string | null = null;
    let uploadProgress = "";

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            files = target.files;
            previewUrl = URL.createObjectURL(files[0]);
            success = false;
        }
    }

    async function uploadImage() {
        if (!files || files.length === 0) return;
        uploading = true;
        uploadProgress = "Komprimerar bild...";
        
        try {
            const file = files[0];
            
            // Inställningar för komprimering
            const options = {
                maxSizeMB: 1,          // Max 1MB per bild (räcker gott för skärmar)
                maxWidthOrHeight: 1920, // Max Full-HD upplösning
                useWebWorker: true
            };

            const compressedFile = await imageCompression(file, options);
            
            uploadProgress = "Laddar upp...";
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('wedding_images')
                .upload(filePath, compressedFile);

            if (uploadError) {
                throw uploadError;
            } else {
                success = true;
            }
        } catch (error) {
            alert('Gick inte att ladda upp bilden. Försök igen!');
            console.error(error);
        } finally {
            uploading = false;
            uploadProgress = "";
        }
    }
</script>

<svelte:head>
    <title>Ladda upp bröllopsbild</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
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

                <label class="file-label">
                    <input type="file" accept="image/*" on:change={handleFileChange} capture="environment" />
                    <span>{previewUrl ? 'VÄLJ EN ANNAN BILD' : 'TA ETT KORT / VÄLJ BILD'}</span>
                </label>

                {#if files}
                    <button class="upload-btn" on:click={uploadImage} disabled={uploading}>
                        {uploading ? 'LADDAR UPP...' : 'SKICKA BILD'}
                    </button>
                {/if}
            </div>
        {:else}
            <div class="success-msg">
                <div class="icon">❤️</div>
                <h2>TACK!</h2>
                <p>Din bild har skickats och kommer snart dyka upp i galleriet i spelet.</p>
                <button class="reset-btn" on:click={() => { success = false; files = null; previewUrl = null; }}>
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
        background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
    }

    .card {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    h1 {
        color: #e712d1;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #666;
        margin-bottom: 2rem;
    }

    .upload-area {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .preview {
        width: 100%;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;
        background: #eee;
    }

    .preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .file-label {
        background: #eee;
        padding: 1rem;
        border-radius: 10px;
        border: 2px dashed #ccc;
        cursor: pointer;
        display: block;
        font-weight: bold;
        color: #555;
    }

    .file-label input {
        display: none;
    }

    .upload-btn {
        background: #e712d1;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 50px;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(231, 18, 209, 0.3);
    }

    .upload-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .success-msg {
        padding: 2rem 0;
    }

    .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .reset-btn {
        margin-top: 1.5rem;
        background: none;
        border: 2px solid #e712d1;
        color: #e712d1;
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        font-weight: bold;
        cursor: pointer;
    }
</style>