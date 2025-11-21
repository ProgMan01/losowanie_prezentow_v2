// PLIK: app/draw/page.js
import DrawForm from '@/components/DrawForm';
import Link from 'next/link'; // Import Link jest już obecny

// Funkcja pomocnicza do generowania losowych płatków śniegu.
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

// Strona dla Losowania Secret Santa
export default function DrawPage() {
    return (
        // Używamy gradientu jako bazowego tła dla przyjemniejszego efektu
        <main className="relative min-h-screen flex flex-col items-center justify-center p-3 overflow-hidden
                       bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-950">
            
            {/* 🖼️ Tło świąteczne z public/snow-bg.png */}
            <div
                // Zmniejszono opacity do 60% i dodano delikatny blur
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

            {/* Logo - ZMIANA: Owinięte komponentem Link, aby kierowało do głównej strony */}
            <Link href="/" className="relative z-10 mx-auto mb-4 inline-block hover:opacity-80 transition duration-150">
                <img
                    src="/logo.png"
                    alt="Logo firmy - Kliknij, aby wrócić na stronę główną"
                    className="w-24 h-auto filter drop-shadow-lg cursor-pointer" 
                />
            </Link>

            {/* Karta Główna */}
            <div className="relative z-10 text-center max-w-lg w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[30px] shadow-2xl px-6 py-4 border-4 border-double border-red-400 dark:border-red-600 christmas-card-glow max-h-[95vh] overflow-y-auto">
                
                {/* Nagłówek - Żółto-pomarańczowy, dla spójności */}
                <h1 className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-400 mb-4 tracking-tight">
                    2. LOSUJ ODBIORCĘ 🎁
                </h1>

                {/* Opis */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Wprowadź swój zarejestrowany e-mail, aby poznać, komu robisz prezent!
                </p>

                {/* Komponent formularza losowania */}
                <DrawForm />

                {/* Stopka karty */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                        href="/register"
                        // Czerwony przycisk, spójny z CTA ze strony rejestracji
                        className="inline-flex items-center justify-center py-3 px-6 rounded-xl shadow-lg text-base font-bold text-white bg-red-600 hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                        &larr; Wróć do Rejestracji (Krok 1)
                    </Link>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-4 pt-4 text-xs text-gray-500 dark:text-gray-400 relative z-10">
                 © 2025 Praktyki – <span className="font-bold text-yellow-500">Wesołych Świąt!</span>
            </footer>
        </main>
    );
}