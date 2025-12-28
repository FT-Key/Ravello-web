// src/components/profile/ProfileTabs.jsx
import React from 'react';
import { User, Shield, Settings, BarChart3 } from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Información Personal', icon: User },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'preferences', label: 'Preferencias', icon: Settings },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
];

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white border-b-4 border-[var(--color-primary-red)]'
                  : 'text-light hover:bg-background-light hover:text-primary-blue'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}