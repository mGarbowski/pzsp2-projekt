<!-- 
pandoc master.md -o documentation.pdf \
    --pdf-engine=xelatex \
    --toc \
    --toc-depth=2 \
    --number-sections \
    -V geometry:margin=0.5in \
    -V lang=polish \
    -V babel-lang=polish
-->

---
title: "Sieć"
subtitle: "Dokumentacja projektowa PZSP2"
date: "2024-11-19"
titlepage: true
titlepage-color: "FFFFFF"
titlepage-text-color: "000000"
titlepage-rule-color: "000000"
titlepage-rule-height: 2
---

# Wprowadzenie

**Wersja 1.1**

**Zespół nr 2 w składzie**

* Maksym Bieńkowski
* Mikołaj Garbowski
* Michał Łuszczek
* Krzysztof Sokół

**Mentor zespołu: mgr. inż. Klara Borowa**

**Właściciel tematu: dr. inż. Stanisław Kozdrowski**

\newpage

## Cel projektu
Celem jest stworzenie aplikacji wspomagającej optymalizację bieżącego ruchu w realistycznej sieci 
teleinformatycznej. Podstawowym zadaniem jest odzwierciedlenie aktualnej zajętości pasma w sieci 
optycznej na podstawie plików z baz danych: w postaci arkusza kalkulacyjnego jak i w postaci graficznej 
na modelu topologicznym sieci (mapa zajętości). W przeciwieństwie do technologii fixed grid, która 
zakłada równomierny podział pasma między kanały, stosowany model flex grid umożliwia zmienny 
przydział jednostek nazywanych slice'ami. Pozwala to na minimalizację marnowanego pasma, co 
prowadzi do zmniejszenia kosztów dzierżawy włókien przesyłowych. Problem optymalnej rozbudowy 
sieci należy do kategorii NP-trudnych. Naszym celem jest stworzenie aplikacji ułatwiającej zarządzanie 
taką siecią.

**Głównymi celami są**

* czytelna reprezentacja sieci w postaci grafu
* możliwość zestawienia nowych kanałów i automatyczny dobór optymalnych tras zapewniających 
równomierne obciążenie sieci
* generowanie raportów zajętości slice'ów w postaci plików csv
* zaproponowanie modelu w postaci matematycznej, zawierającego funkcję celu (kosztu) oraz zbioru ograniczeń, optymalizujacego pasmo oraz ruting nowo-zestawianych kanałów (ścieżek) optycznych w sieci

**Słowik pojęć**

* pasmo - zakres częstotliwości światła, na którym przesyłane są dane
* slice’y - kawałki pasma o różnej rozpiętości częstotliwościowej
* krawędź - para włókien optycznych dzierżawionych przez firmę telekomunikacyjną
* kanał - ścieżka między dwoma wierzchołkami zajmująca tę samą grupę slice'ów na każdej krawędzi
* wierzchołek - punkt rozdzielczy sieci telekomunikacyjnej


## Wstępna wizja projektu

Projekt realizowany jako aplikacja sieciowa.

**Tryb Działania**

* Użytkownik ma do dyspozycji interfejs na którym wyświetlana jest sieć w postaci grafu.
* Dla polepszenia czytelności graf nałożony będzie na mapę, przez co łatwo będzie identyfikować połączenia.
* Interfejs użytkownika udostępnia narzędzia do modyfikacji modelu sieci i parametrów modeli optymalizacyjnych.
* System dostarcza modeli optymalizacyjnych do wyznaczania nowych kanałów w sieci.

**Dane**

Danymi w projekcie są:

* dostarczony przez użytkownika plik zawierający koordynaty punktów rozdzielczych, istniejące połączenia i kanały
* wewnętrzna reprezentacja grafowa sieci
* wygenerowany raport w formacie csv z informacjami o zajętości slice'ów - informacje o połączeniu, slice i czy jest obecnie używany

System nie będzie trwale przechowywać danych.

# Metodologia wytwarzania

* Praca, poza określonymi w harmonogramie konsultacjami, organizowana jest w formie zwinnej.
* Przewidziane są cotygodniowe spotkania zdalne w ramach zespołu, w trakcie których członkowie ustalają priorytety i dzielą się zadaniami.
* Przydział zadań widoczny jest na Github w postaci issues.
* Dodatkowo dostępna jest ciągła komunikacja na platformie discord.

Role w zespole według podziału Belbina

* Mikołaj Grabowski  - Shaper, Implementer, Team worker
* Maksym Bieńkowski - Implementer, Resource Investgator, Team Worker
* Michał Luszczek - Coordinator, Implementer, Team Worker
* Krzysztof Sokół - Implementator, Evaluator

# Analiza wymagań

## Wymagania użytkownika i biznesowe

**Wymagania biznesowe**

Aktorzy: osoba zarządzająca rozkładem połączeń w sieci

1. Próba minimalizacji kosztów wynikających z dzierżawy włókien przesyłowych
2. Ułatwienie rozszerzania sieci o nowe połączenia
3. Rozwiązanie problemu wyboru optymalnej trasy nowego połączenia
4. Ułatwienie administracji siecią
5. Zapewnienie jak największej niezawodności sieci poprzez równomierne rozłożenie obciążeń pozwalające na poprowadzenie alternatywnego połączenia w przypadku zerwania fizycznych węzłów
6. Rozwiązanie problemu identyfikacji najbardziej obciążonych odcinków sieci


