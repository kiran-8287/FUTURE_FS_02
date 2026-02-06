import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, FunnelChart, Funnel, LabelList } from 'recharts';
import { format, parseISO, isValid } from 'date-fns';
import { Printer } from 'lucide-react';
import { Button } from '../components/ui/Button';

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

  // Data preparation for Conversion Funnel
  // Logic: 
  // 1. Total (All valid leads)
  // 2. Engaged (Contacted + Converted)
  // 3. Won (Converted only)
  const funnelData = [
    {
      value: stats.total,
      name: 'Total Leads',
      fill: '#3B82F6',
    },
    {
      value: stats.contacted + stats.converted,
      name: 'Engaged',
      fill: '#F59E0B',
    },
    {
      value: stats.converted,
      name: 'Won',
      fill: '#10B981',
    },
  ];

  // Data preparation for Leads Growth (Line Chart)
  const leadsOverTime = React.useMemo(() => {
    const dates: Record<string, number> = {};

    // 1. Group by date
    leads.forEach(lead => {
      // Handle various date formats potentially
      let dateStr = '';
      try {
        const date = new Date(lead.dateAdded);
        if (isValid(date)) {
          dateStr = format(date, 'yyyy-MM-dd');
        }
      } catch (e) { console.warn('Invalid date', lead.dateAdded); }

      if (dateStr) {
        dates[dateStr] = (dates[dateStr] || 0) + 1;
      }
    });

    // 2. Convert to array and sort
    return Object.entries(dates)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      // Optional: limit to last 30 entries if too many
      .slice(-30);
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <Button onClick={() => window.print()} variant="secondary">
          <Printer size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

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

        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Conversion Funnel</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Growth Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">New Leads (Last 30 Days)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => format(parseISO(str), 'MMM dd')}
                  tick={{ fontSize: 12 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(str) => format(parseISO(str), 'MMM dd, yyyy')}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3B82F6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue/Value by Source */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
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