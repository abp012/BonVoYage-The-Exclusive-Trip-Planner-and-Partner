import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { format, addDays } from 'date-fns';
import { X, Plus, Trash2, Pencil } from 'lucide-react';

interface DailyExpenseFormProps {
  travelExpenseId: Id<"travelExpenses">;
  userId: string;
  selectedDay: number;
  tripData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DailyExpenseForm: React.FC<DailyExpenseFormProps> = ({
  travelExpenseId,
  userId,
  selectedDay,
  tripData,
  onClose,
  onSuccess,
}) => {
  const [currentDay, setCurrentDay] = useState(selectedDay);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    paymentMethod: 'cash',
    location: '',
    isPlanned: false,
    notes: '',
  });
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dailyExpenses = useQuery(api.expenses.getDailyExpenses, { travelExpenseId });
  const userCategories = useQuery(api.expenses.getUserExpenseCategories, { userId });

  const addDailyExpense = useMutation(api.expenses.addDailyExpense);
  const updateDailyExpense = useMutation(api.expenses.updateDailyExpense);
  const deleteDailyExpense = useMutation(api.expenses.deleteDailyExpense);

  const defaultCategories = [
    { name: "Accommodation", icon: "🏨", subcategories: ["Hotel", "Hostel", "Airbnb", "Resort"] },
    { name: "Food & Dining", icon: "🍽️", subcategories: ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks"] },
    { name: "Transportation", icon: "🚗", subcategories: ["Flight", "Train", "Bus", "Taxi", "Uber", "Car Rental", "Fuel"] },
    { name: "Activities", icon: "🎯", subcategories: ["Tours", "Museums", "Shows", "Sports", "Adventure"] },
    { name: "Shopping", icon: "🛍️", subcategories: ["Souvenirs", "Clothes", "Local Products", "Gifts"] },
    { name: "Miscellaneous", icon: "📋", subcategories: ["Tips", "Phone/Internet", "Insurance", "Other"] },
  ];

  const paymentMethods = ['cash', 'credit_card', 'debit_card', 'digital_wallet', 'bank_transfer'];

  const getCurrentDayDate = () => {
    return addDays(new Date(tripData.startDate), currentDay - 1);
  };

  const getCurrentDayExpenses = () => {
    return dailyExpenses?.filter(expense => expense.day === currentDay) || [];
  };

  const getDayTotal = () => {
    return getCurrentDayExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      subcategory: '',
      description: '',
      amount: '',
      paymentMethod: 'cash',
      location: '',
      isPlanned: false,
      notes: '',
    });
    setEditingExpense(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        description: formData.description,
        amount: Number(formData.amount),
        currency: tripData.currency,
        paymentMethod: formData.paymentMethod || undefined,
        location: formData.location || undefined,
        isPlanned: formData.isPlanned,
        notes: formData.notes || undefined,
      };

      if (editingExpense) {
        await updateDailyExpense({
          expenseId: editingExpense._id,
          ...expenseData,
        });
      } else {
        await addDailyExpense({
          travelExpenseId,
          userId,
          day: currentDay,
          date: format(getCurrentDayDate(), 'yyyy-MM-dd'),
          ...expenseData,
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      subcategory: expense.subcategory || '',
      description: expense.description,
      amount: expense.amount.toString(),
      paymentMethod: expense.paymentMethod || 'cash',
      location: expense.location || '',
      isPlanned: expense.isPlanned,
      notes: expense.notes || '',
    });
  };

  const handleDelete = async (expenseId: Id<"dailyExpenses">) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteDailyExpense({ expenseId });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: tripData.currency,
    }).format(amount);
  };

  const getSubcategories = (category: string) => {
    const cat = defaultCategories.find(c => c.name === category);
    return cat?.subcategories || [];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Daily Expenses - {tripData.tripName}          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Add/Edit Form */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
              <select
                value={currentDay}
                onChange={(e) => {
                  setCurrentDay(Number(e.target.value));
                  resetForm();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: tripData.totalDays }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>
                    Day {day} - {format(addDays(new Date(tripData.startDate), day - 1), 'MMM dd, yyyy')}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Day {currentDay} Total: {formatCurrency(getDayTotal())}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        category: e.target.value,
                        subcategory: '' // Reset subcategory when category changes
                      }));
                      if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {defaultCategories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={!formData.category}
                  >
                    <option value="">Select subcategory</option>
                    {formData.category && getSubcategories(formData.category).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Lunch at local restaurant"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({tripData.currency}) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, amount: e.target.value }));
                      if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                    }}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>
                        {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Times Square, NYC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPlanned"
                  checked={formData.isPlanned}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPlanned: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPlanned" className="ml-2 text-sm text-gray-700">
                  This is a planned expense (budget item)
                </label>
              </div>

              {errors.submit && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                {editingExpense && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Panel - Day's Expenses */}
          <div>
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h4 className="text-lg font-semibold text-gray-900">
                  Day {currentDay} Expenses
                </h4>
                <p className="text-sm text-gray-600">
                  {format(getCurrentDayDate(), 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              <div className="p-4">
                {getCurrentDayExpenses().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No expenses added for this day</p>
                    <p className="text-sm">Start by adding your first expense</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getCurrentDayExpenses().map((expense) => (
                      <div key={expense._id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-blue-600">
                                {expense.category}
                              </span>
                              {expense.subcategory && (
                                <span className="text-xs text-gray-500">
                                  • {expense.subcategory}
                                </span>
                              )}
                              {expense.isPlanned && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Planned
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium">{expense.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className="font-semibold text-lg text-gray-900">
                                {formatCurrency(expense.amount)}
                              </span>
                              {expense.paymentMethod && (
                                <span>
                                  {expense.paymentMethod.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </span>
                              )}
                              {expense.location && (
                                <span>📍 {expense.location}</span>
                              )}
                            </div>
                            {expense.notes && (
                              <p className="text-sm text-gray-600 mt-1">{expense.notes}</p>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-4">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="p-1 text-gray-400 hover:text-blue-600"                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyExpenseForm;
