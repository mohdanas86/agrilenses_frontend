// "use client";

// import {
//   ArrowLeft,
//   ArrowRight,
//   Camera,
//   Leaf,
//   Shield,
//   BarChart3,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// // Crop models data
// const cropModels = [
//   {
//     id: "tomato",
//     name: "Tomato",
//     emoji: "🍅",
//     description: "Detects common tomato diseases with advanced AI algorithms",
//     accuracy: "96.2%",
//     diseases: [
//       "Tomato Bacterial spot",
//       "Tomato Early blight",
//       "Tomato Late blight",
//       "Tomato Leaf Mold",
//       "Tomato Septoria leaf spot",
//       "Tomato Spider mites Two-spotted spider mite",
//       "Tomato Target Spot",
//       "Tomato Tomato Yellow Leaf Curl Virus",
//       "Tomato Tomato mosaic virus",
//       "Tomato healthy",
//     ],
//     bgGradient: "from-red-500 to-orange-500",
//     pattern: "bg-gradient-to-br from-red-500/10 to-orange-500/10",
//   },
//   {
//     id: "potato",
//     name: "Potato",
//     emoji: "🥔",
//     description: "Identifies potato plant diseases with precision diagnostics",
//     accuracy: "94.8%",
//     diseases: ["Late Blight", "Early Blight"],
//     bgGradient: "from-yellow-600 to-amber-600",
//     pattern: "bg-gradient-to-br from-yellow-600/10 to-amber-600/10",
//   },
// ];

// const Models = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   // Auto-rotate carousel
//   useEffect(() => {
//     if (!isAutoPlaying) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % cropModels.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isAutoPlaying]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % cropModels.length);
//     setIsAutoPlaying(false);
//   };

//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) => (prev - 1 + cropModels.length) % cropModels.length
//     );
//     setIsAutoPlaying(false);
//   };

//   const currentModel = cropModels[currentSlide];

//   return (
//     <React.Fragment>
//       <div className="heroSection relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-[80vh] flex items-center">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <svg
//             className="w-full h-full"
//             viewBox="0 0 100 100"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <defs>
//               <pattern
//                 id="grain"
//                 x="0"
//                 y="0"
//                 width="20"
//                 height="20"
//                 patternUnits="userSpaceOnUse"
//               >
//                 <circle cx="10" cy="10" r="1" fill="currentColor" />
//               </pattern>
//             </defs>
//             <rect width="100" height="100" fill="url(#grain)" />
//           </svg>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left Side - Content */}
//             <div className="space-y-8 animate-fade-in">
//               {/* Main Heading */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
//                     <Leaf className="h-4 w-4 text-green-600" />
//                     <span className="text-sm font-medium text-green-700">
//                       AI-Powered Agriculture
//                     </span>
//                   </div>
//                 </div>

//                 <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//                   Smart Disease
//                   <span
//                     className={`bg-gradient-to-r ${currentModel.bgGradient} bg-clip-text text-transparent block`}
//                   >
//                     Detection
//                   </span>
//                 </h1>

//                 <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
//                   Advanced AI models for precise crop disease identification.
//                   Protect your harvest with cutting-edge technology.
//                 </p>
//               </div>

//               {/* Current Model Details */}
//               <div
//                 className={`${currentModel.pattern} rounded-2xl p-6 border border-gray-200/50 backdrop-blur-sm transition-all duration-500`}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="text-4xl">{currentModel.emoji}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="text-2xl font-bold text-gray-900">
//                         {currentModel.name}
//                       </h3>
//                       <Badge
//                         variant="secondary"
//                         className="bg-green-100 text-green-800 font-semibold"
//                       >
//                         <BarChart3 className="h-3 w-3 mr-1" />
//                         {currentModel.accuracy}
//                       </Badge>
//                     </div>
//                     <p className="text-gray-700 mb-4">
//                       {currentModel.description}
//                     </p>

//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2">
//                         <Shield className="h-4 w-4 text-green-600" />
//                         <span className="text-sm font-medium text-gray-800">
//                           Detects {currentModel.diseases.length} conditions
//                         </span>
//                       </div>

//                       <div className="flex flex-wrap gap-2">
//                         {currentModel.diseases
//                           .slice(0, 3)
//                           .map((disease, index) => (
//                             <Badge
//                               key={index}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {disease.replace(`${currentModel.name} `, "")}
//                             </Badge>
//                           ))}
//                         {currentModel.diseases.length > 3 && (
//                           <Badge variant="outline" className="text-xs">
//                             +{currentModel.diseases.length - 3} more
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button
//                   size="lg"
//                   className={`bg-gradient-to-r ${currentModel.bgGradient} hover:opacity-90 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3`}
//                 >
//                   <Camera className="h-5 w-5" />
//                   Start Scanning
//                 </Button>

//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="font-semibold text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Learn More
//                 </Button>
//               </div>

//               {/* Carousel Indicators */}
//               <div className="flex items-center gap-3">
//                 {cropModels.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setCurrentSlide(index);
//                       setIsAutoPlaying(false);
//                     }}
//                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                       index === currentSlide
//                         ? `bg-gradient-to-r ${currentModel.bgGradient}`
//                         : "bg-gray-300 hover:bg-gray-400"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Right Side - Visual Carousel */}
//             <div className="relative">
//               <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl">
//                 {cropModels.map((model, index) => (
//                   <div
//                     key={model.id}
//                     className={`absolute inset-0 transition-all duration-700 ease-in-out ${
//                       index === currentSlide
//                         ? "opacity-100 scale-100"
//                         : "opacity-0 scale-95"
//                     }`}
//                   >
//                     <div
//                       className={`h-full bg-gradient-to-br ${model.bgGradient} flex items-center justify-center relative overflow-hidden`}
//                     >
//                       {/* Background Pattern */}
//                       <div className="absolute inset-0 opacity-20">
//                         <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full" />
//                         <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full" />
//                         <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/15 rounded-full" />
//                       </div>

//                       {/* Main Content */}
//                       <div className="text-center text-white z-10">
//                         <div className="text-8xl mb-6 drop-shadow-lg">
//                           {model.emoji}
//                         </div>
//                         <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
//                           {model.name}
//                         </h2>
//                         <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
//                           <span className="text-lg font-semibold">
//                             {model.accuracy} Accuracy
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Carousel Controls */}
//               <button
//                 onClick={prevSlide}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 group"
//               >
//                 <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
//               </button>

//               <button
//                 onClick={nextSlide}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 group"
//               >
//                 <ArrowRight className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Models;
