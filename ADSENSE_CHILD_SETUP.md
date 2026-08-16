# AdSense – konfiguracja witryny skierowanej do dzieci

Cały serwis „Nauka czytania” jest skierowany do dzieci.

## Traktowanie wiekowe

Google w aktualnej dokumentacji używa TFAT (Tag for age treatment). Dla żądania przeznaczonego do traktowania CHILD wartość wynosi `1`.

Przy ręcznej asynchronicznej jednostce reklamowej dodaj do elementu `ins.adsbygoogle`:

```html
data-tag-for-age-treatment="1"
```

Nie wpisuj wymyślonego `data-ad-slot`. Użyj numeru wygenerowanego przez AdSense.

Poza oznaczeniem poszczególnych żądań oznacz również witrynę jako skierowaną do dzieci w odpowiednich narzędziach Google/Search Console. Ustawienie na poziomie witryny jest szczególnie ważne, jeśli korzystasz z automatycznego sposobu umieszczania reklam.

## Zgody i cookies

Dla użytkowników z EOG, Wielkiej Brytanii i Szwajcarii skonfiguruj w AdSense aktualne wymagane rozwiązanie zarządzania zgodą. Brak reklam personalizowanych nie oznacza, że wszystkie technologie pamięci lokalnej są automatycznie wyłączone.
