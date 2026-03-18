import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior UK parking law solicitor drafting a formal appeal letter on behalf of a motorist. 

Write a professional, authoritative appeal letter that:

1. Uses formal legal language appropriate for a tribunal or council appeals team
2. Cites SPECIFIC legislation with exact section/schedule references:
   - Protection of Freedoms Act 2012 (PoFA 2012), Schedule 4
   - Traffic Management Act 2004 (TMA 2004)
   - The Traffic Signs Regulations and General Directions 2016 (TSRGD 2016)
   - Deregulation Act 2015, Section 71
   - BPA Approved Operator Scheme Code of Practice
   - IPC Code of Practice  
   - Road Traffic Regulation Act 1984
   - The Parking (Code of Practice) Act 2019
   - Civil Enforcement of Road Traffic Contraventions (Approved Devices) (England) Order 2022
   - Consumer Rights Act 2015 (for private parking unfair terms)
   - Human Rights Act 1998, Article 6
3. References relevant case law where applicable (e.g., ParkingEye Ltd v Beavis [2015] UKSC 67, VCS v HMRC, Excel Parking v Heatherington)
4. Structures each ground of appeal clearly with numbered headings
5. Requests cancellation of the PCN with a clear legal basis
6. Maintains a respectful but firm professional tone
7. Includes placeholders for [YOUR NAME] and [YOUR ADDRESS]
8. Addresses the letter to the correct body based on PCN type

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

    const pcnDetails = analysis.pcn_details
      ? `PCN Number: ${analysis.pcn_details.pcn_number || "Unknown"}
Date Issued: ${analysis.pcn_details.date_issued || "Unknown"}
Location: ${analysis.pcn_details.location || "Unknown"}
Contravention Code: ${analysis.pcn_details.contravention_code || "Unknown"}
Issuing Authority: ${analysis.pcn_details.issuing_authority || "Unknown"}
Amount: ${analysis.pcn_details.amount || "Unknown"}`
      : "PCN details not fully available";

    const userPrompt = `Generate a formal appeal letter for the following PCN:

PCN Type: ${analysis.pcn_type === "council" ? "Council (TMA 2004)" : analysis.pcn_type === "private" ? "Private (PoFA 2012)" : "Unknown"}

${pcnDetails}

Identified Legal Grounds:
${issuesSummary}

${userDescription ? `Additional context from the motorist: "${userDescription}"` : ""}

Success probability assessment: ${analysis.success_probability}%
Overall assessment: ${analysis.summary}

Write the complete appeal letter now. Make it authoritative, cite all relevant legislation precisely, and ensure it gives the motorist the strongest possible case.`;

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
