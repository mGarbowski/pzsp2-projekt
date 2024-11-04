## 1 Wprowadzenie

### 1.1 Cel projektu

Problem: Optymalizacja i wizualizacja zajętości sieci optycznej.


Cel:
Stworzenie aplikacji realizującej zagadnienia:
* Reprezentacja zajętość sieci, w formie grafu nałożonego na mapę i pliku csv.
* Wspomaganie użytkownika w balansowaniu zajętością w sieci i dodawaniu nowych kanałów.
* Udostępnienie narzędzi do definicji własnych scenariuszy sieci.

### 1.2 Wstępna wizja projektu

Projekt realizowany jako aplikacja sieciowa podłączona do REST API.

#### Technologia

* Frontend realizowany w typescript.
* Backend realizowany w pythonie (Django)

#### Tryb Działania

Po stronie użytkownika: generowanie graficznego przedstawienia danych i interfejsu użtkownika.

Po stronie serwera: dizałanie algorytmów optymalizacyjnych, wytyczanie nowych połączeń i optymalizacja obecnych.

#### Dane

Projekt nie przewiduje konieczności tworzenia kont użytkowników ani korzystania z bazy danych.

## 2 Metodologia wytwarzania

Praca, poza określonymi w harmonogramie konsultacjami, organizowana jest w formie zwinnej.

Przewidziane są cotygodniowe spotkania zdalne w ramach zespołu, w trakcie których członkowie ustalaja priorytety i dzielą się zadaniami.

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

* specyfikacja; mapowanie powiązań pomiędzy wymaganiami na poszczególnych poziomach

### 3.3 Przypadki użycia

na poziomie ogólnym i rozszerzonym

* diagramy aktywności/stanów dla skomplikowanych przypadków
* związki pomiędzy przypadkami użycia
* diagram przypadków użycia
