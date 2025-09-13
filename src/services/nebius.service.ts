import { nebiusClient } from "../config/nebius.config";
import { GenerateImageInput } from "../validations/llm.validation";

export class Nebius {
  async generateImage({ model, prompt }: GenerateImageInput["body"]) {
    try {
      const imagesResponse = await nebiusClient.images.generate({
        model: model || "black-forest-labs/flux-dev",
        prompt,
      });
      if (!imagesResponse) {
        throw new Error("Failed to generate image");
      }
      return imagesResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

export const nebiusService = new Nebius();
