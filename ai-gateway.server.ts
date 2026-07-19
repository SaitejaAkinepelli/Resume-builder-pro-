// Server-only helper that connects the AI SDK to the Lovable AI Gateway.
// Never import this from client/route code directly — only from server fn handlers.
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
    },
  });
}

export const DEFAULT_AI_MODEL = "google/gemini-3-flash-preview";
