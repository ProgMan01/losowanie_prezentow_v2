'use client';

import { useState } from 'react';
import { registerParticipant } from '@/app/actions';

export default function RegistrationForm({ onParticipantRegistered }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            setMessage('Wypełnij oba pola, aby się zarejestrować.');
            return;
        }

        setIsSubmitting(true);
        setMessage('Rejestracja w toku...');

        try {
            const result = await registerParticipant(name, email);
            
            if (result.success) {
                setMessage('Pomyślnie zarejestrowano! Dołączono do puli losowania.');
                setName('');
                setEmail('');
                onParticipantRegistered();
            } else {
                setMessage(result.message || 'Wystąpił błąd podczas rejestracji.');
            }
        } catch (error) {
            setMessage('Błąd serwera. Spróbuj ponownie.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white/70 dark:bg-gray-800/80 rounded-xl shadow-inner border-2 border-yellow-300 dark:border-yellow-700">
            
            {/* Tytuł formularza - zminimalizowany odstęp mb-2 */}
            <h4 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
                🎁 Chcesz dołączyć do zabawy?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Wpisz swoje dane, aby dodać się do listy uczestników.
            </p>

            {/* Pola formularza - Używamy space-y-3, aby zredukować odstęp między polami */}
            <div className="space-y-3">
                {/* 1. Pole Imię i Nazwisko */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Imię i Nazwisko
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Jan Kowalski"
                        required
                    />
                </div>

                {/* 2. Pole E-mail (TO TUTAJ MUSIAŁ BYĆ ZA DUŻY MARGINES NA div/input) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Twój E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="jan@firma.pl"
                        required
                    />
                </div>
            </div>

            {/* Przycisk */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white transition duration-150 christmas-button"
                // Użycie klas CSS, które musisz zdefiniować globalnie (np. w global.css)
                // lub zastąpić je bezpośrednimi stylami Tailwind (np. bg-orange-500)
                style={{ backgroundColor: isSubmitting ? '#993d00' : '#FF6600', opacity: isSubmitting ? 0.7 : 1 }}
            >
                {isSubmitting ? 'Trwa Rejestracja...' : 'Zarejestruj się do Losowania'}
            </button>

            {/* Komunikat zwrotny */}
            {message && (
                <p className={`mt-3 text-sm font-medium ${message.includes('Pomyślnie') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}