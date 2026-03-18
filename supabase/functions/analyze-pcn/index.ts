import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert UK parking law solicitor AI. You analyze Penalty Charge Notices (PCNs) and identify legal grounds for appeal.

You have deep knowledge of:
- Protection of Freedoms Act 2012 (PoFA 2012) — especially Schedule 4 regarding private parking
- Traffic Management Act 2004 (TMA 2004) — council PCN procedures and requirements
- The Traffic Signs Regulations and General Directions 2016 (TSRGD 2016) — signage compliance
- Deregulation Act 2015 — 10-minute grace period (Section 71)
- BPA (British Parking Association) Approved Operator Scheme Code of Practice
- IPC (International Parking Community) Code of Practice
- POFA Schedule 4 keeper liability requirements
- Civil Enforcement of Road Traffic Contraventions (Approved Devices) (England) Order 2022
- The Parking (Code of Practice) Act 2019
- Local Government Act 1972 — authority powers
- Road Traffic Regulation Act 1984 — Traffic Regulation Orders (TROs)
- Human Rights Act 1998, Article 6 — right to fair hearing
- Consumer Rights Act 2015 — unfair terms in private parking

When analyzing a PCN, you MUST use the tool provided to return structured analysis.

Analyze based on:
1. Whether it's a council (TMA 2004) or private (PoFA 2012/BPA/IPC) PCN
2. Procedural compliance (time limits, format, required information)
3. Signage compliance (TSRGD 2016 for council, BPA/IPC CoP for private)
4. Grace period compliance (Deregulation Act 2015 s.71)
5. Evidence quality (photos, timestamps, CEO notes)
6. TRO validity (for council PCNs)
7. Keeper liability requirements (for private PCNs under PoFA 2012)
8. Whether the operator followed the correct appeals process
9. Proportionality of the charge

Be realistic about success probability. Base it on the strength of the grounds identified.
- 80-95%: Clear procedural failures or strong legal grounds
- 60-79%: Good grounds but may need supporting evidence
- 40-59%: Some grounds but outcome uncertain
- 20-39%: Weak grounds, appeal possible but unlikely
- Below 20%: Very unlikely to succeed

Each issue must cite the SPECIFIC law, section, and regulation number.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, userDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userContent: any[] = [];

    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageBase64 },
      });
    }

    userContent.push({
      type: "text",
      text: userDescription
        ? `Analyze this PCN. The user describes: "${userDescription}". Identify all possible legal grounds for appeal under UK parking law.`
        : "Analyze this PCN image. Extract all details visible (PCN number, date, location, contravention code, issuing authority, amount, etc.) and identify all possible legal grounds for appeal under UK parking law.",
    });

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
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "pcn_analysis",
              description: "Return structured PCN analysis with legal grounds for appeal",
              parameters: {
                type: "object",
                properties: {
                  pcn_type: {
                    type: "string",
                    enum: ["council", "private", "unknown"],
                    description: "Whether this is a council (TMA 2004) or private (PoFA 2012) PCN",
                  },
                  pcn_details: {
                    type: "object",
                    properties: {
                      pcn_number: { type: "string" },
                      date_issued: { type: "string" },
                      location: { type: "string" },
                      contravention_code: { type: "string" },
                      issuing_authority: { type: "string" },
                      amount: { type: "string" },
                    },
                  },
                  success_probability: {
                    type: "integer",
                    minimum: 5,
                    maximum: 95,
                    description: "Realistic probability of successful appeal (5-95%)",
                  },
                  issues: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short title of the issue" },
                        description: { type: "string", description: "Detailed explanation with specific law citations" },
                        legal_reference: { type: "string", description: "Specific Act, Section, Schedule reference" },
                        severity: { type: "string", enum: ["high", "medium", "low"] },
                      },
                      required: ["title", "description", "legal_reference", "severity"],
                    },
                    description: "Legal issues found, each citing specific UK legislation",
                  },
                  summary: {
                    type: "string",
                    description: "Brief overall assessment of appeal prospects",
                  },
                },
                required: ["pcn_type", "success_probability", "issues", "summary"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "pcn_analysis" } },
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
        return new Response(JSON.stringify({ error: "AI service credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured analysis");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-pcn error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
