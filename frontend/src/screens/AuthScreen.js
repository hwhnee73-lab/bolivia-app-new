import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import PhoneMockup from "../components/common/PhoneMockup";

const AuthScreen = () => {
  const { login } = useAppContext();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(id, password);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PhoneMockup theme="dark">
      <form onSubmit={handleLogin} className="text-center space-y-6">
        <div className="text-4xl">🔐</div>
        <h3 className="text-2xl font-bold">Bienvenido a Apt</h3>
        {error && (
          <div className="p-3 bg-red-500/50 text-white rounded-lg">{error}</div>
        )}
        <input
          type="email"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Correo electrónico"
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded bg-teal-600 hover:bg-teal-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </PhoneMockup>
  );
};

export default AuthScreen;
