import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEvent, useGetCallerUserProfile } from '../../hooks/useQueries';
import { EventCategory, EventOrganizerType } from '../../backend';
import { toast } from 'sonner';

interface PostEventModalProps {
  onClose: () => void;
}

export default function PostEventModal({ onClose }: PostEventModalProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const createEvent = useCreateEvent();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'tech' as EventCategory,
    college: userProfile?.college || '',
    city: userProfile?.city || '',
    venue: '',
    eventDate: '',
    registrationLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.college || !form.city || !form.venue || !form.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const dateMs = new Date(form.eventDate).getTime();
    if (isNaN(dateMs)) {
      toast.error('Please enter a valid date');
      return;
    }
    // Convert ms to nanoseconds for the backend
    const eventDateNs = BigInt(dateMs) * BigInt(1_000_000);

    try {
      await createEvent.mutateAsync({
        title: form.title,
        description: form.description,
        category: form.category,
        organizer: userProfile?.name || 'Anonymous',
        organizerType: 'user' as EventOrganizerType,
        college: form.college,
        city: form.city,
        venue: form.venue,
        eventDate: eventDateNs,
        registrationLink: form.registrationLink || null,
        image: null,
      });
      toast.success('Event posted successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to post event');
    }
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Post an Event</DialogTitle>
          <DialogDescription>
            List a new event for students at your college or city.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Event Title *</Label>
            <Input
              placeholder="e.g. Annual Hackathon 2026"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the event, what to expect, etc."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">💻 Tech</SelectItem>
                  <SelectItem value="business">💼 Business</SelectItem>
                  <SelectItem value="cultural">🎭 Cultural</SelectItem>
                  <SelectItem value="sports">⚽ Sports</SelectItem>
                  <SelectItem value="workshop">🛠️ Workshop</SelectItem>
                  <SelectItem value="other">📅 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Event Date *</Label>
              <Input
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => set('eventDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Venue *</Label>
            <Input
              placeholder="e.g. Main Auditorium, Block A"
              value={form.venue}
              onChange={(e) => set('venue', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>College *</Label>
              <Input
                placeholder="Your college"
                value={form.college}
                onChange={(e) => set('college', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input
                placeholder="Your city"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Registration Link (optional)</Label>
            <Input
              placeholder="https://..."
              value={form.registrationLink}
              onChange={(e) => set('registrationLink', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal text-white hover:bg-teal-dark"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? 'Posting...' : 'Post Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
