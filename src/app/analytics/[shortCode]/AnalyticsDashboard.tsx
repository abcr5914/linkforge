"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface TimeData {
  date: string;
  clicks: number;
}

interface OSData {
  name: string;
  value: number;
}

interface AnalyticsDashboardProps {
  timeData: TimeData[];
  osData: OSData[];
}

export default function AnalyticsDashboard({ timeData, osData }: AnalyticsDashboardProps) {

  // Pastel color palette for Pie Chart
  const pieColors = ['#a9d6e5', '#f8ad9d', '#d3e298', '#faddaa', '#dfb2f4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="clay-card-flat px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] shadow-[var(--shadow-drop)]">
          <p className="font-bold text-sm mb-2 text-[var(--text-muted)]">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="font-semibold text-sm flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color !== '#000' && !p.color.includes('var') ? p.color : '#a9d6e5' }}></span>
                {p.name}:
              </span>
              <span className="bg-[var(--bg-color)] px-2 py-[2px] rounded-md font-bold">
                {p.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

      {/* Line Chart: Clicks over time */}
      <div className="lg:col-span-2 clay-card p-6 bg-[var(--card-bg)] border border-[var(--border-color)]">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--color-pastel-blue)]" style={{ filter: "brightness(0.8) saturate(2)" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Clicks Timeline
        </h3>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#a9d6e5"
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, stroke: 'var(--card-bg)', fill: '#a9d6e5' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--card-bg)', fill: '#72abc2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: OS Breakdown */}
      <div className="clay-card p-6 bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
           <svg className="w-5 h-5 text-[var(--color-pastel-pink)]" style={{ filter: "brightness(0.9) saturate(1.5)" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Device Breakdown
        </h3>

        <div className="flex-1 h-[300px] w-full flex flex-col items-center justify-center">
          {osData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {osData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500, color: 'var(--text-main)' }}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="font-medium text-sm text-[var(--text-muted)] bg-[var(--bg-color)] px-4 py-2 rounded-full border border-[var(--border-color)]">
                No data available yet
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
