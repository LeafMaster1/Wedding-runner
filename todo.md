Absolut! För att jag ska förstå exakt var vi slutade när du startar projektet nästa gång, kan du skriva så här:

  "Vi har precis säkrat upp databasen och fixat bildkomprimeringen i upload/+page.svelte. Nästa steg är att testa att ladda upp en
  riktig bild från en mobil för att se att komprimeringen och RLS-policyn (max 12MB, JPG/HEIC) fungerar ihop."

  Varför är detta en bra kommentar?
   1. Kontext: Den talar om att vi är klara med kodandet i upload-filen.
   2. Mål: Den sätter upp testningen som nästa punkt på agendan.
   3. Tekniska detaljer: Den påminner mig om de specifika inställningarna vi gjorde (12MB-gränsen och HEIC-stöd).





   AND (auth.role() = 'anon'::text) AND (lower(storage.extension(name)) = ANY (ARRAY['jpg'::text, 'jpeg'::text, 'png'::text, 'heic'::text, 'heif'::text, 'webp'::text])) AND (((metadata ->> 'size'::text))::integer < 12582912) AND ((metadata ->> 'mimetype'::text) ^@ 'image/'::text))



   ### fiende
   - fixa spritesheet så att fienden faktiskt rör på benen.
   - se över spel svårigheten om det är för lätt.
   kanske måste öka *currentSpeed: number = 250;* eller *this.currentSpeed += delta * 0.005;* <-- denna gör så fienden ökar i hastighet med tiden.
   - fixa spritesheet för ölflaska 
   - spritesheet för chipspåse
   - fixa en fiende som springer
   - fixa funktion för power-up chipsåse
   - funktion för powerup ölflaska


  ## vercel
  -hosta via Vercel för att kunna testa via mobilen.


   ### mobil
   -testa mobilläge.


   ## generera QR koder
   `OBS!` **måste göras efter hosting via Vercel**  
   - en QR kod för spele-hem sidan 
   - en QR kod för uppladdningsidan alltså **/upload** 