import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { format, addDays } from 'date-fns';
import {
  Plus,
  DollarSign,
  Calendar,
  MapPin,
  BarChart3,
  Pencil,
  Trash2,
  Eye,
  Save,
  IndianRupee,
  Info,
} from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import DailyExpenseForm from '../components/DailyExpenseForm';
import ExpenseAnalytics from '../components/ExpenseAnalytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const MyTravelExpenses: React.FC = () => {
  const { userId } = useAuth();
  const [selectedExpense, setSelectedExpense] = useState<Id<"travelExpenses"> | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDailyForm, setShowDailyForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // New form states
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    days: 1,
    dailyExpenses: [] as { day: number; amount: number; date: string }[]
  });

  const travelExpenses = useQuery(api.expenses.getUserTravelExpenses, 
    userId ? { userId } : "skip"
  );
  
  const selectedExpenseData = useQuery(api.expenses.getTravelExpense,
    selectedExpense ? { expenseId: selectedExpense } : "skip"
  );
  
  const dailyExpenses = useQuery(api.expenses.getDailyExpenses,
    selectedExpense ? { travelExpenseId: selectedExpense } : "skip"
  );

  // Get user trip history for auto-fetch functionality
  const tripHistory = useQuery(api.users.getUserTripHistory,
    userId ? { clerkId: userId, limit: 1 } : "skip"
  );

  const deleteTravelExpense = useMutation(api.expenses.deleteTravelExpense);
  const initializeCategories = useMutation(api.expenses.initializeDefaultCategories);
  const createTravelExpense = useMutation(api.expenses.createTravelExpense);
  const addDailyExpense = useMutation(api.expenses.addDailyExpense);

  // Initialize default categories on first load
  useEffect(() => {
    if (userId && travelExpenses && travelExpenses.length === 0) {
      initializeCategories({ userId });
    }
  }, [userId, travelExpenses, initializeCategories]);

  // Auto-fetch recent trip data when component mounts
  useEffect(() => {
    if (tripHistory && tripHistory.length > 0) {
      const recentTrip = tripHistory[0];
      
      // Set auto-fetched data with fallback values
      const destination = recentTrip.destination || 'My Trip';
      const startDate = recentTrip.startDate || new Date().toISOString().split('T')[0];
      const days = recentTrip.days || 1;
      
      setFormData(prev => ({
        ...prev,
        destination: destination,
        startDate: startDate,
        days: days
      }));
    } else {
      // Fallback when no trip history is available
      const today = new Date();
      setFormData(prev => ({
        ...prev,
        destination: 'My Trip',
        startDate: today.toISOString().split('T')[0],
        days: 1
      }));
    }
  }, [tripHistory]);

  // Update daily expenses array when days or start date changes
  useEffect(() => {
    if (formData.startDate && formData.days > 0) {
      const newDailyExpenses = [];
      for (let i = 0; i < formData.days; i++) {
        const date = new Date(formData.startDate);
        date.setDate(date.getDate() + i);
        const existingExpense = formData.dailyExpenses.find(exp => exp.day === i + 1);
        newDailyExpenses.push({
          day: i + 1,
          amount: existingExpense?.amount || 0,
          date: date.toISOString().split('T')[0]
        });
      }
      setFormData(prev => ({ ...prev, dailyExpenses: newDailyExpenses }));
    }
  }, [formData.startDate, formData.days]);

  const handleDeleteExpense = async (expenseId: Id<"travelExpenses">) => {
    if (window.confirm('Are you sure you want to delete this travel expense? All daily expenses will also be deleted.')) {
      await deleteTravelExpense({ expenseId });
      if (selectedExpense === expenseId) {
        setSelectedExpense(null);
      }
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDateSafely = (dateString: string, formatString: string = 'MMM dd, yyyy') => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, formatString);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const handleDailyExpenseChange = (day: number, amount: number) => {
    setFormData(prev => ({
      ...prev,
      dailyExpenses: prev.dailyExpenses.map(exp => 
        exp.day === day ? { ...exp, amount } : exp
      )
    }));
  };
  // Check if a travel expense already exists for the same destination and start date
  const checkForDuplicateExpense = (destination: string, startDate: string): boolean => {
    if (!travelExpenses || travelExpenses.length === 0) return false;
    
    return travelExpenses.some(expense => 
      expense.destination.toLowerCase().trim() === destination.toLowerCase().trim() &&
      expense.startDate === startDate
    );
  };

  // Check if all daily expenses are filled with valid amounts
  const areAllDailyExpensesFilled = (): boolean => {
    return formData.dailyExpenses.every(expense => expense.amount > 0);
  };
  const handleSubmitNewExpense = async () => {
    if (!userId || !formData.destination || !formData.startDate || formData.days < 1) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if all daily expenses are filled
    if (!areAllDailyExpensesFilled()) {
      alert('Please fill in expense amounts for all days');
      return;
    }

    // Check for duplicate expense
    if (checkForDuplicateExpense(formData.destination, formData.startDate)) {
      alert(`A travel expense for "${formData.destination}" starting on ${formatDateSafely(formData.startDate)} already exists. You can only submit expenses once for the same destination and start date.`);
      return;
    }

    try {
      const endDate = new Date(formData.startDate);
      endDate.setDate(endDate.getDate() + formData.days - 1);

      const totalBudget = formData.dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Create travel expense
      const travelExpenseId = await createTravelExpense({
        userId,
        tripName: `Trip to ${formData.destination}`,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        totalDays: formData.days,
        currency: 'INR',
        totalBudget,
      });

      // Add daily expenses
      for (const dailyExp of formData.dailyExpenses) {
        if (dailyExp.amount > 0) {
          await addDailyExpense({
            travelExpenseId,
            userId,
            day: dailyExp.day,
            date: dailyExp.date,
            category: 'miscellaneous',
            description: `Day ${dailyExp.day} expenses`,
            amount: dailyExp.amount,
            currency: 'INR',
            isPlanned: true,
          });
        }
      }

      // Reset form
      setFormData({
        destination: '',
        startDate: '',
        days: 1,
        dailyExpenses: []
      });

      alert('Travel expense created successfully!');
    } catch (error) {
      console.error('Error creating travel expense:', error);
      alert('Failed to create travel expense. Please try again.');
    }
  };
  const getTotalBudget = () => {
    return formData.dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your travel expenses</h2>
        </div>
      </div>
    );
  }

  if (travelExpenses === undefined) {
    return <LoadingSpinner />;
  }  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Section 1: Recent Travel Expenses */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                Recent Travel Expenses
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {travelExpenses.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No travel expenses yet</p>
                    <p className="text-sm">Create your first trip expense using the form on the right</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {travelExpenses.slice(0, 10).map((expense) => (
                      <div
                        key={expense._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{expense.tripName}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{expense.destination}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDateSafely(expense.startDate, 'MMM dd')} - {formatDateSafely(expense.endDate, 'MMM dd, yyyy')}</span>
                        </div>                        <div className="flex justify-center">
                          <div className="text-center">
                            <p className="text-gray-600 text-sm">Total Expenses</p>
                            <p className="font-semibold text-lg text-blue-600">{formatCurrency(expense.totalSpent)}</p>
                          </div>
                        </div>                        <div className="flex justify-between items-center mt-4 pt-3 border-t">
                          <span className="text-xs text-gray-500">{expense.totalDays} days</span>
                          <div className="flex space-x-2">
                            {/* Edit expense button hidden as requested */}
                            {/* <button
                              onClick={() => handleEditExpense(expense)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit expense"
                            >
                              <Pencil className="h-4 w-4" />
                            </button> */}
                            <button
                              onClick={() => setSelectedExpense(expense._id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete expense"
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

          {/* Section 2: New Expense Form */}
          <div className="space-y-6">            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Plus className="h-6 w-6 mr-2 text-green-600" />
                Save your Travel expenses
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">                <div className="space-y-6">
                  {/* Auto-fetch Information Panel */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" style={{ display: 'none' }}>
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>                        <h4 className="text-sm font-medium text-blue-900 mb-1">Trip Details Auto-Loaded</h4>
                        <p className="text-sm text-blue-700">
                          {tripHistory && tripHistory.length > 0 && formData.startDate ? (
                            <>Destination: <span className="font-medium">{formData.destination}</span> | 
                            Start Date: <span className="font-medium">{formatDateSafely(formData.startDate)}</span> | 
                            Duration: <span className="font-medium">{formData.days} {formData.days === 1 ? 'day' : 'days'}</span></>
                          ) : formData.startDate ? (
                            <>Destination: <span className="font-medium">{formData.destination}</span> | 
                            Start Date: <span className="font-medium">{formatDateSafely(formData.startDate)}</span> | 
                            Duration: <span className="font-medium">{formData.days} {formData.days === 1 ? 'day' : 'days'}</span></>
                          ) : (
                            'Loading trip details...'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hidden form fields - kept for state management and database submission */}
                  <div style={{ display: 'none' }}>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <input
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  {/* Daily Expenses Section */}
                  {formData.startDate && formData.days > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Daily Expenses</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          Total: <span className="font-semibold ml-1">{formatCurrency(getTotalBudget())}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">                        {formData.dailyExpenses.map((dailyExp) => {
                          return (                            <div key={dailyExp.day} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-900">
                                  Day {dailyExp.day}
                                  <span className="text-red-500 ml-1">*</span>
                                </h4>
                                <span className="text-sm text-gray-600">
                                  {formatDateSafely(dailyExp.date, 'MMM dd')}
                                </span>
                              </div><div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={dailyExp.amount || ''}
                                  onChange={(e) => handleDailyExpenseChange(dailyExp.day, parseFloat(e.target.value) || 0)}
                                  placeholder="Enter amount"
                                  required
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}                  {/* Submit Button */}                  <div className="pt-4 border-t">
                    <button
                      onClick={handleSubmitNewExpense}
                      disabled={!formData.destination || !formData.startDate || formData.days < 1 || !areAllDailyExpensesFilled()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Details Modal/Panel */}
        {selectedExpense && selectedExpenseData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedExpenseData.tripName}</h2>
                    <p className="text-gray-600">{selectedExpenseData.destination}</p>
                  </div>
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
                <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <p className="text-sm text-blue-600 font-medium">Total Expenses</p>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatCurrency(selectedExpenseData.totalSpent)}
                    </p>
                  </div>
                </div>                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAnalytics(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </button>
                  </div>
                </div><div className="text-sm text-gray-600">
                  <p><strong>Duration:</strong> {formatDateSafely(selectedExpenseData.startDate, 'MMM dd')} - {formatDateSafely(selectedExpenseData.endDate, 'MMM dd, yyyy')} ({selectedExpenseData.totalDays} days)</p>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedExpenseData.status)}`}>{selectedExpenseData.status}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm
          userId={userId}
          expense={editingExpense}
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }}
          onSuccess={(expenseId) => {
            setShowExpenseForm(false);
            setEditingExpense(null);
            setSelectedExpense(expenseId);
          }}
        />
      )}

      {showDailyForm && selectedExpense && selectedExpenseData && (
        <DailyExpenseForm
          travelExpenseId={selectedExpense}
          userId={userId}
          selectedDay={selectedDay}
          tripData={selectedExpenseData}
          onClose={() => {
            setShowDailyForm(false);
            setSelectedDay(1);
          }}
          onSuccess={() => {
            setShowDailyForm(false);
            setSelectedDay(1);
          }}
        />
      )}

      {showAnalytics && selectedExpense && (
        <ExpenseAnalytics
          travelExpenseId={selectedExpense}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};

export default MyTravelExpenses;
