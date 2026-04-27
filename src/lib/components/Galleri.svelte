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
        }, 60000); // Uppdatera bilder varje minut
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
            <p>Vill du synas här? Skanna koden!</p>
            <div class="qr-container">
                <img src={qrCodeUrl} alt="QR Code för uppladdning" />
            </div>
            <p class="upload-link">Dela bilden på: {uploadUrl}</p>
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
        padding: 1.5rem;
        border-radius: 25px;
        width: 100%;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 30px var(--color-primary);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h2 {
        font-size: 2rem;
        margin: 0;
        color: var(--color-primary);
        font-family: "Arial Black", sans-serif;
    }

    .slideshow-container {
        position: relative;
        width: 100%;
        height: 250px;
        background: #eee;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
    }

    .prev {
        left: 10px;
    }
    .next {
        right: 10px;
    }

    .upload-section {
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 15px;
        border: 2px dashed #ccc;
    }

    .qr-container {
        margin: 10px auto;
        width: 120px;
        height: 120px;
        background: white;
        padding: 5px;
        border-radius: 10px;
    }

    .qr-container img {
        width: 100%;
        height: 100%;
    }

    .upload-link {
        font-size: 0.7rem;
        color: #666;
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
