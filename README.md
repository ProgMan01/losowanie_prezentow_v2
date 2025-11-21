# Losowanie Prezentów – Secret Santa

Prosta aplikacja internetowa do losowania prezentów świątecznych w firmie.  
Zbudowana w **Next.js (App Router) + Tailwind CSS + MongoDB Atlas**.

---

## Funkcjonalności

- Użytkownik podaje swój adres e-mail.  
- System losuje osobę, której użytkownik będzie robił prezent.  
- Nikt nie może wylosować samego siebie.  
- Każda osoba może losować tylko raz, a każda osoba może być obdarowana tylko raz.  
- Wynik losowania:
  - zapisany w bazie MongoDB,
  - wyświetlany wyłącznie dla losującego,
  - wysyłany e-mailem do losującego.
s
---

## Instrukcja uruchomienia

1. Sklonuj repozytorium:

```bash
git clone https://github.com/TwojUser/losowanie_prezentow.git
cd losowanie_prezentow
```

2. Instalacja zależności:
```bash
npm install
```

3. Utworzenie pliku .env i wprowadzenie zmiennych środowiskowych:
```bash
MONGODB_URI=<Twój URI MongoDB Atlas>
SMTP_HOST=<adres serwera SMTP>
SMTP_PORT=<port SMTP>
SMTP_USER=<login SMTP>
SMTP_PASS=<hasło SMTP>
EMAIL_FROM=losowania@itmakeovers.com.pl
```

W repozytorium powinien być też plik .env.example z listą wymaganych zmiennych (bez wartości).

4. Uruchomienie aplikacji w trybie deweloperskim:
```bash
npm run dev
```

5. Otwórz przeglądarkę i przejdź na adres:
```bash
http://localhost:3000
```