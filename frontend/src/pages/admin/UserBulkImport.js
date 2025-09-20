import React, { useState } from 'react';
import userAdminService from '../../services/userAdminService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const sampleCsv = `apt_code,dong,ho,display_name,email,role,status,phone_number
BOLIVIA,101,101,홍길동,hong101@example.com,RESIDENT,ACTIVE,010-1111-1111
BOLIVIA,101,102,이영희,lee102@example.com,RESIDENT,ACTIVE,010-2222-2222
BOLIVIA,201,301,관리자,admin@example.com,ADMIN,ACTIVE,010-3333-3333`;

export default function UserBulkImport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState(null);

  const onSelect = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const onDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-batch-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUpload = async () => {
    if (!file) {
      toast.error('파일을 선택해주세요');
      return;
    }
    try {
      setLoading(true);
      const res = await userAdminService.uploadUserBatch(file);
      setPreview(res);
      setResult(null);
      toast.success('검증 결과를 불러왔습니다');
    } catch (e) {
      toast.error('업로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!preview?.tokenKey) {
      toast.error('유효성 토큰이 없습니다. 다시 업로드하세요.');
      return;
    }
    try {
      setConfirming(true);
      const res = await userAdminService.confirmUserBatch(preview.tokenKey);
      setResult(res);
      toast.success('일괄 등록이 완료되었습니다');
    } catch (e) {
      toast.error('확정 처리 실패');
    } finally {
      setConfirming(false);
    }
  };

  const hasInvalid = (preview?.invalid || 0) > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">사용자 일괄 등록</h1>
        <Link to="/admin/users" className="text-primary-600 hover:underline">사용자 목록으로</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">CSV/XLSX 파일 선택</label>
          <input type="file" accept=".csv,.xlsx" onChange={onSelect} />
          <div className="text-sm text-gray-500">열: apt_code,dong,ho,display_name,email,role,status,phone_number</div>
          <div>
            <button onClick={onDownloadSample} className="text-sm text-primary-700 hover:underline">샘플 CSV 다운로드</button>
          </div>
          <button
            onClick={onUpload}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? '업로드 중...' : '업로드 및 검증'}
          </button>
        </div>

        {preview && (
          <div className="space-y-4">
            <div className="text-sm text-gray-700">
              전체 {preview.total}건 / 유효 {preview.valid}건 / 오류 {preview.invalid}건
            </div>
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">행</th>
                    <th className="px-3 py-2 text-left">동</th>
                    <th className="px-3 py-2 text-left">호</th>
                    <th className="px-3 py-2 text-left">이름</th>
                    <th className="px-3 py-2 text-left">이메일</th>
                    <th className="px-3 py-2 text-left">역할</th>
                    <th className="px-3 py-2 text-left">상태</th>
                    <th className="px-3 py-2 text-left">검증</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows?.map((r) => (
                    <tr key={r.rowNumber} className="border-t">
                      <td className="px-3 py-2">{r.rowNumber}</td>
                      <td className="px-3 py-2">{r.dong}</td>
                      <td className="px-3 py-2">{r.ho}</td>
                      <td className="px-3 py-2">{r.displayName}</td>
                      <td className="px-3 py-2">{r.email}</td>
                      <td className="px-3 py-2">{r.role}</td>
                      <td className="px-3 py-2">{r.status}</td>
                      <td className="px-3 py-2">
                        {r.valid ? (
                          <span className="text-green-700">OK</span>
                        ) : (
                          <span className="text-red-700">{r.error}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onConfirm}
                disabled={hasInvalid || confirming}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {confirming ? '처리 중...' : '확정 및 반영'}
              </button>
              {hasInvalid && (
                <span className="text-sm text-amber-700">오류 행이 있어 확정이 비활성화되었습니다.</span>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="p-4 bg-emerald-50 rounded">
            <div className="text-emerald-800 text-sm">
              총 {result.total}건 중 {result.upserted}건 반영, {result.skipped}건 건너뜀
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

