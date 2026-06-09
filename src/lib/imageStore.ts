import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

export const images = writable<string[]>([]);
export const loadingImages = writable(false);

const BUCKET_NAME = 'wedding_images';

// Lokala bilder från static/assets/gallery
// @ts-ignore
const localImages = Object.keys(import.meta.glob('/static/assets/gallery/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true }))
    .map((path) => path.replace('/static', ''));

export const fetchImages = async () => {
    loadingImages.set(true);
    
    try {
        // 1. Hämta filnamnen från databastabellen
        const { data, error } = await supabase
            .from('uploaded_images')
            .select('file_name')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching image list from DB:', error);
            // Om DB-anropet misslyckas visar vi åtminstone lokala bilder
            images.set(localImages);
            return;
        }

        // 2. Skapa publika URL:er för varje fil från Supabase
        const supabaseUrls = data.map(img => {
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(img.file_name);
            return urlData.publicUrl;
        });

        // 3. Slå ihop lokala bilder och Supabase-bilder
        images.set([...localImages, ...supabaseUrls]);
    } catch (err) {
        console.error('Unexpected error in fetchImages:', err);
        images.set(localImages);
    } finally {
        loadingImages.set(false);
    }
};

export const registerUploadedImage = async (fileName: string) => {
    const { error } = await supabase
        .from('uploaded_images')
        .insert([{ file_name: fileName }]);
        
    if (error) {
        console.error('Error registering image in DB:', error);
        throw error;
    }
    
    // Uppdatera listan direkt efter lyckad registrering
    await fetchImages();
};
