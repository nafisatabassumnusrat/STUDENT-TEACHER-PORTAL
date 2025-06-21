import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BudgetEntry } from '../../types';
import { Plus, DollarSign, TrendingUp, FileText, Wallet } from 'lucide-react';

const StudentBudgetTracker: React.FC = () => {
  const { user } = useAuth();
  const [budgetEntries, setBudgetEntries] = useLocalStorage<BudgetEntry[]>('budgetEntries', []);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    studentRoll: user?.rollNumber || '',
    category: 'transport' as 'tuition' | 'transport' | 'food' | 'personal' | 'fees',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const isTeacher = user?.role === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: BudgetEntry = {
      id: Date.now().toString(),
      studentRoll: formData.studentRoll,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      date: new Date(formData.date),
      addedBy: user?.name || 'Unknown'
    };

    setBudgetEntries([...budgetEntries, newEntry]);
    setFormData({
      studentRoll: user?.rollNumber || '',
      category: 'transport',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const getMonthlyExpenses = (month: string, rollNumber?: string) => {
    return budgetEntries.filter(entry => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return entryMonth === month && (!rollNumber || entry.studentRoll === rollNumber);
    });
  };

  const getCategoryTotal = (entries: BudgetEntry[], category: string) => {
    return entries
      .filter(entry => entry.category === category)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const getTotalExpenses = (entries: BudgetEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const currentMonthEntries = getMonthlyExpenses(
    selectedMonth, 
    isTeacher ? undefined : user?.rollNumber
  );

  const categories = [
    { id: 'tuition', name: 'Tuition & Fees', icon: '🎓', teacherOnly: true },
    { id: 'transport', name: 'Transport', icon: '🚌', teacherOnly: false },
    { id: 'food', name: 'Food', icon: '🍽️', teacherOnly: false },
    { id: 'personal', name: 'Personal', icon: '🛍️', teacherOnly: false },
    { id: 'fees', name: 'School Fees', icon: '🏫', teacherOnly: true }
  ];

  const availableCategories = categories.filter(cat => isTeacher || !cat.teacherOnly);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Budget Tracker</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Manage student expenses and fees' : 'Track your monthly expenses'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Expense Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Roll</label>
                  <input
                    type="text"
                    value={formData.studentRoll}
                    onChange={(e) => setFormData({ ...formData, studentRoll: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Bus fare, Lunch, Private tuition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="flex-1" />
          <div className="text-sm text-gray-600">
            Total Entries: {currentMonthEntries.length}
          </div>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map(category => {
          const total = getCategoryTotal(currentMonthEntries, category.id);
          const hasPermission = isTeacher || !category.teacherOnly;
          
          if (!hasPermission && total === 0) return null;
          
          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{category.icon}</span>
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-2xl font-bold text-orange-600">৳{total.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Invoice */}
      {currentMonthEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span>Monthly Invoice - {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-orange-600">৳{getTotalExpenses(currentMonthEntries).toLocaleString()}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  {isTeacher && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentMonthEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => {
                    const category = categories.find(c => c.id === entry.category);
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span className="flex items-center space-x-2">
                            <span>{category?.icon}</span>
                            <span>{category?.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-orange-600">
                          ৳{entry.amount.toLocaleString()}
                        </td>
                        {isTeacher && (
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {entry.studentRoll}
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={isTeacher ? 4 : 3} className="px-4 py-3  text-sm font-medium text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-600">
                    ৳{getTotalExpenses(currentMonthEntries).toLocaleString()}
                  </td>
                  {isTeacher && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentMonthEntries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No expenses recorded for this month</p>
          <p className="text-sm">Add expense entries to track your budget</p>
        </div>
      )}

      {/* Budget Summary */}
      {budgetEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span>Budget Overview</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{budgetEntries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ৳{getTotalExpenses(budgetEntries).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Expenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ৳{Math.round(getTotalExpenses(budgetEntries) / Math.max(1, new Set(budgetEntries.map(e => e.date.toISOString().slice(0, 7))).size)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Avg Monthly</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBudgetTracker;