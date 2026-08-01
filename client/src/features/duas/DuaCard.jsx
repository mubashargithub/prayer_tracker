import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DuaCard = ({ dua, onEdit, onDelete, onComplete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Card className="relative overflow-visible flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-xs font-semibold rounded-full mb-2 transition-colors">
            {dua.category || 'General'}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{dua.title}</h3>
        </div>
        
        {/* Actions Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Options"
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-surface transition-colors text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-32 bg-white dark:bg-charcoal-surface rounded-lg shadow-lg border border-gray-100 dark:border-charcoal-border z-10 py-1"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button 
                  onClick={() => { setShowMenu(false); onEdit(dua); }}
                  aria-label="Edit Dua"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-charcoal-border flex items-center space-x-2 transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-charcoal-border"
                >
                  <Edit2 className="w-4 h-4" /> <span>Edit</span>
                </button>
                <button 
                  onClick={() => { setShowMenu(false); onDelete(dua._id); }}
                  aria-label="Delete Dua"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" /> <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="text-right">
          <p className="font-amiri text-3xl md:text-2xl lg:text-3xl leading-relaxed text-gray-900 dark:text-gray-100 break-words" dir="rtl">
            {dua.arabicText}
          </p>
        </div>
        
        {dua.transliteration && (
          <div className="bg-gray-50 dark:bg-charcoal-surface p-3 rounded-lg border border-gray-100 dark:border-charcoal-border">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
              {dua.transliteration}
            </p>
          </div>
        )}

        <div className="">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            "{dua.translation}"
          </p>
          {dua.reference && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">— {dua.reference}</p>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-charcoal-border">
        <Button 
          variant="primary" 
          className="w-full flex items-center justify-center space-x-2"
          onClick={() => onComplete(dua._id)}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Mark as Done Today</span>
        </Button>
      </div>
    </Card>
  );
};

export default DuaCard;
