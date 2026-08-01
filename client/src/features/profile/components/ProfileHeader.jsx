import React, { useRef, useState } from 'react';
import { Camera, Mail, Calendar, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';

const ProfileHeader = ({ profile }) => {
  const fileInputRef = useRef(null);
  const { updateAvatar } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(profile?.avatarUrl);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    const res = await updateAvatar(file);
    if (res.success) {
      setAvatar(res.avatarUrl);
      toast.success('Avatar updated successfully');
    } else {
      toast.error(res.message);
    }
    setUploading(false);
  };

  const joinDate = profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'Unknown';
  
  const backendBase = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : (import.meta.env.PROD ? '' : 'http://localhost:5000');

  return (
    <div className="bg-white dark:bg-charcoal-base rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-charcoal-border flex flex-col sm:flex-row items-center sm:items-start gap-6">
      
      {/* Avatar Section */}
      <div className="relative group cursor-pointer" onClick={handleImageClick}>
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/40 border-4 border-white dark:border-charcoal-surface shadow-md">
          {avatar ? (
            <img src={avatar.startsWith('http') ? avatar : `${backendBase}${avatar}`} alt={profile?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
          {uploading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Change</span>
            </>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* User Info */}
      <div className="flex-1 text-center sm:text-left space-y-2 mt-2 sm:mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>{profile?.email}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {joinDate}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProfileHeader;
