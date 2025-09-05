import React, { useState } from 'react';

const AdminBilling = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('파일을 선택해주세요.');
      return;
    }

    setUploadStatus('업로드 중...');
    // TODO: Implement file upload
    setTimeout(() => {
      setUploadStatus('업로드 완료!');
    }, 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">일괄 청구 관리</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">청구서 일괄 업로드</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              엑셀 파일 선택 (XLSX, CSV)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
          </div>

          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            업로드
          </button>

          {uploadStatus && (
            <p className="text-sm text-gray-600">{uploadStatus}</p>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">파일 형식 안내</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 동, 호수, 청구액, 납부기한 필드는 필수입니다.</li>
            <li>• 날짜는 YYYY-MM-DD 형식으로 입력해주세요.</li>
            <li>• 금액은 숫자로만 입력해주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;