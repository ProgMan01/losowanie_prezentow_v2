export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
      {/* Tło świąteczne */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{ backgroundImage: "url('/snow-bg.png')", backgroundRepeat: "repeat", backgroundPosition: "center", backgroundSize: "cover" }}
      ></div>



      <div className="relative z-10 text-center max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-red-200 dark:border-red-700">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          🎁 Losowanie Prezentów
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Prosta aplikacja do Secret Santa.  
          W kolejnym etapie dodamy formularz logowania i losowania.
        </p>

        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Formularz logowania/losowania pojawi się tutaj.
          </p>
        </div>

        <footer className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          © 2025 Firma – Wersja testowa
        </footer>
      </div>
    </main>
  );
}
