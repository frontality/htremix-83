
import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to:', bucket, filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // If bucket doesn't exist, create it and try again
        if (uploadError.message.includes('not found')) {
          const { error: bucketError } = await supabase.storage
            .createBucket(bucket, { public: true });
          
          if (!bucketError) {
            const { error: retryError } = await supabase.storage
              .from(bucket)
              .upload(filePath, file);
            
            if (retryError) throw retryError;
          } else {
            throw uploadError;
          }
        } else {
          throw uploadError;
        }
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', data.publicUrl);
      onImageUpload(data.publicUrl);
      
      toast({
        title: "Image uploaded!",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
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
