// components/DrawForm.js
'use client'; 

import { useState } from 'react';
// Ścieżka do Server Action:
import { performDraw } from '@/app/actions'; 

export default function DrawForm() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.target);
    
    // Wywołanie akcji serwerowej
    const response = await performDraw(formData);

    if (response.success) {
      setResult(response);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  // Stylistyka dla wizualnego rozróżnienia wyniku i błędu
  const resultClassName = result?.success ? 'border-green-600 bg-green-50 text-green-800' : 'border-red-600 bg-red-50 text-red-800';
  const buttonDisabled = loading || (!!result && result.receiver);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Twój służbowy adres E-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-gray-900 sm:text-base"
          placeholder="np. jan.kowalski@example.com"
        />
        
        <button
          type="submit"
          disabled={buttonDisabled}
          className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-base font-bold text-white transition-colors duration-150 ${
            buttonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
          }`}
        >
          {loading ? 'Losowanie...' : 'Losuj osobę'}
        </button>
      </form>

      {/* Wyświetlanie wyniku/błędu */}
      {(result || error) && (
        <div className={`p-4 rounded-lg border-2 font-medium ${resultClassName}`}>
          <p className="font-bold mb-2">{result?.message || error}</p>
          {result?.receiver && (
            <div className="mt-3 p-3 bg-white/70 rounded-md shadow-inner border border-gray-200">
              <p className="text-xl font-extrabold text-red-700">
                Wylosowałeś/aś: {result.receiver.name}
              </p>
              <p className="text-sm mt-1 text-gray-600">E-mail: {result.receiver.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}