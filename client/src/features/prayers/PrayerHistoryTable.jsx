import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { format, parseISO } from 'date-fns';
import { Calendar, Filter, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_BADGE = {
  pending: 'bg-gray-100 text-gray-700',
  completed: 'bg-emerald-100 text-emerald-700',
  qaza: 'bg-amber-100 text-amber-700',
  missed: 'bg-red-100 text-red-700'
};

const PrayerHistoryTable = ({ history, loading }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedDates, setExpandedDates] = useState(new Set());
  
  // Handle both initial state (array) and API response (object with logs array)
  const logsList = Array.isArray(history) ? history : (history?.logs || []);
  
  // Basic filtering for demonstration
  const filteredHistory = logsList.filter(record => 
    filterStatus === 'All' ? true : record.status === filterStatus
  );

  // Group by date
  const groupedHistory = useMemo(() => {
    const groups = filteredHistory.reduce((acc, record) => {
      const dateStr = record.date ? format(parseISO(record.date), 'yyyy-MM-dd') : 'Unknown';
      if (!acc[dateStr]) {
        acc[dateStr] = {
          dateStr,
          displayDate: record.date ? format(parseISO(record.date), 'EEEE, MMM dd, yyyy') : 'Unknown',
          prayers: [],
          completedCount: 0,
          totalCount: 0
        };
      }
      acc[dateStr].prayers.push(record);
      acc[dateStr].totalCount++;
      if (record.status === 'completed') acc[dateStr].completedCount++;
      return acc;
    }, {});

    // Convert to array and sort by date descending
    return Object.values(groups).sort((a, b) => {
      if (a.dateStr === 'Unknown') return 1;
      if (b.dateStr === 'Unknown') return -1;
      return b.dateStr.localeCompare(a.dateStr);
    });
  }, [filteredHistory]);

  const toggleExpand = (dateStr) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateStr)) {
      newExpanded.delete(dateStr);
    } else {
      newExpanded.add(dateStr);
    }
    setExpandedDates(newExpanded);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Prayer History</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your recent prayer logs by date</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-charcoal-border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="qaza">Qaza</option>
              <option value="missed">Missed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-charcoal-border text-sm text-gray-500 dark:text-gray-400">
              <th className="py-3 font-medium">Date Summary</th>
              <th className="py-3 font-medium">Completion Rate</th>
              <th className="py-3 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-charcoal-border animate-pulse">
                  <td className="py-4"><div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-32"></div></td>
                  <td className="py-4"><div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-24"></div></td>
                  <td className="py-4"><div className="h-6 bg-gray-200 dark:bg-charcoal-border rounded-full w-8 ml-auto"></div></td>
                </tr>
              ))
            ) : groupedHistory.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No prayer history found.
                </td>
              </tr>
            ) : (
              groupedHistory.map((group) => (
                <React.Fragment key={group.dateStr}>
                  {/* Summary Row */}
                  <tr 
                    className="border-b border-gray-50 dark:border-charcoal-border hover:bg-gray-50/50 dark:hover:bg-charcoal-surface/50 transition-colors cursor-pointer group"
                    onClick={() => toggleExpand(group.dateStr)}
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span>{group.displayDate}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 max-w-[120px] h-2 bg-gray-100 dark:bg-charcoal-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${(group.completedCount / group.totalCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {group.completedCount}/{group.totalCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-charcoal-border transition-colors">
                        {expandedDates.has(group.dateStr) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {expandedDates.has(group.dateStr) && (
                    <tr className="bg-gray-50/30 dark:bg-charcoal-surface/20">
                      <td colSpan="3" className="p-0 border-b border-gray-100 dark:border-charcoal-border">
                        <div className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {group.prayers.map(prayer => (
                              <div key={prayer._id} className="flex flex-col space-y-1 p-3 bg-white dark:bg-charcoal-base border border-gray-100 dark:border-charcoal-border rounded-xl shadow-sm">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{prayer.prayerName}</span>
                                <span className={`w-fit px-2.5 py-0.5 text-[11px] font-medium rounded-full capitalize ${STATUS_BADGE[prayer.status] || 'bg-gray-100 text-gray-600'}`}>
                                  {prayer.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - basic static display for now since backend handles real pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-charcoal-border">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing {groupedHistory.length} days
        </span>
        <div className="flex space-x-2">
          <button className="p-2 border border-gray-200 dark:border-charcoal-border rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-charcoal-surface disabled:opacity-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-200 dark:border-charcoal-border rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-charcoal-surface disabled:opacity-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PrayerHistoryTable;

