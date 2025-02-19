import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { AlertCircle, ImageOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecordPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    title: string;
    fileUrl?: string;
    type?: string;
    fileName?: string;
  } | null;
}

export function RecordPreviewDialog({ isOpen, onClose, record }: RecordPreviewDialogProps) {
  if (!record) return null;

  const [previewError, setPreviewError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  console.log("Preview dialog opened for record:", record);
  console.log("File URL:", record.fileUrl);
  console.log("File name:", record.fileName);

  // Check both the URL and fileName for file type detection
  const fileUrl = record.fileUrl?.toLowerCase() || '';
  const fileName = record.fileName?.toLowerCase() || '';
  
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName) || /\.(jpg|jpeg|png|gif|webp)/i.test(fileUrl);
  const isPDF = /\.pdf$/i.test(fileName) || /\.pdf/i.test(fileUrl);

  console.log("File type detection:", { isImage, isPDF, fileName });

  const handleError = (error: string) => {
    console.error("Preview error:", error);
    setPreviewError(error);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", e);
    setImageLoadError(true);
    handleError("Failed to load image. The file might be corrupted or inaccessible.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{record.title}</DialogTitle>
          <DialogDescription>
            {record.type || 'Health record preview'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {previewError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{previewError}</AlertDescription>
            </Alert>
          )}
          
          {isImage && record.fileUrl && (
            <AspectRatio ratio={16 / 9}>
              {imageLoadError ? (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                  <div className="text-center">
                    <ImageOff className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Image failed to load</p>
                  </div>
                </div>
              ) : (
                <img
                  src={record.fileUrl}
                  alt={record.title}
                  className="rounded-md object-contain w-full h-full"
                  onError={handleImageError}
                />
              )}
            </AspectRatio>
          )}
          
          {isPDF && record.fileUrl && (
            <div className="w-full h-[70vh]">
              <iframe
                src={record.fileUrl}
                className="w-full h-full rounded-md"
                title={record.title}
                onError={() => {
                  handleError("Failed to load PDF. The file might be corrupted or inaccessible.");
                }}
              />
            </div>
          )}
          
          {(!isImage && !isPDF && record.fileUrl) || (!record.fileUrl) ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>This file type is not supported for preview or the file URL is missing.</p>
              <p className="text-sm mt-2">Supported formats: JPG, PNG, GIF, WEBP, PDF</p>
              {record.fileUrl && (
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-4 inline-block"
                >
                  Download File
                </a>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}