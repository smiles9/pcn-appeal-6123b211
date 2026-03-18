import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0 || code.trim().length > 50) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid promo code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const normalizedCode = code.trim().toUpperCase();

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", normalizedCode)
      .eq("active", true)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid or expired promo code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (data.max_uses !== null && data.current_uses >= data.max_uses) {
      return new Response(JSON.stringify({ valid: false, error: "This promo code has been fully redeemed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment usage
    await supabase
      .from("promo_codes")
      .update({ current_uses: data.current_uses + 1 })
      .eq("id", data.id);

    return new Response(JSON.stringify({ valid: true, discount_percent: data.discount_percent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("validate-promo error:", e);
    return new Response(
      JSON.stringify({ valid: false, error: "Validation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
