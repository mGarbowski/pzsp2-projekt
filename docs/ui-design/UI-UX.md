<!--
pandoc UI-UX.md -o UI-UX.pdf \
    --pdf-engine=xelatex \
    --toc \
    --toc-depth=2 \
    --number-sections \
    -V geometry:margin=0.5in \
    -V lang=polish \
    -V babel-lang=polish
 -->
# Aktorzy

Użytkownik aplikacji - analityk sieci teleinformatycznej w dużej firme telekomunikacyjnej

# Historyjki użytkownika

1. Jako analityk sieci teleinformatycznej chcę wizualizować istniejący graf połączeń i ich zajętości w sieci, aby łatwo zrozumieć strukturę połączeń i zidentyfikować potencjalne problemy

2. Jako analityk sieci teleinformatycznej chcę, aby optymalne ścieżki nowych kanałów były automatycznie wyznaczane aby uniknąć ręcznej analizy i zapewnić efektywne wykorzystanie pasma

3. Jako analityk sieci teleinformatycznej chcę łatwo wygenerować raporty o zajętości kanałów w istniejącej sieci aby monitorować obciążenie sieci i zapobiegać ewentualnym przeciążeniom

4. Jako analityk sieci teleinformatycznej, chcę mieć łatwy i intuicyjny dostęp do danych o obciążeniu dowolnego elementu w sieci, aby zidentyfikować słabe punkty i wąskie gardła systemu.

5. Jako analityk sieci teleinformatycznej, chcę optymalnie wykorzystywać przepustowość sieci, aby zminimalizować koszty ponoszone przez moją firmę i zapewnić, że sieć będzie gotowa na dalsze rozszerzenia.

# Przypadki użycia

## Biznesowe przypadki użycia

![Diagram UML przypadków użycia](../diagrams/business-use-cases.drawio.png)

### PB1 Przeglądanie prezentacji sieci

Aktorzy: użytkownik.

Scenariusz główny:

1. System wyświetla graficzną prezentację sieci teletransmisyjnej.
2. System wyświetla zbiorcze statystyki sieci.
3. Użytkownik wybiera element sieci.
4. System wyświetla szczegółowe informacje o elemencie.

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

![Diagram UML przypadków użycia](../diagrams/system-use-cases.drawio.png)

### FU1 Wprowadzenie opisu sieci do systemu

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik otwiera widok wprowadzania danych.
1. Użytkownik wybiera plik z opisem sieci (RB1).
2. Użytkownik potwierdza, że chce nadpisać aktualnie załadowaną w systemie sieć.
3. System informuje użytkownika o poprawnym załadowaniu pliku.
4. System wyświetla widok prezentacji załadowanej sieci.

Scenariusz alternatywny - nieprawidłowy plik:

1. Jak w scenariuszu głównym.
2. System informuje użytkownika o nieprawidłowym formacie pliku.
3. System wyświetla informację o akceptowanych formatach (RB1).
4. System umożliwia ponowny wybór pliku - powrót do kroku 1.

### FU2 Przeglądanie prezentacji sieci

Wspiera procedurę PB1 - Przeglądanie prezentacji sieci.

Korzysta z FU1.

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza opis sieci za pomocą funkcji FU1.
2. Użytkownik otwiera widok prezentacji sieci.
3. System wyświetla graficzną prezentację topologii sieci i zajętości pasma w krawędziach.
4. System wyświetla zbiorcze statystyki sieci (RB4).
5. Użytkownik wybiera element sieci (węzeł, krawędź, kanał).
6. System wyświetla parametry elementu (RB2, RB3, RB5).

### FU3 Wygenerowanie zestawienia zajętości pasma przez kanały

Wspiera procedurę PB2 - Wygenerowanie zestawienia zajętości pasma przez kanały.

Korzysta z FU1.

Aktorzy: użytkownik.

Scenariusz główny:

1. Użytkownik wprowadza do systemu opis sieci za pomocą funkcji FU1.
2. Użytkownik wybiera widok generowania zestawienia.
3. System generuje plik w ustalonym formacie (RB6).
4. Użytkownik pobiera plik.

### FU4 Wyznaczenie nowego kanału

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

1. Jak w scenariuszu głównym.
2. Jak w scenariuszu głównym.
3. Jak w scenariuszu głównym.
4. Jak w scenariuszu głównym.
5. System informuje użytkownika o niepowodzeniu i jego przyczynie.
6. System umożliwia zmianę parametrów i podobną próbę - powrót do kroku 4.

### RB1 Format pliku opisującego sieć teletransmisyjną

Dane nie zostały jeszcze przedstawione przez klienta projektu - wymaga późniejszego
wypełnienia.

### RB2 Parametry węzła sieci

* długość i szerokość geograficzna
* liczba wychodzących ścieżek

### RB3 Parametry krawędzi sieci

* łączone węzły
* całkowite pasmo
* zajętość pasma

### RB4 Zbiorcze statystyki sieci

* sumaryczna zajętość pasma
* najwęższe wolne pasmo
* najbardziej obciążona krawędź
* najmniej obciążona krawędź

### RB5 Parametry kanału

* identyfikator
* całkowite dostępne pasmo
* zajęte pasmo

### RB6 Format pliku z zestawieniem zajmowanych slice'ów przez kanały

* Wierszowi tabeli odpowiada pojedynczy kanał
* Kolumnie tabeli odpowiada pojedynczy slice
* Zawartością komórki tabeli jest binarna informacja o zajętości kanału w danej ścieżce

### RB7 Dostępne modele optymalizacyjne i ich parametry

* algorytm Dijkstry, brak nastrajalnych parametrów
* model całkowitoliczbowy, przewidywane sparametryzowane wagi składowych funkcji celu

# Makiety interfejsu użytkownika

Makiety trzech proponowanych widoków dostępne są do podglądu pod [tym URL](https://www.figma.com/design/LSVdFyCmJqtZo8UsO2cd5q/PZPS2_2024?node-id=0-1&t=1bl4m1dv9aWKn0LJ-1)
