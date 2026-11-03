# Edzésnapló

Vitorlás edzői napló telefonra és számítógépre: edzéstervek, napi adatok, összesítő, havi beszámoló és versenyzői kiértékelés, Word- és Excel-exporttal.

- Telepíthető webalkalmazás (PWA): a telefon kezdőképernyőjére tehető, internet nélkül is megnyílik.
- Az adatok **nem** ebben a tárolóban vannak: az eszközön és a felhasználó saját Google Drive-ján („Edzésnapló” mappa) tárolódnak, és automatikusan szinkronizálódnak.
- A tároló csak a program kódját tartalmazza, személyes adatot nem.

## Fájlok
- `index.html` – az alkalmazás
- `sw.js` – offline működés
- `manifest.webmanifest`, `icon-*.png` – telepítés és ikon
