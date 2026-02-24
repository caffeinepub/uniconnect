import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingBag,
  Users,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Star,
  MessageCircle,
  Search,
  PlusCircle,
  LogIn,
  Heart,
} from 'lucide-react';

const features = [
  {
    icon: <ShoppingBag size={28} className="text-amber-600" />,
    title: 'Marketplace',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    description:
      'Buy, sell, or rent academic resources — textbooks, notes, stationery, and more — directly with fellow students at your college or city.',
    steps: [
      'Browse listings filtered by category, type, or location',
      'Click any listing to view full details and contact the seller',
      'Post your own listing with title, description, price, and an optional photo',
      'Mark your listing as Sold or Rented once the deal is done',
    ],
  },
  {
    icon: <Users size={28} className="text-teal-600" />,
    title: 'Communities',
    color: 'bg-teal-50 border-teal-200',
    iconBg: 'bg-teal-100',
    description:
      'Join or create interest-based student groups — coding clubs, entrepreneurship cells, design teams, and more — across campuses.',
    steps: [
      'Browse communities by category (Coding, Design, Marketing, etc.)',
      'Click "Join" on a public community to become a member instantly',
      'For private communities, send a join request and wait for approval',
      'Create your own community with a name, description, cover image, and visibility setting',
    ],
  },
  {
    icon: <Calendar size={28} className="text-purple-600" />,
    title: 'Events',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    description:
      'Discover campus events and platform-wide events. Register for hackathons, workshops, cultural fests, and more.',
    steps: [
      'Browse "Events By Us" (official UniShare events) and "Community Events" (user-posted)',
      'Filter events by category, college, or city',
      'Click an event to see full details, venue, date, and registration link',
      'Hit "Register" to mark your attendance and get counted as an attendee',
      'Post your own community event using the "Post Event" button',
    ],
  },
  {
    icon: <User size={28} className="text-blue-600" />,
    title: 'Profile',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    description:
      'Set up your student profile with your college, course, year, interests, and social links. Upload a profile photo to personalize your presence.',
    steps: [
      'After logging in, complete your profile setup (name, college, course, year, city)',
      'Add your interest areas as tags (e.g., AI, Finance, Photography)',
      'Upload a profile picture by clicking the camera icon on your avatar',
      'Add your LinkedIn or other social links for networking',
      'Edit your profile anytime from the Profile page',
    ],
  },
  {
    icon: <MapPin size={28} className="text-rose-600" />,
    title: 'Location Detection',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
    description:
      'UniShare can auto-detect your city using your browser\'s geolocation to show you the most relevant listings and events near you.',
    steps: [
      'When setting up your profile, click "Detect Location" to auto-fill your city',
      'Allow browser location permission when prompted',
      'Your city is used to filter marketplace listings and events by default',
      'You can always manually type your city if you prefer',
    ],
  },
];

