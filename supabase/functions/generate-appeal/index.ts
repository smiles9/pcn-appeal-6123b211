import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior legal professional drafting a formal appeal letter for a parking ticket/fine on behalf of a motorist/driver.

You must tailor the letter to the SPECIFIC JURISDICTION detected in the analysis. Use the correct legal language, legislation references, and appeal procedures for that country/region.

Write a professional, authoritative appeal letter that:

1. Uses formal legal language appropriate for the jurisdiction's tribunal, court, or appeals body
2. Cites SPECIFIC legislation with exact section/schedule references relevant to the detected country/jurisdiction
3. References relevant case law where applicable
4. Structures each ground of appeal clearly with numbered headings
5. Requests cancellation/dismissal of the ticket with a clear legal basis
6. Maintains a respectful but firm professional tone
7. Includes placeholders for [YOUR NAME] and [YOUR ADDRESS]
8. Addresses the letter to the correct body based on ticket type and jurisdiction
9. Mentions the correct appeal escalation path for the jurisdiction (e.g. Traffic Penalty Tribunal in UK, Administrative Law Judge in NYC, etc.)

The letter must be genuinely useful — someone should be able to print it and send it directly.
Do NOT use markdown formatting. Write in plain text suitable for a formal letter.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis, userDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const issuesSummary = analysis.issues
      .map((issue: any, i: number) => `${i + 1}. ${issue.title}: ${issue.description} (Ref: ${issue.legal_reference})`)
      .join("\n");

    const country = analysis.pcn_details?.country || "Unknown jurisdiction";

    const pcnDetails = analysis.pcn_details
      ? `Ticket/Notice Number: ${analysis.pcn_details.pcn_number || "Unknown"}
Date Issued: ${analysis.pcn_details.date_issued || "Unknown"}
Location: ${analysis.pcn_details.location || "Unknown"}
Violation/Contravention Code: ${analysis.pcn_details.contravention_code || "Unknown"}
Issuing Authority: ${analysis.pcn_details.issuing_authority || "Unknown"}
Amount: ${analysis.pcn_details.amount || "Unknown"}
Country/Jurisdiction: ${country}`
      : "Ticket details not fully available";

    const userPrompt = `Generate a formal appeal letter for the following parking ticket:

Jurisdiction: ${country}
Ticket Type: ${analysis.pcn_type === "government" ? "Government/Municipal Authority" : analysis.pcn_type === "private" ? "Private Parking Operator" : "Unknown"}

${pcnDetails}

Identified Legal Grounds:
${issuesSummary}

${userDescription ? `Additional context from the driver: "${userDescription}"` : ""}

Success probability assessment: ${analysis.success_probability}%
Overall assessment: ${analysis.summary}

Write the complete appeal letter now. Use the correct laws and legal references for ${country}. Make it authoritative, cite all relevant legislation precisely, and ensure it gives the driver the strongest possible case.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const letterText = data.choices?.[0]?.message?.content;

    if (!letterText) {
      throw new Error("AI did not generate a letter");
    }

    return new Response(JSON.stringify({ letter: letterText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-appeal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Letter generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
