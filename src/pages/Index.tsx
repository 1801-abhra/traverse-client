import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Shield, Clock, MapPin, Users, Zap } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Book a ride in seconds with our streamlined interface.',
    },
    {
      icon: Shield,
      title: 'Safe Rides',
      description: 'Emergency button and verified drivers for your security.',
    },
    {
      icon: MapPin,
      title: 'Campus Coverage',
      description: 'Full coverage across all campus locations.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Track your ride status with live updates.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-header to-header/90 py-20 text-header-foreground lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg yNHYtMmgxMnptMC00djJIMjR2LTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary">
              <Bus className="h-4 w-4" />
              University Ride System
            </div>
            
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Campus Travel,{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-header-foreground/80 sm:text-xl">
              TRAVERSE connects students with verified campus drivers for safe, 
              convenient rides across the university. Book in seconds, track in real-time.
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full gradient-primary text-lg sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="w-full gradient-primary text-lg sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="w-full text-lg sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="hsl(210 20% 98%)"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose TRAVERSE?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Designed specifically for university campuses, TRAVERSE offers a seamless 
              experience for both students and drivers.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card group transition-all duration-300 hover:shadow-card-hover">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Moving?</h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of students and drivers using TRAVERSE for safe campus transportation.
            </p>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="lg" className="gradient-primary">
                  Create Your Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TRAVERSE. University Ride System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
