
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend as ReLegend } from "recharts";

export default function RevenuePieChart({ data, colors }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="revenue" nameKey="region" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <ReTooltip formatter={val => `₹${Number(val).toLocaleString()}`} />
        <ReLegend />
      </PieChart>
    </ResponsiveContainer>
  );
}
