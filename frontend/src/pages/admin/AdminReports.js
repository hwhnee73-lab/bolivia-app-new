import React from 'react';

const AdminReports = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">재무 리포트</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">월별 수입</h2>
          <p className="text-gray-500">차트가 여기에 표시됩니다.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">월별 지출</h2>
          <p className="text-gray-500">차트가 여기에 표시됩니다.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">수납률 추이</h2>
          <p className="text-gray-500">차트가 여기에 표시됩니다.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">연체 현황</h2>
          <p className="text-gray-500">차트가 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;