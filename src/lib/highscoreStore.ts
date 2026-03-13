import { writable } from 'svelte/store';

export interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

const initialScores = JSON.parse(
    (typeof window !== 'undefined' && localStorage.getItem('wedding_highscores')) || '[]'
);

export const highscores = writable<ScoreEntry[]>(initialScores);

export const addHighScore = (name: string, score: number) => {
    highscores.update(currentScores => {
        const upperName = name.trim().toUpperCase();
        
        // 1. Kolla om spelaren redan finns
        const existingIndex = currentScores.findIndex(s => s.name === upperName);

        if (existingIndex !== -1) {
            // Spelaren finns redan! 
            // Uppdatera bara om det nya poänget är HÖGRE
            if (score > currentScores[existingIndex].score) {
                currentScores[existingIndex].score = score;
                currentScores[existingIndex].date = new Date().toLocaleDateString();
            } else {
                // Om det nya poänget är lägre, gör ingenting och returnera listan som den är
                return currentScores;
            }
        } else {
            // Spelaren finns inte, lägg till som ny
            const newEntry: ScoreEntry = {
                name: upperName,
                score: score,
                date: new Date().toLocaleDateString()
            };
            currentScores.push(newEntry);
        }

        // 2. SORTERA: Alltid högst poäng först
        const updated = [...currentScores].sort((a, b) => b.score - a.score);

        // 3. Behåll bara topp 10 unika spelare
        const top10 = updated.slice(0, 10);

        if (typeof window !== 'undefined') {
            localStorage.setItem('wedding_highscores', JSON.stringify(top10));
        }

        return top10;
    });
};
