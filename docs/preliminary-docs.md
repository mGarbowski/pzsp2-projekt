## 1 Wprowadzenie

### 1.1 Cel projektu

Celem projekty jest symulacja ruchu w sieci optycznej na podstawie danych z pliku csv.

Aplikacja będzie wpsierać wczytywanie plików i rysowanie na ich podstawie grafów.

Aplikacja będzie pozwalac na dodawanie kanałów komnikacyjnych i obliczanie dla nich najlepszej ścieżki. W decyzji uwzglediona będzie dostępność kanałów w sieci.

### 1.2 Wstępna wizja projektu

Projekt zrealizowany będzie jako aplikacja webowa podłączona do REST API.

* Frontend realizowany będzie w typescript.
* Backend realizowany będzie w pythonie jako serwer bezstanowy.

Wybieranie opotymalnej ścieżki będzie możliwe na kilka sposobów.
* Algorytm dikstry
* Model liniowy (realizowany w pyomo)
* Model genetyczny

Projket nie orzewiduje konieczności tworzenie użytkowników ani kożystania z bazy danych.

## 2 Metodologia wytwarzania

Praca, poza określonymi w harmonogramie konultacjami, organizowana jest w formie zwinnej.

Przewidziane są cotygodniowe spotkania zdalenw ramach zespołu, w trakcie których członkowie ustalaja priorytety i dzielą się zadaniami.

Dodatkowo dostępna jest ciągła komunikacja na platformie discord.


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
