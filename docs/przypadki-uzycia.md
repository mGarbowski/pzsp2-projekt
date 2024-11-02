# Przypadki użycia

## Wymagania
Do uzgodnienia z ustaleniami reszty zespołu

* System ma umożliwić wczytanie zbioru danych opisującego sieć teletransmisyjną z pliku dostarczonego przez użytkownika
* System ma umożliwić ręczne dodawanie węzłów i krawędzi sieci przez graficzny interfejs
* System ma prezentować graficznie topologię sieci teletransmisyjnej i zajętość pasma
* System ma umożliwić wygenerowanie pliku z tabelarycznym zestawieniem kanałów z wykorzystywanymi przez nie slice'ami
* System ma umożliwić znalezienie optymalnego kanału między węzłami sieci i prezentować wynik
* System ma dostarczyć różnych metod do znajdowania optymalnego kanału

## Aktorzy
* Użytkownik systemu - korzysta z graficznego interfejsu

## Biznesowe przypadki użycia

### PB1 Wprowadzanie opisu sieci do systemu

Aktorzy: użytkownik

Scenariusz główny:

1. Użytkownik wprowadza opis sieci do systemu.
2. System informuje o poprawnym wczytaniu danych.

Scenariusz alternatywny - nieprawidłowy opis:

1. Użytkownik wprowadza nieprawidłowy opis sieci do systemu.
2. System informuje użytkownika o nieprawidłowych danych.
3. System umożliwia kolejną próbę wprowadzenia opisu sieci, powrót do kroku 1.

### PB2 Przeglądanie prezentacji sieci

Aktorzy: użytkownik

Scenariusz główny:

1. System wyświetla graficzną prezentację sieci teletransmisyjnej.
2. System wyświetla zbiorcze statystyki sieci.
3. Użytkownik wybiera element sieci.
4. System wyświetla szczegółowe informacje o elemencie

### PB3 Wygenerowanie zestawienia zajętości pasma przez kanały

Aktorzy: użytkownik

Scenariusz główny:

1. Użytkownik wybiera opcję generowania zestawienia dla załadowanej sieci.
2. System generuje zestawienie.
3. Użytkownik pobiera plik z zestawieniem.

### PB5 Wyznaczenie nowego kanału

Aktorzy: użytkownik

Scenariusz główny:

1. Użytkownik wprowadza parametry dla pożądanego kanału.
2. System prezentuje nowy kanał na wizualizacji sieci.
3. System wyświetla parametry nowego kanału.

Scenariusz alternatywny - system nie może wyznaczyć żądanego kanału:

1. Użytkownik wprowadza parametry dla pożądanego kanału.
2. System informuje użytkownika o niepowodzeniu wyznaczania nowego kanału.
3. System umozliwia ponowne wprowadzenie parametrów - powrót do kroku 1.


## Systemowe przypadki użycia