import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CommunityFilter {
    city?: string;
    category?: CommunityCategory;
    college?: string;
}
export interface Listing {
    id: bigint;
    status: ListingStatus;
    title: string;
    sellerPrincipal: Principal;
    city: string;
    createdAt: bigint;
    description: string;
    listingType: ListingType;
    sellerName: string;
    areaScope: ListingAreaScope;
    category: ListingCategory;
    image?: ExternalBlob;
    price: number;
    college: string;
}
export interface EventFilter {
    city?: string;
    organizerType?: EventOrganizerType;
    category?: EventCategory;
    college?: string;
}
export interface Event {
    id: bigint;
    organizer: string;
    title: string;
    venue: string;
    city: string;
    createdAt: bigint;
    description: string;
    organizerType: EventOrganizerType;
    attendees: Array<Principal>;
    category: EventCategory;
    image?: ExternalBlob;
    registrationLink?: string;
    college: string;
    eventDate: bigint;
}
export interface Community {
    id: bigint;
    members: Array<Principal>;
    city: string;
    name: string;
    createdAt: bigint;
    description: string;
    coverImage?: ExternalBlob;
    pendingRequests: Array<Principal>;
    creatorPrincipal: Principal;
    category: CommunityCategory;
    isPublic: boolean;
    college: string;
}
export interface ListingFilter {
    city?: string;
    listingType?: ListingType;
    areaScope?: ListingAreaScope;
    category?: ListingCategory;
    college?: string;
}
export interface Message {
    id: string;
    text: string;
    conversationId: string;
    senderPrincipal: Principal;
    timestamp: bigint;
}
export interface Conversation {
    id: string;
    participants: Array<Principal>;
    createdAt: bigint;
}
export interface UserProfile {
    city: string;
    profileImage?: ExternalBlob;
    name: string;
    interestAreas: Array<string>;
    otherSocialUrl?: string;
    course: string;
    yearOfStudy: string;
    linkedinUrl?: string;
    college: string;
}
export enum CommunityCategory {
    other = "other",
    marketing = "marketing",
    design = "design",
    entrepreneurship = "entrepreneurship",
    coding = "coding",
    science = "science"
}
export enum EventCategory {
    workshop = "workshop",
    other = "other",
    tech = "tech",
    cultural = "cultural",
    business = "business",
    sports = "sports"
}
export enum EventOrganizerType {
    user = "user",
    platform = "platform"
}
export enum ListingAreaScope {
    all = "all",
    city = "city",
    campus = "campus"
}
export enum ListingCategory {
    all = "all",
    other = "other",
    notes = "notes",
    stationery = "stationery",
    books = "books"
}
export enum ListingStatus {
    rented = "rented",
    active = "active",
    sold = "sold"
}
export enum ListingType {
    buy = "buy",
    rent = "rent",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMember(communityId: bigint, member: Principal): Promise<void>;
    approveMember(communityId: bigint, member: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCommunity(name: string, description: string, category: CommunityCategory, college: string, city: string, isPublic: boolean, coverImage: ExternalBlob | null): Promise<bigint>;
    createEvent(title: string, description: string, category: EventCategory, organizer: string, organizerType: EventOrganizerType, college: string, city: string, venue: string, eventDate: bigint, registrationLink: string | null, image: ExternalBlob | null): Promise<bigint>;
    createListing(title: string, description: string, category: ListingCategory, listingType: ListingType, price: number, sellerName: string, college: string, city: string, areaScope: ListingAreaScope, image: ExternalBlob | null): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunities(filter: CommunityFilter | null): Promise<Array<Community>>;
    getCommunityById(id: bigint): Promise<Community | null>;
    getConversations(): Promise<Array<Conversation>>;
    getEventById(id: bigint): Promise<Event | null>;
    getEvents(filter: EventFilter | null): Promise<Array<Event>>;
    getListingById(id: bigint): Promise<Listing | null>;
    getListings(filter: ListingFilter | null): Promise<Array<Listing>>;
    getMessages(conversationId: string): Promise<Array<Message>>;
    getMyCommunities(): Promise<Array<Community>>;
    getPlatformEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerForEvent(eventId: bigint): Promise<void>;
    requestToJoin(communityId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: string, text: string): Promise<void>;
    startConversation(otherPrincipal: Principal): Promise<Conversation>;
    updateListingStatus(id: bigint, status: ListingStatus): Promise<void>;
    uploadProfileImage(image: ExternalBlob): Promise<void>;
}
