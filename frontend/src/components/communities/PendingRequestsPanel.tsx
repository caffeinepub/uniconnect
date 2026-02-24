import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserProfile, useApproveMember } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingItemProps {
  principal: Principal;
  communityId: bigint;
  index: number;
}

function PendingItem({ principal, communityId, index }: PendingItemProps) {
  const { data: profile, isLoading } = useGetUserProfile(principal);
  const approveMember = useApproveMember();

  const handleApprove = async () => {
    try {
      await approveMember.mutateAsync({ communityId, member: principal });
      toast.success('Member approved!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve member');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  const name = profile?.name || `Student ${index + 1}`;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-amber-light text-amber-dark text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        {profile?.college && (
          <p className="text-xs text-muted-foreground truncate">{profile.college}</p>
        )}
      </div>
      <Button
        size="sm"
        className="h-7 text-xs bg-teal text-white hover:bg-teal-dark shrink-0"
        onClick={handleApprove}
        disabled={approveMember.isPending}
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Approve
      </Button>
    </div>
  );
}

interface PendingRequestsPanelProps {
  communityId: bigint;
  pendingRequests: Principal[];
}

export default function PendingRequestsPanel({ communityId, pendingRequests }: PendingRequestsPanelProps) {
  return (
    <Card className="border-amber/30 bg-amber-light/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-dark" />
          Pending Requests ({pendingRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingRequests.map((principal, i) => (
          <PendingItem
            key={principal.toString()}
            principal={principal}
            communityId={communityId}
            index={i}
          />
        ))}
      </CardContent>
    </Card>
  );
}
