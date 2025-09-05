import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import billService from '../services/billService';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillDetail();
  }, [id]);

  const fetchBillDetail = async () => {
    try {
      const data = await billService.getBillDetail(id);
      setBill(data);
    } catch (error) {
      console.error('Failed to fetch bill detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!bill) {
    return <div>청구서를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 mb-4"
        >
          ← 뒤로가기
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{bill.billMonth} 관리비 상세</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">청구월</p>
            <p className="font-semibold">{bill.billMonth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">납부기한</p>
            <p className="font-semibold">{bill.dueDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">총 청구액</p>
            <p className="font-semibold text-lg">{formatCurrency(bill.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">납부 상태</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
              ${bill.status === '완납' ? 'bg-green-100 text-green-800' : 
                bill.status === '미납' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {bill.status}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">상세 내역</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>일반관리비</span>
              <span>{formatCurrency(bill.generalFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>경비비</span>
              <span>{formatCurrency(bill.securityFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>청소비</span>
              <span>{formatCurrency(bill.cleaningFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>승강기유지비</span>
              <span>{formatCurrency(bill.elevatorFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>전기료</span>
              <span>{formatCurrency(bill.electricityFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>수도료</span>
              <span>{formatCurrency(bill.waterFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>난방비</span>
              <span>{formatCurrency(bill.heatingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>수선유지비</span>
              <span>{formatCurrency(bill.repairFund)}</span>
            </div>
            <div className="flex justify-between">
              <span>보험료</span>
              <span>{formatCurrency(bill.insuranceFee)}</span>
            </div>
          </div>
        </div>

        {bill.status === '미납' && (
          <div className="mt-6">
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
              결제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillDetail;