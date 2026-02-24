import { Link } from '@tanstack/react-router';
import { Community } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Lock, Globe, ImageIcon } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
}

const categoryLabels: Record<string, string> = {
  coding: 'Coding',
  entrepreneurship: 'Entrepreneurship',
  marketing: 'Marketing',
  design: 'Design',
  science: 'Science',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  coding: 'bg-blue-100 text-blue-700',
  entrepreneurship: 'bg-amber-100 text-amber-700',
  marketing: 'bg-pink-100 text-pink-700',
  design: 'bg-purple-100 text-purple-700',
  science: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function CommunityCard({ community }: CommunityCardProps) {
  const categoryKey = community.category as unknown as string;
  const coverImageUrl = community.coverImage?.getDirectURL();

  return (
    <Link
      to="/communities/$communityId"
      params={{ communityId: community.id.toString() }}
      className="block group"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-36 bg-muted flex items-center justify-center overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={community.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <ImageIcon size={28} />
              <span className="text-xs">No cover image</span>
            </div>
          )}
          <div className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[categoryKey] || 'bg-muted text-muted-foreground'}`}>
            {categoryLabels[categoryKey] || categoryKey}
          </div>
          <div className="absolute top-2 right-2">
            {community.isPublic ? (
              <Globe size={14} className="text-white drop-shadow" />
            ) : (
              <Lock size={14} className="text-white drop-shadow" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
            {community.name}
          </h3>
          <p className="text-muted-foreground text-xs line-clamp-2 flex-1">
            {community.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={11} />
              {community.members.length} member{community.members.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} />
              {community.city}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
