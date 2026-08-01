import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Card from '../../../components/common/Card';
import { Heart, BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react';
import Loader from 'lucide-react/dist/esm/icons/loader'; // Adjust if lucide loader imports differently

const getStatusConfig = (status, type) => {
  if (type === 'prayer') {
    switch (status) {
      case 'completed': return { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle };
      case 'missed': return { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle };
      case 'qaza': return { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock };
      default: return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: CheckCircle };
    }
  } else {
    // Dua
    switch (status) {
      case 'done': return { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle };
      case 'skipped': return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: XCircle };
      default: return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: CheckCircle };
    }
  }
};

const TimelineItem = ({ log, index, onDateClick }) => {
  const isPrayer = log.itemType === 'prayer';
  const name = isPrayer ? log.prayerName : log.duaId?.title || 'Unknown Dua';
  const timeStr = log.timestamp ? format(new Date(log.timestamp), 'h:mm a') : 'Unknown time';
  const dateStr = log.timestamp ? format(new Date(log.timestamp), 'MMM d, yyyy') : '';
  
  const config = getStatusConfig(log.status, log.itemType);
  const StatusIcon = config.icon;
  const TypeIcon = isPrayer ? Heart : BookOpen;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className="flex gap-4 relative"
    >
      {/* Vertical Line */}
      <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-charcoal-border z-0"></div>

      {/* Type Icon (Timeline node) */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-charcoal-base ${
        isPrayer ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
      }`}>
        <TypeIcon className="w-5 h-5" />
      </div>

      <Card className="flex-1 p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <StatusIcon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>{name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${config.bg} ${config.color}`}>
                  {log.status}
                </span>
              </h4>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center space-x-2">
                <span 
                  className="cursor-pointer hover:text-emerald-500 hover:underline"
                  onClick={() => onDateClick(log.timestamp)}
                >
                  {dateStr}
                </span>
                <span>•</span>
                <span>{timeStr}</span>
              </p>
            </div>
          </div>

          {log.notes && (
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-charcoal-border/30 p-2 rounded-lg mt-2 sm:mt-0 sm:max-w-xs">
              "{log.notes}"
            </div>
          )}

        </div>
      </Card>
    </motion.div>
  );
};

const HistoryTimeline = ({ logs, hasMore, loadMore, loadingMore, onDateClick }) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  React.useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore, loadingMore]);

  return (
    <div className="py-4">
      {logs.map((log, index) => (
        <TimelineItem 
          key={log._id} 
          log={log} 
          index={index % 10} // reset delay for batched items
          onDateClick={onDateClick} 
        />
      ))}
      
      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center items-center">
          <div className="flex space-x-2 items-center text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more logs...</span>
          </div>
        </div>
      )}

      {!hasMore && logs.length > 0 && (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-charcoal-border mt-4">
          You've reached the end of your history.
        </div>
      )}
    </div>
  );
};

export default HistoryTimeline;
