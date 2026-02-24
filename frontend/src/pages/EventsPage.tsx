import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Star, Calendar, X } from 'lucide-react';
import { useGetEvents, useGetPlatformEvents } from '../hooks/useQueries';
import { EventFilter } from '../backend';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import PostEventModal from '../components/events/PostEventModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function EventsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [filter, setFilter] = useState<EventFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const activeFilter: EventFilter | null =
    Object.keys(filter).filter((k) => (filter as any)[k] !== undefined).length > 0
      ? { ...filter }
      : null;

  // Fetch user events (non-platform) — pass city filter too
  const { data: userEvents, isLoading: loadingUser } = useGetEvents(activeFilter);

  // Fetch platform events separately; apply city filter client-side
  const { data: platformEvents, isLoading: loadingPlatform } = useGetPlatformEvents();

  const activeFilterCount = Object.values(filter).filter((v) => v !== undefined && v !== '').length;

  const filteredUserEvents = (userEvents || [])
    .filter((e) => e.organizerType !== 'platform')
    .filter((e) =>
      searchQuery
        ? e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const filteredPlatformEvents = (platformEvents || [])
    .filter((e) =>
      // Apply city filter client-side for platform events
      filter.city ? e.city.toLowerCase() === filter.city.toLowerCase() : true
    )
    .filter((e) =>
      // Apply category filter client-side for platform events
      filter.category ? e.category === filter.category : true
    )
    .filter((e) =>
      searchQuery
        ? e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover and participate in campus events
          </p>
        </div>
        {isAuthenticated && (
          <Button
            onClick={() => setShowPostModal(true)}
            className="bg-teal text-white hover:bg-teal-dark gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Event</span>
            <span className="sm:hidden">Post</span>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <EventFilters filter={filter} onChange={setFilter} />

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filter.category && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {filter.category}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(f => ({ ...f, category: undefined }))} />
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

      {/* Platform Events — Events By Us */}
      <section className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-dark fill-amber-dark" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Events By Us</h2>
            <p className="text-xs text-muted-foreground">Official events organized by UniShare</p>
          </div>
          {filteredPlatformEvents.length > 0 && (
            <Badge className="ml-auto bg-amber text-white border-0">
              {filteredPlatformEvents.length}
            </Badge>
          )}
        </div>

        {loadingPlatform ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : filteredPlatformEvents.length === 0 ? (
          <Card className="border-dashed border-2 border-amber/30 bg-amber-light/10">
            <CardContent className="py-10 text-center">
              <Star className="w-10 h-10 text-amber/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {activeFilterCount > 0
                  ? 'No official events match your filters.'
                  : 'No official events at the moment. Check back soon!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlatformEvents.map((event) => (
              <EventCard key={event.id.toString()} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Community Events */}
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
            <Calendar className="w-5 h-5 text-teal-dark" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Community Events</h2>
            <p className="text-xs text-muted-foreground">Events posted by students</p>
          </div>
          {filteredUserEvents.length > 0 && (
            <Badge className="ml-auto bg-teal text-white border-0">
              {filteredUserEvents.length}
            </Badge>
          )}
        </div>

        {loadingUser ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : filteredUserEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">No community events yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {activeFilterCount > 0
                ? 'Try adjusting your filters.'
                : 'Be the first to post an event for your campus!'}
            </p>
            {activeFilterCount > 0 ? (
              <Button variant="outline" size="sm" onClick={() => setFilter({})}>
                Clear Filters
              </Button>
            ) : isAuthenticated && (
              <Button
                onClick={() => setShowPostModal(true)}
                className="bg-teal text-white hover:bg-teal-dark"
              >
                Post an Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUserEvents.map((event) => (
              <EventCard key={event.id.toString()} event={event} />
            ))}
          </div>
        )}
      </section>

      {showPostModal && (
        <PostEventModal onClose={() => setShowPostModal(false)} />
      )}
    </div>
  );
}
