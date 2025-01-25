"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (logoUrl: string) => void;
}

export function LogoUploadModal({
  isOpen,
  onClose,
  onUpload,
}: LogoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("logo", selectedFile);

      const response = await fetch("/api/settings/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload logo");
      }

      const data = await response.json();
      onUpload(data.logoUrl);
      toast({
        title: "Logo uploaded",
        description: "Your new logo has been uploaded successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Télécharger un nouveau logo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {previewUrl && (
            <div className="relative w-40 h-40 mx-auto">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Logo preview"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>
            Ajouter le logo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
