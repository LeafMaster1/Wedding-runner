<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { images as imageStore, fetchImages, loadingImages } from '$lib/imageStore';
    export let onClose: () => void;

    let currentIndex = 0;
    let interval: any;
    let fetchInterval: any;
    let touchStartX = 0;

    // Prenumerera på store
    $: images = $imageStore;
    $: loading = $loadingImages;

    onMount(() => {
        fetchImages();
        interval = setInterval(() => {
            if (images.length > 0) {
                currentIndex = (currentIndex + 1) % images.length;
            }
        }, 5000);
        fetchInterval = setInterval(() => {
            fetchImages();
        }, 30000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
        if (fetchInterval) clearInterval(fetchInterval);
    });

    function nextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function handleTouchStart(e: TouchEvent) {
        touchStartX = e.touches[0].clientX;
    }

    function handleTouchEnd(e: TouchEvent) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }

    const uploadUrl =
        typeof window !== "undefined" ? `${window.location.origin}/upload` : "";
</script>

<div class="gallery-overlay">
    <div class="gallery-card">
        <header>
            <h2>BILDGALLERI</h2>
            <button class="close-x" on:click={onClose}>✕</button>
        </header>

        <div 
            class="slideshow-cont"
            on:touchstart={handleTouchStart} 
            on:touchend={handleTouchEnd}
        >
            {#if loading}
                <div class="status-msg">Laddar bilder...</div>
            {:else if images.length > 0}
                <div class="image-container">
                    <img src={images[currentIndex]} alt="Wedding Galleri" />
                    <button class="nav-btn prev" on:click={prevImage}>❮</button>
                    <button class="nav-btn next" on:click={nextImage}>❯</button>
                </div>
            {:else}
                <div class="status-msg">Inga bilder än. Bli den första att ladda upp!</div>
            {/if}
        </div>

        <footer class="gallery-footer">
            <a href="/upload" class="upload-btn-action">LADDA UPP BILD</a>
        </footer>
    </div>
</div>

<style>
    /* Grunddesign (Mobil först) */
    .gallery-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        box-sizing: border-box;
    }

    .gallery-card {
        background-color: #ccc;
        color: black;
        width: 100%;
        height: 100%; /* Fyller hela skärmen på mobil */
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    header {
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        flex-shrink: 0; /* Förhindra att headern krymper */
    }

    h2 {
        font-size: clamp(1.2rem, 5vw, 2.2rem);
        margin: 0;
        color: var(--color-primary);
        font-family: "Arial Black", sans-serif;
    }

    .close-x {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        font-size: 2rem;
        color: #666;
        cursor: pointer;
        padding: 5px 15px;
    }

    .slideshow-cont {
        flex: 1; /* Tar upp all kvarvarande plats */
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        min-height: 0; /* Viktigt för flexbox-overflow */
    }

    .image-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .status-msg {
        color: white;
        font-size: 1.2rem;
    }

    .nav-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 20%; /* Stor osynlig (eller semitransparent) klickyta */
        background: rgba(0,0,0,0.1); /* Diskret på mobil */
        color: rgba(255,255,255,0.5);
        border: none;
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
        z-index: 10;
    }
    .nav-btn:hover {
        background: rgba(0,0,0,0.4);
        color: white;
    }

    .prev { left: 0; }
    .next { right: 0; }

    .gallery-footer {
        padding: 10px;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
    }

    .upload-btn-action {
        background-color: var(--color-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.1rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.2s, background-color 0.2s;
        width: 100%;
        max-width: 400px;
        text-align: center;
    }
    
    .upload-btn-action:active {
        transform: scale(0.95);
    }

    /* Anpassning för liggande mobil (Landscape) */
    @media (orientation: landscape) and (max-height: 500px) {
        header {
            padding: 5px;
        }
        h2 {
            font-size: 1.2rem;
        }
        .gallery-footer {
            padding: 5px;
        }
        .upload-btn-action {
            padding: 0.5rem 1rem;
            font-size: 1rem;
        }
        .close-x {
            font-size: 1.5rem;
            padding: 2px 10px;
        }
    }

    /* Anpassning för Dator/Större skärmar */
    @media (min-width: 768px) {
        .gallery-card {
            height: 90vh;
            max-width: 1020px;
            border-radius: 20px;
            box-shadow: 0 0 50px var(--color-primary);
        }
        
        header {
            padding: 20px;
        }
        
        .gallery-footer {
            padding: 20px;
        }
        
        .nav-btn {
            width: 80px;
        }
    }
</style>
