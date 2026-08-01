import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../../components/common/Modal';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHistory } from '../useHistory';

const DayDetailModal = ({ isOpen, onClose, dateStr }) => {
  const { getDayDetail } = useHistory();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

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
  PRAYER_ORDER.forEach(p => prayersMap[p] = { status: 'missed' }); // default
  if (detail?.prayers) {
    detail.prayers.forEach(p => {
      prayersMap[p.prayerName] = p;
    });
  }

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'done') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'qaza') return <Clock className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const title = dateStr ? format(new Date(dateStr), 'EEEE, MMMM d, yyyy') : 'Day Detail';

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
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-charcoal-border pb-2">
              Prayers
            </h4>
            <div className="space-y-2">
              {PRAYER_ORDER.map(p => (
                <div key={p} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-charcoal-surface">
                  <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{p}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm capitalize text-gray-500">{prayersMap[p].status}</span>
                    {getStatusIcon(prayersMap[p].status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duas Section */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-charcoal-border pb-2">
              Duas
            </h4>
            {detail.duas?.length > 0 ? (
              <div className="space-y-2">
                {detail.duas.map(d => (
                  <div key={d._id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-charcoal-surface">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex-1 truncate pr-4">
                      {d.duaId?.title || 'Unknown Dua'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm capitalize text-gray-500">{d.status}</span>
                      {getStatusIcon(d.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No duas recorded for this day.</p>
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
