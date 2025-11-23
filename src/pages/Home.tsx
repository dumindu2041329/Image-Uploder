import React, { useEffect, useState } from 'react';
import Parse, { isParseInitialized } from '../lib/parse';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Loader2, ImageOff, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
  uploader: string;
  uploaderId: string;
}

export function Home() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!isParseInitialized()) {
        setError('Parse is not initialized. Please check your API keys in .env');
        setLoading(false);
        return;
      }

      try {
        const Gallery = Parse.Object.extend('Gallery');
        const query = new Parse.Query(Gallery);
        query.descending('createdAt');
        query.include('user');
        const results = await query.find();

        const formattedImages = results.map((item) => ({
          id: item.id,
          title: item.get('title'),
          imageUrl: item.get('imageFile')?.url() || '',
          createdAt: item.get('createdAt'),
          uploader: item.get('user')?.getUsername() || 'Unknown',
          uploaderId: item.get('user')?.id || '',
        }));

        setImages(formattedImages);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load gallery.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openDeleteDialog = (imageId: string, imageTitle: string) => {
    setImageToDelete({ id: imageId, title: imageTitle });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!user || !imageToDelete) {
      return;
    }

    setDeletingId(imageToDelete.id);
    try {
      const Gallery = Parse.Object.extend('Gallery');
      const query = new Parse.Query(Gallery);
      const object = await query.get(imageToDelete.id);
      await object.destroy();
      
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      alert(err.message || 'Failed to delete image.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <ImageOff className="h-12 w-12 text-muted mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Connection Error</h3>
        <p className="text-muted-foreground max-w-md mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Public Gallery</h1>
        <p className="text-muted-foreground mt-2">Explore images shared by the community.</p>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-muted/50 rounded-lg border border-dashed border-border">
          <ImageOff className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No images yet</p>
          <p className="text-muted-foreground text-sm">Be the first to upload something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden bg-muted/30 relative">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate" title={img.title}>{img.title}</h3>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>@{img.uploader}</span>
                  <span>{img.createdAt.toLocaleDateString()}</span>
                </div>
                {user && user.id === img.uploaderId && (
                  <Button
                    onClick={() => openDeleteDialog(img.id, img.title)}
                    disabled={deletingId === img.id}
                    variant="destructive"
                    size="sm"
                    className="w-full mt-3"
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="text-left">Delete Image</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              Are you sure you want to delete <strong>"{imageToDelete?.title}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={!!deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!!deletingId}
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
