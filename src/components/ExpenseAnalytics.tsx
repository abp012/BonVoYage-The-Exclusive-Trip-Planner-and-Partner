import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { X } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ExpenseAnalyticsProps {
  travelExpenseId: Id<"travelExpenses">;
  onClose: () => void;
}

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ travelExpenseId, onClose }) => {
  const travelExpense = useQuery(api.expenses.getTravelExpense, { expenseId: travelExpenseId });
  const dailyExpenses = useQuery(api.expenses.getDailyExpenses, { travelExpenseId });
  const analytics = useQuery(api.expenses.getExpenseAnalytics, { travelExpenseId });

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (!travelExpense || !dailyExpenses || !analytics) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }
  // Prepare data for charts
  const dailyData = Object.entries(analytics.dailyTotals)
    .map(([day, amount]) => ({
      day: `Day ${day}`,
      amount,
    }))
    .sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]));

  // Calculate essential metrics
  const averageDailySpend = analytics.totalSpent / travelExpense.totalDays;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Amount: {formatCurrency(payload[0].value, travelExpense.currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{travelExpense.tripName} - Analytics</h3>
            <p className="text-gray-600">{travelExpense.destination}</p>          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>        {/* Total Expenses Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
          <div className="text-center">
            <h4 className="text-lg font-medium text-blue-800 mb-2">Total Expenses</h4>
            <p className="text-4xl font-bold text-blue-900 mb-4">
              {formatCurrency(analytics.totalSpent, travelExpense.currency)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-600 font-medium">Trip Duration</p>
                <p className="text-blue-800">{travelExpense.totalDays} days</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Average per Day</p>
                <p className="text-blue-800">{formatCurrency(averageDailySpend, travelExpense.currency)}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Total Transactions</p>
                <p className="text-blue-800">{dailyExpenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Spending Chart - Main Focus */}
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-900 mb-6">Day-wise Expense Breakdown</h4>
          {dailyData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#6B7280' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value, travelExpense.currency)}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#6B7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    stroke="#1E40AF"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No daily expense data available</p>
                <p className="text-sm">Add daily expenses to see the breakdown chart</p>
              </div>
            </div>
          )}        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
