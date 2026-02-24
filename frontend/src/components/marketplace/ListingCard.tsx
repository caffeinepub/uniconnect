import { Link } from '@tanstack/react-router';
import { Listing, ListingType, ListingStatus } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, ImageIcon } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const categoryLabels: Record<string, string> = {
  books: 'Books',
  notes: 'Notes',
  stationery: 'Stationery',
  other: 'Other',
  all: 'All',
};

const typeColors: Record<string, string> = {
  sell: 'bg-green-100 text-green-700',
  buy: 'bg-blue-100 text-blue-700',
  rent: 'bg-purple-100 text-purple-700',
};

const typeLabels: Record<string, string> = {
  sell: 'For Sale',
  buy: 'Wanted',
  rent: 'For Rent',
};

export default function ListingCard({ listing }: ListingCardProps) {
  const typeKey = listing.listingType as unknown as string;
  const categoryKey = listing.category as unknown as string;
  const statusKey = listing.status as unknown as string;
  const imageUrl = listing.image?.getDirectURL();

  return (
    <Link
      to="/marketplace/$listingId"
      params={{ listingId: listing.id.toString() }}
      className="block group"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <ImageIcon size={32} />
              <span className="text-xs">No image</span>
            </div>
          )}
          {statusKey !== 'active' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm uppercase tracking-wide">
                {statusKey === 'sold' ? 'Sold' : 'Rented'}
              </span>
            </div>
          )}
          <div className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[typeKey] || 'bg-muted text-muted-foreground'}`}>
            {typeLabels[typeKey] || typeKey}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1">
              {listing.title}
            </h3>
            <span className="text-primary font-bold text-sm whitespace-nowrap">
              ₹{listing.price.toFixed(0)}
            </span>
          </div>

          <p className="text-muted-foreground text-xs line-clamp-2 flex-1">
            {listing.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-1">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[categoryKey] || categoryKey}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} />
              {listing.city}
            </span>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Tag size={10} />
            {listing.sellerName}
          </div>
        </div>
      </div>
    </Link>
  );
}
