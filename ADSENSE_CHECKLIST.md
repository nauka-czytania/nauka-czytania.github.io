# AdSense – lista rzeczy do wykonania przed ponownym zgłoszeniem

Projekt został przebudowany tak, aby zawierał więcej własnej, użytecznej treści, jasną nawigację oraz politykę prywatności. Sam kod nie gwarantuje akceptacji AdSense – Google ocenia całą działającą witrynę.

## 1. Hosting na GitHub Pages

Jeżeli strona działa jako projekt pod adresem w rodzaju:

`https://NAZWA_UZYTKOWNIKA.github.io/NaukaCzytania/`

to AdSense nie przyjmuje ścieżki `/NaukaCzytania/` jako osobnej witryny. Dodatkowo `ads.txt` musi być osiągalny z głównego adresu witryny, np. `https://twojadomena.pl/ads.txt`.

Najpewniejsze warianty:

- podpiąć własną domenę do GitHub Pages (zalecane), albo
- publikować projekt jako główną stronę `NAZWA_UZYTKOWNIKA.github.io`, a nie tylko w podkatalogu repozytorium.

Po podpięciu własnej domeny sprawdź w przeglądarce, czy `https://TWOJA_DOMENA/ads.txt` zwraca dokładnie:

`google.com, pub-2654167674032555, DIRECT, f08c47fec0942fa0`

## 2. Wiek odbiorców – cała witryna jest skierowana do dzieci

Ta decyzja jest już jednoznaczna: cały serwis „Nauka czytania” traktuj jako treść skierowaną do dzieci.

Wykonaj dwie rzeczy:

1. W Google Search Console oznacz całą witrynę jako skierowaną do dzieci / wymagającą odpowiedniego traktowania wiekowego.
2. Każde ręcznie dodane żądanie reklamy AdSense oznacz aktualnym sygnałem TFAT dla dzieci. Dla asynchronicznych jednostek `adsbygoogle` oznacza to atrybut:

`data-tag-for-age-treatment="1"`

Wartość `1` oznacza CHILD. W tym trybie Google wyłącza reklamy spersonalizowane i remarketing, blokuje żądania do zewnętrznych dostawców reklam oraz stosuje zabezpieczenia reklamowe dla dzieci.

Nie używaj starszych poradników zalecających TFCD/TFUA jako podstawowej konfiguracji. Google w 2026 przechodzi na TFAT.

**Ważne dla Auto Ads:** zanim włączysz automatyczne reklamy w całej witrynie, najpierw ustaw traktowanie witryny jako dziecięcej na poziomie Google/Search Console. Nie zakładaj, że sam skrypt `adsbygoogle.js` bez dodatkowej konfiguracji oznaczy cały serwis jako CHILD.

## 3. Zgody użytkowników w EOG, Wielkiej Brytanii i Szwajcarii

W panelu AdSense skonfiguruj certyfikowaną platformę CMP. Najprostsza opcja to rozwiązanie Google dostępne w sekcji Privacy & messaging / Prywatność i wiadomości.

Nie zastępuj tego przypadkowym własnym banerem „Akceptuję cookies”, jeżeli ma on obsługiwać zgody wymagane przez AdSense.

## 4. Co już poprawiono w projekcie

- rozbudowana strona główna z jasnym opisem wartości aplikacji,
- osobny poradnik z oryginalną treścią edukacyjną,
- strona „O projekcie”,
- polityka prywatności uwzględniająca AdSense,
- czytelna nawigacja między podstronami,
- responsywny wygląd na telefon i komputer,
- poprawiona dostępność (etykiety, focus, aria-live),
- meta description i sensowne tytuły podstron,
- lokalne przetwarzanie tekstu jasno opisane użytkownikowi,
- `ads.txt` z identyfikatorem `pub-2654167674032555`,
- uporządkowany `robots.txt`.

## 5. Przed wysłaniem do oceny AdSense

1. Opublikuj wszystkie pliki, a nie tylko `index.html`.
2. Kliknij ręcznie każdy link w menu i upewnij się, że nie ma 404.
3. Sprawdź stronę na telefonie i komputerze.
4. Sprawdź publiczny adres `/ads.txt`.
5. Włącz i skonfiguruj CMP w AdSense.
6. Oznacz całą witrynę jako skierowaną do dzieci i upewnij się, że ręczne jednostki reklamowe wysyłają TFAT=CHILD (`data-tag-for-age-treatment="1"`).
7. Nie dodawaj dużej liczby reklam. Treść i narzędzie mają pozostać głównym elementem strony.
8. Dopiero wtedy ponownie poproś o sprawdzenie witryny.

## 6. Ważne

Akceptacji AdSense nie da się zagwarantować. Google może odrzucić stronę również z powodów niezwiązanych bezpośrednio z kodem, np. niewystarczającej historii witryny, jakości lub ilości treści, problemów z nawigacją, sposobu hostowania, polityk dotyczących odbiorców albo konfiguracji konta.
