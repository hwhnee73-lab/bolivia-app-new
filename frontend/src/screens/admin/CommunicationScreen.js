
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { callGeminiAPI } from '../../services/geminiApi'; // La ruta puede variar

const CommunicationScreen = () => {
    const { showToast, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) {
            setStatus(t('communication.errors.missingPrompt'));
            return;
        }
        setIsLoading(true);
        setStatus(t('communication.generating'));
        
        const fullPrompt = `Basado en el siguiente contenido clave, redacta un anuncio oficial para los residentes del condominio en español. El tono debe ser cortés y claro: "${prompt}". El resultado debe tener el formato "Título: [Aquí el título]\n\n[Aquí el contenido del anuncio]".`;
        const result = await callGeminiAPI(fullPrompt);

        // Extraer título y contenido de la respuesta de la IA
        const titleMatch = result.match(/Título:\s*(.*)/);
        const contentMatch = result.split('\n\n').slice(1).join('\n\n');

        setTitle(titleMatch ? titleMatch[1] : t('communication.defaultTitle'));
        setContent(contentMatch || result);
        
        setStatus(t('communication.generated'));
        setIsLoading(false);
    };

    const handlePublish = async () => {
        if (!title || !content) {
            showToast(t('communication.errors.emptyTitleContent'));
            return;
        }
        setIsPublishing(true);
        try {
            const response = await fetchWithAuth('/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (!response.ok) {
                throw new Error(t('communication.errors.publishFailed'));
            }
            
            showToast(t('communication.success.published'));
            // Limpiar formulario después de publicar
            setPrompt('');
            setTitle('');
            setContent('');
            setStatus('');
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-sky-700">{t('communication.title')}</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="announcement-prompt" className="font-semibold text-gray-700">{t('communication.form.promptLabel')}</label>
                    <input id="announcement-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder={t('communication.form.promptPlaceholder')} className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full p-3 rounded bg-gradient-to-r from-fuchsia-600 to-violet-500 hover:from-fuchsia-700 hover:to-violet-600 text-white font-bold transition-colors disabled:opacity-50">
                    {isLoading ? t('communication.actions.generating') : t('communication.actions.generate')}
                </button>
                <div className="text-sm text-center text-fuchsia-600 h-4">{status}</div>
                
                <div>
                    <label htmlFor="announcement-title" className="font-semibold text-gray-700">{t('communication.form.titleLabel')}</label>
                    <input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder={t('communication.form.titlePlaceholder')} className="w-full mt-1 p-2 border rounded-md bg-gray-50" />
                </div>
                
                <div>
                    <label htmlFor="announcement-content" className="font-semibold text-gray-700">{t('communication.form.contentLabel')}</label>
                    <textarea id="announcement-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('communication.form.contentPlaceholder')} rows="8" className="w-full mt-1 p-2 border rounded-md bg-gray-50"></textarea>
                </div>

                <button onClick={handlePublish} disabled={isPublishing} className="w-full p-3 rounded bg-sky-600 text-white hover:bg-sky-700 font-bold transition-colors disabled:opacity-50">
                    {isPublishing ? t('communication.actions.publishing') : t('communication.actions.publishAll')}
                </button>
            </div>
        </div>
    );
};

export default CommunicationScreen;
