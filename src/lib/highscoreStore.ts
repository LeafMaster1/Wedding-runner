import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

export interface ScoreEntry {
    name: string;
    score: number;
    created_at?: string;
}

export const highscores = writable<ScoreEntry[]>([]);

// Hämta highscores från Supabase
export const fetchHighScores = async () => {
    const { data, error } = await supabase
        .from('highscores')
        .select('name, score, created_at')
        .order('score', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching highscores:', error);
    } else if (data) {
        highscores.set(data);
    }
};

// Spara nytt highscore till Supabase
export const addHighScore = async (name: string, score: number) => {
    const upperName = name.trim().toUpperCase();

    // Vi skickar upp poängen. Supabase-tabellen bör vara inställd på att 
    // hantera unika namn eller bara spara alla försök.
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
