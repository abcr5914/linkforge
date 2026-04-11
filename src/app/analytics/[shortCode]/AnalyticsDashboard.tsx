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

  // Memphis color palette for Pie Chart
  const pieColors = ['#FFD500', '#FF007F', '#00E5FF', '#39FF14', '#9D00FF'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-4 border-black p-3 shadow-[6px_6px_0_0_#000]">
          <p className="font-black text-lg uppercase mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="font-bold text-black uppercase" style={{ color: p.color !== '#000' ? p.color : 'black' }}>
              {p.name}: <span className="bg-[#e0e0e0] border-2 border-black px-1">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Line Chart: Clicks over time */}
      <div className="lg:col-span-2 memphis-card p-6 bg-white relative">
        <div className="absolute -top-4 -left-4 bg-[#FF007F] text-white px-3 py-1 font-black shadow-[4px_4px_0_0_#000] border-4 border-black transform -rotate-3 z-10">
          CLICKS OVER TIME
        </div>

        <div className="h-[400px] mt-6 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#111" strokeWidth={2} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#000', fontWeight: 'bold' }}
                axisLine={{ stroke: '#000', strokeWidth: 4 }}
                tickLine={{ stroke: '#000', strokeWidth: 4 }}
              />
              <YAxis
                tick={{ fill: '#000', fontWeight: 'bold' }}
                axisLine={{ stroke: '#000', strokeWidth: 4 }}
                tickLine={{ stroke: '#000', strokeWidth: 4 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="stepAfter"
                dataKey="clicks"
                stroke="#00E5FF"
                strokeWidth={6}
                dot={{ r: 8, strokeWidth: 4, stroke: '#000', fill: '#FFD500' }}
                activeDot={{ r: 12, strokeWidth: 4, stroke: '#000', fill: '#FF007F' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: OS Breakdown */}
      <div className="memphis-card p-6 bg-white relative flex flex-col">
        <div className="absolute -top-4 -right-4 bg-[#00E5FF] text-black px-3 py-1 font-black shadow-[4px_4px_0_0_#000] border-4 border-black transform rotate-3 z-10">
          DEVICE BREAKDOWN
        </div>

        <div className="flex-1 h-[400px] mt-6 w-full flex items-center justify-center">
          {osData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#000', strokeWidth: 2 }}
                >
                  {osData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                      stroke="#000"
                      strokeWidth={4}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontWeight: 'bold', paddingTop: '20px' }}
                  iconSize={20}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="font-bold text-lg bg-[#e0e0e0] border-4 border-black px-4 py-2 transform -rotate-2">
                NO DATA YET
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
