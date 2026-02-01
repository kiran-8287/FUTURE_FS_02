import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Analytics: React.FC = () => {
  const { leads, getLeadStats } = useLeads();
  const stats = getLeadStats();

  // Data preparation for Status Pie Chart
  const statusData = [
    { name: 'New', value: stats.new, color: '#3B82F6' },
    { name: 'Contacted', value: stats.contacted, color: '#F59E0B' },
    { name: 'Converted', value: stats.converted, color: '#10B981' },
    { name: 'Lost', value: stats.lost, color: '#9CA3AF' },
  ].filter(d => d.value > 0);

  // Data preparation for Value by Source Bar Chart
  const valueBySource = leads.reduce((acc: any[], lead) => {
    const existing = acc.find(item => item.name === lead.source);
    if (existing) {
      existing.value += (lead.value || 0);
    } else {
      acc.push({ name: lead.source, value: (lead.value || 0) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue/Value by Source */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Potential Revenue by Source</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={valueBySource}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Summary Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.value.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Deal Size</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.total > 0 ? (stats.value / stats.total).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};