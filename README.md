Projekt koncepcyjny do portfolio – fikcyjna marka

# Trattoria Sole

**Problem.** Goście chcą poznać menu i przygotować rezerwację przed otwarciem lokalu.

**Rozwiązanie.** One-page łączy filtrowane menu, godziny i odliczanie do ustalonej daty.

**Sekcje.** Otwarcie, Menu, Godziny, Rezerwacja.

**Technologie.** HTML, Tailwind CSS, CSS, JavaScript bez frameworków. Font Playfair Display z Google Fonts.

**Grafiki.** Własne SVG i zrzuty interfejsu.

**GitHub Pages.** [Adres demo](https://andriu-tsap.github.io/trattoria-sole/).

**Lokalnie.** Uruchom serwer statyczny w katalogu projektu poleceniem python3 -m http.server 8000. Treść jest w HTML, motyw w style.css, zachowanie w app.js. Aby ponownie skompilować Tailwind, zainstaluj tailwindcss@4 i @tailwindcss/cli@4 i uruchom npx @tailwindcss/cli -i tailwind.input.css -o tailwind.css --minify.

## Zrzuty ekranu

[Desktop](screenshots/desktop.png) · [Mobile](screenshots/mobile.png)

## Lighthouse

<!-- AUDIT:START -->
Pomiar strony głównej na lokalnym serwerze statycznym w GitHub Actions (Chromium · Lighthouse 12).

| Tryb | Wydajność | Dostępność | Dobre praktyki | SEO |
| --- | ---: | ---: | ---: | ---: |
| desktop | 100 | 100 | 100 | 100 |
| mobile | 100 | 100 | 100 | 100 |
<!-- AUDIT:END -->

