import { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomTabBar from './BottomTabBar';
import ProfileSetupModal from './ProfileSetupModal';
import { Link } from '@tanstack/react-router';
import { SiLinkedin, SiInstagram, SiGithub } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const appId = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'unishare-app';
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <BottomTabBar />

      {/* Footer — visible on all screen sizes, with extra bottom padding on mobile for BottomTabBar */}
      <footer className="block bg-card border-t border-border pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/generated/unishare-icon.dim_64x64.png"
                  alt="UniShare icon"
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <span className="text-lg font-extrabold text-foreground tracking-tight">UniShare</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A student community platform connecting college students across India for peer-to-peer exchange, collaboration, and growth.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://www.linkedin.com/in/durganand-sah-491b50253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin size={20} />
                </a>
                <a
                  href="https://www.instagram.com/dn.atwork/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram size={20} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <SiGithub size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/communities" className="hover:text-primary transition-colors">Communities</Link></li>
                <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Developer */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Developer</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="font-medium text-foreground">Durganand Sah</li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/durganand-sah-491b50253"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    LinkedIn Profile
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/dn.atwork/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} UniShare. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart size={14} className="text-red-500 fill-red-500 mx-1" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium ml-1"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
