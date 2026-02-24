import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetListingById, useUpdateListingStatus } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ArrowLeft, MapPin, Building2, Tag, Clock, CheckCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ListingStatus } from '../backend';

export default function ListingDetailPage() {
  const { listingId } = useParams({ from: '/marketplace/$listingId' });
  const id = BigInt(listingId);
  const { data: listing, isLoading } = useGetListingById(id);
  const { identity } = useInternetIdentity();
  const updateStatus = useUpdateListingStatus();

  const isOwner = identity && listing
    ? listing.sellerPrincipal.toString() === identity.getPrincipal().toString()
    : false;

  const handleStatusUpdate = async (status: ListingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Listing marked as ${status}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 rounded-xl mb-4" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Listing not found</h2>
        <Link to="/marketplace">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    sell: 'bg-teal-light text-teal-dark border-0',
    buy: 'bg-secondary text-secondary-foreground border-0',
    rent: 'bg-amber-light text-amber-dark border-0',
  };

  const listingImageUrl = listing.image?.getDirectURL();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl animate-fade-in">
      <Link to="/marketplace">
        <Button variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Button>
      </Link>

      <Card className="border-border overflow-hidden">
        {/* Listing Image */}
        {listingImageUrl ? (
          <div className="h-56 bg-muted overflow-hidden">
            <img
              src={listingImageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 bg-muted flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <ImageIcon size={32} />
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}

        <CardContent className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {listing.category}
            </Badge>
            <Badge className={`capitalize ${typeColors[listing.listingType] || ''}`}>
              {listing.listingType}
            </Badge>
            {listing.status !== 'active' && (
              <Badge variant="outline" className="capitalize text-muted-foreground">
                {listing.status}
              </Badge>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="font-display text-2xl font-bold mb-2">{listing.title}</h1>
            <p className="text-3xl font-bold text-teal font-display">
              ₹{listing.price.toFixed(0)}
              {listing.listingType === 'rent' && (
                <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
              )}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm mb-1.5">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">College</p>
                <p className="font-medium">{listing.college}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p className="font-medium">{listing.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Seller</p>
                <p className="font-medium">{listing.sellerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="font-medium">
                  {new Date(Number(listing.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && listing.status === 'active' && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-semibold mb-3">Update Listing Status</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-teal/30 text-teal hover:bg-teal-light gap-1.5"
                  onClick={() => handleStatusUpdate('sold' as ListingStatus)}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Sold
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-amber/30 text-amber-dark hover:bg-amber-light gap-1.5"
                  onClick={() => handleStatusUpdate('rented' as ListingStatus)}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Rented
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
