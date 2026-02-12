import { useState } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Financials from './components/Financials';
import Periodontogram from './components/Periodontogram';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'patients':
                return <Patients />;
            case 'appointments':
                return <Appointments />;
            case 'financials':
                return <Financials />;
            case 'periodontogram':
                return <Periodontogram />;
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
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </Layout>
    );
}

export default App;