const faqs = [
  {
    q: 'Is UniShare free to use?',
    a: 'Yes! UniShare is completely free for all students. There are no listing fees, membership fees, or hidden charges.',
  },
  {
    q: 'Who can use UniShare?',
    a: 'UniShare is designed for college and university students across India. Anyone can browse listings and events, but you need to log in to post listings, join communities, or register for events.',
  },
  {
    q: 'How do I log in?',
    a: 'UniShare uses Internet Identity for secure, privacy-preserving authentication. Click the "Login" button in the top navbar and follow the prompts. No email or password required.',
  },
  {
    q: 'How do I contact a seller?',
    a: 'Click on any listing to view its full details. The seller\'s name and college are displayed. You can use the in-app messaging feature to start a conversation directly.',
  },
  {
    q: 'Can I post listings from any college?',
    a: 'Yes! You can post listings visible to your campus only, your city, or all of India. Choose the visibility scope when creating a listing.',
  },
  {
    q: 'How do private communities work?',
    a: 'Private communities require the creator to approve join requests. When you click "Request to Join" on a private community, the creator will review and approve or decline your request.',
  },
  {
    q: 'Can I upload images for my listings?',
    a: 'Yes! When posting a listing or creating a community, you can upload an optional cover image. Profile photos can also be uploaded from your Profile page.',
  },
  {
    q: 'Is my data safe?',
    a: 'UniShare is built on the Internet Computer blockchain, which means your data is stored in a decentralized, tamper-proof canister. Your identity is managed by Internet Identity without exposing personal credentials.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo lockup matching Navbar */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <img
              src="/assets/generated/unishare-icon.dim_64x64.png"
              alt="UniShare icon"
              className="h-14 w-14 rounded-xl object-cover shadow-md"
            />
            <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">UniShare</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            About <span className="text-primary">UniShare</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A student-first platform connecting college students across India for peer-to-peer
            resource exchange, community building, and campus collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/marketplace">
              <Button className="gap-2">
                <ShoppingBag size={16} />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/communities">
              <Button variant="outline" className="gap-2">
                <Users size={16} />
                Browse Communities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* What is UniShare */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">What is UniShare?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-muted-foreground leading-relaxed">
                UniShare is a <strong className="text-foreground">student community platform</strong> built
                specifically for college students in India. It brings together the tools students need
                most — a marketplace for academic resources, interest-based communities, campus events,
                and a personalized profile — all in one place.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Whether you're looking to sell your old textbooks, find study partners, discover
                hackathons, or connect with students from other colleges, UniShare is your go-to
                campus companion.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              {[
                'Built for Indian college students',
                'Peer-to-peer resource exchange',
                'Interest-based community groups',
                'Campus & platform events',
                'Secure blockchain-based identity',
                'Completely free to use',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Goal */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Target size={20} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Our Goal</h2>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: <Heart size={28} className="text-rose-500" />,
                  title: 'Empower Students',
                  desc: 'Give every student the tools to share, collaborate, and grow — regardless of their college or city.',
                },
                {
                  icon: <Users size={28} className="text-teal-600" />,
                  title: 'Build Communities',
                  desc: 'Foster meaningful connections between students with shared interests across campuses.',
                },
                {
                  icon: <Lightbulb size={28} className="text-amber-600" />,
                  title: 'Reduce Waste',
                  desc: 'Enable peer-to-peer exchange of academic resources to reduce costs and promote sustainability.',
                },
              ].map((goal) => (
                <div key={goal.title} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {goal.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Star size={20} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Features Overview</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`border rounded-xl p-5 ${feature.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.iconBg}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* User Tour */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Search size={20} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">How to Use Each Feature</h2>
          </div>
          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div key={feature.title} className={`border rounded-xl p-6 ${feature.color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.iconBg}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                </div>
                <ol className="space-y-2">
                  {feature.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-foreground">
                        {stepIdx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <LogIn size={24} className="text-primary" />,
                step: '1',
                title: 'Login',
                desc: 'Click "Login" in the navbar and authenticate with Internet Identity — no email or password needed.',
              },
              {
                icon: <User size={24} className="text-teal-600" />,
                step: '2',
                title: 'Set Up Profile',
                desc: 'Fill in your name, college, course, year, and city. Add interests and social links to personalize your profile.',
              },
              {
                icon: <ArrowRight size={24} className="text-amber-600" />,
                step: '3',
                title: 'Start Exploring',
                desc: 'Browse the marketplace, join communities, discover events, and connect with fellow students.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Step {item.step}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Messaging */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle size={20} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Messaging</h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              UniShare includes a built-in messaging system so you can communicate directly with sellers, community members, or event organizers without leaving the platform.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: <PlusCircle size={16} className="text-primary" />, text: 'Start a conversation from any listing or profile' },
                { icon: <MessageCircle size={16} className="text-teal-600" />, text: 'Real-time messaging with other students' },
                { icon: <CheckCircle2 size={16} className="text-amber-600" />, text: 'All messages stored securely on-chain' },
                { icon: <User size={16} className="text-blue-600" />, text: 'Access all conversations from the Messages tab' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-foreground">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-card border border-border rounded-xl px-5 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-border rounded-2xl p-10">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img
                src="/assets/generated/unishare-icon.dim_64x64.png"
                alt="UniShare icon"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-2xl font-extrabold text-foreground tracking-tight">UniShare</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              Ready to join your campus community?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in with Internet Identity and start connecting with students across India today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2">
                  <ShoppingBag size={18} />
                  Browse Marketplace
                </Button>
              </Link>
              <Link to="/communities">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users size={18} />
                  Explore Communities
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
