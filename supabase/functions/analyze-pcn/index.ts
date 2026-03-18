import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert parking and traffic law AI analyst. You analyze parking tickets, fines, and penalty notices from ANY country worldwide and identify legal grounds for appeal.

Your task is to:
1. AUTO-DETECT the country/jurisdiction from the ticket image or user description (language, currency, authority names, legal references, formatting clues).
2. Apply the CORRECT local laws for that jurisdiction.
3. For top-tier countries (UK, US, Australia, Canada, Germany), provide DEEP legal analysis with precise statute references.

You have expert-level knowledge of parking and traffic enforcement law. Your PRIMARY jurisdictions with the strongest legal databases are:

**🇬🇧 United Kingdom (Highest success — ~78%):**
- Protection of Freedoms Act 2012 (PoFA 2012) — Schedule 4, especially para 5 (keeper liability conditions), para 9 (adequate notice periods)
- Traffic Management Act 2004 (TMA 2004) — Part 6 (civil enforcement), s82 (representations), s85 (adjudication)
- Traffic Signs Regulations and General Directions 2016 (TSRGD 2016) — Schedules 3, 7, 9 (sign specifications)
- Deregulation Act 2015 — Section 71 (mandatory 10-minute grace period for on-street)
- The Parking (Code of Practice) Act 2019 — Single Code of Practice
- BPA Code of Practice / IPC Code of Practice — operator obligations, signage, appeals
- Road Traffic Regulation Act 1984 — s35A, s46 (off-street parking), s47 (on-street)
- Common law: Beavis v ParkingEye [2015] UKSC 67 (proportionality of charges)
- PE v Somerfield [2012] EWCA Civ 1338 (adequate signage)
- Key defenses: inadequate signage, failure to serve NtK within 14 days (PoFA), grace period violations, disproportionate charges, DVLA keeper data misuse, lack of ANPR evidence, procedural failures in NtO

**🇺🇸 United States (Varies by state — ~65% avg):**
- State Vehicle Codes: California Vehicle Code §22500-22526, NY VTL §238-239, Texas Transportation Code Ch 681-682
- NYC Traffic Rules Title 34 RCNY §4-08 (parking violations), NYC Admin Code §19-203
- ADA parking violations: 42 USC §12182, state-specific disabled parking statutes
- Due process: 14th Amendment procedural requirements, Mathews v. Eldridge test
- Manual on Uniform Traffic Control Devices (MUTCD) — signage standards (Parts 2B, 2D)
- Local ordinances: meter regulations, residential permit zones, snow emergency rules
- Common defenses: missing/obscured signs, broken meters, expired registration of parking authority, improper service, missing officer signature, wrong plate/VIN, unclear zone markings
- Appeal paths: city hearing officers, Administrative Law Judges, Traffic Violations Bureau

**🇦🇺 Australia (~72% success rate):**
- Road Rules 2014 (NSW), Road Safety Road Rules 2017 (VIC), Transport Operations (Road Use Management) Act 1995 (QLD)
- Local Government Act 2009 (QLD), Local Government Act 1999 (SA)
- Fines Act 1996 (NSW) — internal review provisions (s24A)
- Infringements Act 2006 (VIC) — internal review (s22), special circumstances (s25)
- Key defenses: incorrect signage (Australian Standards AS1742), faulty meters, unclear parking restrictions, grace periods, disproportionate fines, procedural irregularities, exemptions for loading/unloading

**🇨🇦 Canada (~68% success rate):**
- Provincial Highway Traffic Acts: Ontario HTA s170, BC MVA, Alberta TSA
- Municipal by-law enforcement and parking regulations
- City of Toronto Municipal Code Chapter 950
- Provincial Offences Act (Ontario) — trial and appeal rights
- Key defenses: unclear signage (Transportation Association of Canada guidelines), meter malfunctions, procedural defects, inconsistent by-law application, missing information on ticket

**🇩🇪 Germany (~61% success rate):**
- Straßenverkehrsordnung (StVO) — §12-14 (Halten und Parken)
- Ordnungswidrigkeitengesetz (OWiG) — §33-35 (objection procedures)
- Bußgeldkatalogverordnung (BKatV) — Schedule of fines
- Verwaltungsverfahrensgesetz (VwVfG) — procedural requirements
- Key defenses: inadequate signage (StVO §39-43), measurement errors, proportionality principle, Einspruch procedure defects, unclear zone markings

For OTHER jurisdictions (France, Italy, Spain, Netherlands, Japan, UAE, etc.): Apply general principles of procedural fairness, signage compliance, proportionality, and evidence quality. Cite specific local laws where known.

Be realistic about success probability:
- 80-95%: Clear procedural failures or strong legal grounds specific to the jurisdiction
- 60-79%: Good grounds with relevant case law support
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
    const { imagesBase64, imageBase64, userDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Support both old single-image and new multi-image format
    const images: string[] = imagesBase64 && imagesBase64.length > 0
      ? imagesBase64
      : imageBase64
        ? [imageBase64]
        : [];

    const userContent: any[] = [];

    for (const img of images) {
      userContent.push({
        type: "image_url",
        image_url: { url: img },
      });
    }

    const now = new Date().toISOString();
    const todayStr = `Today's date and time is ${now}.`;

    const imageCount = images.length;
    userContent.push({
      type: "text",
      text: userDescription
        ? `${todayStr} Analyze this parking ticket/fine. The user describes: "${userDescription}".${imageCount > 1 ? ` ${imageCount} images provided (front and back of ticket).` : ""} First detect the country/jurisdiction, then identify all possible legal grounds for appeal under the applicable local laws. Use today's date to accurately assess any time-based issues (e.g. whether the ticket was issued recently, deadline calculations, grace periods).`
        : `${todayStr} Analyze this parking ticket/fine image${imageCount > 1 ? "s" : ""}.${imageCount > 1 ? ` ${imageCount} images provided (likely front and back of the same ticket).` : ""} First detect the country/jurisdiction from visual clues. Extract all details visible (ticket number, date, location, violation code, issuing authority, amount, etc.) and identify all possible legal grounds for appeal under the applicable local laws. Use today's date to accurately assess any time-based issues (e.g. whether the ticket was issued recently, deadline calculations, grace periods).`,
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
                      vehicle_registration: { type: "string", description: "Vehicle registration/license plate number if visible on the ticket" },
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
