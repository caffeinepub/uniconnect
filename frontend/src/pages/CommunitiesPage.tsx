import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, X } from 'lucide-react';
import { useGetCommunities, useGetMyCommunities } from '../hooks/useQueries';
import { CommunityFilter } from '../backend';
import CommunityCard from '../components/communities/CommunityCard';
import CommunityFilters from '../components/communities/CommunityFilters';
import CreateCommunityModal from '../components/communities/CreateCommunityModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function CommunitiesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [filter, setFilter] = useState<CommunityFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeFilter: CommunityFilter | null =
    Object.keys(filter).filter((k) => (filter as any)[k] !== undefined).length > 0 ? filter : null;
  const { data: allCommunities, isLoading: loadingAll } = useGetCommunities(activeFilter);
  const { data: myCommunities, isLoading: loadingMine } = useGetMyCommunities();

  const filteredCommunities = allCommunities?.filter((c) =>
    searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  const activeFilterCount = Object.values(filter).filter((v) => v !== undefined && v !== '').length;

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Communities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Find your tribe on campus
          </p>
        </div>
        {isAuthenticated && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal text-white hover:bg-teal-dark gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Community</span>
            <span className="sm:hidden">Create</span>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <CommunityFilters filter={filter} onChange={setFilter} />

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

      {/* Tabs */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All Communities
            {filteredCommunities.length > 0 && (
              <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
                {filteredCommunities.length}
              </span>
            )}
          </TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="mine">
              My Communities
              {myCommunities && myCommunities.length > 0 && (
                <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
                  {myCommunities.length}
                </span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all">
          {loadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">No communities found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {activeFilterCount > 0 ? 'Try adjusting your filters.' : 'Be the first to create a community!'}
              </p>
              {activeFilterCount > 0 ? (
                <Button variant="outline" size="sm" onClick={() => setFilter({})}>
                  Clear Filters
                </Button>
              ) : isAuthenticated && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-teal text-white hover:bg-teal-dark"
                >
                  Create Community
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id.toString()} community={community} />
              ))}
            </div>
          )}
        </TabsContent>

        {isAuthenticated && (
          <TabsContent value="mine">
            {loadingMine ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : !myCommunities || myCommunities.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="font-display font-semibold text-lg mb-2">No communities yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Join or create a community to see it here.
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-teal text-white hover:bg-teal-dark"
                >
                  Create Community
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCommunities.map((community) => (
                  <CommunityCard key={community.id.toString()} community={community} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <CreateCommunityModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
