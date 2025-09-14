
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";

export default function RevenueLineChart({ data }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date"/>
        <YAxis/>
        <ReTooltip formatter={val => `₹${Number(val).toLocaleString()}`} />
        <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
