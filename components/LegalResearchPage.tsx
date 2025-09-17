

import React, { useState } from 'react';
import { ResearchLog, ResearchParams } from '../types';
import Tabs from './Tabs';
import PersonResearchTab from './PersonResearchTab';
import CaseLawResearchTab from './CaseLawResearchTab';

interface LegalResearchPageProps {
  researchLogs: ResearchLog[];
  addResearchLog: (params: ResearchParams) => void;
}

const LegalResearchPage: React.FC<LegalResearchPageProps> = ({ researchLogs, addResearchLog }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'AI Case Law Research',
      content: <CaseLawResearchTab />
    },
    {
      label: 'Person / Entity Research',
      content: <PersonResearchTab researchLogs={researchLogs} addResearchLog={addResearchLog} />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Research Assistant</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Use AI to analyze case law, or perform due diligence on people and entities.
        </p>
      </div>
       <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default LegalResearchPage;
