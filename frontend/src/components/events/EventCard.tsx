import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '../../backend';
import { MapPin, Building2, Calendar, Star } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-700 border-0',
  business: 'bg-amber-light text-amber-dark border-0',
  cultural: 'bg-pink-100 text-pink-700 border-0',
  sports: 'bg-green-100 text-green-700 border-0',
  workshop: 'bg-purple-100 text-purple-700 border-0',
  other: 'bg-secondary text-secondary-foreground border-0',
};

const categoryEmojis: Record<string, string> = {
  tech: '💻',
  business: '💼',
  cultural: '🎭',
  sports: '⚽',
  workshop: '🛠️',
  other: '📅',
};

export default function EventCard({ event }: EventCardProps) {
  const isPlatform = event.organizerType === 'platform';
  const eventDate = new Date(Number(event.eventDate) / 1_000_000);

  return (
    <Link to="/events/$eventId" params={{ eventId: event.id.toString() }}>
      <Card
        className={`card-hover cursor-pointer border-border h-full ${
          isPlatform ? 'ring-2 ring-amber/40' : ''
        }`}
      >
        <CardContent className="p-4 flex flex-col gap-2.5">
          {/* Platform badge */}
          {isPlatform && (
            <div className="flex items-center gap-1.5 bg-amber-light rounded-lg px-2.5 py-1.5 -mx-0.5">
              <Star className="w-3.5 h-3.5 text-amber-dark fill-amber-dark" />
              <span className="text-xs font-semibold text-amber-dark">Official UniConnect Event</span>
            </div>
          )}

          {/* Category badge */}
          <div className="flex items-center justify-between gap-2">
            <Badge className={`text-xs capitalize gap-1 ${categoryColors[event.category] || ''}`}>
              <span>{categoryEmojis[event.category] || '📅'}</span>
              {event.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2">
            {event.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-teal">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {eventDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Meta */}
          <div className="space-y-1 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{event.college}</span>
            </div>
          </div>

          {/* Organizer */}
          <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-1">
            by <span className="font-medium text-foreground">{event.organizer}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
