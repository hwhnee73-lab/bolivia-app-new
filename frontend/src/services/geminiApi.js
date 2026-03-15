/**
 * Gemini AI API 서비스
 * API 키를 환경변수에서 가져옵니다 (프론트엔드 하드코딩 방지)
 */
const GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL
  || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

export const callGeminiAPI = async (prompt) => {
    if (!GEMINI_API_KEY) {
        return "API 키가 설정되지 않았습니다. 관리자에게 문의하세요.";
    }
    const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
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