import { useState, useRef } from 'react';
import { useCreateCommunity } from '../../hooks/useQueries';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { CommunityCategory, ExternalBlob } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateCommunityModal({ open, onClose }: CreateCommunityModalProps) {
  const createCommunity = useCreateCommunity();
  const { data: userProfile } = useGetCallerUserProfile();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>(CommunityCategory.coding);
  const [college, setCollege] = useState(userProfile?.college || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    let coverImageBlob: ExternalBlob | null = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      coverImageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
    }

    createCommunity.mutate(
      {
        name,
        description,
        category,
        college: college || userProfile?.college || '',
        city: city || userProfile?.city || '',
        isPublic,
        coverImage: coverImageBlob,
      },
      {
        onSuccess: () => {
          onClose();
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory(CommunityCategory.coding);
    setCollege('');
    setCity('');
    setIsPublic(true);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); resetForm(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Image Upload */}
          <div>
            <Label className="mb-1.5 block">Cover Image (optional)</Label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <ImagePlus size={24} />
                <span className="text-sm">Click to upload cover image</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div>
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IIT Delhi Coders"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              required
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as CommunityCategory)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CommunityCategory.coding}>Coding</SelectItem>
                <SelectItem value={CommunityCategory.entrepreneurship}>Entrepreneurship</SelectItem>
                <SelectItem value={CommunityCategory.marketing}>Marketing</SelectItem>
                <SelectItem value={CommunityCategory.design}>Design</SelectItem>
                <SelectItem value={CommunityCategory.science}>Science</SelectItem>
                <SelectItem value={CommunityCategory.other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="comm-college">College</Label>
              <Input
                id="comm-college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Your college"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="comm-city">City</Label>
              <Input
                id="comm-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isPublic" className="font-medium">Public Community</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPublic ? 'Anyone can join directly' : 'Members need approval to join'}
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {createCommunity.isPending && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="text-sm text-muted-foreground">
              Uploading image: {uploadProgress}%
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCommunity.isPending}>
              {createCommunity.isPending ? (
                <><Loader2 size={14} className="mr-2 animate-spin" />Creating...</>
              ) : (
                'Create Community'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
