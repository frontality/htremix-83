
import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
  bucket?: string;
}

const ImageUpload = ({ currentImage, onImageUpload, className = "", bucket = "avatars" }: ImageUploadProps) => {
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      // For now, we'll convert to base64 and store locally since Supabase storage isn't configured
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        console.log('Image converted to base64');
        onImageUpload(base64String);
        
        toast({
          title: "Image uploaded!",
          description: "Your image has been uploaded successfully",
        });
        setUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
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

  return (
    <div className={`relative group ${className}`}>
      <img
        src={currentImage || "/placeholder.svg"}
        alt="Upload preview"
        className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg transition-transform group-hover:scale-105"
      />
      
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button
            type="button"
            size="sm"
            className={`${currentTheme.primary} text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-2`}
            disabled={uploading}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Camera className="h-4 w-4" />
            )}
            {uploading ? 'Uploading...' : 'Change'}
          </Button>
        </label>
      </div>
      
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
