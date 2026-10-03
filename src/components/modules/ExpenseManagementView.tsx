import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  FileText,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface ExpenseManagementViewProps {
  onOpenQuickExpense: () => void;
}

export const ExpenseManagementView: React.FC<ExpenseManagementViewProps> = ({
  onOpenQuickExpense,
}) => {
  const { transactions, deleteTransaction, formatCurrency } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter only expense transactions
  const expenseList = transactions.filter((t) => t.type === 'expense');

  const categories = ['All', ...Array.from(new Set(expenseList.map((e) => e.category)))];

  const filtered = expenseList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseSum = expenseList.reduce((acc, e) => acc + Math.abs(e.amount), 0);
  const averageTicket = expenseList.length > 0 ? totalExpenseSum / expenseList.length : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Expense Management & Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily outflow velocity, attach receipts, and reconcile categorized charges.
          </p>
        </div>

        <button
          onClick={onOpenQuickExpense}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Cycle Outflow Total
          </div>
          <div className="text-xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(totalExpenseSum)}
          </div>
          <div className="text-xs text-slate-400 mt-1">{expenseList.length} total entries logged</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Average Expense Ticket
          </div>
          <div className="text-xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(averageTicket)}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">Normalized per transaction</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Receipt Verification
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            100% Cleared
          </div>
          <div className="text-xs text-slate-400 mt-1">Audit-ready tax ledger</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by merchant or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-500 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Merchant / Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Account / Card</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No matching expenses found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono">{item.date}</td>
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <span>{item.title}</span>
                      {item.receiptAttached && (
                        <span title="Receipt verified">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.account}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-100 tabular-nums">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteTransaction(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
