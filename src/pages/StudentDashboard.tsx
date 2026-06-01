import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ridesAPI } from '@/services/api';
import { initSocket, disconnectSocket } from '@/services/socket';
import { Ride } from '@/types/ride';
import RideCard from '@/components/RideCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Loader2, RefreshCw, Car, History } from 'lucide-react';
import {
  getRideId,
  isActiveRide,
  isHistoryRide,
  mergeRideUpdate,
  normalizeRide,
} from '@/lib/rideUtils';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [rides, setRides] = useState<Ride[]>([]);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingRide, setProcessingRide] = useState<string | null>(null);

  const applyRideUpdate = useCallback((updatedRide: Ride) => {
    const normalized = normalizeRide(updatedRide);
    const rideId = getRideId(normalized);
    if (!rideId) return normalized;

    setRides((prev) => {
      const index = prev.findIndex((r) => getRideId(r) === rideId);
      if (index === -1) {
        if (normalized.student?._id === user?._id) {
          return [normalized, ...prev];
        }
        return prev;
      }
      const next = [...prev];
      next[index] = mergeRideUpdate(prev[index], normalized);
      return next;
    });

    return normalized;
  }, [user?._id]);

  const fetchRides = async () => {
    try {
      const data = await ridesAPI.getMyRides();
      const ridesArr = Array.isArray(data) ? data : data?.rides || [];
      setRides(ridesArr.map(normalizeRide));
    } catch (error: unknown) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRides();

    const socket = initSocket();

    const onRideUpdate = (updatedRide: Ride) => {
      const normalized = applyRideUpdate(updatedRide);

      if (normalized.status === 'ACCEPTED' && normalized.driver?.name) {
        toast({
          title: 'Driver assigned',
          description: `${normalized.driver.name} accepted your ride.`,
        });
      } else if (normalized.status === 'ONGOING') {
        toast({
          title: 'On the way',
          description: 'Your driver is heading to your destination.',
        });
      } else if (normalized.status === 'COMPLETED') {
        toast({
          title: 'Ride completed',
          description: 'Thanks for riding with TRAVERSE.',
        });
      } else if (normalized.status === 'CANCELLED') {
        toast({
          title: 'Ride cancelled',
          description: 'Your ride request was cancelled.',
        });
      }
    };

    socket.on('ride:update', onRideUpdate);

    socket.on('rideAccepted', (updatedRide: Ride) => {
      const normalized = applyRideUpdate({ ...updatedRide, status: 'ACCEPTED' });
      const driverName = normalized.driver?.name || 'A driver';
      const vehicle = normalized.driver?.vehicleNumber;
      toast({
        title: 'Driver on the way!',
        description: vehicle
          ? `${driverName} accepted your ride. Vehicle: ${vehicle}`
          : `${driverName} accepted your ride.`,
      });
    });

    socket.on('ride:new', (newRide: Ride) => {
      const normalized = normalizeRide(newRide);
      if (normalized.student?._id === user?._id) {
        setRides((prev) => {
          const id = getRideId(normalized);
          if (prev.some((r) => getRideId(r) === id)) return prev;
          return [normalized, ...prev];
        });
      }
    });

    if (user?._id) {
      socket.emit('join', { userId: user._id, role: 'student' });
    }

    return () => {
      socket.off('ride:update', onRideUpdate);
      socket.off('rideAccepted');
      socket.off('ride:new');
      disconnectSocket();
    };
  }, [user?._id, applyRideUpdate, toast]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRides();
  };

  const handleBookRide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickup.trim() || !dropoff.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter both pickup and drop-off locations',
      });
      return;
    }

    setIsBooking(true);

    try {
      const response = await ridesAPI.createRide({ pickup, dropoff });
      const newRide = response?.ride || response;
      const normalizedRide = normalizeRide({ ...newRide, status: newRide.status || 'REQUESTED' });

      setRides((prev) => [normalizedRide, ...prev]);
      setPickup('');
      setDropoff('');

      toast({
        title: 'Ride requested',
        description: 'Searching for a nearby driver...',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not book ride';
      toast({
        variant: 'destructive',
        title: 'Booking failed',
        description: message,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    setProcessingRide(rideId);
    try {
      const updated = await ridesAPI.cancelRide(rideId);
      const normalized = normalizeRide(
        typeof updated === 'object' && updated !== null && 'status' in updated
          ? (updated as Ride)
          : { ...rides.find((r) => getRideId(r) === rideId)!, status: 'CANCELLED' }
      );
      applyRideUpdate(normalized);
      toast({
        title: 'Ride cancelled',
        description: 'Your request has been cancelled.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to cancel ride';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setProcessingRide(null);
    }
  };

  const handleEmergency = async (rideId: string) => {
    try {
      await ridesAPI.triggerEmergency(rideId);
      setRides((prev) =>
        prev.map((ride) =>
          getRideId(ride) === rideId ? { ...ride, emergency: true } : ride
        )
      );

      toast({
        variant: 'destructive',
        title: 'Emergency Alert Sent',
        description: 'Campus security has been notified.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send emergency alert';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    }
  };

  const activeRides = rides.filter(isActiveRide);
  const primaryActiveRide = activeRides[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Book a ride or track your live ride status below.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/history">
            <History className="mr-2 h-4 w-4" />
            Ride History
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Book a Ride
            </CardTitle>
            <CardDescription>Enter your pickup and drop-off locations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookRide} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                  <Input
                    id="pickup"
                    placeholder="e.g., Main Library"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-10"
                    disabled={isBooking}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff">Drop-off Location</Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                  <Input
                    id="dropoff"
                    placeholder="e.g., Science Building"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="pl-10"
                    disabled={isBooking}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={isBooking}>
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Request Ride'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Rides</h2>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeRides.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <Car className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No active rides</p>
                <p className="text-muted-foreground">Book a ride to see live status updates here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {primaryActiveRide && (
                <RideCard
                  key={getRideId(primaryActiveRide)}
                  ride={primaryActiveRide}
                  userRole="student"
                  showLiveStatus
                  onCancel={handleCancelRide}
                  onEmergency={handleEmergency}
                  isLoading={processingRide === getRideId(primaryActiveRide)}
                />
              )}
              {activeRides.slice(1).map((ride) => (
                <RideCard
                  key={getRideId(ride)}
                  ride={ride}
                  userRole="student"
                  showLiveStatus
                  onCancel={handleCancelRide}
                  onEmergency={handleEmergency}
                  isLoading={processingRide === getRideId(ride)}
                />
              ))}
            </div>
          )}

          {rides.some(isHistoryRide) && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              View completed rides on the{' '}
              <Link to="/history" className="font-medium text-primary hover:underline">
                ride history
              </Link>{' '}
              page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
