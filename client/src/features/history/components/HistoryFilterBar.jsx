import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const HistoryFilterBar = ({ filters, setFilters }) => {
  
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.type || filters.status || filters.startDate || filters.endDate || filters.search;

  return (
    <div className="bg-white dark:bg-charcoal-base border border-gray-200 dark:border-charcoal-border rounded-xl p-4 shadow-sm sticky top-4 z-10 space-y-4 transition-colors">
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or keyword..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl bg-gray-50 dark:bg-charcoal-surface text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        {/* Date Range - Using native HTML5 date inputs configured for Tailwind Dark Mode */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <input 
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full md:w-36 px-3 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            title="Start Date"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input 
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full md:w-36 px-3 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            title="End Date"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          
          <select 
            name="type" 
            value={filters.type}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-charcoal-border rounded-lg bg-gray-50 dark:bg-charcoal-surface text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="prayers">Prayers Only</option>
            <option value="duas">Duas Only</option>
          </select>

          <select 
            name="status" 
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-charcoal-border rounded-lg bg-gray-50 dark:bg-charcoal-surface text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <optgroup label="Prayers">
              <option value="completed">Completed (Prayer)</option>
              <option value="missed">Missed (Prayer)</option>
              <option value="qaza">Qaza (Prayer)</option>
            </optgroup>
            <optgroup label="Duas">
              <option value="done">Done (Dua)</option>
              <option value="skipped">Skipped (Dua)</option>
            </optgroup>
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default HistoryFilterBar;
