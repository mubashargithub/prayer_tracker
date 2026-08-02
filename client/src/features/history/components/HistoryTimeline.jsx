import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Card from '../../../components/common/Card';
import { Heart, BookOpen, CheckCircle, XCircle, Clock, ChevronDown, Calendar } from 'lucide-react';

const getStatusConfig = (status, type) => {
  if (type === 'prayer') {
    switch (status) {
      case 'completed': return { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle };
      case 'missed': return { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle };
      case 'qaza': return { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock };
      default: return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: CheckCircle };
    }
  } else {
    switch (status) {
      case 'done': return { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle };
      case 'skipped': return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: XCircle };
      default: return { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: CheckCircle };
    }
  }
};

const LogItem = ({ log }) => {
  const isPrayer = log.itemType === 'prayer';
  const name = isPrayer ? log.prayerName : log.duaId?.title || 'Unknown Dua';
  const timeStr = log.timestamp ? format(new Date(log.timestamp), 'h:mm a') : 'Unknown time';
  const config = getStatusConfig(log.status, log.itemType);
  const StatusIcon = config.icon;
  const TypeIcon = isPrayer ? Heart : BookOpen;

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-charcoal-border/30 rounded-xl border border-gray-100 dark:border-charcoal-border">
      <div className={`p-2 rounded-lg flex-shrink-0 ${config.bg}`}>
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2 flex items-center space-x-2">
            <TypeIcon className="w-3 h-3 text-gray-400" />
            <span>{name}</span>
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{timeStr}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${config.bg} ${config.color}`}>
            {log.status}
          </span>
        </div>
        {log.notes && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">
            "{log.notes}"
          </p>
        )}
      </div>
    </div>
  );
};

const DayGroup = ({ dateStr, logs, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateObj = new Date(dateStr);
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  
  const prayers = logs.filter(l => l.itemType === 'prayer');
  const duas = logs.filter(l => l.itemType === 'dua');
  
  const completedPrayers = prayers.filter(p => p.status === 'completed').length;
  const completedDuas = duas.filter(d => d.status === 'done').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="mb-4"
    >
      <Card className="overflow-hidden">
        {/* Header (Clickable) */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-charcoal-border/20 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{formattedDate}</h3>
              <div className="flex space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>{prayers.length} Prayers ({completedPrayers} completed)</span>
                <span>•</span>
                <span>{duas.length} Duas ({completedDuas} done)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mini Progress Bar for Prayers */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${prayers.length > 0 ? (completedPrayers / prayers.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-gray-100 dark:bg-charcoal-border text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100 dark:border-charcoal-border bg-gray-50/50 dark:bg-charcoal-base/50 p-5"
            >
              {prayers.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Prayers Logged</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prayers.map(log => <LogItem key={log._id} log={log} />)}
                  </div>
                </div>
              )}
              
              {duas.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Duas Logged</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {duas.map(log => <LogItem key={log._id} log={log} />)}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const HistoryTimeline = ({ logs, hasMore, loadMore, loadingMore }) => {
  const { ref, inView } = useInView({ threshold: 0 });

  React.useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore, loadingMore]);

  // Group logs by date string (YYYY-MM-DD)
  const groupedLogs = useMemo(() => {
    const groups = {};
    logs.forEach(log => {
      if (!log.timestamp) return;
      const dateStr = log.timestamp.split('T')[0];
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(log);
    });
    
    // Sort dates descending
    return Object.keys(groups)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(dateStr => ({
        dateStr,
        logs: groups[dateStr]
      }));
  }, [logs]);

  return (
    <div className="py-4">
      {groupedLogs.map((group, index) => (
        <DayGroup 
          key={group.dateStr} 
          dateStr={group.dateStr} 
          logs={group.logs} 
          index={index % 10} 
        />
      ))}
      
      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center items-center">
          <div className="flex space-x-2 items-center text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more history...</span>
          </div>
        </div>
      )}

      {!hasMore && logs.length > 0 && (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          You've reached the end of your history.
        </div>
      )}
    </div>
  );
};

export default HistoryTimeline;
