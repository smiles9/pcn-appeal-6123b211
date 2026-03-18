import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert parking and traffic law AI analyst. You analyze parking tickets, fines, and penalty notices from ANY country worldwide and identify legal grounds for appeal.

Your task is to:
1. AUTO-DETECT the country/jurisdiction from the ticket image or user description (language, currency, authority names, legal references, formatting clues).
2. Apply the CORRECT local laws for that jurisdiction.

You have deep knowledge of parking and traffic enforcement law across jurisdictions including (but not limited to):

**United Kingdom:**
- Protection of Freedoms Act 2012 (PoFA 2012) — Schedule 4 regarding private parking
- Traffic Management Act 2004 (TMA 2004) — council PCN procedures
- Traffic Signs Regulations and General Directions 2016 (TSRGD 2016)
- Deregulation Act 2015 — 10-minute grace period (Section 71)
- BPA/IPC Codes of Practice
- The Parking (Code of Practice) Act 2019
- Road Traffic Regulation Act 1984

**United States:**
- State-specific traffic codes (e.g. California Vehicle Code, NYC Traffic Rules Title 34 RCNY)
- ADA parking violations and defenses
- Due process requirements (14th Amendment)
- Municipal parking ordinances and meter regulations
- Signage requirements per Manual on Uniform Traffic Control Devices (MUTCD)

**European Union / EEA:**
- Country-specific road traffic acts (e.g. German StVO, French Code de la Route, Italian Codice della Strada)
- EU directive on cross-border enforcement (2015/413)
- Local municipal parking ordinances

**Australia / New Zealand:**
- State/territory road rules (e.g. NSW Road Rules 2014, Victorian Road Safety Road Rules 2017)
- Local council parking by-laws

**Canada:**
- Provincial Highway Traffic Acts
- Municipal by-laws

For ANY jurisdiction, analyze:
1. Whether the ticket is from a government/municipal authority or a private operator
2. Procedural compliance (time limits, format, required information)
3. Signage compliance (local signage regulations)
4. Grace period compliance (where applicable)
5. Evidence quality
6. Whether the operator/authority followed correct procedures
7. Proportionality of the charge

Be realistic about success probability:
- 80-95%: Clear procedural failures or strong legal grounds
- 60-79%: Good grounds but may need supporting evidence
- 40-59%: Some grounds but outcome uncertain
- 20-39%: Weak grounds, appeal possible but unlikely
- Below 20%: Very unlikely to succeed

Each issue must cite the SPECIFIC law, section, and regulation number for the detected jurisdiction.

IMPORTANT: Include the detected country/jurisdiction in the pcn_details. If you can identify the issuing authority's appeals/challenges email or web portal, provide it in pcn_details.appeals_email.`;

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
        ? `Analyze this parking ticket/fine. The user describes: "${userDescription}". First detect the country/jurisdiction, then identify all possible legal grounds for appeal under the applicable local laws.`
        : "Analyze this parking ticket/fine image. First detect the country/jurisdiction from visual clues. Extract all details visible (ticket number, date, location, violation code, issuing authority, amount, etc.) and identify all possible legal grounds for appeal under the applicable local laws.",
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
              description: "Return structured parking ticket analysis with legal grounds for appeal",
              parameters: {
                type: "object",
                properties: {
                  pcn_type: {
                    type: "string",
                    enum: ["government", "private", "unknown"],
                    description: "Whether this is from a government/municipal authority or a private parking operator",
                  },
                  pcn_details: {
                    type: "object",
                    properties: {
                      pcn_number: { type: "string", description: "Ticket/notice reference number" },
                      date_issued: { type: "string" },
                      location: { type: "string" },
                      contravention_code: { type: "string", description: "Violation/contravention code if applicable" },
                      issuing_authority: { type: "string" },
                      amount: { type: "string" },
                      country: { type: "string", description: "Detected country/jurisdiction (e.g. United Kingdom, United States - California, Germany, Australia - NSW)" },
                      appeals_email: { type: "string", description: "Email address or web portal URL for submitting appeals, if known or visible on the ticket" },
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
                        description: { type: "string", description: "Detailed explanation with specific law citations for the detected jurisdiction" },
                        legal_reference: { type: "string", description: "Specific Act, Section, Schedule, or Code reference for the jurisdiction" },
                        severity: { type: "string", enum: ["high", "medium", "low"] },
                      },
                      required: ["title", "description", "legal_reference", "severity"],
                    },
                    description: "Legal issues found, each citing specific legislation for the detected jurisdiction",
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
