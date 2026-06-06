import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';
import { dev } from "$app/environment";

export interface ScoreEntry {
    name: string;
    score: number;
    created_at?: string;
}

const LOCAL_STORAGE_KEY = 'wedding_runner_highscores';

export const highscores = writable<ScoreEntry[]>([]);

// Hämta highscores från Supabase eller LocalStorage (i dev)
export const fetchHighScores = async () => {
    if (dev) {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            const parsedData: ScoreEntry[] = JSON.parse(localData);
            // Sortera först efter högsta poäng
            const sorted = parsedData.sort((a, b) => b.score - a.score);
            
            // Filtrera så varje namn bara visas en gång
            const uniqueScores: ScoreEntry[] = [];
            const seenNames = new Set();
            
            for (const entry of sorted) {
                if (!seenNames.has(entry.name)) {
                    uniqueScores.push(entry);
                    seenNames.add(entry.name);
                }
                if (uniqueScores.length === 10) break;
            }
            
            highscores.set(uniqueScores);
        } else {
            highscores.set([]);
        }
        return;
    }

    // Vi hämtar de 100 bästa raderna för att vara säkra på att vi hittar 10 unika personer
    const { data, error } = await supabase
        .from('highscores')
        .select('name, score, created_at')
        .order('score', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error fetching highscores:', error);
    } else if (data) {
        // Filtrera bort dubbletter (behåll bara bästa poängen per person)
        const uniqueData: ScoreEntry[] = [];
        const seenNames = new Set();
        
        for (const entry of data) {
            if (!seenNames.has(entry.name)) {
                uniqueData.push(entry);
                seenNames.add(entry.name);
            }
            if (uniqueData.length === 10) break; // Vi vill bara ha topp 10 unika
        }
        
        highscores.set(uniqueData);
    }
};

// Spara nytt highscore till Supabase eller LocalStorage (i dev)
export const addHighScore = async (name: string, score: number) => {
    const upperName = name.trim().toUpperCase();

    if (dev) {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let scores: ScoreEntry[] = localData ? JSON.parse(localData) : [];
        
        scores.push({
            name: upperName,
            score: score,
            created_at: new Date().toISOString()
        });

        // Sortera och spara
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scores));
        highscores.set(scores);
        return;
    }

    // Vi skickar upp poängen till Supabase
    const { error } = await supabase
        .from('highscores')
        .insert([{ name: upperName, score: score }]);

    if (error) {
        console.error('Error saving highscore:', error);
    } else {
        // Hämta listan på nytt för att uppdatera vyn
        await fetchHighScores();
    }
};
