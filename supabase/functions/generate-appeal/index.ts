import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior legal professional drafting a formal appeal letter for a parking ticket/fine on behalf of a motorist/driver.

You must tailor the letter to the SPECIFIC JURISDICTION detected in the analysis. Use the correct legal language, legislation references, and appeal procedures for that country/region.

JURISDICTION-SPECIFIC FORMATTING:

**United Kingdom:** Address to Traffic Penalty Tribunal (council) or POPLA/IAS (private). Use formal British legal language. Cite PoFA 2012, TMA 2004, TSRGD 2016 with exact section/schedule/paragraph. Reference BPA/IPC Code of Practice obligations. Mention escalation to independent tribunal.

**United States:** Address to the relevant city/county parking authority or Administrative Law Judge. Cite specific state Vehicle Code sections, local ordinances (e.g., 34 RCNY §4-08 for NYC), MUTCD standards. Mention due process rights under 14th Amendment where relevant. Reference hearing/appeal timelines.

**Australia:** Address to the relevant council or state revenue office. Cite specific Road Rules (e.g., NSW Road Rules 2014), Fines Act, Infringements Act with section numbers. Mention internal review rights and GIPA Act requests for evidence. Use formal Australian legal conventions.

**Canada:** Address to the relevant municipal court or Provincial Offences Court. Cite Highway Traffic Act sections, municipal by-law numbers. Mention trial/dispute rights under Provincial Offences Act. Reference Canadian Charter rights where applicable.

**Germany:** Address to the Ordnungsamt or relevant authority. Write in formal English but reference German legislation (StVO, OWiG) with §-notation. Explain Einspruch (objection) procedure. Note the 14-day objection period.

For all jurisdictions:
1. Uses formal legal language appropriate for the jurisdiction's tribunal, court, or appeals body
2. Cites SPECIFIC legislation with exact section/schedule references
3. References relevant case law where applicable (e.g., ParkingEye v Beavis for UK)
4. Structures each ground of appeal clearly with numbered headings
5. Requests cancellation/dismissal of the ticket with a clear legal basis
6. Maintains a respectful but firm professional tone
7. Includes placeholders for [YOUR NAME], [YOUR ADDRESS], and [YOUR POSTCODE] ONLY. Do NOT include [YOUR PHONE NUMBER], [YOUR EMAIL ADDRESS], or any other placeholders — we do not collect those.
8. Use the provided current date for the letter date — do NOT use a placeholder for the date.
8. Addresses the letter to the correct body based on ticket type and jurisdiction
9. Mentions the correct appeal escalation path

The letter must be genuinely useful — someone should be able to print it and send it directly.
Do NOT use markdown formatting. Write in plain text suitable for a formal letter.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis, userDescription, circumstances } = await req.json();

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

    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const userPrompt = `Generate a formal appeal letter for the following parking ticket:

Today's date (use this as the letter date): ${today}
Jurisdiction: ${country}
Ticket Type: ${analysis.pcn_type === "government" ? "Government/Municipal Authority" : analysis.pcn_type === "private" ? "Private Parking Operator" : "Unknown"}

${pcnDetails}

Identified Legal Grounds:
${issuesSummary}

${userDescription ? `Additional context from the driver: "${userDescription}"` : ""}
${circumstances && circumstances.length > 0 ? `The driver has also indicated the following mitigating circumstances that MUST be incorporated as additional grounds in the letter: ${circumstances.join(", ")}. Weave these into the appeal with appropriate legal backing.` : ""}

Success probability assessment: ${analysis.success_probability}%
Overall assessment: ${analysis.summary}

Write the complete appeal letter now. You MUST use EXACTLY the legal grounds listed above — do not add, remove, or substitute any grounds. Each numbered ground above must appear as a clearly headed section in the letter, using the same title and legal reference provided. Do not invent additional grounds or omit any. Use the correct laws and legal references for ${country}. Make it authoritative, cite all relevant legislation precisely, and ensure it gives the driver the strongest possible case.`;

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
