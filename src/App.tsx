import { useState } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Financials from './components/Financials';

function App() {
    const [activeTab, setActiveTab] = useState('patients');
    const [searchValue, setSearchValue] = useState("");
    const [requestedSubTab, setRequestedSubTab] = useState<string | null>(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'patients':
                return (
                    <Patients
                        externalSearch={searchValue}
                        onExternalSearchChange={setSearchValue}
                        forcedSubTab={requestedSubTab}
                        onForcedSubTabHandled={() => setRequestedSubTab(null)}
                    />
                );
            case 'appointments':
                return <Appointments />;
            case 'financials':
                return <Financials />;
            case 'periodontogram':
                // This case is actually handled by the onSearchChange/setActiveTab logic now
                // but we keep it for safety or redirect
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
                return <Dashboard />;
        }
    };

    return (
        <Layout
            activeTab={activeTab === 'patients' && requestedSubTab === 'Periodontograma' ? 'periodontogram' : activeTab}
            setActiveTab={(tab) => {
                if (tab === 'periodontogram') {
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
        >
            {renderContent()}
        </Layout>
    );
}

export default App;
