import React, { useState, useRef } from 'react';
import Parse from '../lib/parse';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Loader2, Upload as UploadIcon, X, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '../lib/utils';

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG or PNG image.",
        type: "error",
      });
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        type: "error",
      });
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
       toast({
        title: "Missing information",
        description: "Please provide a title and select an image.",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) throw new Error("Not authenticated");

      // 1. Create Parse File with sanitized filename
      // Remove invalid characters and replace spaces with underscores
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const parseFile = new Parse.File(sanitizedName, file);
      await parseFile.save();

      // 2. Create Gallery Object
      const Gallery = Parse.Object.extend("Gallery");
      const galleryItem = new Gallery();
      galleryItem.set("title", title);
      galleryItem.set("imageFile", parseFile);
      galleryItem.set("user", currentUser);

      await galleryItem.save();

      toast({
        title: "Upload Successful",
        description: "Your image has been added to the gallery.",
        type: "success",
      });

      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description: error.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Share your photos with the community. Max 5MB (JPEG/PNG).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Image Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Sunset at the beach" 
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label>Image File</Label>
              {!preview ? (
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                      <UploadIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={preview} alt="Preview" className="w-full h-64 object-contain" />
                  <div className="absolute top-2 right-2">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={clearFile}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-white border-t flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file?.name}</p>
                      <p className="text-xs text-slate-500">{file ? formatBytes(file.size) : ''}</p>
                    </div>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isUploading || !file}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
