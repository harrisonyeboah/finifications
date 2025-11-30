import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockVisualization = ({ prices }) => {
  // Generate dates going backward from today
  const today = new Date();
  const data = prices.map((price, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (prices.length - 1 - index));
    const formattedDate = date.toLocaleDateString(); // e.g., "11/30/2025"
    return {
      name: formattedDate,
      price,
    };
  });

  // Format Y-axis values with $
  const formatCurrency = (value) => `$${value}`;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={formatCurrency} 
          />
          <Tooltip 
            formatter={(value) => `$${value}`} 
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#a1887f" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockVisualization;
