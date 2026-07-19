import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_resume",
  title: "Get a tailored resume",
  description:
    "Fetch a single AI-tailored resume by id for the signed-in user, including the full structured resume content and its ATS report (score, matched/missing keywords, strengths, and suggestions).",
  inputSchema: {
    id: z.string().uuid().describe("The id of the generated resume (from list_resumes)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    const { data: gen, error } = await supabase
      .from("generated_resumes")
      .select("id, title, created_at, template_schema")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!gen) {
      return { content: [{ type: "text", text: "Resume not found." }], isError: true };
    }

    const { data: rep } = await supabase
      .from("ats_reports")
      .select("score, missing_keywords, suggestions, strengths, improvement_areas")
      .eq("generated_resume_id", id)
      .maybeSingle();

    const result = {
      id: gen.id,
      title: gen.title,
      createdAt: gen.created_at,
      resume: gen.template_schema,
      atsReport: rep
        ? {
            score: rep.score,
            missingKeywords: rep.missing_keywords,
            strengths: rep.strengths,
            improvementAreas: rep.improvement_areas,
            suggestions: rep.suggestions,
          }
        : null,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
