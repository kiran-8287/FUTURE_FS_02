import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { Users, UserCheck, IndianRupee, Activity, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarWidget } from '../components/CalendarWidget';
import { SkeletonCard, SkeletonChart, SkeletonList } from '../components/ui/Skeleton';

export const Dashboard: React.FC = () => {
  const { getLeadStats, leads, loading } = useLeads();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('all');

  // Calculate turned/stalled leads
  const stalledLeads = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    return leads.filter(lead => {
      // Exclude converted or lost leads
      if (lead.status === 'Converted' || lead.status === 'Lost') return false;

      const lastInteraction = new Date(lead.lastInteraction || lead.dateAdded);
      return lastInteraction < sevenDaysAgo;
    });
  }, [leads]);

  const [activeTab, setActiveTab] = useState<'recent' | 'stalled'>('recent');

  // Filter leads based on selected date range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return leads.filter(lead => {
      const leadDate = new Date(lead.dateAdded);

      switch (dateRange) {
        case '7days':
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return leadDate >= sevenDaysAgo;
        case '30days':
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return leadDate >= thirtyDaysAgo;
        case 'quarter':
          const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          return leadDate >= startOfQuarter;
        default:
          return true;
      }
    });
  }, [leads, dateRange]);

  // Calculate previous period for trends
  const previousLeads = useMemo(() => {
    if (dateRange === 'all') return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return leads.filter(lead => {
      const leadDate = new Date(lead.dateAdded);

      switch (dateRange) {
        case '7days':
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          const fourteenDaysAgo = new Date(today);
          fourteenDaysAgo.setDate(today.getDate() - 14);
          return leadDate >= fourteenDaysAgo && leadDate < sevenDaysAgo; // Previous 7 days
        case '30days':
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          const sixtyDaysAgo = new Date(today);
          sixtyDaysAgo.setDate(today.getDate() - 60);
          return leadDate >= sixtyDaysAgo && leadDate < thirtyDaysAgo;
        case 'quarter':
          const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          const previousQuarterStart = new Date(startOfQuarter);
          previousQuarterStart.setMonth(startOfQuarter.getMonth() - 3);
          return leadDate >= previousQuarterStart && leadDate < startOfQuarter;
        default:
          return false;
      }
    });
  }, [leads, dateRange]);

  const stats = getLeadStats(filteredLeads);
  const prevStats = getLeadStats(previousLeads);

  const calculateTrend = (current: number, previous: number) => {
    if (dateRange === 'all') return null;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const trends = {
    total: calculateTrend(stats.total, prevStats.total),
    new: calculateTrend(stats.new, prevStats.new),
    converted: calculateTrend(stats.converted, prevStats.converted),
    value: calculateTrend(stats.value, prevStats.value),
  };

  const cards = [
    {
      name: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      trend: trends.total
    },
    {
      name: 'New Leads',
      value: stats.new,
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      trend: trends.new
    },
    {
      name: 'Converted',
      value: stats.converted,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
      trend: trends.converted
    },
    {
      name: 'Pipeline Value',
      value: `₹${stats.value.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      trend: trends.value
    },
  ];

  // Prepare simple chart data from source
  const sourceData = filteredLeads.reduce((acc: any[], lead) => {
    const existing = acc.find(item => item.name === lead.source);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.source, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <span className="text-sm text-gray-500">Overview of your sales pipeline</span>
        </div>

        <div className="flex items-center space-x-2 bg-white rounded-md shadow-sm border border-gray-300 px-3 py-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm text-gray-700 border-none focus:ring-0 p-0 pr-8 bg-transparent cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                      {card.trend !== null && (
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {card.trend >= 0 ? (
                            <span className="sr-only">Increased by</span>
                          ) : (
                            <span className="sr-only">Decreased by</span>
                          )}
                          {card.trend > 0 ? '↑' : card.trend < 0 ? '↓' : ''}
                          {Math.abs(card.trend)}%
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent/Stalled Activity - Spans 1 column */}
        <div className="col-span-1 bg-white shadow-sm rounded-lg border border-gray-200 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('recent')}
                className={`text-sm font-medium pb-2 -mb-2.5 transition-colors ${activeTab === 'recent'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Recent Leads
              </button>
              <button
                onClick={() => setActiveTab('stalled')}
                className={`text-sm font-medium pb-2 -mb-2.5 transition-colors flex items-center ${activeTab === 'stalled'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Stalled
                {stalledLeads.length > 0 && (
                  <span className="ml-1.5 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                    {stalledLeads.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'recent' ? (
                <>
                  {filteredLeads.slice(0, 5).map((lead) => (
                    <li key={lead.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block h-8 w-8 rounded-full bg-white border border-gray-200 text-center leading-8 text-xs font-bold text-gray-600">
                            {lead.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate(`/leads?q=${lead.name}`)}
                            className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 focus:outline-none text-left"
                          >
                            {lead.name}
                          </button>
                          <p className="text-sm text-gray-500 truncate">{lead.company}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                              'bg-white border border-gray-200 text-gray-800'
                            }`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                  {filteredLeads.length === 0 && (
                    <li className="py-10 text-center text-sm text-gray-500">
                      No recent leads found
                    </li>
                  )}
                </>
              ) : (
                <>
                  {stalledLeads.slice(0, 5).map((lead) => (
                    <li key={lead.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block h-8 w-8 rounded-full bg-red-50 border border-red-100 text-center leading-8 text-xs font-bold text-red-600">
                            !
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate(`/leads?q=${lead.name}`)}
                            className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 focus:outline-none text-left"
                          >
                            {lead.name}
                          </button>
                          <p className="text-xs text-red-500 truncate">
                            {Math.floor((new Date().getTime() - new Date(lead.lastInteraction || lead.dateAdded).getTime()) / (1000 * 3600 * 24))} days inactive
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/leads?q=${lead.name}`)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                  {stalledLeads.length === 0 && (
                    <li className="py-10 text-center flex flex-col items-center justify-center">
                      <UserCheck className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm text-gray-900 font-medium">All caught up!</p>
                      <p className="text-xs text-gray-500">No stalled leads requiring attention.</p>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Charts & Calendar - Spans 2 columns */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Simple Chart */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Source</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(data) => navigate(`/leads?source=${data.name}`)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="h-96">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
};