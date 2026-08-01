import React, { useEffect, useState } from 'react';
import { useProfile } from './useProfile';
import { User, Settings, Shield, Bell, Award, AlertTriangle, Loader, Camera } from 'lucide-react';
import ProfileHeader from './components/ProfileHeader';
import EditProfileForm from './components/EditProfileForm';
import PreferencesForm from './components/PreferencesForm';
import NotificationSettingsForm from './components/NotificationSettingsForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import AchievementsGrid from './components/AchievementsGrid';
import DangerZone from './components/DangerZone';
import ErrorState from '../../components/common/ErrorState';
import ProfileSkeleton from './components/ProfileSkeleton';
import PageTransition from '../../components/common/PageTransition';

const ProfilePage = () => {
  const { profile, loading, error, fetchProfile, fetchAchievements, achievements } = useProfile();
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
    fetchAchievements();
  }, [fetchProfile, fetchAchievements]);

  if (loading && !profile) {
    return <ProfileSkeleton />;
  }

  if (error && !profile) {
    return (
      <ErrorState 
        title="Failed to Load Profile" 
        message={error} 
        onRetry={() => {
          fetchProfile();
          fetchAchievements();
        }} 
      />
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true }
  ];

  return (
    <PageTransition>
      <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Header Profile Info */}
      <ProfileHeader profile={profile} />

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Tabs Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar space-x-2 md:space-x-0 md:space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? tab.danger 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-charcoal-border'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${
                  activeTab === tab.id ? (tab.danger ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400') : ''
                }`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 bg-white dark:bg-charcoal-base rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-charcoal-border">
          {activeTab === 'personal' && <EditProfileForm profile={profile} />}
          {activeTab === 'preferences' && <PreferencesForm profile={profile} />}
          {activeTab === 'notifications' && <NotificationSettingsForm profile={profile} />}
          {activeTab === 'security' && <ChangePasswordForm />}
          {activeTab === 'achievements' && <AchievementsGrid achievements={achievements} />}
          {activeTab === 'danger' && <DangerZone />}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
