import { GoogleGenAI, Modality, Type } from "@google/genai";
import { EditResult, EnhancedPrompts } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithPrompt = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  negativePrompt?: string,
  maskBase64?: string,
): Promise<EditResult> => {
  try {
    let finalPrompt = prompt;
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt = `${prompt}. Negative prompt: do not include ${negativePrompt.trim()}.`;
    }

    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    // FIX: Refactored the construction of the 'parts' array to be more type-safe, resolving a TypeScript error.
    const parts: ({ inlineData: { data: string; mimeType: string; }; } | { text: string; })[] = [imagePart];

    if (maskBase64) {
      const maskPart = {
        inlineData: {
          data: maskBase64,
          mimeType: 'image/png', // Masks are always PNG
        },
      };
      // Order is important: image, mask, then prompt
      parts.push(maskPart);
      finalPrompt += " (Note: apply this edit ONLY to the masked area)";
    }

    parts.push({ text: finalPrompt });


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new Error('No content generated. The request may have been blocked by the API.');
    }

    if (!candidate.content || !candidate.content.parts) {
      const reason = candidate.finishReason ? ` (Reason: ${candidate.finishReason})` : '';
      const safetyInfo = candidate.safetyRatings?.some(r => r.blocked) ? ' The content may have been blocked by safety filters.' : '';
      throw new Error(`The AI did not return a valid image.${reason}${safetyInfo} Please try a different prompt.`);
    }

    const result: EditResult = { image: null, text: null };
    
    for (const part of candidate.content.parts) {
      if (part.text) {
        result.text = part.text;
      } else if (part.inlineData) {
        const generatedMimeType = part.inlineData.mimeType;
        const base64ImageBytes: string = part.inlineData.data;
        result.image = `data:${generatedMimeType};base64,${base64ImageBytes}`;
      }
    }

    if (!result.image) {
        throw new Error("The AI did not return an image. It may have refused the request.");
    }
    
    return result;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw new Error(`Failed to edit image. ${error instanceof Error ? error.message : ''}`);
  }
};


export const enhancePrompt = async (
  prompt: string,
  negativePrompt: string
): Promise<EnhancedPrompts> => {
  try {
    const systemInstruction = `You are a creative assistant that enhances user prompts for an AI image editor.
    Your task is to rewrite the user's prompt and negative prompt to be more descriptive, safer, and more likely to produce a high-quality, unblocked result from a generative AI model.
    - Expand on the user's idea, adding artistic details (e.g., lighting, style, composition).
    - Ensure the tone is positive and avoids any ambiguous or potentially sensitive terms.
    - If the negative prompt is empty, create a helpful one that excludes common image artifacts (e.g., "blurry, distorted, watermark, text, extra limbs").
    - Return ONLY the JSON object with the enhanced prompts.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following for an AI image generator:\n\nPrompt: "${prompt}"\nNegative Prompt: "${negativePrompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: {
              type: Type.STRING,
              description: "The enhanced, descriptive, and safe version of the user's main prompt.",
            },
            enhancedNegativePrompt: {
              type: Type.STRING,
              description: "The enhanced or generated negative prompt to avoid common issues.",
            },
          },
          required: ["enhancedPrompt", "enhancedNegativePrompt"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error enhancing prompt with Gemini:", error);
    throw new Error(`Failed to enhance prompt. ${error instanceof Error ? error.message : ''}`);
  }
};