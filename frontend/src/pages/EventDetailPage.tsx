import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEventById, useRegisterForEvent } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Star,
  CheckCircle,
  ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

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

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/events/$eventId' });
  const id = BigInt(eventId);
  const { data: event, isLoading } = useGetEventById(id);
  const { identity } = useInternetIdentity();
  const registerForEvent = useRegisterForEvent();

  const currentPrincipal = identity?.getPrincipal().toString();
  const isRegistered = currentPrincipal
    ? event?.attendees.some((a) => a.toString() === currentPrincipal) || false
    : false;

  const isPlatform = event?.organizerType === 'platform';

  const handleRegister = async () => {
    if (!identity) {
      toast.error('Please login to register for events');
      return;
    }
    try {
      await registerForEvent.mutateAsync(id);
      toast.success('Successfully registered for the event! 🎉');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to register');
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

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Event not found</h2>
        <Link to="/events">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const eventDate = new Date(Number(event.eventDate) / 1_000_000);
  const eventImageUrl = event.image?.getDirectURL();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl animate-fade-in">
      <Link to="/events">
        <Button variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Button>
      </Link>

      <Card className={`border-border overflow-hidden ${isPlatform ? 'ring-2 ring-amber/40' : ''}`}>
        {/* Platform Banner */}
        {isPlatform && (
          <div className="gradient-amber px-6 py-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white font-semibold text-sm">Official UniShare Event</span>
          </div>
        )}

        {/* Event Image */}
        {eventImageUrl ? (
          <div className="h-56 bg-muted overflow-hidden">
            <img
              src={eventImageUrl}
              alt={event.title}
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
          {/* Category & Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`capitalize gap-1 ${categoryColors[event.category] || ''}`}>
              <span>{categoryEmojis[event.category] || '📅'}</span>
              {event.category}
            </Badge>
            {isPlatform && (
              <Badge className="bg-amber text-white border-0">
                ⭐ By UniShare
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl font-bold">{event.title}</h1>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-teal font-medium">
            <Calendar className="w-5 h-5 shrink-0" />
            <span>
              {eventDate.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm mb-1.5">About this Event</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">College</p>
                <p className="font-medium">{event.college}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p className="font-medium">{event.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Attendees</p>
                <p className="font-medium">{event.attendees.length} registered</p>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-sm pt-1">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">
              Organized by{' '}
              <span className="font-semibold text-foreground">{event.organizer}</span>
            </span>
          </div>

          {/* Registration */}
          <div className="pt-2 border-t border-border">
            {event.registrationLink ? (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-amber text-white hover:bg-amber-dark gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Visit Event Page & Register
                </Button>
              </a>
            ) : isRegistered ? (
              <div className="flex items-center justify-center gap-2 py-3 bg-teal-light rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-dark" />
                <span className="font-semibold text-teal-dark">You're registered!</span>
              </div>
            ) : (
              <Button
                className="w-full bg-teal text-white hover:bg-teal-dark gap-2"
                onClick={handleRegister}
                disabled={registerForEvent.isPending || !identity}
              >
                {registerForEvent.isPending ? (
                  'Registering...'
                ) : !identity ? (
                  'Login to Register'
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Register for this Event
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
