## Słownik
kanał - połączenie między dwoma punktami wykorzystujące ten sam slice na każdej z krawędzi symbolizujących włókna przesyłowe


## Wymagania biznesowe
Aktorzy: osoba zarządzająca rozkładem połączeń w sieci

* Próba minimalizacji kosztów wynikających z dzierżawy włókien przesyłowych
* Ułatwienie rozszerzania sieci o nowe połączenia
* Rozwiązanie problemu wyboru optymalnej trasy nowego połączenia
* Ułatwienie administracji siecią
* Zapewnienie jak największej niezawodności sieci poprzez równomierne rozłożenie obciążeń pozwalające na poprowadzenie alternatywnego połączenia w przypadku zerwania fizycznych węzłów
* Rozwiązanie problemu identyfikacji najbardziej obciążonych odcinków sieci



## Wymagania użytkowe
* Użytkownik powinien mieć możliwość zdefiniowania sieci poprzez przesłanie pliku zawierającego jej reprezentację
* Użytkownik powinien mieć możliwość ręcznego zdefiniowania nowego węzła
* Użytkownik powinien mieć możliwość ręcznego zdefiniowania nowego kanału
* Użytkownik powinien mieć możliwość ręcznego zdefiniowania nowej krawędzi (fizycznego połączenia)
* Użytkownik powinien mieć możliwość wizualnego podglądu zajętości slice’ów poszczególnych krawędzi w sieci
* Użytkownik powinien mieć możliwość zdefiniowania nowego kanału w sieci o określonej przepustowości łączącego zadane dwa wierzchołki
* Użytkownik powinien otrzymać optymalne ułożenie nowego kanału w sieci
* Użytkownik powinien mieć możliwość pobrać plik reprezentujący zajętość pasma na każdym ze zdefiniowanych kanałów w sieci
* Dane użytkownika nie powinny być dostępne dla innych użytkowników systemu
* Użytkownik powinien mieć możliwość zmiany parametrów algorytmu optymalizacyjnego.

## Wymagania systemowe

* Po przesłaniu pliku system powinien udostępnić użytkownikowi graficzną reprezentację sieci w formie grafu
* System powinien udostępniać możliwość ręcznego zdefiniowania nowego węzła w sieci
* System powinien udostępniać możliwość ręcznego zdefiniowania nowego kanału w sieci
* System powinien udostępniać możliwość ręcznego zdefiniowania nowej krawędzi w sieci (fizycznego połączenia)
* System powinien móc wyświetlać graf rzutowany na mapę geograficzną obszaru na podstawie koordynatów poszczególnych węzłów 
* System powinien wyświetlać zajętość slice'ów danej krawędzi po najechaniu na nią myszką 
* System powinien wyświetlać krawędzie w różnych kolorach reprezentujących zajętość pasma
* System powinien ustalać optymalne ułożenie nowo zdefiniowanego kanału
* System powinien udostępniać optymalizację ułożenia dodawanego kanału przy pomocy algorytmu Dijkstry
* System powinien udostępniać optymalizację ułożenia dodawanego kanału przy pomocy modelu całkowitoliczbowego
* System powinien umożliwić wyeksportowanie reprezentacji sieci w pliku CSV w następującym formacie:
   - Wierszowi tabeli odpowiada pojedynczy kanał
   - Kolumnie tabeli odpowiada pojedynczy slice
   - Zawartością komórki tabeli jest binarna informacja o zajętości kanału w danej ścieżce 
* Reprezentacja sieci w sesji danego użytkownika powinna być widoczna tylko dla niego
* System powinien umożliwić zapisanie stanu sieci
* System powinien umożliwić odtworzenie sieci z wcześniej zapisanego stanu