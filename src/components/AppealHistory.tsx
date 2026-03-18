import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Clock, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import type { PcnIssue } from "@/hooks/useSubmission";

interface HistoryItem {
  id: string;
  created_at: string;
  success_probability: number;
  issues: PcnIssue[];
  status: string;
  appeal_letter?: string;
}

interface AppealHistoryProps {
  onBack: () => void;
}

const AppealHistory = ({ onBack }: AppealHistoryProps) => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data: submissions } = await supabase
        .from("submissions")
        .select("id, created_at, success_probability, issues, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!submissions) {
        setLoading(false);
        return;
      }

      // Fetch associated letters
      const ids = submissions.map((s) => s.id);
      const { data: letters } = await supabase
        .from("appeal_letters")
        .select("submission_id, letter_text")
        .in("submission_id", ids);

      const letterMap = new Map(letters?.map((l) => [l.submission_id, l.letter_text]) || []);

      setItems(
        submissions.map((s) => ({
          ...s,
          issues: (s.issues as any) || [],
          appeal_letter: letterMap.get(s.id) || undefined,
        }))
      );
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-sm">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ← Back to home
        </button>

        <h2 className="font-display text-xl font-bold text-foreground">
          Appeal History
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your previous PCN analyses and appeal letters
        </p>

        {loading ? (
          <div className="mt-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No appeals yet. Upload a PCN to get started!
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const expanded = expandedId === item.id;
              const prob = item.success_probability;
              const probColor = prob >= 60 ? "text-success" : prob >= 40 ? "text-accent" : "text-destructive";

              return (
                <motion.div
                  key={item.id}
                  layout
                  className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`font-display text-lg font-bold ${probColor}`}>
                          {prob}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {item.issues.length} issues · {item.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>

                  {expanded && (
                    <div className="border-t border-border px-4 py-3 space-y-2">
                      {item.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          {issue.severity === "high" ? (
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                          ) : (
                            <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                          )}
                          <div>
                            <span className="font-semibold text-foreground">{issue.title}</span>
                            <span className="ml-1 text-muted-foreground">— {issue.legal_reference}</span>
                          </div>
                        </div>
                      ))}

                      {item.appeal_letter && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs font-semibold text-primary">
                            View Appeal Letter
                          </summary>
                          <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-[10px] leading-relaxed text-foreground">
                            {item.appeal_letter}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AppealHistory;
