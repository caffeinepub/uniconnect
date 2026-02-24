import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";

actor {
  // ----- User Profile -----
  type UserProfile = {
    name : Text;
    college : Text;
    city : Text;
    course : Text;
    yearOfStudy : Text;
    interestAreas : [Text];
    linkedinUrl : ?Text;
    otherSocialUrl : ?Text;
    profileImage : ?Storage.ExternalBlob;
  };

  // ----- Chat -----
  type Conversation = {
    id : Text;
    participants : [Principal];
    createdAt : Int;
  };

  type Message = {
    id : Text;
    conversationId : Text;
    senderPrincipal : Principal;
    text : Text;
    timestamp : Int;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let conversations = Map.empty<Text, Conversation>();
  let messages = Map.empty<Text, Message>();

  // ----- Listing Types -----
  type ListingCategory = {
    #books;
    #notes;
    #stationery;
    #other;
    #all;
  };

  module ListingCategory {
    public func compare(c1 : ListingCategory, c2 : ListingCategory) : Order.Order {
      switch (c1, c2) {
        case (#books, #books) { #equal };
        case (#books, _) { #less };
        case (#notes, #books) { #greater };
        case (#notes, #notes) { #equal };
        case (#notes, _) { #less };
        case (#stationery, #books) { #greater };
        case (#stationery, #notes) { #greater };
        case (#stationery, #stationery) { #equal };
        case (#stationery, _) { #less };
        case (#other, #all) { #less };
        case (#other, #other) { #equal };
        case (#other, _) { #greater };
        case (#all, #all) { #equal };
        case (#all, _) { #greater };
      };
    };
  };

  type ListingType = {
    #sell;
    #buy;
    #rent;
  };

  type ListingStatus = {
    #active;
    #sold;
    #rented;
  };

  type ListingAreaScope = {
    #campus;
    #city;
    #all;
  };

  type Listing = {
    id : Nat;
    title : Text;
    description : Text;
    category : ListingCategory;
    listingType : ListingType;
    price : Float;
    sellerPrincipal : Principal;
    sellerName : Text;
    college : Text;
    city : Text;
    areaScope : ListingAreaScope;
    image : ?Storage.ExternalBlob;
    createdAt : Int;
    status : ListingStatus;
  };

  // ----- Community Types -----
  type CommunityCategory = {
    #coding;
    #entrepreneurship;
    #marketing;
    #design;
    #science;
    #other;
  };

  type Community = {
    id : Nat;
    name : Text;
    description : Text;
    category : CommunityCategory;
    college : Text;
    city : Text;
    creatorPrincipal : Principal;
    members : [Principal];
    pendingRequests : [Principal];
    isPublic : Bool;
    createdAt : Int;
    coverImage : ?Storage.ExternalBlob;
  };

  // ----- Event Types -----
  type EventCategory = {
    #tech;
    #business;
    #cultural;
    #sports;
    #workshop;
    #other;
  };

  type EventOrganizerType = {
    #user;
    #platform;
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    category : EventCategory;
    organizer : Text;
    organizerType : EventOrganizerType;
    college : Text;
    city : Text;
    venue : Text;
    eventDate : Int;
    registrationLink : ?Text;
    image : ?Storage.ExternalBlob;
    attendees : [Principal];
    createdAt : Int;
  };

  let listings = Map.empty<Nat, Listing>();
  let communities = Map.empty<Nat, Community>();
  let events = Map.empty<Nat, Event>();

  var nextListingId = 1;
  var nextCommunityId = 1;
  var nextEventId = 1;
  var nextChatId = 1;
  var nextMessageId = 1;

  // ----- User Profile Functions -----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadProfileImage(image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload profile images");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        let newProfile : UserProfile = {
          name = "";
          college = "";
          city = "";
          course = "";
          yearOfStudy = "";
          interestAreas = [];
          linkedinUrl = null;
          otherSocialUrl = null;
          profileImage = ?image;
        };
        userProfiles.add(caller, newProfile);
      };
      case (?profile) {
        let updatedProfile = {
          profile with profileImage = ?image
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // ----- Listings -----
  type ListingFilter = {
    category : ?ListingCategory;
    listingType : ?ListingType;
    areaScope : ?ListingAreaScope;
    city : ?Text;
    college : ?Text;
  };

  public shared ({ caller }) func createListing(
    title : Text,
    description : Text,
    category : ListingCategory,
    listingType : ListingType,
    price : Float,
    sellerName : Text,
    college : Text,
    city : Text,
    areaScope : ListingAreaScope,
    image : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };
    let id = nextListingId;
    nextListingId += 1;

    let listing : Listing = {
      id;
      title;
      description;
      category;
      listingType;
      price;
      sellerPrincipal = caller;
      sellerName;
      college;
      city;
      areaScope;
      image;
      createdAt = Time.now();
      status = #active;
    };

    listings.add(id, listing);
    id;
  };

  public query ({ caller }) func getListings(filter : ?ListingFilter) : async [Listing] {
    listings.values().toArray().filter(
      func(listing) {
        switch (filter) {
          case (null) { true };
          case (?(f)) {
            var matches = true;
            switch (f.category) {
              case (null) {};
              case (?cat) {
                matches := matches and (ListingCategory.compare(listing.category, cat) == #equal);
              };
            };
            switch (f.listingType) {
              case (null) {};
              case (?lt) {
                matches := matches and (listing.listingType == lt);
              };
            };
            switch (f.areaScope) {
              case (null) {};
              case (?as_) {
                matches := matches and (listing.areaScope == as_);
              };
            };
            switch (f.city) {
              case (null) {};
              case (?city) {
                matches := matches and (listing.city == city);
              };
            };
            switch (f.college) {
              case (null) {};
              case (?college) {
                matches := matches and (listing.college == college);
              };
            };
            matches;
          };
        };
      }
    );
  };

  public query func getListingById(id : Nat) : async ?Listing {
    listings.get(id);
  };

  public shared ({ caller }) func updateListingStatus(id : Nat, status : ListingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update listing status");
    };
    switch (listings.get(id)) {
      case (null) {
        Runtime.trap("Listing not found");
      };
      case (?listing) {
        if (listing.sellerPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or admins can update listing status");
        };
        let updatedListing = {
          listing with status
        };
        listings.add(id, updatedListing);
      };
    };
  };

  // ----- Communities -----
  type CommunityFilter = {
    category : ?CommunityCategory;
    college : ?Text;
    city : ?Text;
  };

  func contains(array : [Principal], principal : Principal) : Bool {
    array.values().any(
      func(p) {
        Principal.equal(p, principal);
      }
    );
  };

  public shared ({ caller }) func createCommunity(
    name : Text,
    description : Text,
    category : CommunityCategory,
    college : Text,
    city : Text,
    isPublic : Bool,
    coverImage : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create communities");
    };
    let id = nextCommunityId;
    nextCommunityId += 1;

    let community : Community = {
      id;
      name;
      description;
      category;
      college;
      city;
      creatorPrincipal = caller;
      members = [caller];
      pendingRequests = [];
      isPublic;
      createdAt = Time.now();
      coverImage;
    };

    communities.add(id, community);
    id;
  };

  public query func getCommunities(filter : ?CommunityFilter) : async [Community] {
    communities.values().toArray().filter(
      func(community) {
        switch (filter) {
          case (null) { true };
          case (?(f)) {
            var matches = true;
            switch (f.category) {
              case (null) {};
              case (?cat) {
                matches := matches and (community.category == cat);
              };
            };
            switch (f.college) {
              case (null) {};
              case (?college) {
                matches := matches and (community.college == college);
              };
            };
            switch (f.city) {
              case (null) {};
              case (?city) {
                matches := matches and (community.city == city);
              };
            };
            matches;
          };
        };
      }
    );
  };

  public query func getCommunityById(id : Nat) : async ?Community {
    communities.get(id);
  };

  public shared ({ caller }) func requestToJoin(communityId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request to join communities");
    };
    switch (communities.get(communityId)) {
      case (null) {
        Runtime.trap("Community not found");
      };
      case (?community) {
        if (contains(community.members, caller)) {
          Runtime.trap("Already a member");
        };
        if (contains(community.pendingRequests, caller)) {
          Runtime.trap("Already requested to join");
        };
        let list = List.fromArray(community.pendingRequests);
        list.add(caller);
        let updatedCommunity = {
          community with pendingRequests = list.toArray()
        };
        communities.add(communityId, updatedCommunity);
      };
    };
  };

  public shared ({ caller }) func approveMember(communityId : Nat, member : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can approve members");
    };
    switch (communities.get(communityId)) {
      case (null) {
        Runtime.trap("Community not found");
      };
      case (?community) {
        if (community.creatorPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admins can approve members");
        };
        if (not contains(community.pendingRequests, member)) {
          Runtime.trap("Member not found in pending requests");
        };
        let newPending = community.pendingRequests.filter(func(p) { p != member });
        let membersList = List.fromArray(community.members);
        membersList.add(member);
        let updatedCommunity = {
          community with
          pendingRequests = newPending;
          members = membersList.toArray();
        };
        communities.add(communityId, updatedCommunity);
      };
    };
  };

  public shared ({ caller }) func addMember(communityId : Nat, member : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add members");
    };
    switch (communities.get(communityId)) {
      case (null) {
        Runtime.trap("Community not found");
      };
      case (?community) {
        if (community.creatorPrincipal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admins can directly add members");
        };
        if (contains(community.members, member)) {
          Runtime.trap("Already a member");
        };
        let membersList = List.fromArray(community.members);
        membersList.add(member);
        // Also remove from pending if present
        let newPending = community.pendingRequests.filter(func(p) { p != member });
        let updatedCommunity = {
          community with
          members = membersList.toArray();
          pendingRequests = newPending;
        };
        communities.add(communityId, updatedCommunity);
      };
    };
  };

  public query ({ caller }) func getMyCommunities() : async [Community] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their communities");
    };
    communities.values().toArray().filter(
      func(community) {
        contains(community.members, caller);
      }
    );
  };

  // ----- Events -----
  type EventFilter = {
    category : ?EventCategory;
    college : ?Text;
    city : ?Text;
    organizerType : ?EventOrganizerType;
  };

  public shared ({ caller }) func createEvent(
    title : Text,
    description : Text,
    category : EventCategory,
    organizer : Text,
    organizerType : EventOrganizerType,
    college : Text,
    city : Text,
    venue : Text,
    eventDate : Int,
    registrationLink : ?Text,
    image : ?Storage.ExternalBlob,
  ) : async Nat {
    // Platform events can only be created by admins
    switch (organizerType) {
      case (#platform) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          Runtime.trap("Unauthorized: Only admins can create platform events");
        };
      };
      case (#user) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only users can create events");
        };
      };
    };

    let id = nextEventId;
    nextEventId += 1;

    let event : Event = {
      id;
      title;
      description;
      category;
      organizer;
      organizerType;
      college;
      city;
      venue;
      eventDate;
      registrationLink;
      image;
      attendees = [];
      createdAt = Time.now();
    };

    events.add(id, event);
    id;
  };

  public query func getEvents(filter : ?EventFilter) : async [Event] {
    events.values().toArray().filter(
      func(event) {
        switch (filter) {
          case (null) { true };
          case (?(f)) {
            var matches = true;
            switch (f.category) {
              case (null) {};
              case (?cat) {
                matches := matches and (event.category == cat);
              };
            };
            switch (f.college) {
              case (null) {};
              case (?college) {
                matches := matches and (event.college == college);
              };
            };
            switch (f.city) {
              case (null) {};
              case (?city) {
                matches := matches and (event.city == city);
              };
            };
            switch (f.organizerType) {
              case (null) {};
              case (?ot) {
                matches := matches and (event.organizerType == ot);
              };
            };
            matches;
          };
        };
      }
    );
  };

  public query func getEventById(id : Nat) : async ?Event {
    events.get(id);
  };

  public shared ({ caller }) func registerForEvent(eventId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for events");
    };
    switch (events.get(eventId)) {
      case (null) {
        Runtime.trap("Event not found");
      };
      case (?event) {
        if (contains(event.attendees, caller)) {
          Runtime.trap("Already registered for this event");
        };
        let attendees = List.fromArray(event.attendees);
        attendees.add(caller);
        let updatedEvent = {
          event with attendees = attendees.toArray()
        };
        events.add(eventId, updatedEvent);
      };
    };
  };

  public query func getPlatformEvents() : async [Event] {
    events.values().toArray().filter(
      func(event) {
        event.organizerType == #platform;
      }
    );
  };

  // ----- Chat -----

  public shared ({ caller }) func startConversation(otherPrincipal : Principal) : async Conversation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start conversations");
    };

    // Find if a conversation between the two participants already exists
    let participantIds = [caller, otherPrincipal];

    for ((id, conversation) in conversations.entries()) {
      let participantsEqual = conversation.participants.size() == 2 and
        conversation.participants.values().all(
          func(p) { participantIds.values().any(func(pid) { Principal.equal(p, pid) }) }
        );
      if (participantsEqual) {
        return conversation;
      };
    };

    // If not found, create a new conversation
    let conversationId = "conv" # nextChatId.toText();
    nextChatId += 1;

    let conversation : Conversation = {
      id = conversationId;
      participants = [caller, otherPrincipal];
      createdAt = Time.now();
    };

    conversations.add(conversationId, conversation);
    conversation;
  };

  public shared ({ caller }) func sendMessage(conversationId : Text, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) {
        Runtime.trap("Conversation not found");
      };
      case (?convo) {
        if (not contains(convo.participants, caller)) {
          Runtime.trap("Unauthorized: You are not a participant in this conversation");
        };

        let messageId = "msg" # nextMessageId.toText();
        nextMessageId += 1;

        let message : Message = {
          id = messageId;
          conversationId;
          senderPrincipal = caller;
          text;
          timestamp = Time.now();
        };

        messages.add(messageId, message);
      };
    };
  };

  public query ({ caller }) func getConversations() : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch conversations");
    };

    conversations.values().toArray().filter(
      func(convo) {
        convo.participants.values().any(
          func(p) { Principal.equal(p, caller) }
        );
      }
    );
  };

  public query ({ caller }) func getMessages(conversationId : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) {
        Runtime.trap("Conversation not found");
      };
      case (?convo) {
        if (not contains(convo.participants, caller)) {
          Runtime.trap("Unauthorized: You are not a participant in this conversation");
        };

        let conversationMessages = messages.values().toArray().filter(
          func(msg) { msg.conversationId == conversationId }
        );

        let sortedMessages = conversationMessages.sort(
          func(a, b) {
            if (a.timestamp < b.timestamp) { #less }
            else if (a.timestamp > b.timestamp) { #greater }
            else { #equal };
          }
        );

        sortedMessages;
      };
    };
  };
};
