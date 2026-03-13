import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    finalScore: number = 0;

    constructor ()
    {
        super('GameOver');
    }

    init (data: { score: number })
    {
        // Ta emot poängen från Game-scenen
        this.finalScore = data.score || 0;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(512, 384, 'home').setAlpha(0.5);

        // Vi behöver inte visa text här egentligen eftersom Svelte sköter det,
        // men vi skickar ut eventet så Svelte vet att vi är redo.
        EventBus.emit('current-scene-ready', this);
    }
}
