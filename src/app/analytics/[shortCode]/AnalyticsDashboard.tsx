"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface TimeData { date: string; clicks: number; }
interface OSData { name: string; value: number; }
interface Props { timeData: TimeData[]; osData: OSData[]; }

export default function AnalyticsDashboard({ timeData, osData }: Props) {

  const colors = ['#6C5CE7', '#E07C4F', '#34C759', '#5AC8FA', '#AF52DE'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="card px-3 py-2 text-sm" style={{ boxShadow: "var(--shadow-md)" }}>
          <p className="text-[10px] font-semibold text-[var(--text-3)] mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-[var(--text-2)]">{p.name}:</span>
              <span className="font-semibold text-[var(--text-1)]">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-10">

      <div className="lg:col-span-2 card p-5">
        <h3 className="text-sm font-bold text-[var(--text-1)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Clicks Timeline
        </h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#AEAEB2', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#AEAEB2', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="clicks" stroke="#6C5CE7" strokeWidth={2.5}
                dot={{ r: 3, fill: '#6C5CE7', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#6C5CE7', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5 flex flex-col">
        <h3 className="text-sm font-bold text-[var(--text-1)] mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <svg className="w-4 h-4 text-[var(--cta)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Devices
        </h3>
        <div className="flex-1 h-[280px]">
          {osData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={osData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {osData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#6E6E73' }} iconSize={7} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="pill text-xs">No data yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
