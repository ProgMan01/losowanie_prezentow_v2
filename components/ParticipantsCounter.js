'use client';

import { useState } from 'react';
import { getAllParticipants } from '@/app/actions';
import RegistrationForm from './RegistrationForm';

export default function ParticipantsCounter({ initialCount }) {
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    // Funkcja do odświeżania listy po nowej rejestracji
    const refreshCount = async () => {
        setIsLoading(true);
        // Pobieramy całą listę, a następnie bierzemy jej długość
        const participants = await getAllParticipants(); 
        setCount(participants.length);
        setIsLoading(false);
    };

    return (
        <div className="space-y-2">
            <div className="text-center p-4 rounded-lg border dark:border-blue-800 shadow-lg">
                
                {/* ZMIANA: Dodajemy przyjemniejszy, jasny gradient i złoty/żółty pierścień/ramkę */}
                <div className="p-4 rounded-xl 
                                bg-gradient-to-br from-white to-blue-50/80 dark:from-gray-700 dark:to-gray-800/80
                                border-2 border-yellow-300 dark:border-blue-500 shadow-inner">
                    <h3 className="text-4xl font-extrabold text-blue-800 dark:text-blue-300">
                        {isLoading ? (
                            <span className="text-yellow-600 animate-pulse">...</span>
                        ) : (
                            count
                        )}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Liczba Zarejestrowanych Uczestników
                    </p>
                </div>
            </div>
            
            {/* Formularz rejestracji, który po pomyślnej rejestracji wywoła refreshCount */}
            <RegistrationForm onParticipantRegistered={refreshCount} />
        </div>
    );
}