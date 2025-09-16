import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const menuItems = [
    {
      id: 'profile',
      title: '내 정보수정',
      icon: '👤',
      onClick: () => navigate('/profile')
    },
    {
      id: 'password',
      title: '비밀번호 변경',
      icon: '🔐',
      onClick: () => navigate('/change-password')
    },
    {
      id: 'markerSettings',
      title: '마커트 설정',
      icon: '📍',
      onClick: () => navigate('/marker-settings')
    },
    {
      id: 'notification',
      title: '알림 설정',
      icon: '🔔',
      onClick: () => navigate('/notification-settings')
    },
    {
      id: 'eventReminder',
      title: '차단 사용자 관리',
      icon: '🚫',
      onClick: () => navigate('/blocked-users')
    },
    {
      id: 'marketNews',
      title: '마켓트너 탈퇴',
      icon: '👋',
      onClick: () => handleDeleteAccount()
    },
    {
      id: 'language',
      title: '로그아웃',
      icon: '🚪',
      onClick: () => handleLogout()
    }
  ];

  const secondaryMenuItems = [
    {
      id: 'marketFAQ',
      title: '마켓트너 공식시장',
      icon: '🏪',
      onClick: () => navigate('/official-market')
    },
    {
      id: 'faq',
      title: '자주 묻는 질문(FAQ)',
      icon: '❓',
      onClick: () => navigate('/faq')
    },
    {
      id: 'terms',
      title: '1:1 문의',
      icon: '💬',
      onClick: () => navigate('/support')
    }
  ];

  const tertiaryMenuItems = [
    {
      id: 'notice',
      title: '약관',
      icon: '📋',
      onClick: () => navigate('/terms')
    },
    {
      id: 'version',
      title: '버전정보',
      icon: 'ℹ️',
      version: '2.20.42',
      onClick: () => {}
    }
  ];

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // Logout logic here
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // Account deletion logic here
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">설정</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* 메인 설정 섹션 */}
        <div className="mb-6">
          <h2 className="text-xs text-gray-500 mb-2 px-2">메뉴와 설정</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* 마켓트너 고객센터 섹션 */}
        <div className="mb-6">
          <h2 className="text-xs text-gray-500 mb-2 px-2">마켓트너 고객센터</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {secondaryMenuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index !== secondaryMenuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* 서비스 정보 섹션 */}
        <div className="mb-6">
          <h2 className="text-xs text-gray-500 mb-2 px-2">서비스 정보</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {tertiaryMenuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index !== tertiaryMenuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {item.version ? (
                  <span className="text-sm text-gray-500">{item.version}</span>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;