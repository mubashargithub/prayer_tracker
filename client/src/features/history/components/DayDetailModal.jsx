import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../../components/common/Modal';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHistory } from '../useHistory';
import api from '../../../services/api';
import { toast } from 'sonner';

const DayDetailModal = ({ isOpen, onClose, dateStr, onRecordUpdated }) => {
  const { getDayDetail } = useHistory();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (isOpen && dateStr) {
      const fetchDetail = async () => {
        setLoading(true);
        const data = await getDayDetail(dateStr);
        setDetail(data);
        setLoading(false);
      };
      fetchDetail();
    }
  }, [isOpen, dateStr]);

  if (!isOpen) return null;

  const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  // Organize prayers
  const prayersMap = {};
  PRAYER_ORDER.forEach(p => prayersMap[p] = { status: 'pending' }); // default to pending
  if (detail?.prayers) {
    detail.prayers.forEach(p => {
      prayersMap[p.prayerName] = p;
    });
  }

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'done') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'qaza') return <Clock className="w-5 h-5 text-amber-500" />;
    if (status === 'pending') return <Clock className="w-5 h-5 text-gray-300 dark:text-gray-500" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const handleStatusChange = async (prayerName, newStatus) => {
    setUpdating(prev => ({ ...prev, [prayerName]: true }));
    try {
      await api.post('/prayers/mark', {
        prayerName,
        status: newStatus,
        date: dateStr
      });
      
      // Update local state detail
      setDetail(prev => {
        if (!prev) return prev;
        const updatedPrayers = [...(prev.prayers || [])];
        const prayerIdx = updatedPrayers.findIndex(p => p.prayerName === prayerName);
        if (prayerIdx > -1) {
          updatedPrayers[prayerIdx] = { ...updatedPrayers[prayerIdx], status: newStatus };
        } else {
          updatedPrayers.push({ prayerName, status: newStatus });
        }
        return { ...prev, prayers: updatedPrayers };
      });
      
      toast.success(`${prayerName} updated to ${newStatus}`);
      if (onRecordUpdated) {
        onRecordUpdated();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${prayerName}`);
    } finally {
      setUpdating(prev => ({ ...prev, [prayerName]: false }));
    }
  };

  // Convert dateStr properly in local time to avoid timezone offset shifts
  const getFormattedTitle = () => {
    try {
      if (!dateStr) return 'Day Detail';
      const [year, month, day] = dateStr.split('-');
      const localDate = new Date(year, month - 1, day);
      return format(localDate, 'EEEE, MMMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const title = getFormattedTitle();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : detail ? (
        <div className="space-y-6">
          
          {/* Prayers Section */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-[#1F2D50] pb-2 text-left">
              Prayers
            </h4>
            <div className="space-y-2">
              {PRAYER_ORDER.map(p => (
                <div key={p} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-[#14203D]/50 transition-colors">
                  <span className="font-medium text-gray-700 dark:text-gray-300 w-24 text-left">{p}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5 min-w-[90px] justify-end">
                      {getStatusIcon(prayersMap[p].status)}
                      <span className="hidden sm:inline text-xs capitalize text-gray-400 dark:text-gray-500">
                        {prayersMap[p].status}
                      </span>
                    </div>
                    <select
                      value={prayersMap[p].status || 'pending'}
                      onChange={(e) => handleStatusChange(p, e.target.value)}
                      disabled={updating[p]}
                      className="bg-white dark:bg-[#14203D] border border-gray-200 dark:border-[#1F2D50] hover:border-emerald-500 dark:hover:border-emerald-400 rounded-lg text-sm px-2.5 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="qaza">Qaza</option>
                      <option value="missed">Missed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duas Section */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-[#1F2D50] pb-2 text-left">
              Duas
            </h4>
            {detail.duas?.length > 0 ? (
              <div className="space-y-2">
                {detail.duas.map(d => (
                  <div key={d._id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-[#14203D]/50 transition-colors">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex-1 truncate pr-4 text-left">
                      {d.duaId?.title || 'Unknown Dua'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm capitalize text-gray-500 mr-1">{d.status}</span>
                      {getStatusIcon(d.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2 text-left">No duas recorded for this day.</p>
            )}
          </div>

        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Failed to load details.</p>
      )}
    </Modal>
  );
};

export default DayDetailModal;
