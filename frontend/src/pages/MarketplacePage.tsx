import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useGetListings } from '../hooks/useQueries';
import { ListingFilter } from '../backend';
import ListingCard from '../components/marketplace/ListingCard';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import PostListingModal from '../components/marketplace/PostListingModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function MarketplacePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [filter, setFilter] = useState<ListingFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const activeFilter: ListingFilter | null = Object.keys(filter).filter(k => (filter as any)[k] !== undefined).length > 0 ? filter : null;
  const { data: listings, isLoading } = useGetListings(activeFilter);

  const filteredListings = listings?.filter((l) =>
    searchQuery
      ? l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  const activeFilterCount = Object.values(filter).filter((v) => v !== undefined && v !== '').length;

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {isAuthenticated && (
          <Button
            onClick={() => setShowPostModal(true)}
            className="bg-teal text-white hover:bg-teal-dark gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Listing</span>
            <span className="sm:hidden">Post</span>
          </Button>
        )}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`gap-2 ${activeFilterCount > 0 ? 'border-teal text-teal' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="bg-teal text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filter.category && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {filter.category}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(f => ({ ...f, category: undefined }))} />
            </Badge>
          )}
          {filter.listingType && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {filter.listingType}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(f => ({ ...f, listingType: undefined }))} />
            </Badge>
          )}
          {filter.areaScope && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {filter.areaScope}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(f => ({ ...f, areaScope: undefined }))} />
            </Badge>
          )}
          {filter.city && (
            <Badge variant="secondary" className="gap-1">
              📍 {filter.city}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(f => ({ ...f, city: undefined }))} />
            </Badge>
          )}
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => setFilter({})}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6">
          <MarketplaceFilters filter={filter} onChange={setFilter} />
        </div>
      )}

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">No listings found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Try adjusting your filters or search query.
          </p>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => setFilter({})}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id.toString()} listing={listing} />
          ))}
        </div>
      )}

      <PostListingModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </div>
  );
}
