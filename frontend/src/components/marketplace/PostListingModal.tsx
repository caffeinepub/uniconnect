import { useState, useRef } from 'react';
import { useCreateListing } from '../../hooks/useQueries';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { ListingCategory, ListingType, ListingAreaScope, ExternalBlob } from '../../backend';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface PostListingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PostListingModal({ open, onClose }: PostListingModalProps) {
  const createListing = useCreateListing();
  const { data: userProfile } = useGetCallerUserProfile();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>(ListingCategory.books);
  const [listingType, setListingType] = useState<ListingType>(ListingType.sell);
  const [price, setPrice] = useState('');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [areaScope, setAreaScope] = useState<ListingAreaScope>(ListingAreaScope.city);
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
    if (!title || !description || !price) return;

    let imageBlob: ExternalBlob | null = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
    }

    createListing.mutate(
      {
        title,
        description,
        category,
        listingType,
        price: parseFloat(price),
        sellerName: userProfile?.name || 'Anonymous',
        college: college || userProfile?.college || '',
        city: city || userProfile?.city || '',
        areaScope,
        image: imageBlob,
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
    setTitle('');
    setDescription('');
    setCategory(ListingCategory.books);
    setListingType(ListingType.sell);
    setPrice('');
    setCollege('');
    setCity('');
    setAreaScope(ListingAreaScope.city);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); resetForm(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label className="mb-1.5 block">Image (optional)</Label>
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
                <span className="text-sm">Click to upload image</span>
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Engineering Mathematics Textbook"
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
              placeholder="Describe the item, condition, etc."
              required
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ListingCategory)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ListingCategory.books}>Books</SelectItem>
                  <SelectItem value={ListingCategory.notes}>Notes</SelectItem>
                  <SelectItem value={ListingCategory.stationery}>Stationery</SelectItem>
                  <SelectItem value={ListingCategory.other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={listingType} onValueChange={(v) => setListingType(v as ListingType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ListingType.sell}>Sell</SelectItem>
                  <SelectItem value={ListingType.buy}>Buy</SelectItem>
                  <SelectItem value={ListingType.rent}>Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Your college"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Visibility</Label>
            <Select value={areaScope} onValueChange={(v) => setAreaScope(v as ListingAreaScope)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ListingAreaScope.campus}>Campus Only</SelectItem>
                <SelectItem value={ListingAreaScope.city}>City Wide</SelectItem>
                <SelectItem value={ListingAreaScope.all}>All India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {createListing.isPending && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="text-sm text-muted-foreground">
              Uploading image: {uploadProgress}%
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createListing.isPending}>
              {createListing.isPending ? (
                <><Loader2 size={14} className="mr-2 animate-spin" />Posting...</>
              ) : (
                'Post Listing'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
