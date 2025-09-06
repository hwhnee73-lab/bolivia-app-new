
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import PhoneMockup from '../../components/common/PhoneMockup';
import  Modal  from '../../components/common/Modal'; // La ruta puede variar
import  HomeButton  from '../../components/common/HomeButton'; // La ruta puede variar

const CommunityScreen = () => {
    const { showToast, currentUser, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState({ category: 'Foro Libre', title: '', content: '' });

    // Al cargar el componente, se obtiene la lista de publicaciones desde la API
    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth('/posts');
            if (!response.ok) { throw new Error(t('community.errors.loadFailed')); }
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchWithAuth('/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) { throw new Error(t('community.errors.createFailed')); }
            
            showToast(t('community.success.created'));
            setIsFormVisible(false);
            setFormData({ category: 'Foro Libre', title: '', content: '' });
            fetchPosts(); // Recargar la lista
        } catch (err) {
            showToast(t('common.errorWithMessage', { message: err.message }));
        }
    };

    const openPostModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    return (
        <>
            <PhoneMockup theme="light">
                <div className="relative h-[650px] flex flex-col">
                    <HomeButton />
                    <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">{t('community.title')}</h3>
                    
                    {!isFormVisible && (
                        <button onClick={() => setIsFormVisible(true)} className="w-full p-3 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 mb-4">
                            {t('community.actions.newPostPlus')}
                        </button>
                    )}

                    {isFormVisible && (
                        <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg shadow mb-4 space-y-3">
                            <h4 className="font-semibold">{t('community.form.newTitle')}</h4>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded text-sm">
                                <option value="Foro Libre">Foro Libre</option>
                                <option value="Mercado">Mercado</option>
                            </select>
                            <input name="title" value={formData.title} onChange={handleInputChange} placeholder={t('community.form.titlePlaceholder')} className="w-full p-2 border rounded text-sm" required />
                            <textarea name="content" value={formData.content} onChange={handleInputChange} rows="3" placeholder={t('community.form.contentPlaceholder')} className="w-full p-2 border rounded text-sm" required></textarea>
                            <div className="flex gap-2">
                                <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded text-sm hover:bg-teal-700">{t('community.actions.publish')}</button>
                                <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm hover:bg-gray-400">{t('common.cancel')}</button>
                            </div>
                        </form>
                    )}

                    <div className="flex-grow overflow-y-auto space-y-2">
                        <h4 className="font-semibold mb-2">{t('community.list.title')}</h4>
                        {isLoading && <p className="text-center">{t('common.loading')}</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        {!isLoading && !error && posts.map(post => (
                            <div key={post.id} onClick={() => openPostModal(post)} className="bg-white p-3 rounded-lg shadow cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full font-semibold">{post.category}</span>
                                    <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="font-bold text-sm mt-2 truncate">{post.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{t('community.list.author')}: {post.author_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PhoneMockup>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedPost?.title}>
                <div className="space-y-4">
                    <div className="text-sm text-gray-500">
                        <span>{t('community.list.category')}: {selectedPost?.category}</span> | <span>{t('community.list.author')}: {selectedPost?.author_name}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPost?.content}</p>
                </div>
            </Modal>
        </>
    );
};
export default CommunityScreen;
