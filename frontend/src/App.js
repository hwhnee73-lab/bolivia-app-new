// (auto-concat)

import './i18n';
import { AppProvider, useAppContext } from './contexts/AppContext';
// Layout Components
import Header from './components/layout/Header';
import SlideOutMenu from './components/layout/SlideOutMenu';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import BottomNavBar from './components/layout/BottomNavBar';
// Screen Components
import AuthScreen from './screens/AuthScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import IntroInfographicScreen from './screens/IntroInfographicScreen';
// Resident Screens
import ResidentDashboard from './screens/resident/ResidentDashboard';
import PaymentScreen from './screens/resident/PaymentScreen';
import ReservationScreen from './screens/resident/ReservationScreen';
import MaintenanceScreen from './screens/resident/MaintenanceScreen';
import CommunityScreen from './screens/resident/CommunityScreen';
import ProfileScreen from './screens/resident/ProfileScreen';
// Admin Screens
import AdminDashboard from './screens/admin/AdminDashboard';
import ResidentManagementScreen from './screens/admin/ResidentManagementScreen';
import UserManagementScreen from './screens/admin/UserManagementScreen';
import FinanceScreen from './screens/admin/FinanceScreen';
import TaskScreen from './screens/admin/TaskScreen';

import BillingBatchWizard from './screens/admin/BillingBatchWizard';
import CommunicationScreen from './screens/admin/CommunicationScreen';
import ReservationApprovalScreen from './screens/admin/ReservationApprovalScreen';

// --- /src/App.js ---
// El componente principal de la aplicación se encarga de renderizar la pantalla.
const AppContent = () => {
    const { isLoggedIn, persona, activeView } = useAppContext();
    const renderContent = () => {
        if (!isLoggedIn && activeView !== 'intro') {
            return <AuthScreen />;
        }

        if (activeView === 'intro') {
            return <IntroInfographicScreen />;
        }

        if (persona === 'resident') {
            switch (activeView) {
                case 'intro': return <PlaceholderScreen screenName="Introducción" />;
                case 'auth': return <AuthScreen />;
                case 'dashboard': return <ResidentDashboard />;
                case 'payment': return <PaymentScreen />;
                case 'reservation': return <ReservationScreen />;
                case 'maintenance': return <MaintenanceScreen />;
                case 'community': return <CommunityScreen />;
                case 'profile': return <ProfileScreen />;
                default: return <ResidentDashboard />;
            }
        } else { // admin
            switch (activeView) {
                case 'intro': return <PlaceholderScreen screenName="Introducción" />;
                case 'auth': return <AuthScreen />;
                case 'dashboard': return <AdminDashboard />;
                case 'user_management': return <UserManagementScreen />;
                case 'resident_management': return <ResidentManagementScreen />;
                case 'finance': return <FinanceScreen />;
                case 'billing_batch': return <BillingBatchWizard />;
                case 'task': return <TaskScreen />;
                case 'reservation_approval': return <ReservationApprovalScreen />;
                case 'communication': return <CommunicationScreen />;
                default: return <AdminDashboard />;
            }
        }
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />
            <SlideOutMenu />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="w-full">{renderContent()}</div>
            </main>
            <BottomNavBar />
            <Toast />
            <Footer />
        </div>
    );
};
// --- /src/index.js ---
// Finalmente, AppProvider envuelve a AppContent para proporcionar el estado a toda la aplicación.
export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}


