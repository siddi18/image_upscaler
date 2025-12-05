"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

type ApiKey = {
  apiKey: string;
};

const ImageUploader = ({ apiKey }: ApiKey) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImages, setProcessedImages] = useState<{ name: string; original: string; upscaled: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [upscaleOption, setUpscaleOption] = useState<"2x" | "4x">("2x");
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024;
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    files.forEach((file) => {
      if (!allowedFormats.includes(file.type)) {
        errors.push(`${file.name}: Invalid format. Only PNG, JPG, JPEG, and WebP are supported.`);
        return;
      }

      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(`${file.name}: File too large (${sizeMB}MB). Maximum size is 5MB.`);
        return;
      }

      validFiles.push(file);
    });

    return { valid: validFiles, errors };
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    
    const { valid: validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setError(errors.join("\n"));
      if (validFiles.length === 0) {
        return;
      }
    }

    setLoading(true);
    setProgress(0);
    const results: { name: string; original: string; upscaled: string }[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const baseProgress = (i / validFiles.length) * 100;

      try {
        // Stage 1: Reading file (20% of each file's progress)
        setProgress(baseProgress + (20 / validFiles.length));
        const originalBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(",")[1]);
          };
          reader.readAsDataURL(file);
        });

        // Stage 2: Preparing upload (40% of each file's progress)
        setProgress(baseProgress + (40 / validFiles.length));

        const formData = new FormData();
        formData.append("image", file);

        const options = {
          method: "POST",
          url: "https://ai-image-upscaler1.p.rapidapi.com/v1",
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "ai-image-upscaler1.p.rapidapi.com",
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        };

        // Stage 3: Processing with AI (70% of each file's progress)
        setProgress(baseProgress + (70 / validFiles.length));
        const response = await axios.request(options);
        
        // Stage 4: Finalizing (100% of each file's progress)
        setProgress(baseProgress + (100 / validFiles.length));
        
        results.push({
          name: file.name,
          original: originalBase64,
          upscaled: response.data.result_base64,
        });
        console.log(`File ${file.name} processed successfully:`, response.data);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    setProcessedImages(results);
    setLoading(false);
    setProgress(0);
  };

  const downloadImage = (base64: string, name: string) => {
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    saveAs(blob, name);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
    >
      <div
        className={`fixed min-h-screen w-screen inset-0 z-50 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 backdrop-blur-sm transition-all duration-300 flex justify-center lg:p-10 ${
          isDragging ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-95"
        }`}
      >
        <div className="w-full h-full rounded-3xl flex flex-col justify-center items-center border-4 border-dashed border-white/50 animate-pulse px-4">
          <svg className="w-16 h-16 sm:w-24 sm:h-24 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold text-center">Drop Your Images Here</p>
          <p className="text-white/70 text-base sm:text-lg mt-2 text-center">Release to upload and enhance</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <div className="lg:pt-32 lg:pb-20 pb-12 lg:px-48 px-4 pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
              AI Image Upscaler
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">Transform your images with cutting-edge AI technology</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-bold text-lg mb-2">Validation Error</h3>
                  <div className="text-red-700 text-sm whitespace-pre-line">{error}</div>
                </div>
                <button onClick={() => setError(null)} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="border-4 border-dashed border-gray-300 rounded-2xl py-16 px-8 transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/30">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 border-8 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-3 border-8 border-transparent border-t-pink-500 rounded-full animate-spin" style={{animationDuration: "1.5s", animationDirection: "reverse"}}></div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-gray-800 text-2xl font-bold">Enhancing Your Images</p>
                      <p className="text-gray-600">AI is working its magic...</p>
                    </div>
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-gray-700 text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden" style={{ width: `${progress}%` }}>
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50"></div>
                      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 rounded-full">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 w-full">
                      <p className="text-gray-700 font-semibold text-sm">Upscaling Options</p>
                      <div className="flex gap-3 flex-wrap justify-center">
                        <button
                          onClick={() => setUpscaleOption("2x")}
                          className={upscaleOption === "2x" ? "px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" : "px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 bg-gray-200 text-gray-600 hover:bg-gray-300"}
                        >
                          2x Quality
                        </button>
                        <button
                          onClick={() => setUpscaleOption("4x")}
                          className={upscaleOption === "4x" ? "px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" : "px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 bg-gray-200 text-gray-600 hover:bg-gray-300"}
                        >
                          4x Quality
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleButtonClick}
                      className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Choose Images
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <div className="text-center space-y-2">
                      <p className="text-gray-600 font-medium text-sm sm:text-base">Drag & drop your images here</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Supports PNG, JPG, JPEG, WebP • Max 5MB per file</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {processedImages.length > 0 && (
        <div className="lg:px-48 px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                ✨ Before & After Comparison
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">See the amazing transformation powered by AI</p>
            </div>
            
            <div className="space-y-8">
              {processedImages.map((image, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-4">
                    <p className="text-white font-bold text-lg truncate" title={image.name}>
                      📸 {image.name}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            Original
                          </h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Before</span>
                        </div>
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                          <img src={`data:image/jpeg;base64,${image.original}`} alt={`Original ${image.name}`} className="w-full h-full object-contain" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
                            Enhanced
                          </h3>
                          <span className="text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full font-semibold">After ✨</span>
                        </div>
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-200 bg-purple-50">
                          <img src={`data:image/jpeg;base64,${image.upscaled}`} alt={`Enhanced ${image.name}`} className="w-full h-full object-contain" />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            AI Enhanced
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => downloadImage(image.upscaled, image.name)}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">Download Enhanced Image</span>
                        <span className="sm:hidden">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
