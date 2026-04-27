# Bröllops-Runner: Karaktärsrörelse TODO

Här är stegen för att få bröllopskaraktärerna att röra på sig och bli spelbara:

## 1. Grundinställningar
- [x] **Aktivera fysikmotorn**: Lägg till `physics` (Arcade Physics) i `src/game/main.ts` så att karaktären kan påverkas av gravitation.
- [] **Skapa en mark (Ground)**: Lägg till en statisk kropp eller en osynlig plattform i `Game.ts` som spelaren kan springa på.

## 2. Resurser & Animationer
- [x] **Ladda karaktärer**: Uppdatera `src/game/scenes/Preloader.ts` för att ladda `wedding-cloth-run.png` (som en spritesheet om det är en animation).
- [x] **Skapa animationer**: I `Preloader.ts` (create) eller `Game.ts`, definiera animationer för:
    - `run`: Spelaren springer framåt.
    - `jump`: Spelaren hoppar.
- [] **Skapa animationer för fiende**: I `Preloader.ts` (create) eller `Game.ts`, definiera animationer för:
    - `run`: fiende springer framåt.


## 3. Spelarlogik (Game.ts)
- [x] **Skapa spelaren**: Lägg till `this.player = this.physics.add.sprite(...)` i `create()`-metoden.
- [ ] **Konfigurera kollision**: Se till att spelaren krockar med marken (`this.physics.add.collider(player, ground)`).
- [ ] **Sätt gravitation**: Justera spelarens `gravityY` så hoppen känns bra.

## 4. Styrning & Input
- [x] **Tangentbordsstyrning**: Lägg till lyssnare för `SPACE` eller `UP` för att hoppa, samt piltangenter för framåt/bakåt.
- [x] **Touch-kontroller (Mobil)**:
    - [x] **Vänsterpil**: Skapa en knapp för att gå bakåt.
    - [x] **Högerpil**: Skapa en knapp för att gå framåt.
    - [x] **Upp-pil (Hopp)**: Skapa en dedikerad knapp för att hoppa.
- [ ] **Håll-ner-logik**: Implementera logik så att karaktären fortsätter gå så länge man håller fingret på vänster/höger-knappen.
- [ ] **Hopp-logik**: Kontrollera att spelaren bara kan hoppa när den faktiskt står på marken (`body.touching.down`).

## 5. UI-layout för Mobil
- [x] **Placering**: Placera vänster- och högerpilar nere i vänstra hörnet och hoppknappen nere i högra hörnet för bästa ergonomi.
- [ ] **ScrollFactor**: Sätt `setScrollFactor(0)` på alla knappar så de stannar kvar på skärmen när karaktären springer framåt.
- [ ] **Responsivitet**: Se till att knapparna inte täcker för mycket av spelplanen på mindre skärmar.

## 6. Databas supabase
- [x] **koppla databasen** : koppla till highscorelistan.
- [x] **koppla databasen** : koppla till bilder galleri.
- [] **koppla databasen** : koppla till QR kod.

## 7. Generera QR kod till spelet
- [] **QR till spelet** : ansluta till spelet med QR-kod.
- [] **QR till bildgaller** : lägga upp bilder med QR-kod dill galleri knappen.