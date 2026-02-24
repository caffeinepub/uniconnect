import { Link } from '@tanstack/react-router';
import { useGetListings, useGetCommunities, useGetEvents } from '../hooks/useQueries';
import ListingCard from '../components/marketplace/ListingCard';
import CommunityCard from '../components/communities/CommunityCard';
import EventCard from '../components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingBag, Users, Calendar } from 'lucide-react';

export default function HomePage() {
  const { data: listings, isLoading: listingsLoading } = useGetListings();
  const { data: communities, isLoading: communitiesLoading } = useGetCommunities();
  const { data: events, isLoading: eventsLoading } = useGetEvents();

  const recentListings = listings?.slice(0, 4) || [];
  const recentCommunities = communities?.slice(0, 3) || [];
  const recentEvents = events?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden min-h-[260px] md:min-h-[340px]">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="UniShare Hero"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          {/* Logo lockup inside hero (matches reference image) */}
          <div className="flex items-center gap-2 mb-5">
            <img
              src="/assets/generated/unishare-icon.dim_64x64.png"
              alt="UniShare icon"
              className="h-9 w-9 rounded-xl object-cover shadow-md"
            />
            <span className="text-white text-xl font-bold tracking-tight drop-shadow">UniShare</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
            Your Campus, Connected
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed max-w-lg drop-shadow">
            Buy, sell, join communities, and discover events — all in one place for students.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/marketplace">
              <Button className="gap-2 bg-amber hover:bg-amber-dark text-white font-semibold shadow-md border-0">
                <ShoppingBag size={16} />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/communities">
              <Button
                variant="outline"
                className="gap-2 bg-white/10 border-white text-white hover:bg-white/20 font-semibold backdrop-blur-sm"
              >
                <Users size={16} />
                Join Communities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{listings?.length || 0}+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Active Listings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{communities?.length || 0}+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Communities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{events?.length || 0}+</div>
              <div className="text-xs text-muted-foreground mt-0.5">Events</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Marketplace Preview */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">Recent Listings</h2>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          {listingsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))}
            </div>
          ) : recentListings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id.toString()} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No listings yet. Be the first to post!</p>
              <Link to="/marketplace" className="mt-3 inline-block">
                <Button size="sm" variant="outline">Go to Marketplace</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Communities Preview */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">Active Communities</h2>
            </div>
            <Link to="/communities">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          {communitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : recentCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCommunities.map((community) => (
                <CommunityCard key={community.id.toString()} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No communities yet. Create one!</p>
              <Link to="/communities" className="mt-3 inline-block">
                <Button size="sm" variant="outline">Go to Communities</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Events Preview */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
            </div>
            <Link to="/events">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentEvents.map((event) => (
                <EventCard key={event.id.toString()} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
              <Calendar size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No events yet. Check back soon!</p>
              <Link to="/events" className="mt-3 inline-block">
                <Button size="sm" variant="outline">Go to Events</Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
