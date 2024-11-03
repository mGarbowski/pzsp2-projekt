## Wymagania biznesowe
* Próba minimalizacji kosztów wynikających z dzierżawy włókien przesyłowych
* Ułatwienie rozszerzania sieci o nowe połączenia
* Rozwiązanie problemu wyboru optymalnej trasy nowego połączenia
* Ułatwienie administracji siecią
* Zapewnienie jak największej niezawodności sieci poprzez równomierne rozłożenie obciążeń pozwalające na poprowadzenie alternatywnego połączenia w przypadku zerwania fizycznych węzłów
* Rozwiazanie problemu identyfikacji najbardziej obciążonych odcinków sieci



## Wymagania użytkowe
* Użytkownik powinien mieć możliwość zdefiniowania sieci poprzez przesłanie pliku zawierającego jej reprezentację.
  
* Użytkownik powinien mieć możliwość wizualnego podglądu zajętości slice’ów poszczególnych krawędzi w sieci .
* Użytkownik powinien mieć możliwość zdefiniowania nowej ścieżki w sieci łączącej zadane dwa wierzchołki o określonej przepustowości.
* Użytkownik powinien otrzymać optymalne ułożenie nowej ścieżki w sieci.
* Użytkownik powinien mieć możliwość pobrać plik reprezentujący zajętość pasma na każdej ze zdefiniowanych ścieżek w sieci
* Użytkowników powinno być w stanie równolegle korzystać z systemu.
* System powinien być dostępny dla wielu użytkowników równolegle
* Dane użytkownika nie powinny być dostępne dla innych użytkowników systemu.


## Wymagania systemowe

* Po przesłaniu pliku aplikacja powinna udostępnić użytkownikowi graficzną reprezentację sieci w formie grafu.
* Użytkownik powinien mieć możliwość wyświetlania grafu zrzutowanego na mapę geograficzną obszaru na podstawie koordynatów poszczególnych węzłów. 
* Aplikacja powininna wyświetlać zajętość slice'ów danej krawędzi po najechaniu na nią myszką 
* Aplikacja powininna wyświetlać krawędzie w różnych kolorach reprezentujących zajętość pasma
* System powinien ustalać ułożenie nowo zdefiniowanej ścieżki za pomocą algorytmu optymalizacyjnego
* Aplikacja powinna udostępniać optymalizację ułożenia dodawanej ścieżki przy pomocy algorytmu Dijkstry.
* Aplikacja powinna udostępniać optymalizację ułożenia dodawanej ścieżki przy pomocy modelu całkowitoliczbowego.
* Aplikacja umożliwi wyeksportowanie reprezentacji sieci w pliku CSV w następującym formacie:
   - Wierszowi tabeli odpowiada pojedynczy kanał
   - Kolumnie tabeli odpowiada pojedynczy slice
   - Zawartością komórki tabeli jest binarna informacja o zajętości kanału w danej ścieżce 
* Reprezentacja sieci w sesji danego użytkownika powinna być widoczna tylko dla niego.