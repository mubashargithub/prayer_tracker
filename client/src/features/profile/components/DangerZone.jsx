import React, { useState } from 'react';
import { useProfile } from '../useProfile';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../auth/authSlice';
import { toast } from 'sonner';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import { AlertTriangle } from 'lucide-react';

const DangerZone = () => {
  const { deleteAccount } = useProfile();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    
    setLoading(true);
    const res = await deleteAccount();
    if (res.success) {
      toast.success(res.message);
      // Wait a moment then log user out locally
      setTimeout(() => {
        dispatch(logoutUser());
      }, 1500);
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Irreversible and destructive actions.</p>
      </div>

      <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50 dark:bg-red-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">Delete Account</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
        <Button 
          variant="danger" 
          onClick={() => setIsOpen(true)}
          className="whitespace-nowrap"
        >
          Delete Account
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => !loading && setIsOpen(false)} title="Are you absolutely sure?">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action <strong>cannot</strong> be undone. This will permanently delete your account,
            prayer logs, duas, reminders, and remove all your data from our servers.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please type <strong>DELETE</strong> to confirm.
          </p>
          
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete} 
              disabled={confirmText !== 'DELETE' || loading}
            >
              {loading ? 'Deleting...' : 'I understand, delete my account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DangerZone;
