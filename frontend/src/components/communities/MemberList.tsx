import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserProfile } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Users } from 'lucide-react';

interface MemberItemProps {
  principal: Principal;
  index: number;
}

function MemberItem({ principal, index }: MemberItemProps) {
  const { data: profile, isLoading } = useGetUserProfile(principal);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  const name = profile?.name || `Student ${index + 1}`;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-teal-light text-teal-dark text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{name}</p>
        {profile?.college && (
          <p className="text-xs text-muted-foreground">{profile.college}</p>
        )}
      </div>
    </div>
  );
}

interface MemberListProps {
  members: Principal[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Users className="w-4 h-4 text-teal" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet</p>
        ) : (
          members.map((member, i) => (
            <MemberItem key={member.toString()} principal={member} index={i} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
