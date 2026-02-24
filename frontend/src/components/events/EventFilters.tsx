import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { EventFilter, EventCategory } from '../../backend';

interface EventFiltersProps {
  filter: EventFilter;
  onChange: (filter: EventFilter) => void;
}

export default function EventFilters({ filter, onChange }: EventFiltersProps) {
  const update = (key: keyof EventFilter, value: string | undefined) => {
    onChange({ ...filter, [key]: value || undefined });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Category */}
      <Select
        value={filter.category || 'all'}
        onValueChange={(v) => update('category', v === 'all' ? undefined : v as EventCategory)}
      >
        <SelectTrigger className="h-9 w-auto min-w-36 text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="tech">💻 Tech</SelectItem>
          <SelectItem value="business">💼 Business</SelectItem>
          <SelectItem value="cultural">🎭 Cultural</SelectItem>
          <SelectItem value="sports">⚽ Sports</SelectItem>
          <SelectItem value="workshop">🛠️ Workshop</SelectItem>
          <SelectItem value="other">📅 Other</SelectItem>
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
