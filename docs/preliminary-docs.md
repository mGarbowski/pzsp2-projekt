## 1 Wprowadzenie

### 1.1 Cel projektu

Problemem rozważanym w projekcie jest optymalizacja zajętości pasma w sieci optycznej.
Sieć jest odwzorowaniem części istniejącej infrastruktury firmy T-mobile, na podstawie zrzutu danych z pewnego momentu działania.
Pasmo przesyłowe podzielone jest na slice'y po których przesyłane są kanały, służące do przesyłania informacji. Pojedynczy kanał nie musi mić połączenia bezpośredniego między nadawcą i odbiorcą ale na każdym z przewodów optycznych musi zajmować to samo pasmo częstotliwości.
Taka limitacja powoduje, że problem należy do kategorii NP-trudnych.

Naszym celem jest stworzenie aplikacji ułatwiającej zarządzanie taką siecią.
Głównymi celami są:
* czytelna reprezentacja sieci w postaci grafu.
* możliwość zestawienia nowych kanałów i automatyczny dobór optymalnych tras, tak aby jak największa rozpiętość częstotliwości pozostawała wolna w jak największej części sieci.
* Udostępnienie narzedzi do dodawania nowych połączeń, miast i kanałów do sieci.
* generowanie raportów zajętości slice'ów w postaci plików csv

<!-- ROZPISAĆ PROBLEM, TO CO BYŁO NA SPOTKANIU, WPROWADZENIE, WSTĘP TECHNICZNY, KRAWĘDZIE - DZIERŻAWA, SLAJSY, KANAŁY, ITD -->
<!--
Problemem jest ...
Rozważamy realistyczną sieć optyczną opracowaną na podstawie ..
Problem jest mp trudny ... zasady działania kanałów ... system flex grid

Nasza aplikacja ma na celu ułatwić administracje poprzez automatyczną obsługę funkcji ...
 -->
#### słowniczek
kanał - połączenie między wierzchołkiem a i b zajmujące ten sam slice na każdej krawędzi
pasmo - zakres częstotliwości światła na której przesyłane są dane
slice`y - kawałki pasma o różnej rozpiętości częstotliwościowej
krawędź - para włókien optycznych dzierżawionych przez firmę telekomunikacyjną

### 1.2 Wstępna wizja projektu

Projekt realizowany jako aplikacja sieciowa podłączona do REST API.

#### Technologia
<!-- USUNĄĆ -->

* Frontend realizowany w typescript.
* Backend realizowany w pythonie (Django)

#### Tryb Działania
<!-- UŻYTKOWNIK WPROWADZA DANE PRZEZ GUI, MOŻE PRZEGLĄDAĆ, WPROWADZAĆ DANE, SYSTEM ROBI RZECZY
OD STRONY UŻYTKOWNIKA-->

Użytkownik ma do dyspozycji interfejs na którym wyświetlana jest sieć w postaci grafu. Dla polepszenia czytelności graf nałożony będzie na mapę Polski, przez co łatwo będzie identyfikowac połączenia.
Dodatkowo umieszczone sa w nim pola narzędzi administracyjnych. Logika biznesowa odpowiedzialna będzie za obliczanie zmian w strukturze sieci na żądanie użytkownika.

#### Dane
<!-- CO JEST W MODELU SIECI, NIE GDZIE A CO-->
Danymi w projekcie są:
* Zrzut z bazy T-Mobile zawierający koordynaty wierzchołków, istniejące krawędzie i kanały
* wewnętrzna reprezentacja grafowa sieci
* dane o dodawanych wierzchołkach, krawędziach i kanałach przesyłane do serwera
* plik csv z informacjami o zajętości slice'ów - informacje o połączeniu, slice i czy jest obecnie używany

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
