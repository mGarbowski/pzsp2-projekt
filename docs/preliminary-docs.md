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

* Użytkownik powinien mieć możliwość przesłania pliku zawierającego reprezentację sieci.
* Po przesłaniu pliku aplikacja powinna udostępnić użytkownikowi graficzną reprezentację sieci w formie grafu.
* Użytkownik powinien mieć możliwość wyświetlania grafu zrzutowanego na mapę geograficzną obszaru na podstawie koordynatów poszczególnych węzłów.
* Użytkownik powinien mieć możliwość wizualnego podglądu zajętości slice’ów poszczególnych połączeń w sieci (najechanie myszką, oznaczenia kolorystyczne).
* Użytkownik powinien mieć możliwość zdefiniowania nowej ścieżki w sieci łączącej zadane dwa wierzchołki o określonej przepustowości.
* Ułożenie nowych ścieżek określane będzie przy pomocy algorytmu optymalizacyjnego.
* Aplikacja udostępni optymalizację ułożenia dodawanej ścieżki przy pomocy przynajmniej dwóch algorytmów: algorytmu Dijkstry oraz modelu całkowitoliczbowego.

* Aplikacja umożliwi wyeksportowanie reprezentacji sieci w pliku CSV w następującym formacie:
  * Wierszowi odpowiada pojedynczy kanał
  * Kolumnie odpowiada pojedynczy slice
  * Zawartością komórki jest binarna informacja o zajętości kanału w danej ścieżce

* Reprezentacja sieci w sesji danego użytkownika powinna być widoczna tylko dla niego.

#### Wymagania niefunkcjonalne

* Aplikacja powinna obsługiwać nie mniej niż 5 użytkowników jednocześnie.

### 3.3 Przypadki użycia

na poziomie ogólnym i rozszerzonym

* diagramy aktywności/stanów dla skomplikowanych przypadków
* związki pomiędzy przypadkami użycia
* diagram przypadków użycia
