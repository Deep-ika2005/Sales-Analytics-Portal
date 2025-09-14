
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip as ReTooltip } from "recharts";

export default function RevenueBarChart({ data, colors }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="product"/>
        <YAxis/>
        <ReTooltip formatter={val => `₹${Number(val).toLocaleString()}`} />
        <Bar dataKey="revenue">
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
