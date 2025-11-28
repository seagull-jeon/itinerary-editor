
import React, { useState, useEffect } from 'react';
import { INITIAL_SCHEDULE } from './constants';
import { DaySchedule, ItineraryItem, CostDetail } from './types';
import ItineraryList from './components/ItineraryList';
import EditModal from './components/EditModal';
import LoginModal from './components/LoginModal';
import CostModal from './components/CostModal';
import GlobalCostModal from './components/GlobalCostModal';
import { Plus, Gem, CalendarDays, ArrowUpDown, Check, UserCircle, LogOut, RotateCcw, Wallet } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Helper to convert "HH:MM" to minutes
const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes to "HH:MM"
const toTimeStr = (mins: number) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [activeDayId, setActiveDayId] = useState<string>(INITIAL_SCHEDULE[0].id);
  const [currency, setCurrency] = useState<string>('JPY');
  
  // Modals & Active Items
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [costItem, setCostItem] = useState<ItineraryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isGlobalCostModalOpen, setIsGlobalCostModalOpen] = useState(false);

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'reorder'>('create');
  
  // Authorization State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Temporary storage for action pending login
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Store the state of a day before a drag operation causes a conflict, allowing revert on cancel.
  const [preDragSchedule, setPreDragSchedule] = useState<DaySchedule | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load schedule and user from LocalStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('seventeen-trip-schedule-2025');
    if (savedSchedule) {
      try {
        setSchedule(JSON.parse(savedSchedule));
      } catch (e) {
        console.error("Failed to parse schedule", e);
      }
    }

    const savedUser = localStorage.getItem('seventeen-trip-user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    const savedCurrency = localStorage.getItem('seventeen-trip-currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('seventeen-trip-schedule-2025', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('seventeen-trip-currency', currency);
  }, [currency]);

  // Handle Login Logic
  const handleLogin = (name: string) => {
    setCurrentUser(name);
    localStorage.setItem('seventeen-trip-user', name);
    setIsLoginModalOpen(false);
    
    // Execute pending action if any
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm(`Logout as ${currentUser}?`)) {
      setCurrentUser(null);
      localStorage.removeItem('seventeen-trip-user');
      setIsReorderMode(false); 
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the schedule to default? This will remove all your edits and cannot be undone.')) {
      setSchedule(JSON.parse(JSON.stringify(INITIAL_SCHEDULE)));
      localStorage.removeItem('seventeen-trip-schedule-2025');
    }
  };

  // Auth Wrapper
  const requireAuth = (callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setPendingAction(() => callback);
      setIsLoginModalOpen(true);
    }
  };

  const handleEditItem = (item: ItineraryItem) => {
    requireAuth(() => {
      setPreDragSchedule(null);
      setEditingItem(item);
      setModalMode('edit');
      setIsModalOpen(true);
    });
  };

  const handleOpenCost = (item: ItineraryItem) => {
    setCostItem(item);
    setIsCostModalOpen(true);
  };

  const handleAddNewItem = () => {
    requireAuth(() => {
      setPreDragSchedule(null);
      const newItem: ItineraryItem = {
        id: Math.random().toString(36).substr(2, 9),
        startTime: '12:00',
        endTime: '13:00',
        activity: 'New Plan',
        location: '',
        category: 'activity',
        costs: []
      };
      setEditingItem(newItem);
      setModalMode('create');
      setIsModalOpen(true);
    });
  };

  const toggleReorderMode = () => {
    requireAuth(() => {
      setIsReorderMode(!isReorderMode);
    });
  };

  const handleCloseModal = () => {
    if (preDragSchedule) {
      setSchedule(prev => prev.map(d => d.id === preDragSchedule.id ? preDragSchedule : d));
      setPreDragSchedule(null);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (itemData: ItineraryItem) => {
    const updatedItem = {
      ...itemData,
      lastEditedBy: currentUser || 'Unknown'
    };

    setSchedule(prev => prev.map(day => {
      if (day.id === activeDayId) {
        let newItems;
        const exists = day.items.find(i => i.id === updatedItem.id);
        
        if (exists) {
          newItems = day.items.map(i => i.id === updatedItem.id ? updatedItem : i);
        } else {
          newItems = [...day.items, updatedItem];
        }

        newItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

        return {
          ...day,
          items: newItems
        };
      }
      return day;
    }));
    
    setPreDragSchedule(null);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveCosts = (itemId: string, newCosts: CostDetail[]) => {
    setSchedule(prev => prev.map(day => {
         const itemExists = day.items.some(i => i.id === itemId);
         if (itemExists) {
             return {
                 ...day,
                 items: day.items.map(i => i.id === itemId ? { ...i, costs: newCosts } : i)
             }
         }
        return day;
    }));
  };

  // Allow deleting costs from global view
  const handleDeleteCostGlobal = (itemId: string, costId: string) => {
    if (!currentUser) return;
    setSchedule(prev => prev.map(day => {
      const itemExists = day.items.some(i => i.id === itemId);
      if (itemExists) {
          return {
              ...day,
              items: day.items.map(i => {
                if (i.id === itemId) {
                  return {
                    ...i,
                    costs: (i.costs || []).filter(c => c.id !== costId)
                  };
                }
                return i;
              })
          }
      }
      return day;
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.id === activeDayId) {
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId)
        };
      }
      return day;
    }));
    setPreDragSchedule(null);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const dayIndex = schedule.findIndex(d => d.id === activeDayId);
    if (dayIndex === -1) return;

    const currentDay = schedule[dayIndex];
    const items = currentDay.items;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    
    const movedItem = newItems[newIndex];
    const prevItem = newIndex > 0 ? newItems[newIndex - 1] : null;
    const nextItem = newIndex < newItems.length - 1 ? newItems[newIndex + 1] : null;

    let suggestedStart = toMinutes(movedItem.startTime);
    let suggestedEnd = toMinutes(movedItem.endTime);
    const duration = suggestedEnd - suggestedStart;

    const pEnd = prevItem ? toMinutes(prevItem.endTime || prevItem.startTime) : -1;
    const nStart = nextItem ? toMinutes(nextItem.startTime) : 99999;
    const currentStart = toMinutes(movedItem.startTime);

    if (currentStart < pEnd || currentStart > nStart) {
        let newStartMin = currentStart;
        if (currentStart < pEnd) newStartMin = pEnd;
        if (currentStart > nStart) newStartMin = Math.max(0, nStart - duration);
        
        if (pEnd > -1 && nStart < 99999 && newStartMin + duration > nStart) {
            newStartMin = pEnd; 
        }

        const newEndMin = newStartMin + duration;
        const suggestedStartTimeStr = toTimeStr(newStartMin);
        const suggestedEndTimeStr = toTimeStr(newEndMin);

        setPreDragSchedule(currentDay);

        const updatedDay = { ...currentDay, items: newItems };
        const newSchedule = [...schedule];
        newSchedule[dayIndex] = updatedDay;
        setSchedule(newSchedule);

        setTimeout(() => {
            setEditingItem({
                ...movedItem,
                startTime: suggestedStartTimeStr,
                endTime: suggestedEndTimeStr
            });
            setModalMode('reorder');
            setIsModalOpen(true);
        }, 50);

    } else {
        const updatedDay = { ...currentDay, items: newItems };
        const newSchedule = [...schedule];
        newSchedule[dayIndex] = updatedDay;
        setSchedule(newSchedule);
    }
  };

  const activeDaySchedule = schedule.find(d => d.id === activeDayId);
  
  const displayItems = activeDaySchedule ? 
    (isReorderMode ? activeDaySchedule.items : [...activeDaySchedule.items].sort((a, b) => a.startTime.localeCompare(b.startTime))) 
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-100">
      
      {/* Header */}
      <header className="bg-gradient-to-br from-svt-rose to-svt-serenity text-white pt-10 pb-6 px-4 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-start mb-4 px-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gem size={20} fill="white" className="text-white opacity-90 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase opacity-80">Seventeen Tour</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight drop-shadow-sm">
              셉셉투어 2025<br/>
              <span className="text-3xl">FUKUOKA</span>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {/* Global Cost Button */}
            <button
               onClick={() => setIsGlobalCostModalOpen(true)}
               className="p-2 text-white/70 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors mr-1"
               title="Trip Expenses"
            >
                <Wallet size={18} />
            </button>

            {currentUser ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[10px] text-white/70 uppercase font-bold">Editor</span>
                  <span className="text-xs font-bold text-white leading-none">{currentUser}</span>
                </div>
                
                <button 
                  onClick={handleReset}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Reset Schedule"
                >
                  <RotateCcw size={18} />
                </button>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-white/70 hover:text-svt-rose hover:bg-white/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>

                <div className="w-px h-6 bg-white/20 mx-1"></div>

                <button 
                    onClick={toggleReorderMode}
                    className={`transition-all p-2 rounded-lg border ${isReorderMode ? 'bg-white text-svt-serenity border-white' : 'text-white/70 border-transparent hover:bg-white/10'}`}
                    title={isReorderMode ? "Done Reordering" : "Reorder Schedule"}
                >
                    {isReorderMode ? <Check size={20} /> : <ArrowUpDown size={20} />}
                </button>
              </>
            ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 p-2 rounded-lg transition-all text-white/80 hover:text-white hover:bg-white/10"
                  title="Login to Edit"
                >
                  <span className="text-xs font-bold">Login</span>
                  <UserCircle size={24} />
                </button>
            )}
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex w-full gap-2">
          {schedule.map(day => (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border-2 ${
                activeDayId === day.id 
                  ? 'bg-white text-svt-serenity border-white shadow-lg translate-y-1' 
                  : 'bg-white/10 text-white border-transparent hover:bg-white/20'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${activeDayId === day.id ? 'text-svt-rose' : 'opacity-70'}`}>
                {day.dayLabel}
              </span>
              <span className="font-bold text-sm whitespace-nowrap leading-none mb-0.5">
                {day.dateLabel.split(' ')[0]}
              </span>
              <span className="text-[10px] opacity-80 leading-none">
                {day.dateLabel.split(' ')[1]}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
           <h2 className="text-gray-500 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <CalendarDays size={16} />
            {isReorderMode ? 'Drag to Reorder' : 'Itinerary'}
           </h2>
           <span className="text-xs bg-svt-rose/10 text-svt-rose px-2 py-1 rounded-full font-medium">
             {displayItems.length} items
           </span>
        </div>
        
        {activeDaySchedule && (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <ItineraryList 
              items={displayItems} 
              onEdit={handleEditItem}
              onOpenCost={handleOpenCost}
              isReorderMode={isReorderMode}
              dateLabel={activeDaySchedule.dateLabel}
              isReadOnly={!currentUser}
              currency={currency}
            />
          </DndContext>
        )}
      </main>

      {!isReorderMode && currentUser && (
        <div className="absolute bottom-6 right-6 z-30">
          <button
            onClick={handleAddNewItem}
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-4 shadow-xl shadow-gray-400/50 transition-transform hover:scale-110 active:scale-95 flex items-center gap-2"
          >
            <Plus size={24} />
            <span className="font-bold text-sm pr-1">Add</span>
          </button>
        </div>
      )}

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        item={editingItem}
        showDelete={modalMode === 'edit'}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => {
            setIsLoginModalOpen(false);
            setPendingAction(null);
        }}
        onLogin={handleLogin}
      />

      <CostModal
        isOpen={isCostModalOpen}
        onClose={() => {
            setIsCostModalOpen(false);
            setCostItem(null);
        }}
        item={costItem}
        onSaveCosts={handleSaveCosts}
        currentUser={currentUser}
        currency={currency}
        setCurrency={setCurrency}
      />

      <GlobalCostModal
        isOpen={isGlobalCostModalOpen}
        onClose={() => setIsGlobalCostModalOpen(false)}
        schedule={schedule}
        currency={currency}
        setCurrency={setCurrency}
        currentUser={currentUser}
        onDeleteCost={handleDeleteCostGlobal}
      />
    </div>
  );
};

export default App;
