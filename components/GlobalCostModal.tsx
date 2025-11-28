
import React, { useState } from 'react';
import { X, DollarSign, Wallet, Calculator, Trash2, ArrowRightLeft } from 'lucide-react';
import { DaySchedule } from '../types';

interface GlobalCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: DaySchedule[];
  currency: string;
  setCurrency: (curr: string) => void;
  currentUser: string | null;
  onDeleteCost: (itemId: string, costId: string) => void;
}

const GlobalCostModal: React.FC<GlobalCostModalProps> = ({ 
  isOpen, 
  onClose, 
  schedule, 
  currency, 
  setCurrency,
  currentUser,
  onDeleteCost
}) => {
  const [showSumByPayer, setShowSumByPayer] = useState(false);

  if (!isOpen) return null;

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

  // Flatten costs
  const allCosts = schedule.flatMap(day => 
    day.items.flatMap(item => 
      (item.costs || []).map(cost => ({
        ...cost,
        dayLabel: day.dayLabel,
        activityName: item.activity,
        itemId: item.id
      }))
    )
  );

  const totalCost = allCosts.reduce((sum, cost) => sum + cost.amount, 0);

  // Calculate sum by payer
  const payerTotals = allCosts.reduce((acc, cost) => {
    const payer = cost.payer || 'Unknown';
    acc[payer] = (acc[payer] || 0) + cost.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header: App Theme Gradient */}
        <div className="bg-gradient-to-r from-svt-rose to-svt-serenity p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Wallet size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-lg">Trip Expenses</h3>
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

        {/* Summary Section: Green Theme for Money */}
        <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-emerald-600/70 font-bold text-xs uppercase tracking-wider mb-1">Total Spent</span>
              <span className="text-3xl font-bold text-emerald-600 tracking-tight">{currencySymbol}{totalCost.toLocaleString()}</span>
            </div>
            <button
                onClick={() => setShowSumByPayer(!showSumByPayer)}
                className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
                    showSumByPayer 
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                }`}
                title="Sum by Payer"
            >
                <Calculator size={18} />
                <span className="text-xs font-bold">Sum</span>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
            {showSumByPayer ? (
                <div className="space-y-4 animate-in slide-in-from-right duration-200">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 pl-1">Cost Breakdown by Payer</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(payerTotals).map(([payer, amount]) => (
                            <div key={payer} className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase shadow-inner">
                                        {payer.charAt(0)}
                                    </div>
                                    <span className="font-bold text-gray-700 text-lg">{payer}</span>
                                </div>
                                <span className="font-bold text-xl text-emerald-600">{currencySymbol}{amount.toLocaleString()}</span>
                            </div>
                        ))}
                         {Object.keys(payerTotals).length === 0 && (
                             <p className="text-center text-gray-400 text-sm py-8 bg-white rounded-xl border border-dashed border-gray-200">No data to calculate.</p>
                         )}
                    </div>
                </div>
            ) : (
                <>
                {allCosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-300">
                    <DollarSign size={64} className="mx-auto mb-3 opacity-10" />
                    <p className="text-sm font-medium">No expenses recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Item / Day</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Payer</th>
                                {currentUser && <th className="px-2 py-3 w-8"></th>}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {allCosts.map((cost) => (
                                <tr key={cost.id} className="group hover:bg-emerald-50/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-700">{cost.item}</div>
                                    <div className="text-[10px] text-gray-400 truncate max-w-[150px] flex items-center gap-1 mt-0.5">
                                        <span className="bg-gray-100 px-1 rounded">{cost.dayLabel}</span>
                                        <span>{cost.activityName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600">
                                    {currencySymbol}{cost.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md border border-gray-200">
                                        {cost.payer}
                                    </span>
                                </td>
                                {currentUser && (
                                    <td className="px-2 py-3 text-center">
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('Delete this expense?')) {
                                                    onDeleteCost(cost.itemId, cost.id);
                                                }
                                            }}
                                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCostModal;
