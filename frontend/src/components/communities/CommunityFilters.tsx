import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { CommunityFilter, CommunityCategory } from '../../backend';

interface CommunityFiltersProps {
  filter: CommunityFilter;
  onChange: (filter: CommunityFilter) => void;
}

export default function CommunityFilters({ filter, onChange }: CommunityFiltersProps) {
  const update = (key: keyof CommunityFilter, value: string | undefined) => {
    onChange({ ...filter, [key]: value || undefined });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Category */}
      <Select
        value={filter.category || 'all'}
        onValueChange={(v) => update('category', v === 'all' ? undefined : v as CommunityCategory)}
      >
        <SelectTrigger className="h-9 w-auto min-w-36 text-sm">
          <SelectValue placeholder="All Topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          <SelectItem value="coding">💻 Coding</SelectItem>
          <SelectItem value="entrepreneurship">🚀 Entrepreneurship</SelectItem>
          <SelectItem value="marketing">📣 Marketing</SelectItem>
          <SelectItem value="design">🎨 Design</SelectItem>
          <SelectItem value="science">🔬 Science</SelectItem>
          <SelectItem value="other">🌐 Other</SelectItem>
        </SelectContent>
      </Select>

      {/* City / Location */}
      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Filter by city…"
          value={filter.city || ''}
          onChange={(e) => update('city', e.target.value || undefined)}
          className="h-9 text-sm pl-8 w-44"
        />
      </div>
    </div>
  );
}
