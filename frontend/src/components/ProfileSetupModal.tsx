import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { GraduationCap, MapPin, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const INTEREST_OPTIONS = [
  'Coding', 'Entrepreneurship', 'Marketing', 'Design',
  'Sports', 'Music', 'Science', 'Arts', 'Research', 'Finance',
];

const YEAR_OPTIONS = [
  '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgrad',
];

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [course, setCourse] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [otherSocialUrl, setOtherSocialUrl] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

  const detectLocation = async () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            '';
          if (detectedCity) setCity(detectedCity);
        } catch {
          // silently fail
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      });
      toast.success('Profile saved! Welcome to UniShare 🎓');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-display">Welcome to UniShare!</DialogTitle>
          </div>
          <DialogDescription>
            Set up your student profile to connect with peers, join communities, and discover opportunities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* College */}
          <div className="space-y-1.5">
            <Label htmlFor="college">College / University *</Label>
            <Input
              id="college"
              placeholder="e.g. IIT Delhi"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
          </div>

          {/* Course */}
          <div className="space-y-1.5">
            <Label htmlFor="course">Course / Program *</Label>
            <Input
              id="course"
              placeholder="e.g. B.Tech Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </div>

          {/* Year of Study */}
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

          {/* City with location detection */}
          <div className="space-y-1.5">
            <Label htmlFor="city">City *</Label>
            <div className="flex gap-2">
              <Input
                id="city"
                placeholder="e.g. New Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="shrink-0 gap-1.5 text-teal border-teal/30 hover:bg-teal-light"
              >
                {detectingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                {detectingLocation ? 'Detecting...' : 'Detect'}
              </Button>
            </div>
          </div>

          {/* Interest Areas */}
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
            {interestAreas.length > 0 && (
              <p className="text-xs text-muted-foreground">{interestAreas.length} selected</p>
            )}
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-1.5">
            <Label htmlFor="linkedin">LinkedIn URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourname"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          {/* Other Social URL */}
          <div className="space-y-1.5">
            <Label htmlFor="otherSocial">Other Social / Portfolio <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="otherSocial"
              placeholder="https://github.com/yourname or portfolio link"
              value={otherSocialUrl}
              onChange={(e) => setOtherSocialUrl(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-teal text-white hover:bg-teal-dark"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Setup & Join UniShare 🎓'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
