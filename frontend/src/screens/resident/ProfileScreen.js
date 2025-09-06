
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import PhoneMockup from '../../components/common/PhoneMockup';
import HomeButton from '../../components/common/HomeButton'; // La ruta puede variar

const ProfileScreen = () => {
    const { showToast, handleLogout, currentUser, setCurrentUser, fetchWithAuth } = useAppContext();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Sincroniza el formulario si los datos del usuario cambian
    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejador para guardar los cambios en el perfil
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth('/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t('profile.errors.saveFailed'));
            }

            const updatedProfile = await response.json();

            // Actualiza el estado global del usuario con la nueva información
            setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
            setIsEditing(false);
            showToast(t('profile.success.updated'));

        } catch (error) {
            showToast(t('common.errorWithMessage', { message: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center text-sm py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );

    return (
        <PhoneMockup theme="light">
            <div className="relative space-y-5">
                <HomeButton />
                <h3 className="text-xl font-bold text-center">{t('profile.title')}</h3>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold">{t('profile.sections.accountInfo')}</h4>
                        {!isEditing && <button onClick={() => setIsEditing(true)} className="text-xs text-blue-500 font-semibold">{t('common.edit')}</button>}
                    </div>
                    {isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium">{t('profile.form.username')}</label>
                                <input name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded mt-1 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-medium">{t('profile.form.email')}</label>
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded mt-1 text-sm" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={handleSave} disabled={isLoading} className="w-full bg-teal-600 text-white p-2 rounded text-sm hover:bg-teal-700 disabled:opacity-50">
                                    {isLoading ? t('profile.actions.saving') : t('profile.actions.save')}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm hover:bg-gray-400">{t('common.cancel')}</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <InfoRow label={t('profile.info.username')} value={currentUser?.username} />
                            <InfoRow label={t('profile.info.sessionEmail')} value={currentUser?.email} />
                            <InfoRow label={t('profile.info.role')} value={currentUser?.role} />
                        </>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-md font-semibold mb-2">{t('profile.sections.unitInfo')}</h4>
                    <InfoRow label={t('profile.unit.building')} value={currentUser?.household?.building_number} />
                    <InfoRow label={t('profile.unit.unit')} value={currentUser?.household?.unit_number} />
                </div>
                
                <button onClick={handleLogout} className="w-full text-center text-red-500 hover:text-red-400 font-semibold pt-2">{t('profile.actions.logout')}</button>
            </div>
        </PhoneMockup>
    );
};
export default ProfileScreen;
