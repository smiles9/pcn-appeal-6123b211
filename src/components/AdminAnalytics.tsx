import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, CreditCard, TrendingUp, Loader2 } from "lucide-react";

interface AnalyticsData {
  totalSubmissions: number;
  paidSubmissions: number;
  pendingSubmissions: number;
  conversionRate: number;
  totalLetters: number;
  todaySubmissions: number;
  weekSubmissions: number;
  promoUsages: number;
}

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [submissionsRes, lettersRes, promosRes] = await Promise.all([
          supabase.from("submissions").select("id, status, created_at"),
          supabase.from("appeal_letters").select("id"),
          supabase.from("promo_codes").select("current_uses"),
        ]);

        const submissions = submissionsRes.data || [];
        const letters = lettersRes.data || [];
        const promos = promosRes.data || [];

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const totalSubmissions = submissions.length;
        const paidSubmissions = submissions.filter((s) => s.status === "paid").length;
        const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
        const todaySubmissions = submissions.filter((s) => s.created_at >= todayStart).length;
        const weekSubmissions = submissions.filter((s) => s.created_at >= weekStart).length;
        const promoUsages = promos.reduce((sum, p) => sum + (p.current_uses || 0), 0);

        setData({
          totalSubmissions,
          paidSubmissions,
          pendingSubmissions,
          conversionRate: totalSubmissions > 0 ? Math.round((paidSubmissions / totalSubmissions) * 100) : 0,
          totalLetters: letters.length,
          todaySubmissions,
          weekSubmissions,
          promoUsages,
        });
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Submissions",
      value: data.totalSubmissions,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Paid / Converted",
      value: data.paidSubmissions,
      icon: CreditCard,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Conversion Rate",
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Letters Generated",
      value: data.totalLetters,
      icon: Users,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        Analytics Overview
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Activity breakdown */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's submissions</span>
            <span className="font-mono text-sm font-bold text-foreground">{data.todaySubmissions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last 7 days</span>
            <span className="font-mono text-sm font-bold text-foreground">{data.weekSubmissions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending (unpaid)</span>
            <span className="font-mono text-sm font-bold text-foreground">{data.pendingSubmissions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Promo code uses (total)</span>
            <span className="font-mono text-sm font-bold text-foreground">{data.promoUsages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
