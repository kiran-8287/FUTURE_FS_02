import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { Users, UserCheck, IndianRupee, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarWidget } from '../components/CalendarWidget';

export const Dashboard: React.FC = () => {
  const { getLeadStats, leads } = useLeads();
  const navigate = useNavigate();
  const stats = getLeadStats();

  const cards = [
    { name: 'Total Leads', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'New Leads', value: stats.new, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Converted', value: stats.converted, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pipeline Value', value: `₹${stats.value.toLocaleString()}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  // Prepare simple chart data from source
  const sourceData = leads.reduce((acc: any[], lead) => {
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-500">Overview of your sales pipeline</span>
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
                    <dd className="text-2xl font-bold text-gray-900">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Spans 1 column */}
        <div className="col-span-1 bg-white shadow-sm rounded-lg border border-gray-200 p-6 lg:col-span-1">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Leads</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-block h-8 w-8 rounded-full bg-white border border-gray-200 text-center leading-8 text-xs font-bold text-gray-600">
                        {lead.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
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