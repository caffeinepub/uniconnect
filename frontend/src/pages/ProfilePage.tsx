import { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useUploadProfileImage, useMyListings, useGetMyCommunities } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ListingCard from '../components/marketplace/ListingCard';
import CommunityCard from '../components/communities/CommunityCard';
import {
  User, Edit, MapPin, GraduationCap,
  Linkedin, Globe, Camera, Loader2, Building2, Tag, ShoppingBag, Users, LogIn
} from 'lucide-react';
import { ExternalBlob } from '../backend';
import { useNavigate } from '@tanstack/react-router';
import ProfileSetupModal from '../components/ProfileSetupModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2 as Loader2Icon, X } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

const INTEREST_OPTIONS = [
  'Coding', 'Entrepreneurship', 'Marketing', 'Design',
  'Sports', 'Music', 'Science', 'Arts', 'Research', 'Finance',
];

const YEAR_OPTIONS = [
  '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgrad',
];

export default function ProfilePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [editModalOpen, setEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const uploadImageMutation = useUploadProfileImage();
  const { data: myListings, isLoading: listingsLoading } = useMyListings();
  const { data: myCommunities, isLoading: communitiesLoading } = useGetMyCommunities();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes);
    uploadImageMutation.mutate(blob);
    e.target.value = '';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <User size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Sign in to view your profile</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Log in to access your profile, listings, and communities.
        </p>
        <Button
          onClick={() => login()}
          disabled={isLoggingIn}
          className="bg-teal text-white hover:bg-teal-dark gap-2"
        >
          <LogIn size={16} />
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    );
  }

  if (isLoading || !isFetched) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <Skeleton className="w-28 h-28 rounded-full" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile yet — show setup modal
  if (!userProfile) {
    return <ProfileSetupModal />;
  }

  const profileImageUrl = userProfile.profileImage?.getDirectURL();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20" />

        <CardContent className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-5 -mt-14 sm:-mt-12">
            {/* Avatar */}
            <div className="relative flex-shrink-0 self-center sm:self-start">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background shadow-lg overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={userProfile.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {userProfile.name ? getInitials(userProfile.name) : <User size={36} />}
                  </span>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadImageMutation.isPending ? (
                    <Loader2 size={22} className="text-white animate-spin" />
                  ) : (
                    <Camera size={22} className="text-white" />
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 sm:pt-14">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {userProfile.name || 'Your Name'}
                  </h1>
                  {userProfile.course && (
                    <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1.5">
                      <GraduationCap size={14} />
                      {userProfile.course}
                      {userProfile.yearOfStudy && ` · ${userProfile.yearOfStudy}`}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(true)}
                  className="gap-2 self-start"
                >
                  <Edit size={14} />
                  Edit Profile
                </Button>
              </div>

              {/* Details Row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-muted-foreground">
                {userProfile.college && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-primary" />
                    {userProfile.college}
                  </span>
                )}
                {userProfile.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {userProfile.city}
                  </span>
                )}
              </div>

              {/* Social Links */}
              {(userProfile.linkedinUrl || userProfile.otherSocialUrl) && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {userProfile.linkedinUrl && (
                    <a
                      href={userProfile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Linkedin size={14} />
                      LinkedIn
                    </a>
                  )}
                  {userProfile.otherSocialUrl && (
                    <a
                      href={userProfile.otherSocialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Globe size={14} />
                      Website
                    </a>
                  )}
                </div>
              )}

              {/* Interests */}
              {userProfile.interestAreas && userProfile.interestAreas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {userProfile.interestAreas.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs gap-1">
                      <Tag size={10} />
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload feedback */}
      {uploadImageMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
          <Loader2 size={14} className="animate-spin" />
          Uploading profile image...
        </div>
      )}
      {uploadImageMutation.isError && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          Failed to upload image. Please try again.
        </div>
      )}

      {/* My Listings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-teal" />
          <h2 className="text-lg font-display font-semibold">My Listings</h2>
          {myListings && myListings.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">{myListings.length}</Badge>
          )}
        </div>
        {listingsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : myListings && myListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((listing) => (
              <ListingCard key={listing.id.toString()} listing={listing} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-border">
            <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">No listings yet</p>
                <p className="text-xs text-muted-foreground mt-1">Head to the Marketplace to post your first listing.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: '/marketplace' })} className="mt-1 border-teal/30 text-teal hover:bg-teal-light">
                Go to Marketplace
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <Separator />

      {/* My Communities */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-teal" />
          <h2 className="text-lg font-display font-semibold">My Communities</h2>
          {myCommunities && myCommunities.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">{myCommunities.length}</Badge>
          )}
        </div>
        {communitiesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : myCommunities && myCommunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCommunities.map((community) => (
              <CommunityCard key={community.id.toString()} community={community} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-border">
            <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">No communities joined yet</p>
                <p className="text-xs text-muted-foreground mt-1">Explore communities and join ones that match your interests.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: '/communities' })} className="mt-1 border-teal/30 text-teal hover:bg-teal-light">
                Explore Communities
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <ProfileEditModal
          profile={userProfile}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Inline Edit Modal ────────────────────────────────────────────────────────

interface ProfileEditModalProps {
  profile: UserProfile;
  onClose: () => void;
}

function ProfileEditModal({ profile, onClose }: ProfileEditModalProps) {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [city, setCity] = useState(profile.city);
  const [course, setCourse] = useState(profile.course);
  const [yearOfStudy, setYearOfStudy] = useState(profile.yearOfStudy);
  const [interestAreas, setInterestAreas] = useState<string[]>(profile.interestAreas);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '');
  const [otherSocialUrl, setOtherSocialUrl] = useState(profile.otherSocialUrl || '');

  const saveProfile = useSaveCallerUserProfile();

  const toggleInterest = (interest: string) => {
    setInterestAreas((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !college.trim() || !city.trim() || !course.trim() || !yearOfStudy) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        college: college.trim(),
        city: city.trim(),
        course: course.trim(),
        yearOfStudy,
        interestAreas,
        linkedinUrl: linkedinUrl.trim() || undefined,
        otherSocialUrl: otherSocialUrl.trim() || undefined,
        profileImage: profile.profileImage,
      });
      toast.success('Profile updated!');
      onClose();
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Edit Profile</DialogTitle>
          <DialogDescription>Update your student profile information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Your Name *</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-college">College / University *</Label>
            <Input id="edit-college" value={college} onChange={(e) => setCollege(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-course">Course / Program *</Label>
            <Input id="edit-course" value={course} onChange={(e) => setCourse(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label>Year of Study *</Label>
            <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
              <SelectTrigger>
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-city">City *</Label>
            <Input id="edit-city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Interest Areas <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = interestAreas.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-teal text-white border-teal'
                        : 'bg-background text-muted-foreground border-border hover:border-teal/50 hover:text-teal'
                    }`}
                  >
                    {selected && <X className="w-2.5 h-2.5 inline mr-1" />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-linkedin">LinkedIn URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input id="edit-linkedin" placeholder="https://linkedin.com/in/yourname" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-social">Other Social / Portfolio <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input id="edit-social" placeholder="https://github.com/yourname" value={otherSocialUrl} onChange={(e) => setOtherSocialUrl(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 bg-teal text-white hover:bg-teal-dark" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? (
                <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
