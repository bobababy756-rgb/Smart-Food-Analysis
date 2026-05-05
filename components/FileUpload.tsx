import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface FileUploadProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onAnalyze(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative group overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out ${
          dragActive ? 'border-brand-500 bg-brand-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-brand-300 hover:bg-slate-50'
        } ${preview ? 'border-solid' : 'h-80 flex flex-col items-center justify-center'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isAnalyzing}
        />

        {preview ? (
          <div className="relative w-full h-full min-h-[300px] bg-slate-900">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain max-h-[500px] mx-auto opacity-90"
            />
            {!isAnalyzing && (
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                }}
                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isAnalyzing && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
                 <p className="text-white font-medium text-lg animate-pulse">Analyzing nutrients...</p>
               </div>
            )}
          </div>
        ) : (
          <div 
            className="text-center cursor-pointer p-8"
            onClick={() => inputRef.current?.click()}
          >
            <div className="mx-auto w-16 h-16 mb-4 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Upload Food Image
            </h3>
            <p className="text-slate-500 mb-6 max-w-xs mx-auto">
              Drag and drop your image here, or click to browse your gallery.
            </p>
            <span className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>Supports JPG, PNG, WEBP</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
