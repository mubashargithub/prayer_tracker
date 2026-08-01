import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import { useDuas } from './useDuas';
import DuaCard from './DuaCard';
import AddEditDuaModal from './AddEditDuaModal';
import ErrorState from '../../components/common/ErrorState';
import PageTransition from '../../components/common/PageTransition';

const DuasPage = () => {
  const {
    loading,
    error,
    duas,
    fetchDuas,
    createDua,
    updateDua,
    deleteDua,
    completeDua
  } = useDuas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDua, setEditingDua] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchDuas();
  }, [fetchDuas]);

  const handleOpenAdd = () => {
    setEditingDua(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dua) => {
    setEditingDua(dua);
    setIsModalOpen(true);
  };

  const handleSubmit = async (duaData) => {
    if (editingDua) {
      await updateDua(editingDua._id, duaData);
    } else {
      await createDua(duaData);
    }
  };

  const categories = ['All', 'General', 'Morning', 'Evening', 'After Prayer', 'Travel', 'Hardship'];

  const filteredDuas = duas.filter(dua => {
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (dua.translation && dua.translation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dua Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Memorize, recite, and track your daily supplications.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Dua</span>
        </Button>
      </div>

      {error && !loading && (
        <ErrorState 
          title="Failed to Load Duas" 
          message={error} 
          onRetry={fetchDuas} 
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-charcoal-base p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or translation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-none bg-gray-50 dark:bg-charcoal-surface rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-charcoal-surface border-none rounded-xl text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Duas Grid */}
      {loading && duas.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-charcoal-border rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredDuas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-charcoal-base rounded-3xl border border-gray-100 dark:border-charcoal-border shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-charcoal-surface rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Duas Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {searchQuery || selectedCategory !== 'All' 
              ? "We couldn't find any Duas matching your current filters." 
              : "You haven't added any Duas yet. Click the button above to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {filteredDuas.map(dua => (
            <DuaCard 
              key={dua._id}
              dua={dua}
              onEdit={handleOpenEdit}
              onDelete={deleteDua}
              onComplete={completeDua}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddEditDuaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingDua}
      />

      </div>
    </PageTransition>
  );
};

export default DuasPage;
