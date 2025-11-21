// PLIK: app/page.js
import Link from 'next/link';

// Funkcja pomocnicza do generowania losowych płatków śniegu,
// skopiowana ze stron rejestracji/losowania dla spójnego wyglądu tła.
const createSnowflakes = () => {
    const snowflakes = [];
    // Generujemy np. 50 płatków
    for (let i = 0; i < 50; i++) {
        snowflakes.push(
            <div 
                key={i} 
                className="snowflake text-2xl" 
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 10 + 5}s`, 
                    animationDelay: `-${Math.random() * 10}s`, 
                    opacity: `${Math.random() * 0.5 + 0.5}`, 
                }}
            >
                ❅
            </div>
        );
    }
    return snowflakes;
};

// Strona Główna
export default function HomePage() {
    return (
        // Upewniamy się, że główne body nie ma poziomych pasków przewijania
        <main className="relative min-h-screen flex flex-col items-center justify-center p-3 overflow-x-hidden 
                       bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-950">
            
            {/* 🖼️ Tło świąteczne z public/snow-bg.png */}
            <div
                className="absolute inset-0 opacity-60 pointer-events-none blur-[1px]"
                style={{
                    backgroundImage: "url('/snow-bg.png')",
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            ></div>

            {/* ❄️ Magiczny Efekt Śniegu (Dynamiczne płatki) */}
            <div className="absolute inset-0 pointer-events-none">
                {createSnowflakes()}
            </div>

            {/* Logo (Klikalne, prowadzi do / - spójność z innymi stronami) */}
            <Link href="/" className="relative z-10 mx-auto mb-6 inline-block hover:opacity-80 transition duration-150">
                <img
                    src="/logo.png"
                    alt="Logo firmy - Kliknij, aby wrócić na stronę główną"
                    className="w-28 h-auto filter drop-shadow-lg cursor-pointer" 
                />
            </Link>

            {/* Karta Główna - Zmniejszony padding i ukryty overflow X */}
            <div className="relative z-10 text-center max-w-lg w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[30px] shadow-2xl px-4 sm:px-8 py-8 border-4 border-double border-red-400 dark:border-red-600 christmas-card-glow max-h-[95vh] overflow-y-auto overflow-x-hidden">
                
                {/* Nagłówek Główny - ZMIENIONO: USUNIĘTO DATĘ '2025' DLA MAKSYMALNEGO SKRÓCENIA.
                    - text-xl na małych ekranach.
                    - whitespace-nowrap wymusza jedną linię.
                */}
                <h1 className="text-xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400 mb-4 tracking-tight whitespace-nowrap">
                    🎄 Secret Santa 🎅
                </h1>

                {/* Opis */}
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Witaj w aplikacji do losowania Secret Santa! Wybierz, co chcesz zrobić:
                </p>

                {/* Kontenery z Opcjami (Krok 1 i Krok 2) - Używamy flex zamiast grid na mobilnych, aby zapewnić centrowanie */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-4 w-full">
                    
                    {/* Krok 1: Dołącz do Zabawy */}
                    <Link href="/register" className="p-5 rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.02] 
                                                    bg-blue-100/70 dark:bg-gray-800/70 border-2 border-blue-200 dark:border-gray-700 group flex flex-col justify-center items-center h-full">
                        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                            1. DOŁĄCZ DO ZABAWY 📝
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100">
                            Zarejestruj swój e-mail, aby wejść do puli losowania.
                        </p>
                    </Link>

                    {/* Krok 2: Losuj Odbiorcę */}
                    <Link href="/draw" className="p-5 rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.02] 
                                                 bg-red-100/70 dark:bg-gray-800/70 border-2 border-red-200 dark:border-gray-700 group flex flex-col justify-center items-center h-full">
                        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                            2. LOSUJ ODBIORCĘ 🎁
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100">
                            Wylosuj osobę, dla której przygotujesz świąteczny prezent.
                        </p>
                    </Link>
                </div>
                
            </div>
            
            {/* Footer */}
            <footer className="mt-8 pt-4 text-xs text-gray-500 dark:text-gray-400 relative z-10">
                 © 2025 Praktyki – <span className="font-bold text-yellow-500">Wesołych Świąt!</span>
            </footer>
        </main>
    );
}