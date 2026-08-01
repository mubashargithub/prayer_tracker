import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AddEditDuaModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    arabicText: '',
    transliteration: '',
    translation: '',
    category: 'General',
    reference: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        arabicText: '',
        transliteration: '',
        translation: '',
        category: 'General',
        reference: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const categories = ['General', 'Morning', 'Evening', 'After Prayer', 'Travel', 'Hardship'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Dua" : "Add New Dua"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Dua for Forgiveness"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Arabic Text</label>
          <textarea
            name="arabicText"
            value={formData.arabicText}
            onChange={handleChange}
            dir="rtl"
            placeholder="Paste Arabic text here..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow font-amiri text-2xl"
            rows={3}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Supports copy-pasting directly from Arabic sources.</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transliteration (Optional)</label>
          <textarea
            name="transliteration"
            value={formData.transliteration}
            onChange={handleChange}
            placeholder="e.g., Astaghfirullah"
            className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
            rows={2}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Translation</label>
          <textarea
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            placeholder="e.g., I seek forgiveness from Allah."
            className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <Input
            label="Reference (Optional)"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="e.g., Quran 2:201"
          />
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit">{initialData ? 'Save Changes' : 'Add Dua'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditDuaModal;
