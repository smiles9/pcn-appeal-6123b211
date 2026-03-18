import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Mail, Lock, Chrome } from "lucide-react";
import { toast } from "sonner";

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {isLogin ? "Sign in to access your appeals" : "Sign up to save your appeal history"}
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 font-display text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <Chrome className="h-5 w-5" />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
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
            <label className="text-xs font-medium text-muted-foreground">Password</label>
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
            {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default AuthPage;
