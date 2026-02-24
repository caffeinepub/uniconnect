import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { ListingFilter, ListingCategory, ListingType, ListingAreaScope } from '../../backend';

interface MarketplaceFiltersProps {
  filter: ListingFilter;
  onChange: (filter: ListingFilter) => void;
}

export default function MarketplaceFilters({ filter, onChange }: MarketplaceFiltersProps) {
  const update = (key: keyof ListingFilter, value: string | undefined) => {
    onChange({ ...filter, [key]: value || undefined });
  };

  return (
    <div className="space-y-5 bg-card rounded-xl border border-border p-4">
      <h3 className="font-display font-semibold text-sm">Filter Listings</h3>
      <Separator />

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Category
        </Label>
        <Select
          value={filter.category || 'all'}
          onValueChange={(v) => update('category', v === 'all' ? undefined : v as ListingCategory)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="books">📚 Books</SelectItem>
            <SelectItem value="notes">📝 Notes</SelectItem>
            <SelectItem value="stationery">✏️ Stationery</SelectItem>
            <SelectItem value="other">📦 Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Transaction Type
        </Label>
        <Select
          value={filter.listingType || 'all'}
          onValueChange={(v) => update('listingType', v === 'all' ? undefined : v as ListingType)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area Scope */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Area
        </Label>
        <Select
          value={filter.areaScope || 'all'}
          onValueChange={(v) => update('areaScope', v === 'all' ? undefined : v as ListingAreaScope)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="campus">🏫 Campus Only</SelectItem>
            <SelectItem value="city">🏙️ City Wide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City / Location */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          City / Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="e.g. Mumbai, Delhi…"
            value={filter.city || ''}
            onChange={(e) => update('city', e.target.value || undefined)}
            className="h-9 text-sm pl-8"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground text-xs"
        onClick={() => onChange({})}
      >
        Clear Filters
      </Button>
    </div>
  );
}
