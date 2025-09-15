import React from 'react';

const Payments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제 내역</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">결제 내역이 없습니다.</p>
      </div>
    </div>
  );
};

export default Payments;