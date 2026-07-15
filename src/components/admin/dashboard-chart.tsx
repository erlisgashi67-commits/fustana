"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDatum {
  name: string;
  value: number;
}

const STATUS_COLORS: Record<string, string> = {
  "Në Pritje": "oklch(0.75 0.12 70)",
  "Në Procesim": "oklch(0.7 0.13 250)",
  "Dërguar": "oklch(0.7 0.13 200)",
  "Përfunduar": "oklch(0.7 0.15 150)",
  "Anuluar": "oklch(0.62 0.2 25)",
};

/**
 * Recharts bar chart showing order counts by status.
 *
 * This component is dynamically imported (ssr: false) by the dashboard so
 * the heavy recharts library is only loaded on the client when the admin
 * dashboard is actually visited — keeping it out of the main bundle and
 * avoiding SSR / chunk issues.
 */
export function DashboardChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "oklch(0.52 0.02 20)" }}
          interval={0}
          angle={-12}
          textAnchor="end"
          height={50}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "oklch(0.52 0.02 20)" }} />
        <Tooltip
          cursor={{ fill: "oklch(0.96 0.012 25)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid oklch(0.9 0.015 25)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "oklch(0.62 0.13 18)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
