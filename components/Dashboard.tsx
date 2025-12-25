
import React from 'react';
import { AppState, BookingStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totalRevenue = state.bookings
    .filter(b => b.status === BookingStatus.APPROVED)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingWeddings = state.bookings.filter(b => b.status === BookingStatus.PENDING).length;
  const pendingViewings = state.viewings.filter(v => v.status === BookingStatus.PENDING).length;

  const chartData = [
    { name: 'Jan', revenue: 42000 },
    { name: 'Feb', revenue: 38000 },
    { name: 'Mar', revenue: 55000 },
    { name: 'Apr', revenue: 47000 },
    { name: 'May', revenue: 62000 },
    { name: 'Jun', revenue: totalRevenue || 75000 },
  ];

  // Using semantic colors for easier understanding
  const statusDistribution = [
    { name: 'Approved', value: state.bookings.filter(b => b.status === BookingStatus.APPROVED).length, color: '#10b981' },
    { name: 'Pending', value: state.bookings.filter(b => b.status === BookingStatus.PENDING).length, color: '#f59e0b' },
    { name: 'Rejected', value: state.bookings.filter(b => b.status === BookingStatus.REJECTED).length, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Monthly Revenue', value: `RM${totalRevenue.toLocaleString()}`, icon: 'fa-sack-dollar', color: 'text-[#a67c52]', bg: 'bg-[#fcfaf7]' },
          { label: 'Pending Events', value: pendingWeddings, icon: 'fa-ring', color: 'text-[#3d2b1f]', bg: 'bg-[#fcfaf7]' },
          { label: 'Appointment Requests', value: pendingViewings, icon: 'fa-eye', color: 'text-[#a67c52]', bg: 'bg-[#fcfaf7]' },
          { label: 'Active Stall Items', value: state.stallItems.length, icon: 'fa-store', color: 'text-[#3d2b1f]', bg: 'bg-[#fcfaf7]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow group">
            <div className="flex flex-col gap-4">
              <div className={`p-4 w-14 h-14 ${stat.color} rounded-2xl bg-stone-50 group-hover:bg-[#a67c52] group-hover:text-white transition-colors flex items-center justify-center`}>
                <i className={`fas ${stat.icon} text-2xl`}></i>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-serif font-bold text-stone-800">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h4 className="text-xl font-serif font-bold text-[#3d2b1f]">Revenue Projections</h4>
               <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-1">Growth vs Current Performance</p>
            </div>
            <select className="text-xs font-bold text-stone-500 border border-stone-100 bg-stone-50 p-2 px-4 rounded-xl outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Year 2024</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="activeBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 15px 30px -5px rgb(0 0 (0 / 0.15)', backgroundColor: '#fff', padding: '12px' }}
                  cursor={{ fill: '#fcfaf7', radius: 10 }}
                  formatter={(value: any) => [`RM${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? "url(#activeBlueGradient)" : "url(#blueBarGradient)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#1e3a8a] rounded-full"></div>
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Historical Data</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div>
               <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Current Month Projection</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 flex flex-col">
          <h4 className="text-xl font-serif font-bold text-[#3d2b1f] mb-8">Portfolio Status</h4>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {statusDistribution.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3 font-medium text-stone-600">
                  <span className="w-3.5 h-3.5 rounded-sm" style={{backgroundColor: s.color}}></span>
                  {s.name}
                </span>
                <span className="font-bold text-stone-800">{s.value} Bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
