import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">총 세대수</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">미납 세대</p>
          <p className="text-2xl font-bold text-red-600 mt-1">4</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">당월 수납률</p>
          <p className="text-2xl font-bold text-green-600 mt-1">50%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">미납 총액</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₩1,830,000</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            일괄 청구 업로드
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            재무 리포트
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            사용자 관리
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            공지사항 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;