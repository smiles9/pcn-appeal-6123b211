import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Ban, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthPage from "@/components/AuthPage";

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  current_uses: number;
  active: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", discount_percent: 100, max_uses: "" });
  const [saving, setSaving] = useState(false);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCodes(data as PromoCode[]);
    setLoadingCodes(false);
  };

  useEffect(() => {
    if (isAdmin) fetchCodes();
  }, [isAdmin]);

  const handleSubmit = async () => {
    const trimmedCode = formData.code.trim().toUpperCase();
    if (!trimmedCode) {
      toast.error("Code is required");
      return;
    }
    if (formData.discount_percent < 1 || formData.discount_percent > 100) {
      toast.error("Discount must be 1-100%");
      return;
    }

    setSaving(true);
    const payload = {
      code: trimmedCode,
      discount_percent: formData.discount_percent,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
    };

    if (editingId) {
      const { error } = await supabase.from("promo_codes").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Failed to update");
      } else {
        toast.success("Promo code updated");
      }
    } else {
      const { error } = await supabase.from("promo_codes").insert(payload);
      if (error) {
        toast.error(error.message.includes("duplicate") ? "Code already exists" : "Failed to create");
      } else {
        toast.success("Promo code created");
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setFormData({ code: "", discount_percent: 100, max_uses: "" });
    fetchCodes();
  };

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    const { error } = await supabase.from("promo_codes").update({ active: !currentlyActive }).eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(currentlyActive ? "Promo code deactivated" : "Promo code activated");
      fetchCodes();
    }
  };

  const startEdit = (code: PromoCode) => {
    setEditingId(code.id);
    setFormData({
      code: code.code,
      discount_percent: code.discount_percent,
      max_uses: code.max_uses?.toString() || "",
    });
    setShowForm(true);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md pt-12">
          <p className="mb-4 text-center text-sm text-muted-foreground">Sign in to access admin</p>
          <AuthPage />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-lg font-bold text-foreground">Access Denied</h1>
        <p className="text-sm text-muted-foreground">You don't have admin privileges.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Shield className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-bold text-foreground">Promo Code Admin</span>
      </header>

      <div className="mx-auto max-w-2xl p-4">
        {/* Add button */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">
            Promo Codes ({codes.length})
          </h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ code: "", discount_percent: 100, max_uses: "" });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            New Code
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-4 rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {editingId ? "Edit Promo Code" : "Create Promo Code"}
            </h3>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER50"
                maxLength={50}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Discount %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Max Uses (blank = unlimited)</label>
                <input
                  type="number"
                  min={1}
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  placeholder="∞"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="rounded-lg bg-muted px-4 py-2 text-xs font-medium text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {loadingCodes ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : codes.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No promo codes yet.</p>
        ) : (
          <div className="space-y-2">
            {codes.map((code) => (
              <div
                key={code.id}
                className={`flex items-center justify-between rounded-xl border bg-card p-3 ${
                  code.active ? "border-border" : "border-border/50 opacity-60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{code.code}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {code.discount_percent}% off
                    </span>
                    {!code.active && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {code.current_uses}{code.max_uses ? `/${code.max_uses}` : ""} uses
                    · Created {new Date(code.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(code)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => toggleActive(code.id, code.active)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title={code.active ? "Deactivate" : "Activate"}
                  >
                    {code.active ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