**Wymagania użytkowe**

1. Użytkownik powinien mieć możliwość zdefiniowania sieci poprzez przesłanie pliku zawierającego jej reprezentację
2. Użytkownik powinien mieć możliwość wizualnego podglądu zajętości slice’ów poszczególnych krawędzi w sieci
3. Użytkownik powinien mieć możliwość zdefiniowania nowego kanału w sieci o określonej przepustowości łączącego zadane dwa wierzchołki
4. Użytkownik powinien otrzymać optymalne ułożenie nowego kanału w sieci
5. Użytkownik powinien mieć możliwość pobrać plik reprezentujący zajętość pasma na każdym ze zdefiniowanych kanałów w sieci
6. Dane użytkownika nie powinny być dostępne dla innych użytkowników systemu
7. Użytkownik powinien mieć możliwość zmiany parametrów algorytmu optymalizacyjnego.

**Wymagania systemowe**

1. System powinien udostępnić użytkownikowi graficzną reprezentację sieci w formie grafu
2. System powinien móc wyświetlać graf rzutowany na mapę geograficzną obszaru na podstawie koordynatów poszczególnych węzłów
3. System powinien wyświetlać zajętość slice'ów danej krawędzi po najechaniu na nią myszką
4. System powinien wyświetlać krawędzie w różnych kolorach reprezentujących zajętość pasma
5. System powinien ustalać optymalne ułożenie nowo zdefiniowanego kanału
6. System powinien udostępniać optymalizację ułożenia dodawanego kanału przy pomocy algorytmu Dijkstry
7. System powinien udostępniać optymalizację ułożenia dodawanego kanału przy pomocy modelu całkowitoliczbowego
8. System powinien umożliwić wyeksportowanie reprezentacji sieci w pliku CSV w następującym formacie:
    * Wierszowi tabeli odpowiada pojedynczy kanał
    * Kolumnie tabeli odpowiada pojedynczy slice
    * Zawartością komórki tabeli jest binarna informacja o zajętości kanału w danej ścieżce
9. Reprezentacja sieci w sesji danego użytkownika powinna być widoczna tylko dla niego
10. System powinien umożliwić zapisanie stanu sieci
11. System powinien umożliwić odtworzenie sieci z wcześniej zapisanego stanu

## Wymagania funkcjonalne i niefunkcjonalne

**Wymagania funkcjonalne**

1. Użytkownik powinien mieć możliwość przesłania pliku w formacie `.csv` zawierającego reprezentację sieci.
2. Aplikacja powinna udostępnić użytkownikowi graficzną reprezentację sieci w postaci grafu.
3. Użytkownik powinien mieć możliwość zdefiniowania nowego kanału w sieci łączącej zadane dwa wierzchołki, określając jego przepustowość.
4. Użytkownik powinien mieć możliwość wyświetlania grafu zrzutowanego na mapę geograficzną obszaru na podstawie współrzędnych poszczególnych węzłów.
5. Aplikacja powinna dynamicznie zmieniać kolor krawędzi grafu w zależności od poziomu zajętości slice'ów tej krawędzi.
6. Użytkownik powinien mieć możliwość podglądu szczegółowych danych dotyczących zajętości slice'ów określonej krawędzi poprzez najechanie na nią kursorem.
7. Ułożenie nowych kanałów określane będzie przy pomocy algorytmu optymalizacyjnego.
8. Aplikacja umożliwia optymalizację ułożenia nowego kanału za pomocą algorytmu Dijkstry.
9. Aplikacja umożliwia optymalizację ułożenia nowego kanału przy użyciu modelu całkowitoliczbowego.
10. Użytkownik powinien mieć możliwość zmiany parametrów algorytmu optymalizacyjnego.

**Wymagania niefunkcjonalne**

1. Aplikacja powinna dostarczać wynik optymalizacji ułożenia kanału w czasie nie dłuższym niż 5 minut dla sieci złożonej z nie więcej niż 300 kanałów.

## Przypadki użycia

**Biznesowe przypadki użycia**

![Diagram UML przypadków użycia](./diagrams/business-use-cases.drawio.png)

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


**Systemowe przypadki użycia**

![Diagram UML przypadków użycia](./diagrams/system-use-cases.drawio.png)

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

### Reguły biznesowe
TODO: Do uzupełnienia kiedy dostaniemy przykładowy zbiór od właściciela projektu

### RB1 Format pliku opisującego sieć teletransmisyjną

### RB2 Parametry węzła sieci

### RB3 Parametry krawędzi sieci

### RB4 Zbiorcze statystyki sieci

### RB5 Parametry kanału

### RB6 Format pliku z zestawieniem zajmowanych slice'ów przez kanały

### RB7 Dostępne modele optymalizacyjne i ich parametry

## Potwierdzenie zgodności wymagań

![Zrzut ekranu z akceptacją wymagań przez właściciela i mentora](./acceptance.png)