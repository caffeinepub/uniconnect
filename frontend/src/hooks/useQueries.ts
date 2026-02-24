import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import {
  UserProfile,
  Listing,
  ListingFilter,
  ListingStatus,
  Community,
  CommunityFilter,
  Event,
  EventFilter,
  EventCategory,
  EventOrganizerType,
  ListingCategory,
  ListingType,
  ListingAreaScope,
  CommunityCategory,
  Conversation,
  Message,
  ExternalBlob,
} from '../backend';
import { Principal } from '@dfinity/principal';

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(user: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !actorFetching && !!user,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUploadProfileImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProfileImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Listings ----

export function useGetListings(filter?: ListingFilter | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings', filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListings(filter ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListingById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing | null>({
    queryKey: ['listing', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getListingById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      category: ListingCategory;
      listingType: ListingType;
      price: number;
      sellerName: string;
      college: string;
      city: string;
      areaScope: ListingAreaScope;
      image?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(
        params.title,
        params.description,
        params.category,
        params.listingType,
        params.price,
        params.sellerName,
        params.college,
        params.city,
        params.areaScope,
        params.image ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useUpdateListingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: ListingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useMyListings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Listing[]>({
    queryKey: ['myListings', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const all = await actor.getListings(null);
      const myPrincipal = identity.getPrincipal().toString();
      return all.filter((l) => l.sellerPrincipal.toString() === myPrincipal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ---- Communities ----

export function useGetCommunities(filter?: CommunityFilter | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Community[]>({
    queryKey: ['communities', filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommunities(filter ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommunityById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Community | null>({
    queryKey: ['community', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCommunityById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCommunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      category: CommunityCategory;
      college: string;
      city: string;
      isPublic: boolean;
      coverImage?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunity(
        params.name,
        params.description,
        params.category,
        params.college,
        params.city,
        params.isPublic,
        params.coverImage ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['myCommunities'] });
    },
  });
}

export function useRequestToJoin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communityId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestToJoin(communityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community'] });
      queryClient.invalidateQueries({ queryKey: ['myCommunities'] });
    },
  });
}

export function useApproveMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { communityId: bigint; member: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveMember(params.communityId, params.member);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', variables.communityId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['myCommunities'] });
    },
  });
}

export function useGetMyCommunities() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Community[]>({
    queryKey: ['myCommunities'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCommunities();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ---- Events ----

export function useGetEvents(filter?: EventFilter | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents(filter ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEventById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Event | null>({
    queryKey: ['event', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEventById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlatformEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['platformEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlatformEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      category: EventCategory;
      organizer: string;
      organizerType: EventOrganizerType;
      college: string;
      city: string;
      venue: string;
      eventDate: bigint;
      registrationLink?: string | null;
      image?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(
        params.title,
        params.description,
        params.category,
        params.organizer,
        params.organizerType,
        params.college,
        params.city,
        params.venue,
        params.eventDate,
        params.registrationLink ?? null,
        params.image ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['platformEvents'] });
    },
  });
}

export function useRegisterForEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerForEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
}

// ---- Chat ----

export function useGetConversations() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetMessages(conversationId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(conversationId);
    },
    enabled: !!actor && !isFetching && !!identity && !!conversationId,
    refetchInterval: 3000,
  });
}

export function useStartConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startConversation(otherPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(conversationId, text);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}
