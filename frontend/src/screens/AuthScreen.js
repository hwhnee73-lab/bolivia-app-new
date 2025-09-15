import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext'; // La ruta puede variar
import PhoneMockup from '../components/common/PhoneMockup';

const AuthScreen = () => {
    const { handleLoginSuccess } = useAppContext();
    const [id, setId] = useState('admin@aa.com');
    const [password, setPassword] = useState('1');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Llamada a la API del backend a través del proxy de Nginx
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }),
            });

            if (!response.ok) {
                let errorMsg = "Error en el inicio de sesión. Intente de nuevo.";
                try {
                    const errorData = await response.json();
                    if(errorData && errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch(e) {
                    // Si el cuerpo del error no es JSON, usa el mensaje por defecto
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            
            // Lógica de éxito: guardar usuario y Access Token en el estado global (Context)
            // El Refresh Token en la cookie httpOnly es manejado automáticamente por el navegador
            handleLoginSuccess(data.user, data.accessToken);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PhoneMockup theme="dark">
            <form onSubmit={handleLogin} className="text-center space-y-6">
                <div className="text-4xl">🏢</div>
                <h3 className="text-2xl font-bold">Bienvenido a Apt</h3>
                {error && <div className="p-3 bg-red-500/50 text-white rounded-lg">{error}</div>}
                <input 
                    type="text" 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                    placeholder="ID de usuario (o email)" 
                    className="w-full p-3 rounded bg-gray-600 placeholder-gray-400 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Contraseña" 
                    className="w-full p-3 rounded bg-gray-600 placeholder-gray-400 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    required 
                />
                <button type="submit" disabled={isLoading} className="w-full p-3 rounded bg-teal-600 hover:bg-teal-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
        </PhoneMockup>
    );
};

export default AuthScreen;
