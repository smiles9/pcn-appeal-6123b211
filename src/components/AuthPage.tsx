import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Mail, Lock, Chrome } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
    } catch (e: any) {
      toast.error(e.message || "Failed to send reset email");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in successfully");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! You're now signed in.");
      }
      onSuccess?.();
    } catch (e: any) {
      toast.error(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <section className="flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h2 className="font-display text-2xl font-bold text-center text-foreground">
          {isLogin ? t("welcome_back") : t("create_account")}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {isLogin ? t("sign_in_subtitle") : t("sign_up_subtitle")}
        </p>

        <button
          onClick={handleGoogleAuth}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 font-display text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <Chrome className="h-5 w-5" />
          {t("continue_google")}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{t("or")}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">{t("email")}</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">{t("password")}</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? t("please_wait") : isLogin ? t("sign_in") : t("create_account")}
          </button>
        </form>

        {isLogin && (
          <button
            onClick={handleForgotPassword}
            className="mt-3 block w-full text-center text-xs font-medium text-primary hover:underline"
          >
            {t("forgot_password")}
          </button>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isLogin ? t("no_account") : t("have_account")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? t("sign_up") : t("sign_in")}
          </button>
        </p>
      </div>
    </section>
  );
};

export default AuthPage;
