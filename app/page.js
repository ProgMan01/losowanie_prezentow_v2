export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 p-6 overflow-hidden">
      
      {/* Tło świąteczne */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none blur-sm"
        style={{
          backgroundImage: "url('/snow-bg.png')",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo firmy"
        className="mx-auto mb-6 w-32 h-auto relative z-10"
      />

      {/* Karta główna */}
      <div className="relative z-10 text-center max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-red-200 dark:border-red-700">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          🎁 Losowanie Prezentów
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Prosta aplikacja do Secret Santa.  
          W kolejnym etapie dodamy formularz logowania i losowania.
        </p>

        {/* Placeholder na formularz */}
        <div className="mt-6">
          <button
            className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-not-allowed"
            disabled
          >
            Formularz logowania/losowania pojawi się tutaj
          </button>
        </div>

        <footer className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          © 2025 Firma – Wersja testowa
        </footer>
      </div>
    </main>
  );
}
