import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_resumes",
  title: "List tailored resumes",
  description:
    "List the signed-in user's AI-tailored resumes, most recent first, including each resume's title, creation date, and ATS match score when available.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum number of resumes to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("generated_resumes")
      .select("id, title, created_at, ats_reports(score)")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const items = (data ?? []).map((row) => {
      const reports = row.ats_reports as unknown as { score: number }[] | null;
      return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        atsScore: reports && reports.length > 0 ? reports[0].score : null,
      };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { resumes: items },
    };
  },
});
