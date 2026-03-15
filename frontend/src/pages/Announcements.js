import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements } from '../services/announcementService';
import { categoryColors, ANNOUNCEMENT_CATEGORIES } from '../constants';



const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  filterBtn: (isActive) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
    background: isActive ? '#eff6ff' : '#ffffff',
    color: isActive ? '#2563eb' : '#64748b',
    fontWeight: isActive ? '600' : '400',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  card: (isPinned) => ({
    background: isPinned ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
    border: isPinned ? '1px solid #f59e0b' : '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  badge: (cat) => {
    const c = categoryColors[cat] || categoryColors['기타'];
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    };
  },
  pinIcon: {
    fontSize: '1rem',
    color: '#f59e0b',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '6px',
  },
  cardContent: {
    fontSize: '0.9rem',
    color: '#475569',
    lineHeight: '1.5',
    marginTop: '10px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
  },
  pageBtn: (isActive) => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: isActive ? '#3b82f6' : '#ffffff',
    color: isActive ? '#ffffff' : '#64748b',
    cursor: 'pointer',
    fontWeight: isActive ? '600' : '400',
    fontSize: '0.875rem',
  }),
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '12px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
};

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (category) params.category = category;
      const res = await getAnnouncements(params);
      const data = res.data;
      setAnnouncements(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('공지사항 조회 실패:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📣 공지사항</h1>
      </div>

      {/* 카테고리 필터 */}
      <div style={styles.filterRow}>
        {ANNOUNCEMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            style={styles.filterBtn(category === cat.value)}
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 로딩 */}
      {loading && (
        <div style={styles.loading}>로딩 중...</div>
      )}

      {/* 공지사항 목록 */}
      {!loading && announcements.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <p>공지사항이 없습니다.</p>
        </div>
      )}

      {!loading && announcements.map((item) => (
        <div
          key={item.id}
          style={styles.card(item.isPinned)}
          onClick={() => navigate(`/announcements/${item.id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
          }}
        >
          <div style={styles.cardHeader}>
            {item.isPinned && <span style={styles.pinIcon}>📌</span>}
            <span style={styles.badge(item.category)}>{item.category}</span>
            <h3 style={styles.cardTitle}>{item.title}</h3>
          </div>
          <div style={styles.cardContent}>{item.content}</div>
          <div style={styles.cardMeta}>
            <span>✍️ {item.authorName}</span>
            <span>📅 {formatDate(item.createdAt)}</span>
            <span>👁️ {item.viewCount || 0}</span>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn(false)}
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            ◀ 이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              style={styles.pageBtn(page === i)}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={styles.pageBtn(false)}
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            다음 ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Announcements;