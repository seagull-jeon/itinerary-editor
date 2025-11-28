
import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { ItineraryItem } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ItineraryItem) => void;
  onDelete: (id: string) => void;
  item: ItineraryItem | null;
  showDelete: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, onDelete, item, showDelete }) => {
  const [formData, setFormData] = useState<ItineraryItem>({
    id: '',
    startTime: '',
    endTime: '',
    activity: '',
    location: '',
    category: 'activity'
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
      setHasChanges(false);
    }
  }, [item]);

  // Check for changes whenever formData updates
  useEffect(() => {
    if (item) {
      const isChanged = 
        formData.startTime !== item.startTime ||
        formData.endTime !== item.endTime ||
        formData.activity !== item.activity ||
        formData.location !== item.location ||
        formData.category !== item.category;
      setHasChanges(isChanged);
    }
  }, [formData, item]);

  if (!isOpen || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasChanges) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gradient-to-r from-svt-rose to-svt-serenity p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Edit Schedule</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-svt-serenity focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-svt-serenity focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Activity</label>
            <input
              type="text"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              placeholder="What are you doing?"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-svt-serenity focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Searchable place name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-svt-serenity focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-svt-serenity focus:border-transparent outline-none transition-all"
            >
              <option value="activity">Activity 🎡</option>
              <option value="food">Food & Drink 🍜</option>
              <option value="shopping">Shopping 🛍️</option>
              <option value="transport">Transport ✈️</option>
              <option value="concert">Concert 💎</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            {showDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    onDelete(formData.id);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 p-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors bg-white border border-red-100"
              >
                <Trash2 size={18} />
                Delete
              </button>
            ) : (
                <div className="flex-1"></div>
            )}
            
            <button
              type="submit"
              disabled={!hasChanges}
              className={`flex-2 grow flex items-center justify-center gap-2 p-3 text-white font-bold rounded-xl shadow-lg transition-all ${
                hasChanges 
                  ? 'bg-svt-serenity hover:opacity-90' 
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
