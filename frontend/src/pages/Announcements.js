import React from 'react';

const Announcements = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">공지사항</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">공지사항이 없습니다.</p>
      </div>
    </div>
  );
};

export default Announcements;