<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { supabase } from '../supabaseClient';
    export let onClose: () => void;

    let images: string[] = [];
    let currentIndex = 0;
    let interval: any;
    let fetchInterval: any;
    let loading = true;
    
    // @ts-ignore
     const localImages = Object.keys(import.meta.glob('/static/assets/gallery/*.{png,jpg,jpeg,webp}',
     { eager: true }))
    .map((path) => path.replace('/static', ''));

     async function loadImages() {
    loading = true;
    
    // 1. Hämta listan från Supabase
    const { data, error } = await supabase
        .storage
        .from('wedding_images')
        .list('', {
            limit: 100,
               offset: 0,
               sortBy: { column: 'created_at', order: 'desc' },
           });

       let supabaseUrls: string[] = [];
       if (data) {
           // Skapa URL:er för bilderna i Supabase
           supabaseUrls = data.map(file => {
               const { data: urlData } = supabase
                   .storage
                   .from('wedding_images')
                   .getPublicUrl(file.name);
               return urlData.publicUrl;
           });
       }

       // 2. HÄR ÄR ÄNDRINGEN: Kombinera listorna
       // Vi lägger dina lokala bilder först, sen de från gästerna.
       images = [...localImages, ...supabaseUrls];
       
       loading = false;
   }

    onMount(() => {
        loadImages();
        interval = setInterval(() => {
            if (images.length > 0) {
                currentIndex = (currentIndex + 1) % images.length;
            }
        }, 5000);
        fetchInterval = setInterval(() => {
            loadImages();
        }, 30000); // Uppdatera bilder varje 30 sekunder
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
        if (fetchInterval) clearInterval(fetchInterval);
    });

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    const uploadUrl =
        typeof window !== "undefined" ? `${window.location.origin}/upload` : "";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(uploadUrl)}`;
</script>

<div class="gallery-overlay">
    <div class="gallery-card">
        <h2>BILDGALLERI</h2>

        <div class="slideshow-container">
            {#if loading}
                <p>Laddar bilder...</p>
            {:else if images.length > 0}
                <div class="image-wrapper">
                    <img src={images[currentIndex]} alt="Wedding Galleri" />
                    <button class="nav-btn prev" on:click={prevImage}>❮</button>
                    <button class="nav-btn next" on:click={nextImage}>❯</button>
                </div>
            {:else}
                <p>Inga bilder än. Bli den första att ladda upp!</p>
            {/if}
        </div>

        <div class="upload-section">
            <p>Vill du synas här?</p>
            <div class="qr-container">
                <img src={qrCodeUrl} alt="QR Code för uppladdning" />
            </div>
            <a href="/upload" class="upload-btn-action">LADDA UPP DIN BILD HÄR</a>
            <p class="upload-link">Eller dela på: {uploadUrl}</p>
        </div>

        <button class="back-btn" on:click={onClose}>TILLBAKA</button>
    </div>
</div>

<style>
    /* Samma stilar som tidigare */
    .gallery-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
        box-sizing: border-box;
    }

    .gallery-card {
        background-color: white;
        color: black;
        padding: 2rem;
        border-radius: 30px;
        width: 100%;
        max-width: 1020px; /* Ännu bredare kort */
        /* max-width: 800px; */
        text-align: center;
        box-shadow: 0 0 50px var(--color-primary);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h2 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--color-primary);
        font-family: "Arial Black", sans-serif;
    }

    .slideshow-container {
        position: relative;
        width: 100%;
        height: 450px; /* Högre bildvisning */
        background: #000; /* Svart bakgrund för bilderna */
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid var(--color-primary);
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain; /* Behåll hela bilden synlig */
    }

    .nav-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 60px; /* Bredare klickyta */
        background: rgba(0, 0, 0, 0.2); /* Väldigt diskret bakgrund */
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        transition: background 0.3s, opacity 0.3s;
        opacity: 0.6;
        z-index: 10;
    }

    .nav-btn:hover {
        background: rgba(0, 0, 0, 0.5);
        opacity: 1;
    }

    .prev {
        left: 0;
        border-radius: 0 15px 15px 0;
    }
    .next {
        right: 0;
        border-radius: 15px 0 0 15px;
    }

    .upload-section {
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 15px;
        border: 2px dashed #ccc;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .qr-container {
        margin: 5px auto;
        width: 100px;
        height: 100px;
        background: white;
        padding: 5px;
        border-radius: 10px;
    }

    .qr-container img {
        width: 100%;
        height: 100%;
    }

    .upload-btn-action {
        background-color: var(--color-primary);
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 0.9rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }

    .upload-btn-action:active {
        transform: scale(0.95);
    }

    .upload-link {
        font-size: 0.6rem;
        color: #666;
        margin: 0;
    }

    .back-btn {
        padding: 1rem;
        background: var(--color-primary);
        color: var(--color-white);
        border: 2px solid var(--color-white);
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
    }
</style>
