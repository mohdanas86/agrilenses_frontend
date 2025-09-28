import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure this env variable is defined
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSuggestion(scan: {
  plantName: string;
  disease: string;
  confidence: number;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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














// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Make sure this env variable is defined
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function generateSuggestion(scan: {
//   plantName: string;
//   disease: string;
//   confidence: number;
// }) {
//   try {
//     // Check if API key is available
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error("GEMINI_API_KEY environment variable is not set");
//     }

//     console.log("Generating suggestion for:", scan);
//     console.log("Using API key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

//     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); // Using latest flash model

//     const prompt = `You are a plant disease expert. For ${scan.plantName} with ${scan.disease} disease (${Math.round(scan.confidence * 100)}% confidence), provide treatment advice in this exact JSON format:

// {
//   "identification": {
//     "diseaseName": "${scan.disease}",
//     "plant": "${scan.plantName}",
//     "confidence": ${Math.round(scan.confidence * 100)},
//     "symptoms": ["Affected leaves show spots", "Yellowing of plant parts", "Reduced growth"]
//   },
//   "managementPlan": {
//     "culturalAndPreventative": [
//       "Remove and destroy affected plant parts",
//       "Improve air circulation around plants",
//       "Avoid overhead watering"
//     ],
//     "treatments": {
//       "organicOptions": [
//         {
//           "activeIngredient": "Neem Oil",
//           "description": "Natural fungicide that disrupts pest life cycles",
//           "application": "Mix 2-3 ml per liter of water and spray weekly"
//         }
//       ],
//       "chemicalOptions": [
//         {
//           "activeIngredient": "Copper fungicide",
//           "description": "Effective against fungal diseases on contact",
//           "application": "Apply as per product instructions, repeat every 7-10 days"
//         }
//       ]
//     }
//   },
//   "longTermCare": {
//     "notes": [
//       "Monitor plants regularly for early disease signs",
//       "Practice crop rotation in future seasons",
//       "Maintain proper plant spacing for air circulation"
//     ]
//   },
//   "warning": "Always follow label instructions and wear protective equipment when applying treatments"
// }

// Return only the JSON, no other text.`;

//     console.log("Model initialized, generating content...");

//     // Add retry logic for better reliability
//     let result;
//     let retries = 3;
//     while (retries > 0) {
//       try {
//         result = await model.generateContent({
//           contents: [{ role: "user", parts: [{ text: prompt }] }],
//         });
//         break; // Success, exit retry loop
//       } catch (retryError: any) {
//         retries--;
//         console.log(`Attempt failed, ${retries} retries left:`, retryError.message);
//         if (retries === 0) throw retryError;
//         // Wait 1 second before retry
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }

//     console.log("Content generated, getting response...");

//     let text = result!.response.text();
//     console.log("Raw response received:", text.substring(0, 200) + "...");

//     // Strip markdown code blocks if present
//     text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();

//     console.log("Cleaned response:", text.substring(0, 200) + "...");

//     const parsed = JSON.parse(text);
//     console.log("Successfully parsed JSON response");

//     return parsed;

//   } catch (error: any) {
//     console.error("Error in generateSuggestion:", {
//       message: error.message,
//       name: error.name,
//       stack: error.stack,
//       response: error.response?.data,
//       status: error.response?.status
//     });

//     // Return fallback response instead of throwing error
//     console.log("Using fallback response due to API error");
//     return {
//       identification: {
//         diseaseName: scan.disease,
//         plant: scan.plantName,
//         confidence: Math.round(scan.confidence * 100),
//         symptoms: ["Disease symptoms may include spots, discoloration, or wilting"]
//       },
//       managementPlan: {
//         culturalAndPreventative: [
//           "Remove and destroy affected plant parts immediately",
//           "Improve air circulation around plants",
//           "Avoid overhead watering to reduce humidity"
//         ],
//         treatments: {
//           organicOptions: [{
//             activeIngredient: "Neem Oil",
//             description: "Natural fungicide and pesticide",
//             application: "Mix 2-3 ml per liter of water and spray every 7-10 days"
//           }],
//           chemicalOptions: [{
//             activeIngredient: "Copper-based fungicide",
//             description: "Broad-spectrum fungicide effective against many plant diseases",
//             application: "Apply according to product label instructions"
//           }]
//         }
//       },
//       longTermCare: {
//         notes: [
//           "Regular monitoring of plant health is essential",
//           "Practice proper crop rotation",
//           "Maintain optimal soil health and fertility"
//         ]
//       },
//       warning: "This is general advice. Please consult local agricultural experts for specific treatment recommendations."
//     };
//   }
// }
