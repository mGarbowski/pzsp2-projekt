## 1 Wprowadzenie

### 1.1 Cel projektu

Celem jest stworzenie aplikacji wspomagającej optymalizację bieżącego ruchu w realistycznej sieci teleinformatycznej.
Podstawowym zadaniem jest odzwierciedlenie aktualnej zajętości pasma w sieci optycznej na podstawie plików z baz danych: w postaci arkusza kalkulacyjnego jak i w postaci graficznej na modelu topologicznym sieci (mapa zajętości).
W przeciwieństwie do technologii fixed grid, która zakłada równomierny podział pasma między kanały, stosowany model flex grid umożliwia zmienny przydział jednostek nazywanych slice'ami.
Pozwala to na minimalizację marnowanego pasma, co prowadzi do zmniejszenia kosztów dzierżawy włókien przesyłowych.
Problem optymalnej rozbudowy sieci należy do kategorii NP-trudnych.

Naszym celem jest stworzenie aplikacji ułatwiającej zarządzanie taką siecią.
Głównymi celami są:

* czytelna reprezentacja sieci w postaci grafu
* możliwość zestawienia nowych kanałów i automatyczny dobór optymalnych tras zapewniających równomierne obciążenie sieci
* udostępnienie narzędzi do dodawania nowych połączeń, miast i kanałów do sieci
* generowanie raportów zajętości slice'ów w postaci plików csv

#### Słownik pojęć

* pasmo - zakres częstotliwości światła, na którym przesyłane są dane
* slice`y - kawałki pasma o różnej rozpiętości częstotliwościowej
* krawędź - para włókien optycznych dzierżawionych przez firmę telekomunikacyjną
* kanał - ścieżka między dwoma wierzchołkami zajmująca tę samą grupę slice'ów na każdej krawędzi
* wierzchołek - punkt rozdzielczy sieci telekomunikacyjnej

### 1.2 Wstępna wizja projektu

Projekt realizowany jako aplikacja sieciowa.

#### Tryb Działania

Użytkownik ma do dyspozycji interfejs na którym wyświetlana jest sieć w postaci grafu.

Dla polepszenia czytelności graf nałożony będzie na mapę, przez co łatwo będzie identyfikować połączenia.

Interfejs użytkownika udostępnia narzędzia do modyfikacji modelu sieci i parametrów modeli optymalizacyjnych.

System dostarcza modeli optymalizacyjnych do wyznaczania nowych kanałów w sieci.

#### Dane

Danymi w projekcie są:

* dostarczony przez użytkownika plik zawierający koordynaty punktów rozdzielczych, istniejące połączenia i kanały
* wewnętrzna reprezentacja grafowa sieci
* wygenerowany raport w formacie csv z informacjami o zajętości slice'ów - informacje o połączeniu, slice i czy jest obecnie używany

System nie będzie trwale przechowywać danych.

## 2 Metodologia wytwarzania

Praca, poza określonymi w harmonogramie konsultacjami, organizowana jest w formie zwinnej.

Przewidziane są cotygodniowe spotkania zdalne w ramach zespołu, w trakcie których członkowie ustalają priorytety i dzielą się zadaniami.

Przydział zadań widoczny jest na Github w postaci issues.

Dodatkowo dostępna jest ciągła komunikacja na platformie discord.

#### Role w zespole

Według podziału Belbina

* Mikołaj Grabowski -Shaper, Implementer, Team worker
* Maksym Bieńkowski - Implementer, Resource Investgator, Team Worker
* Michał Luszczek -Coordinator, Implementer, Team Worker
* Krzysztof Sokół - Implementator, Evaluator

## 3 Analiza wymagań

### 3.1 Wymagania użytkownika i biznesowe

* wymagania biznesowe: cele i potrzeby biznesowe, problemy do rozwiązania
* wymagania użytkowe: potrzeby użytkowników i interesariuszy, cechy użytkowe
* wymagania systemowe: cechy rozwiązania

### 3.2 Wymagania funkcjonalne i niefunkcjonalne

#### Wymagania funkcjonalne

* Użytkownik powinien mieć możliwość przesłania pliku w formacie `.csv` zawierającego reprezentację sieci.
* Aplikacja powinna udostępnić użytkownikowi graficzną reprezentację sieci w postaci grafu.
* System powinien udostępniać możliwość ręcznego zdefiniowania nowego węzła w sieci
* Użytkownik powinien mieć możliwość zdefiniowania nowego kanału w sieci łączącej zadane dwa wierzchołki, określając jego przepustowość.
* Użytkownik powinien mieć możliwość wyświetlania grafu zrzutowanego na mapę geograficzną obszaru na podstawie współrzędnych poszczególnych węzłów.
* Aplikacja powinna dynamicznie zmieniać kolor krawędzi grafu w zależności od poziomu zajętości slice'ów tej krawędzi.
* Użytkownik powinien mieć możliwość podglądu szczegółowych danych dotyczących zajętości slice'ów określonej krawędzi poprzez najechanie na nią kursorem.
* Ułożenie nowych kanałów określane będzie przy pomocy algorytmu optymalizacyjnego.
* Aplikacja umożliwia optymalizację ułożenia nowego kanału za pomocą algorytmu Dijkstry.
* Aplikacja umożliwia optymalizację ułożenia nowego kanału przy użyciu modelu całkowitoliczbowego.
* Użytkownik powinien mieć możliwość zmiany parametrów algorytmu optymalizacyjnego.

* Aplikacja umożliwi wyeksportowanie reprezentacji sieci w pliku CSV w następującym formacie:
  * Wierszowi odpowiada pojedynczy kanał
  * Kolumnie odpowiada pojedynczy slice
  * Zawartością komórki jest binarna informacja o zajętości pasma w danym kanale

* Reprezentacja sieci wprowadzonej przez danego użytkownika powinna być widoczna tylko dla niego.

#### Wymagania niefunkcjonalne

* Aplikacja powinna dostarczać wynik optymalizacji ułożenia kanału w czasie nie dłuższym niż 5 minut dla
sieci złożonej z nie więcej niż 300 kanałów.

### 3.3 Przypadki użycia

na poziomie ogólnym i rozszerzonym

* diagramy aktywności/stanów dla skomplikowanych przypadków
* związki pomiędzy przypadkami użycia
* diagram przypadków użycia
