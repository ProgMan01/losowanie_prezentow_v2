// app/page.js
import DrawForm from '@/components/DrawForm';

// Funkcja pomocnicza do generowania losowych płatków śniegu
// Przywrócona!
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

export default function Home() {
  return (
    // Używamy ciemnego tła dla dark mode: ciemny granat (dark:bg-gray-950)
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-950 p-6 overflow-hidden">
      
      {/* 🖼️ Tło świąteczne z public/snow-bg.png */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none blur-sm"
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

      {/* Logo z lepszym cieniem i marginesem */}
      <img
        src="/logo.png"
        alt="Logo firmy"
        className="mx-auto mb-8 w-36 h-auto relative z-10 filter drop-shadow-lg" 
      />

      {/* 🎁 Karta Główna - Zachowane ulepszenia wizualne */}
      <div className="relative z-10 text-center max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[30px] shadow-2xl p-8 border-4 border-double border-red-400 dark:border-red-600 christmas-card-glow"> 
        
        {/* Tytuł z Gradientem */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 mb-4 tracking-tight">
          🎁 Losowanie Prezentów
        </h1>

        {/* Podtytuł */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
          Wprowadź swój służbowy e-mail, aby wylosować osobę!
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold border-b pb-4 mb-6 border-red-100 dark:border-red-800">
          Pamiętaj: <strong className="text-red-700 dark:text-red-300">każda osoba losuje tylko raz!</strong>
        </p>

        {/* Formularz losowania */}
        <div className="mt-6">
          <DrawForm />
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          © 2025 Praktyki – <span className="font-bold text-red-500">Wesołych Świąt!</span>
        </footer>
      </div>
    </main>
  );
}