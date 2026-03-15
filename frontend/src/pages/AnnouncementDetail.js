import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnouncementDetail } from '../services/announcementService';
import { categoryColors } from '../constants';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '0.875rem',
    marginBottom: '20px',
    transition: 'all 0.2s',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  cardTop: (cat) => {
    const c = categoryColors[cat] || categoryColors['기타'];
    return {
      padding: '24px 28px 16px',
      borderBottom: '1px solid #f1f5f9',
      background: `linear-gradient(135deg, ${c.bg} 0%, #ffffff 100%)`,
    };
  },
  badge: (cat) => {
    const c = categoryColors[cat] || categoryColors['기타'];
    return {
      display: 'inline-block',
      padding: '4px 14px',
      borderRadius: '16px',
      fontSize: '0.8rem',
      fontWeight: '600',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      marginBottom: '12px',
    };
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardBody: {
    padding: '28px',
  },
  content: {
    fontSize: '1rem',
    color: '#334155',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
  },
  attachment: {
    marginTop: '24px',
    padding: '14px 18px',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  attachLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
  },
  errorState: {
    textAlign: 'center',
    padding: '60px',
    color: '#ef4444',
  },
};

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getAnnouncementDetail(id);
        setAnnouncement(res.data);
      } catch (err) {
        console.error('공지사항 상세 조회 실패:', err);
        setError('공지사항을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={styles.loading}>로딩 중...</div>;
  }

  if (error || !announcement) {
    return (
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/announcements')}>
          ◀ 목록으로
        </button>
        <div style={styles.errorState}>
          <p>{error || '공지사항을 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button
        style={styles.backBtn}
        onClick={() => navigate('/announcements')}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
      >
        ◀ 목록으로
      </button>

      <div style={styles.card}>
        <div style={styles.cardTop(announcement.category)}>
          <span style={styles.badge(announcement.category)}>
            {announcement.isPinned && '📌 '}{announcement.category}
          </span>
          <h1 style={styles.title}>{announcement.title}</h1>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>✍️ {announcement.authorName}</span>
            <span style={styles.metaItem}>📅 {formatDate(announcement.createdAt)}</span>
            <span style={styles.metaItem}>👁️ 조회 {announcement.viewCount || 0}</span>
          </div>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.content}>{announcement.content}</div>

          {announcement.attachmentUrl && (
            <div style={styles.attachment}>
              📎 첨부파일:{' '}
              <a
                href={announcement.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.attachLink}
              >
                파일 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
