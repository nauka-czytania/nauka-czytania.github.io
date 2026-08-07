# AdSense – konfiguracja witryny skierowanej do dzieci

Cały serwis „Nauka czytania” jest skierowany do dzieci.

## Ustawienia obowiązkowe

- Oznacz całą witrynę jako skierowaną do dzieci w narzędziach Google/Search Console.
- Nie korzystaj z reklam personalizowanych ani remarketingu.
- Google w 2026 używa TFAT (Tag for Age Treatment). Wartość CHILD to `1`.
- Przy ręcznych jednostkach asynchronicznego AdSense dodaj do elementu `<ins class="adsbygoogle">`:

```html
data-tag-for-age-treatment="1"
```

Przykład (wstaw własny `data-ad-slot` z panelu AdSense):

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2654167674032555"
     data-ad-slot="TWOJ_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"
     data-tag-for-age-treatment="1"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

Nie wpisuj wymyślonego numeru `data-ad-slot`; skopiuj go z jednostki utworzonej w AdSense.

## Zgody i cookies

Brak personalizacji nie oznacza automatycznie braku plików cookie. Google informuje, że reklamy niespersonalizowane mogą nadal używać cookie/identyfikatorów m.in. do ograniczania częstotliwości i zbiorczych raportów. Dla użytkowników z EOG/UK/Szwajcarii skonfiguruj w AdSense „Prywatność i wiadomości” zgodnie z aktualnymi wymaganiami Google i prawa.
