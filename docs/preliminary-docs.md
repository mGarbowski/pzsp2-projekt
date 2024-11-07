## 1 Wprowadzenie

### 1.1 Cel projektu

### 1.2 Wstępna wizja projektu

## 2 Metodologia wytwarzania

* Organizacja pracy w projekcie

## 3 Analiza wymagań

### 3.1 Wymagania użytkownika i biznesowe

* wymagania biznesowe: cele i potrzeby biznesowe, problemy do rozwiązania
* wymagania użytkowe: potrzeby użytkowników i interesariuszy, cechy użytkowe
* wymagania systemowe: cechy rozwiązania

### 3.2 Wymagania funkcjonalne i niefunkcjonalne

#### Wymagania funkcjonalne

* Użytkownik powinien mieć możliwość przesłania pliku w formacie `.csv` zawierającego reprezentację sieci.
* Aplikacja powinna udostępnić użytkownikowi graficzną reprezentację sieci w postaci grafu.
* Użytkownik powinien móc dodać do grafu nowy wierzchołek, wybierając jego położenie na istniejącej wizualizacji.
* Użytkownik powinien móc dodać do grafu nowy wierzchołek, wpisując jego współrzędne geograficzne.
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
