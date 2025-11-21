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