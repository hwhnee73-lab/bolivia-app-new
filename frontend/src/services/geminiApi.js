// (auto-concat)
import { CONSTANTS } from '../constants';
// --- /src/services/geminiApi.js ---
// Separa la lógica de la llamada a la API de Gemini en una función de servicio independiente.
export const callGeminiAPI = async (prompt) => {
    const apiUrl = `${CONSTANTS.API_URL}?key=${CONSTANTS.API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        return "No se pudo recibir una respuesta de la IA. Por favor, inténtelo de nuevo más tarde.";
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Ocurrió un error durante la llamada a la IA. Por favor, verifique su conexión de red.";
    }
};