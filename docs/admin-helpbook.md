# Instrukcja dla administratora
Aplikacja jest w pełni skonteneryzowana.

Obsługuje dwa tryby uruchomienia:
- lokalny, w celu testowania i developmentu
- produkcyjny, w którym wszystkie kontenery uruchamiane są na jednej maszynie, dostępna przez HTTP

Do uruchomienia lokalnego potrzebne jest jedynie narzędzie Docker.
Wdrożenie produkcyjne przystosowane jest do usługi Microsoft Azure.

Pliki używane do uruchomienia:
1. Lokalnie:
   * frontend/Dockerfile.dev
   * backend/Dockerfile
   * docker-compose.local.yml
   * nginx.local.conf
   * .env.development
2. Produkcyjnie:
   * frontend/Dockerfile.prod
   * backend/Dockerfile
   * docker-compose.prod.yml
   * nginx.prod.conf
   * .env.production


# Wdrożenie produkcyjne
## 1. Stworzenie infrastrktury
Do stworzenia infrastruktury chmmurowej wykorzystywane jest narzędzie Terraform. Przygotowany skrypt używa usługi Microsoft Azure.
Aplikacja nie jest uzależniona od tego wyboru. Możliwe jest stworzenie własnej architektury fizycznej lub chmurowej we własnym zakresie.

### Korzystanie z przygotowanego rozwiązania:
- Wymagane jest posiadanie konta i subskrypcji Microsoft Azure, na której dostępne są co najmniej:
  * Jeden adres publiczny ip
  * Jedna maszyna wirtualna
  * 4 rdzenie procesorów wirtualnych
### Na własnej maszynie:
- Należy mieć zainstalowane narzędzie AZ (Azure CLI), zalogować się na swoje konto Azure i wybrać subskrypcję, z której korzystać ma aplikacja
- Należy zainstalować narzędzie Terraform
- w pliku terraform.tfvars ustawić zmienną "public_ssh_key_file" na ścieżkę do pliku zawierającego klucz publiczny, który będzie potrzebny 
do pierwszego zalogowania się na maszynę wirtualną (domyślnie: "~/.ssh/id_rsa.pub")
- (opcjonalnie) w pliku main.tf zmienić nazwy i lokalizacje zasobów alokowanych na platformie Azure wedle potrzeb
- W katalogu cloud/terraform wykonać polecenia:

```shell
terraform init
terraform apply
```

## 2. Wdrożenie aplikacja używając Ansible
Do wdrożenia aplikacja na istniejącej infrastrukturze używane jest narzędzie Ansible.
1. Upewnić się, że maszyna wirtualna z adresem publicznym jest uruchomiona
2. W pliku inventory.ini zmienić adres na adres publiczny maszyny wirtualnej
3. W pliku frontend/ngnix.prod.conf i frontend/.env.production zmienić ".*pzsp2.mgarbowski.pl" na adres używany przez maszynę wirtualną
4. W pliku full-deployment.yaml, w zadaniu "Create users and add SSH keys", dopasować listę użytkowników, których chcemy dodać na maszynie
5. Pliki z kluczami publicznymi użytkowników zdefiniowanych w poprzednim kroku umieścić w katalogu "/cloud/ansible/public_keys/". Nazwa pliku musi odpowiadać nazwie użytkownika zdefiniowanej w poprzednim kroku.

6. Po pierwszym uruchomieniu maszyny administrator operujący kluczem ssh zdefiniowanym przy tworzeniu architektury musi wykonać na swojej maszynie
``` shell  
$user@computer: ~/projekt/cloud/ansible$ ansible-playbook -i inventory.ini  ./full-deployment.yaml --user azureuser
```
W przypadku wykorzystania innego rozwiazania niż Azure, należy zastąpić "azureuser" nazwą użytkownika z dostępem do uprawnień root
7. Po każdym kolejnym uruchomieniu zapisani użytkownicy mogą wdrożyć aplikację na nowo poleceniem
``` shell  
$user@computer: ~/projekt/cloud/ansible$ ansible-playbook -i inventory.ini  ./full-deployment.yaml --user {nazwa uzytkownika}
``` 

Aplikacja powinna być teraz dostępna pod adresem http://{adres publiczny maszyny}


## Uwaga!
Jeśli nie pożądane jest, aby wdrażana była najnowsza dostępna wersja aplikacji (https://github.com/mGarbowski/pzsp2-projekt.git), należy zastąpić adres repozytorium 
w pliku full-deployment, w zadaniu "Clone the project repository" na własne publiczne repozytorium zawierające pożądaną wersję.