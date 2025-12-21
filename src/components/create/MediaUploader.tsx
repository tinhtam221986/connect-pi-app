import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploaderProps {
  onMediaSelect: (file: File, previewUrl: string, type: 'video' | 'image') => void;
}

export function MediaUploader({ onMediaSelect }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      const url = URL.createObjectURL(file);

      setPreview(url);

      // Artificial delay to show processing state if file is loaded instantly
      // checking file validity or preparing preview
      await new Promise(resolve => setTimeout(resolve, 500));

      onMediaSelect(file, url, type);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <input
        type="file"
        ref={inputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Processing media...</p>
        </div>
      ) : !preview ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-sm border-2 border-dashed border-gray-600 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-white/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Upload className="w-8 h-8 text-gray-400 group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Select Media</h3>
          <p className="text-sm text-gray-400">Tap to upload video or image</p>
        </div>
      ) : (
        <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            onClick={clearSelection}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <video 
            src={preview} 
            className="w-full h-full object-contain" 
            controls={false}
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>
      )}
    </div>
  );
}
