
import React, { useState, useEffect } from 'react';
import { X, Plus, DollarSign, Trash2, ArrowRightLeft } from 'lucide-react';
import { ItineraryItem, CostDetail } from '../types';

interface CostModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItem | null;
  onSaveCosts: (itemId: string, costs: CostDetail[]) => void;
  currentUser: string | null;
  currency: string;
  setCurrency: (curr: string) => void;
}

const CostModal: React.FC<CostModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  onSaveCosts, 
  currentUser,
  currency,
  setCurrency
}) => {
  const [costs, setCosts] = useState<CostDetail[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPayer, setNewPayer] = useState('');

  useEffect(() => {
    if (item) {
      setCosts(item.costs || []);
      setNewItem('');
      setNewAmount('');
      setNewPayer(currentUser || '');
    }
  }, [item, currentUser, isOpen]);

  if (!isOpen || !item) return null;

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'JPY': return '¥';
      case 'TWD': return 'NT$';
      case 'USD': return '$';
      case 'KRW': return '₩';
      default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(currency);
  const currencies = ['JPY', 'TWD', 'USD', 'KRW'];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !newAmount || !newPayer) return;

    const newCost: CostDetail = {
      id: Math.random().toString(36).substr(2, 9),
      item: newItem,
      amount: parseFloat(newAmount),
      payer: newPayer
    };

    const updatedCosts = [...costs, newCost];
    setCosts(updatedCosts);
    onSaveCosts(item.id, updatedCosts);
    
    setNewItem('');
    setNewAmount('');
  };

  const handleDeleteCost = (costId: string) => {
    const updatedCosts = costs.filter(c => c.id !== costId);
    setCosts(updatedCosts);
    onSaveCosts(item.id, updatedCosts);
  };

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <DollarSign size={20} />
            <div>
              <h3 className="font-bold text-lg leading-none">Cost Tracker</h3>
              <p className="text-[10px] opacity-80 leading-none mt-1">{item.activity}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-white/20 hover:bg-white/30 rounded-lg px-2 py-1 transition-colors border border-white/10 group">
                <ArrowRightLeft size={12} className="text-white mr-1.5 pointer-events-none opacity-80" />
                <select
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="appearance-none bg-transparent text-white text-xs font-mono font-bold outline-none cursor-pointer border-none p-0 focus:ring-0 w-10 text-center"
                    title="Change Currency"
                >
                    {currencies.map(curr => (
                        <option key={curr} value={curr} className="text-gray-800 bg-white">
                            {curr}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* List of Costs */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex justify-between">
              <span>Expenses</span>
              <span>Total: {currencySymbol}{totalCost.toLocaleString()}</span>
            </h4>
            
            {costs.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                No expenses recorded yet.
              </div>
            ) : (
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-right">Cost</th>
                      <th className="px-3 py-2 text-center">Payer</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {costs.map(cost => (
                      <tr key={cost.id} className="bg-white">
                        <td className="px-3 py-3 font-medium text-gray-800">{cost.item}</td>
                        <td className="px-3 py-3 text-right font-mono text-gray-600">{currencySymbol}{cost.amount.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {cost.payer}
                            </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button 
                            onClick={() => handleDeleteCost(cost.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add New Cost Form */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Add New Expense</h4>
            <form onSubmit={handleAddCost} className="space-y-3">
              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <input
                  type="text"
                  placeholder="Item (e.g., Lunch)"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <input
                  type="text"
                  placeholder="Payer (e.g., Mike)"
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostModal;
