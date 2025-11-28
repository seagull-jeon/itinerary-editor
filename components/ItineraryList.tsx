
import React from 'react';
import { MapPin, Clock, Edit3, Plane, Coffee, Music, ShoppingBag, Utensils, Camera, GripVertical, DollarSign } from 'lucide-react';
import { ItineraryItem } from '../types';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItineraryListProps {
  items: ItineraryItem[];
  onEdit: (item: ItineraryItem) => void;
  onOpenCost: (item: ItineraryItem) => void;
  isReorderMode: boolean;
  dateLabel?: string;
  isReadOnly?: boolean;
  currency: string;
}

const getCategoryIcon = (category: string = 'activity') => {
  switch (category) {
    case 'transport': return <Plane size={16} className="text-gray-500" />;
    case 'food': return <Utensils size={16} className="text-orange-500" />;
    case 'shopping': return <ShoppingBag size={16} className="text-pink-500" />;
    case 'concert': return <Music size={16} className="text-svt-serenity" />;
    case 'activity': 
    default: return <Camera size={16} className="text-emerald-500" />;
  }
};

const getCategoryColor = (category: string = 'activity') => {
  switch (category) {
    case 'transport': return 'border-l-gray-300';
    case 'food': return 'border-l-orange-300';
    case 'shopping': return 'border-l-pink-300';
    case 'concert': return 'border-l-svt-serenity';
    case 'activity': 
    default: return 'border-l-emerald-300';
  }
};

const getCurrencySymbol = (curr: string) => {
  switch (curr) {
    case 'JPY': return '¥';
    case 'TWD': return 'NT$';
    case 'USD': return '$';
    case 'KRW': return '₩';
    default: return '$';
  }
};

const isItemPast = (item: ItineraryItem, dateLabel: string) => {
  if (!dateLabel) return false;
  const now = new Date();
  const year = 2025; // Fixed year based on App Title
  const [dateStr] = dateLabel.split(' ');
  const [month, day] = dateStr.split('/').map(Number);
  
  // Use endTime if available, otherwise startTime
  const timeStr = item.endTime || item.startTime;
  if (!timeStr) return false;
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const itemDate = new Date(year, month - 1, day, hours, minutes);
  
  return now > itemDate;
};

interface SortableItemProps {
  item: ItineraryItem;
  onEdit: (item: ItineraryItem) => void;
  onOpenCost: (item: ItineraryItem) => void;
  isReorderMode: boolean;
  isPast: boolean;
  isReadOnly?: boolean;
  currencySymbol: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, onEdit, onOpenCost, isReorderMode, isPast, isReadOnly, currencySymbol }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled: !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const totalCost = (item.costs || []).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 transition-all hover:shadow-md border-l-4 ${getCategoryColor(item.category)} ${isReorderMode ? 'cursor-move' : ''} ${isPast ? 'grayscale opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      {isReorderMode && (
         <div {...attributes} {...listeners} className="flex items-center justify-center text-gray-300 cursor-grab active:cursor-grabbing px-1 -ml-2">
            <GripVertical size={20} />
         </div>
      )}

      {/* Time Column */}
      <div className="flex flex-col items-center min-w-[60px] pt-1">
        <span className="text-lg font-bold text-gray-700 leading-none">{item.startTime}</span>
        {item.endTime && (
          <span className="text-xs text-gray-400 mt-1 font-medium">{item.endTime}</span>
        )}
        {!isReorderMode && (
          <div className="mt-3 p-1.5 bg-gray-50 rounded-full">
             {getCategoryIcon(item.category)}
          </div>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0 flex flex-col h-full justify-center py-1">
        <h4 className="text-gray-800 font-bold text-lg leading-tight mb-1 line-clamp-2" title={item.activity}>
          {item.activity}
        </h4>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {item.location && !isReorderMode && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-svt-serenity hover:text-blue-600 transition-colors bg-blue-50 px-2 py-1 rounded-md"
            >
              <span className="text-base">📍</span>
              <span className="underline decoration-dotted underline-offset-2 truncate font-medium max-w-[120px]">
                {item.location}
              </span>
            </a>
          )}
          
          {/* Cost Indicator Badge if costs exist */}
          {totalCost > 0 && !isReorderMode && (
             <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                <DollarSign size={10} />
                {currencySymbol}{totalCost.toLocaleString()}
             </span>
          )}
        </div>
      </div>

      {/* Action Column */}
      <div className="flex flex-col items-end justify-between min-w-[40px] pl-2 self-stretch py-1">
        <div className="flex flex-col gap-2 items-end">
          {!isReorderMode && !isReadOnly && (
              <>
                  <button 
                  onClick={() => onEdit(item)}
                  className="p-2 text-gray-300 hover:text-svt-rose hover:bg-rose-50 rounded-full transition-all"
                  aria-label="Edit item"
                  >
                  <Edit3 size={18} />
                  </button>
                  <button 
                  onClick={() => onOpenCost(item)}
                  className="p-2 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all"
                  aria-label="Cost details"
                  >
                  <DollarSign size={18} />
                  </button>
              </>
          )}
          {!isReorderMode && isReadOnly && totalCost > 0 && (
              <button 
                  onClick={() => onOpenCost(item)}
                  className="p-2 text-emerald-400 hover:bg-emerald-50 rounded-full transition-all"
                  aria-label="View Cost details"
              >
                  <DollarSign size={18} />
              </button>
          )}
        </div>

        {/* Edited By Text - Aligned to bottom right */}
        {item.lastEditedBy && !isReorderMode && (
          <div className="text-[9px] text-gray-300 font-light italic text-right whitespace-nowrap mt-auto pt-2">
            Edited by {item.lastEditedBy}
          </div>
        )}
      </div>
    </div>
  );
};

const ItineraryList: React.FC<ItineraryListProps> = ({ items, onEdit, onOpenCost, isReorderMode, dateLabel, isReadOnly, currency }) => {
  const currencySymbol = getCurrencySymbol(currency);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Coffee size={48} className="mb-4 opacity-20" />
        <p>No plans for this day yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem 
            key={item.id} 
            item={item} 
            onEdit={onEdit} 
            onOpenCost={onOpenCost}
            isReorderMode={isReorderMode}
            isPast={!isReorderMode && !!dateLabel && isItemPast(item, dateLabel)}
            isReadOnly={isReadOnly}
            currencySymbol={currencySymbol}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default ItineraryList;
