# Instrukcja uruchomienia aplikacji w chmurze

1. Wejść na portal azure i uruchomić maszynę wirtualną "frontend-vm"
2. Przy pierwszym uruchomieniu maszyny główny administrator z dostępem do konta azureuser musi wykonać na swojej maszynie 
``` shell  
$user@computer: ~/projekt/cloud/ansible$ ansible-playbook -i inventory.ini  ./full-deployment.yaml --user azureuser
``` 
3. Po każdym kolejnym uruchomieniu zapisany użytkownik może wdrożyć aplikację poleceniem 
``` shell  
$user@computer: ~/projekt/cloud/ansible$ ansible-playbook -i inventory.ini  ./full-deployment.yaml --user {nazwa uzytkownika}
``` 
Nazwa użytkownika to pierwsza litera imienia i nazwisko, małymi literami bez polskich znaków. 
Michał Łuszczek -> mluszczek