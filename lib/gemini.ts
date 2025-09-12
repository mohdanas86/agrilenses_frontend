import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure this env variable is defined
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSuggestion(scan: {
  plantName: string;
  disease: string;
  confidence: number;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const prompt = `
// You are a plant pathologist. A scan reported:
// - Plant: ${scan.plantName}
// - Disease: ${scan.disease}
// - Confidence: ${Math.round(scan.confidence * 100)}%

// Give:
// - Short explanation (reason)
// - Treatment
// - Care tips

// Respond in **strict JSON** like:
// {
//   "reason": "...",
//   "treatment": "...",
//   "care": "..."
// }
// `;

const prompt = `
You are an expert plant pathologist and agronomist. Your task is to provide a detailed, actionable, and scientifically-grounded management plan based on a plant disease scan. The response should be clear for a farmer or home gardener.

Based on the following scan data:
- Plant: ${scan.plantName}
- Disease: ${scan.disease}
- Confidence: ${Math.round(scan.confidence * 100)}%

Generate a response in a **single, strict JSON object format** with no other text outside the JSON.

The JSON structure must be as follows:
{
  "identification": {
    "diseaseName": "${scan.disease}",
    "plant": "${scan.plantName}",
    "confidence": ${Math.round(scan.confidence * 100)},
    "symptoms": [
      "Symptom 1 that leads to this diagnosis...",
      "Symptom 2...",
      "Symptom 3..."
    ]
  },
  "managementPlan": {
    "culturalAndPreventative": [
      "Immediate non-chemical action 1...",
      "Preventative soil/water practice...",
      "Pruning or sanitation instruction..."
    ],
    "treatments": {
      "organicOptions": [
        {
          "activeIngredient": "e.g., Neem Oil",
          "description": "Why this is effective and how it works.",
          "application": "How to mix and apply it, and how often."
        }
      ],
      "chemicalOptions": [
        {
          "activeIngredient": "e.g., Mancozeb",
          "description": "Why this is a widely used and effective fungicide for this issue.",
          "application": "Instructions for application, including timing and frequency."
        }
      ]
    }
  },
  "longTermCare": {
    "notes": [
      "Long-term care tip 1 for plant resilience...",
      "Fertilizing advice...",
      "Monitoring advice..."
    ]
  },
  "warning": "Always read and follow the manufacturer's label instructions for any product. Wear appropriate personal protective equipment (PPE) when handling chemical treatments."
}

**Crucial Instructions & Constraints:**
1.  **Strict JSON Only:** The entire response must be a single, valid JSON object.
2.  **Active Ingredients, Not Brands:** Recommend widely recognized and scientifically proven **active ingredients**. Do NOT recommend specific product brand names.
3.  **Actionable Lists:** All arrays should contain clear, concise, and actionable steps.
4.  **Scientific Rationale:** The 'description' for treatments should explain *why* the ingredient is effective for the specified disease.
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  let text = result.response.text();

  // Strip markdown code blocks if present
  text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from Gemini:\n" + text);
  }
}
