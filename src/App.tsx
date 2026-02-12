import { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Financials from './components/Financials';
import { ToastContainer, ToastType } from './components/Notifications';
import { Login } from './components/Login';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchValue, setSearchValue] = useState("");
    const [requestedSubTab, setRequestedSubTab] = useState<string | null>(null);
    const [toasts, setToasts] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <Dashboard
                        setActiveTab={setActiveTab}
                        onSearchChange={setSearchValue}
                        addToast={addToast}
                    />
                );
            case 'patients':
                return (
                    <Patients
                        externalSearch={searchValue}
                        onExternalSearchChange={setSearchValue}
                        forcedSubTab={requestedSubTab}
                        onForcedSubTabHandled={() => setRequestedSubTab(null)}
                        addToast={addToast}
                    />
                );
            case 'appointments':
                return <Appointments addToast={addToast} />;
            case 'financials':
                return <Financials />;
            case 'periodontogram':
                return null;
            case 'reports':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                            <span className="material-icons-round text-4xl">assessment</span>
                        </div>
                        <p className="font-bold uppercase tracking-widest text-xs">Reports module is coming soon</p>
                    </div>
                );
            default:
                return (
                    <Dashboard
                        setActiveTab={setActiveTab}
                        onSearchChange={setSearchValue}
                        addToast={addToast}
                    />
                );
        }
    };

    if (!isLoggedIn) {
        return (
            <>
                <Login onLogin={handleLogin} />
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </>
        );
    }

    return (
        <>
            <Layout
                activeTab={activeTab === 'patients' && requestedSubTab === 'Periodontograma' ? 'periodontogram' : activeTab}
                setActiveTab={(tab) => {
                    if (tab === 'logout') {
                        handleLogout();
                    } else if (tab === 'periodontogram') {
                        setActiveTab('patients');
                        setRequestedSubTab('Periodontograma');
                    } else {
                        setActiveTab(tab);
                        setRequestedSubTab(null);
                    }
                }}
                searchValue={searchValue}
                onSearchChange={(v) => {
                    setSearchValue(v);
                    if (activeTab !== 'patients' && v.length > 0) {
                        setActiveTab('patients');
                        setRequestedSubTab(null);
                    }
                }}
                addToast={addToast}
            >
                {renderContent()}
            </Layout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

export default App;
