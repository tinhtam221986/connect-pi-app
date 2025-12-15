import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploaderProps {
  onMediaSelect: (file: File, previewUrl: string, type: 'video' | 'image') => void;
}

export function MediaUploader({ onMediaSelect }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('video') ? 'video' : 'image';
    const url = URL.createObjectURL(file);
    
    setPreview(url);
    onMediaSelect(file, url, type);
  };

  const clearSelection = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="file"
        ref={inputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!preview ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-400">Tap to upload video or image</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-[9/16]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={clearSelection}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <video 
            src={preview} 
            className="w-full h-full object-contain" 
            controls 
            autoPlay 
            loop 
            muted 
          />
        </div>
      )}
    </div>
  );
}
