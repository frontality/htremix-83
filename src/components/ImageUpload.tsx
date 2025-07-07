
import { useState } from "react";
import { Camera, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
  bucket?: string;
  variant?: "avatar" | "marketplace";
}

const ImageUpload = ({ 
  currentImage, 
  onImageUpload, 
  className = "", 
  bucket = "avatars", 
  variant = "avatar" 
}: ImageUploadProps) => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadId] = useState(() => `marketplace-upload-${Math.random().toString(36).substr(2, 9)}`);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    
    try {
      console.log('Starting image upload...');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        console.log('Image converted to base64, calling onImageUpload');
        
        // Save to localStorage with timestamp for uniqueness
        const imageKey = `uploaded_image_${Date.now()}_${file.name}`;
        localStorage.setItem(imageKey, base64String);
        
        // Also save as current avatar for persistence if it's avatar variant
        if (variant === "avatar") {
          localStorage.setItem('current_avatar', base64String);
        }
        
        onImageUpload(base64String);
        
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
        
        toast({
          title: "Image uploaded! 📸",
          description: "Your image has been uploaded successfully",
        });
        setUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        toast({
          title: "Upload failed",
          description: "Failed to read the image file. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (variant === "avatar") {
      localStorage.removeItem('current_avatar');
      onImageUpload("/placeholder.svg");
      toast({
        title: "Image removed",
        description: "Profile image has been reset to default",
      });
    }
  };

  // Avatar variant (existing functionality)
  if (variant === "avatar") {
    return (
      <div className={`relative group ${className}`}>
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg transition-transform group-hover:scale-105 bg-gray-800">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="Upload preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image load error, using placeholder');
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <label htmlFor="image-upload" className="cursor-pointer">
            <Button
              type="button"
              size="sm"
              className={`${currentTheme.primary} text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-2 pointer-events-none`}
              disabled={uploading}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : uploadSuccess ? (
                <Check className="h-4 w-4" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {uploading ? 'Uploading...' : uploadSuccess ? 'Success!' : 'Change'}
            </Button>
          </label>
        </div>
        
        {/* Remove button */}
        {currentImage && currentImage !== "/placeholder.svg" && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        )}
        
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>
    );
  }

  // Marketplace variant (rectangular upload area)
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={uploadId} className="cursor-pointer block">
        <div className="w-full h-full border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-colors bg-gray-800/50 hover:bg-gray-700/50">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
          ) : uploadSuccess ? (
            <Check className="h-8 w-8 text-green-500 mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
          )}
          <span className="text-sm text-gray-400 text-center">
            {uploading ? 'Uploading...' : uploadSuccess ? 'Added!' : 'Click to upload or drag & drop'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF up to 10MB
          </span>
        </div>
      </label>
      
      <input
        id={uploadId}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUpload;
