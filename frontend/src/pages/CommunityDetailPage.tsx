import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useGetCommunityById, useRequestToJoin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ArrowLeft, Users, MapPin, Building2, Lock, Globe, Clock } from 'lucide-react';
import MemberList from '../components/communities/MemberList';
import PendingRequestsPanel from '../components/communities/PendingRequestsPanel';
import { toast } from 'sonner';

const categoryEmojis: Record<string, string> = {
  coding: '💻',
  entrepreneurship: '🚀',
  marketing: '📣',
  design: '🎨',
  science: '🔬',
  other: '🌐',
};

export default function CommunityDetailPage() {
  const { communityId } = useParams({ from: '/communities/$communityId' });
  const id = BigInt(communityId);
  const { data: community, isLoading } = useGetCommunityById(id);
  const { identity } = useInternetIdentity();
  const requestToJoin = useRequestToJoin();

  const currentPrincipal = identity?.getPrincipal().toString();
  const isCreator = currentPrincipal
    ? community?.creatorPrincipal.toString() === currentPrincipal
    : false;
  const isMember = currentPrincipal
    ? community?.members.some((m) => m.toString() === currentPrincipal) || false
    : false;
  const isPending = currentPrincipal
    ? community?.pendingRequests.some((p) => p.toString() === currentPrincipal) || false
    : false;

  const handleJoin = async () => {
    if (!identity) {
      toast.error('Please login to join communities');
      return;
    }
    try {
      await requestToJoin.mutateAsync(id);
      toast.success(community?.isPublic ? 'Joined community!' : 'Join request sent!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to join');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-48 rounded-xl mb-4" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Community not found</h2>
        <Link to="/communities">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Communities
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl animate-fade-in">
      <Link to="/communities">
        <Button variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Communities
        </Button>
      </Link>

      {/* Community Header */}
      <Card className="border-border mb-4">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-teal flex items-center justify-center text-2xl shrink-0">
              {categoryEmojis[community.category] || '🌐'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-display text-2xl font-bold">{community.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge className="capitalize bg-teal-light text-teal-dark border-0">
                      {community.category}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      {community.isPublic ? (
                        <><Globe className="w-3 h-3" /> Open</>
                      ) : (
                        <><Lock className="w-3 h-3" /> Request to Join</>
                      )}
                    </Badge>
                  </div>
                </div>

                {identity && !isMember && !isPending && (
                  <Button
                    onClick={handleJoin}
                    className="bg-teal text-white hover:bg-teal-dark shrink-0"
                    disabled={requestToJoin.isPending}
                  >
                    {community.isPublic ? 'Join Community' : 'Request to Join'}
                  </Button>
                )}
                {isPending && (
                  <Badge variant="secondary" className="shrink-0">
                    Request Pending
                  </Badge>
                )}
                {isMember && !isCreator && (
                  <Badge className="bg-teal-light text-teal-dark border-0 shrink-0">
                    ✓ Member
                  </Badge>
                )}
                {isCreator && (
                  <Badge className="bg-amber-light text-amber-dark border-0 shrink-0">
                    👑 Creator
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4">
            {community.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{community.members.length}</span>
              <span className="text-muted-foreground">members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{community.college}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{community.city}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Members */}
        <MemberList members={community.members} />

        {/* Pending Requests (creator only) */}
        {isCreator && community.pendingRequests.length > 0 && (
          <PendingRequestsPanel
            communityId={community.id}
            pendingRequests={community.pendingRequests}
          />
        )}
      </div>
    </div>
  );
}
