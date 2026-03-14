import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);

      if (result && result.success) {
        navigate(result.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      } else {
        setError(result?.error || t('auth.loginError'));
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bolivia</h1>
          <p className="text-gray-600 mt-2">콘도 관리 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')} / 아이디
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="admin@bolivia.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                {t('auth.rememberMe')}
              </label>
            </div>
            <button type="button" className="text-sm text-primary-600 hover:text-primary-500">
              {t('auth.forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            테스트 계정 안내
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex justify-between items-center bg-white p-2 rounded border border-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => setFormData({ ...formData, username: 'admin@bolivia.com', password: 'Admin123!' })}>
              <div>
                <span className="font-semibold block">시스템 관리자</span>
                <span className="text-xs text-blue-500">클릭하여 입력 달기</span>
              </div>
              <div className="text-right">
                <code className="block text-xs bg-gray-100 px-1 rounded">admin@bolivia.com</code>
                <code className="block text-xs text-gray-500">Admin123!</code>
              </div>
            </li>
            <li className="flex justify-between items-center bg-white p-2 rounded border border-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => setFormData({ ...formData, username: 'kim101@bolivia.com', password: 'Admin123!' })}>
              <div>
                <span className="font-semibold block">일반 입주민</span>
                <span className="text-xs text-blue-500">클릭하여 입력 달기</span>
              </div>
              <div className="text-right">
                <code className="block text-xs bg-gray-100 px-1 rounded">kim101@bolivia.com</code>
                <code className="block text-xs text-gray-500">Admin123!</code>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;