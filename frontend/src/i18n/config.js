import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      common: {
        login: '로그인',
        logout: '로그아웃',
        register: '회원가입',
        save: '저장',
        cancel: '취소',
        delete: '삭제',
        edit: '수정',
        close: '닫기',
        search: '검색',
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        confirm: '확인',
      },
      nav: {
        home: '홈',
        dashboard: '대시보드',
        bills: '관리비',
        payments: '결제',
        announcements: '공지사항',
        reservations: '시설예약',
        maintenance: '유지보수',
        reports: '리포트',
        settings: '설정',
      },
      auth: {
        email: '이메일',
        password: '비밀번호',
        rememberMe: '로그인 유지',
        forgotPassword: '비밀번호 찾기',
        loginSuccess: '로그인에 성공했습니다',
        loginError: '로그인에 실패했습니다',
        logoutSuccess: '로그아웃되었습니다',
      },
      bill: {
        title: '관리비 조회',
        month: '청구월',
        amount: '청구금액',
        dueDate: '납부기한',
        status: '납부상태',
        paid: '완납',
        unpaid: '미납',
        partial: '부분납',
        detail: '상세내역',
        generalFee: '일반관리비',
        securityFee: '경비비',
        cleaningFee: '청소비',
        electricityFee: '전기료',
        waterFee: '수도료',
        heatingFee: '난방비',
      },
      dashboard: {
        welcome: '환영합니다',
        summary: '요약',
        totalUnpaid: '미납 총액',
        currentMonth: '당월 청구액',
        recentPayments: '최근 결제',
        upcomingReservations: '예정된 예약',
      }
    }
  },
  en: {
    translation: {
      common: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        confirm: 'Confirm',
      },
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        bills: 'Bills',
        payments: 'Payments',
        announcements: 'Announcements',
        reservations: 'Reservations',
        maintenance: 'Maintenance',
        reports: 'Reports',
        settings: 'Settings',
      },
      auth: {
        email: 'Email',
        password: 'Password',
        rememberMe: 'Remember Me',
        forgotPassword: 'Forgot Password',
        loginSuccess: 'Login successful',
        loginError: 'Login failed',
        logoutSuccess: 'Logged out successfully',
      },
      bill: {
        title: 'View Bills',
        month: 'Bill Month',
        amount: 'Amount',
        dueDate: 'Due Date',
        status: 'Status',
        paid: 'Paid',
        unpaid: 'Unpaid',
        partial: 'Partial',
        detail: 'Details',
        generalFee: 'General Fee',
        securityFee: 'Security Fee',
        cleaningFee: 'Cleaning Fee',
        electricityFee: 'Electricity',
        waterFee: 'Water',
        heatingFee: 'Heating',
      },
      dashboard: {
        welcome: 'Welcome',
        summary: 'Summary',
        totalUnpaid: 'Total Unpaid',
        currentMonth: 'Current Month',
        recentPayments: 'Recent Payments',
        upcomingReservations: 'Upcoming Reservations',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;