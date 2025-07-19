import { CropModel } from "./types";

export const cropModels: CropModel[] = [
  {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    description: "Detects common tomato diseases",
    accuracy: "96.2%",
    diseases: ["Late Blight", "Early Blight", "Bacterial Spot", "Leaf Mold"],
  },
  {
    id: "potato",
    name: "Potato",
    emoji: "🥔",
    description: "Identifies potato plant diseases",
    accuracy: "94.8%",
    diseases: ["Late Blight", "Early Blight", "Common Scab", "Black Dot"],
  },
  {
    id: "rice",
    name: "Rice",
    emoji: "🌾",
    description: "Rice disease detection model",
    accuracy: "92.1%",
    diseases: ["Blast", "Brown Spot", "Bacterial Blight"],
    disabled: true,
  },
  {
    id: "wheat",
    name: "Wheat",
    emoji: "🌾",
    description: "Wheat crop disease analysis",
    accuracy: "90.5%",
    diseases: ["Rust", "Powdery Mildew", "Septoria"],
    disabled: true,
  },
  {
    id: "corn",
    name: "Corn",
    emoji: "🌽",
    description: "Corn disease identification",
    accuracy: "91.7%",
    diseases: ["Northern Leaf Blight", "Gray Leaf Spot"],
    disabled: true,
  },
];
