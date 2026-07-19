import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listResumesTool from "./tools/list-resumes";
import getResumeTool from "./tools/get-resume";

// OAuth issuer must be the direct Supabase host (not the .lovable.cloud proxy),
// so verification matches the issuer published in the discovery document.
// VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ai-resume-builder-mcp",
  title: "AI Resume Builder MCP",
  version: "0.1.0",
  instructions:
    "Tools for the AI Resume Builder. Use `list_resumes` to see the signed-in user's tailored resumes and their ATS scores, and `get_resume` to fetch the full content and ATS report for one resume by id.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listResumesTool, getResumeTool],
});
