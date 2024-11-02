# Przypadki użycia

## Wymagania
Tylko robocze, do uzgodnienia z ustaleniami reszty zespołu

* System ma umożliwić wczytanie zbioru danych opisującego sieć teletransmisyjną z pliku dostarczonego przez użytkownika
* System ma umożliwić ręczne dodawanie węzłów i krawędzi sieci przez graficzny interfejs
* System ma prezentować graficznie topologię sieci teletransmisyjnej i zajętość pasma
* System ma umożliwić wygenerowanie pliku z tabelarycznym zestawieniem kanałów z wykorzystywanymi przez nie slice'ami
* System ma umożliwić znalezienie optymalnego kanału między węzłami sieci i prezentować wynik
* System ma dostarczyć różnych metod do znajdowania optymalnego kanału

## Aktorzy
* Użytkownik systemu - korzysta z graficznego interfejsu

## Biznesowe przypadki użycia

![Diagram UML przypadków użycia](./diagrams/business-use-cases.drawio.png)

### PB1 Przeglądanie prezentacji sieci

Aktorzy: użytkownik.

Scenariusz główny:

1. System wyświetla graficzną prezentację sieci teletransmisyjnej.
2. System wyświetla zbiorcze statystyki sieci.
3. Użytkownik wybiera element sieci.
4. System wyświetla szczegółowe informacje o elemencie

### PB2 Wygenerowanie zestawienia zajętości pasma przez kanały

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wybiera opcję generowania zestawienia dla załadowanej sieci.
2. System generuje zestawienie.
3. Użytkownik pobiera plik z zestawieniem.

### PB3 Wyznaczenie nowego kanału

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza parametry dla pożądanego kanału.
2. System prezentuje nowy kanał na wizualizacji sieci.
3. System wyświetla parametry nowego kanału.

Scenariusz alternatywny - system nie może wyznaczyć żądanego kanału:

1. Użytkownik wprowadza parametry dla pożądanego kanału.
2. System informuje użytkownika o niepowodzeniu wyznaczania nowego kanału.
3. System umozliwia ponowne wprowadzenie parametrów - powrót do kroku 1.


## Systemowe przypadki użycia

![Diagram UML przypadków użycia](./diagrams/system-use-cases.drawio.png)

### FU1 Wprowadzenie opisu sieci do systemu

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik otwiera widok wprowadzania danych **[wybór operacji]**

### FU2 Załadowanie danych z pliku

Rozszerza funkcję FU1 po kroku 1. (wybór operacji).

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wybiera plik z opisem sieci (RB1).
2. Użytkownik potwierdza, że chce nadpisać aktualnie załadowaną w systemie sieć.
3. System informuje użytkownika o poprawnym załadowaniu pliku.
4. System wyświetla widok prezentacji załadowanej sieci.

Scenariusz alternatywny - nieprawidłowy plik:

1. Jak w scenariuszu głównym.
2. System informuje użytkownika o nieprawidłowym formacie pliku.
3. System wyświetla informację o akceptowanych formatach (RB1).
4. System umożliwia ponowny wybór pliku - powrót do kroku 1.

### FU3 Ręczne wprowadzenie danych

Rozszerza funkcję FU1 po kroku 1. (wybór operacji).

Aktorzy: użytkownik.

Scenariusz główny:

1. System prezentuje aktualny stan sieci.
2. Użytkownik wybiera rodzaj elementu, który chce dodać (węzeł, krawędź).
3. Użytkownik wprowadza parametry elementu (RB2, RB3).
4. Użytkownik potwierdza dodanie elementu.
5. System wyświetla wizualizację sieci z dodanym elementem.

Scenariusz alternatywny - nieprawidłowe parametry elementu:

1-4. Jak w scenariuszu głównym
5. System informuje o nieprawidłowych wartościach parametrów (RB2, RB3)
6. Użytkownik modyfikuje parametry - powrót do kroku 4.

### FU4 Przeglądanie prezentacji sieci

Wspiera procedurę PB1 - Przeglądanie prezentacji sieci.

Korzysta z FU1.

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza opis sieci za pomocą funkcji FU1.
2. Użytkownik otwiera widok prezentacji sieci
3. System wyświetla graficzną prezentację topologii sieci i zajętości pasma
4. System wyświetla zbiorcze statystyki sieci (RB4).
5. Użytkownik wybiera element sieci (węzeł, krawędź, kanał).
6. System wyświetla parametry elementu (RB2, RB3, RB5).

### FU5 Wygenerowanie zestawienia zajętości pasma przez kanały

Wspiera procedurę PB2 - Wygenerowanie zestawienia zajętości pasma przez kanały.

Korzysta z FU1.

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza do systemu opis sieci za pomocą funkcji FU1.
2. Użytkownik wybiera widok generowania zestawienia.
3. System generuje plik w ustalonym formacie (RB6).
4. Użytkownik pobiera plik.

### FU6 Wyznaczenie nowego kanału

Wspiera procedurę PB3 - Wyznaczenie nowego kanału.

Korzysta z funkcji FU1.

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza opis sieci do systemu za pomocą funkcji FU1.
2. Użytkownik wybiera widok wyznaczania kanału.
3. Użytkownik wybiera model optymalizacyjny (RB7).
4. Użytkownik wprowadza parametry dla modelu (RB7).
5. Użytkownik potwierdza wybór.
6. System sygnalizuje przetwarzanie.
7. System prezentuje znaleziony kanał na wizualizacji.
8. System wyświetla parametry kanału (RB5).

Scenariusz alternatywny - system nie może wyznaczyć żądanego kanału:

1-4. Jak w scenariuszu głównym.
5. System informuje użytkownika o niepowodzeniu i jego przyczynie.
6. System umożliwia zmianę parametrów i podobną próbę - powrót do kroku 4.

## Reguły biznesowe
TODO: Do uzupełnienia kiedy dostaniemy przykładowy zbiór od właściciela projektu

### RB1 Format pliku opisującego sieć teletransmisyjną

### RB2 Parametry węzła sieci

### RB3 Parametry krawędzi sieci

### RB4 Zbiorcze statystyki sieci

### RB5 Parametry kanału

### RB6 Format pliku z zestawieniem zajmowanych slice'ów przez kanały

### RB7 Dostępne modele optymalizacyjne i ich parametry