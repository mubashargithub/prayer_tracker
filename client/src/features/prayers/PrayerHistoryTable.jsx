import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { format, parseISO } from 'date-fns';
import { Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_BADGE = {
  pending: 'bg-gray-100 text-gray-700',
  completed: 'bg-emerald-100 text-emerald-700',
  qaza: 'bg-amber-100 text-amber-700',
  missed: 'bg-red-100 text-red-700'
};

const PrayerHistoryTable = ({ history, loading }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Handle both initial state (array) and API response (object with logs array)
  const logsList = Array.isArray(history) ? history : (history?.logs || []);
  
  // Basic filtering for demonstration
  const filteredHistory = logsList.filter(record => 
    filterStatus === 'All' ? true : record.status === filterStatus
  );

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Prayer History</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your recent prayer logs</p>
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
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Prayer</th>
              <th className="py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-charcoal-border animate-pulse">
                  <td className="py-4"><div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-24"></div></td>
                  <td className="py-4"><div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-16"></div></td>
                  <td className="py-4"><div className="h-6 bg-gray-200 dark:bg-charcoal-border rounded-full w-20 ml-auto"></div></td>
                </tr>
              ))
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No prayer history found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((record) => (
                <tr key={record._id || Math.random()} className="border-b border-gray-50 dark:border-charcoal-border hover:bg-gray-50/50 dark:hover:bg-charcoal-surface/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{record.date ? format(parseISO(record.date), 'MMM dd, yyyy') : 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-gray-900 dark:text-gray-100">{record.prayerName || record.name}</td>
                  <td className="py-4 text-right">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${STATUS_BADGE[record.status] || 'bg-gray-100 dark:bg-charcoal-border text-gray-700 dark:text-gray-400'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Basic Pagination Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-charcoal-border">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredHistory.length} entries
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
