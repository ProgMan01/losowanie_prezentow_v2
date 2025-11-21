'use client';

import { useState } from 'react';
import { performDraw } from '@/app/actions'; // Zakładam, że akcja istnieje

export default function DrawForm() {
    const [email, setEmail] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [drawerName, setDrawerName] = useState('');
    const [receiverInfo, setReceiverInfo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setResultMessage({ type: 'error', text: 'Wpisz swój adres e-mail.' });
            return;
        }

        setIsLoading(true);
        setResultMessage({ type: 'info', text: 'Trwa losowanie...' });
        setDrawerName('');
        setReceiverInfo(null);

        try {
            const result = await performDraw(email); // Wywołanie akcji losowania
            if (result.success) {
                setResultMessage({ type: 'success', text: result.message || 'Losowanie zakończone pomyślnie!' });
                setDrawerName(result.drawerName);
                setReceiverInfo(result.receiver);
            } else {
                setResultMessage({ type: 'error', text: result.message || 'Wystąpił błąd podczas losowania.' });
            }
        } catch (error) {
            console.error('Błąd losowania:', error);
            setResultMessage({ type: 'error', text: `Błąd serwera: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white/70 dark:bg-gray-800/80 rounded-xl shadow-inner border-2 border-yellow-300 dark:border-yellow-700 space-y-4">
            
            {/* Nagłówek formularza - Zmieniono z czerwonego na żółto-pomarańczowy */}
            <h4 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                🥳 Losuj osobę!
            </h4>

            {/* Pole E-mail */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twój zarejestrowany adres E-mail:
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="np. jan.kowalski@example.com"
                    required
                />
            </div>

            {/* Przycisk losowania - Zmieniono z czerwonego na pomarańczowy */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white transition duration-150 christmas-button"
                style={{ backgroundColor: isLoading ? '#993d00' : '#FF6600', opacity: isLoading ? 0.7 : 1 }}
            >
                {isLoading ? 'LOSOWANIE...' : 'LOSUJ OSOBĘ'}
            </button>

            {/* Wyświetlanie wyniku losowania */}
            {receiverInfo && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200">
                    <p className="font-bold text-lg">Gratulacje, {drawerName}!</p>
                    <p>Wylosowałeś/aś: <span className="text-xl font-extrabold">{receiverInfo.name}</span></p>
                    <p className="text-sm">E-mail odbiorcy: {receiverInfo.email}</p>
                    <p className="mt-2 text-xs">Informacja została również wysłana na Twój adres e-mail.</p>
                </div>
            )}

            {/* Komunikat zwrotny (błędy/info) */}
            {resultMessage.text && !receiverInfo && (
                <p className={`mt-3 text-sm font-medium ${resultMessage.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {resultMessage.text}
                </p>
            )}
        </form>
    );
}