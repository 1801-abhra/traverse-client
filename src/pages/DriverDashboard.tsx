import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ridesAPI } from '@/services/api';
import { initSocket, disconnectSocket } from '@/services/socket';
import { Ride, RideStatus } from '@/types/ride';
import RideCard from '@/components/RideCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Car, CheckCircle, Clock, History } from 'lucide-react';
import { getRideId, mergeRideUpdate, normalizeRide } from '@/lib/rideUtils';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [dismissedRideIds, setDismissedRideIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingRide, setProcessingRide] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();

    const socket = initSocket();

    socket.on('ride:new', (newRide: Ride) => {
      const normalizedRide = normalizeRide(newRide);
      const rideId = getRideId(normalizedRide);
      if (normalizedRide.status !== 'REQUESTED' || !rideId) return;

      setAvailableRides((prev) => {
        if (prev.some((r) => getRideId(r) === rideId)) return prev;
        return [normalizedRide, ...prev];
      });

      const pickupAddr =
        typeof normalizedRide.pickup === 'string'
          ? normalizedRide.pickup
          : normalizedRide.pickup?.address;
      const dropAddr =
        normalizedRide.drop?.address ||
        (typeof normalizedRide.dropoff === 'string'
          ? normalizedRide.dropoff
          : normalizedRide.dropoff?.address);

      toast({
        title: 'New ride request',
        description: `From ${pickupAddr} to ${dropAddr}`,
      });
    });

    socket.on('ride:update', (updatedRide: Ride) => {
      const normalizedRide = normalizeRide(updatedRide);
      const rideId = getRideId(normalizedRide);

      if (normalizedRide.status !== 'REQUESTED') {
        setAvailableRides((prev) => prev.filter((r) => getRideId(r) !== rideId));
      }

      if (normalizedRide.driver?._id === user?._id) {
        setMyRides((prev) => {
          const exists = prev.find((r) => getRideId(r) === rideId);
          if (exists) {
            return prev.map((r) =>
              getRideId(r) === rideId ? mergeRideUpdate(r, normalizedRide) : r
            );
          }
          return [normalizedRide, ...prev];
        });
      }
    });

    if (user?._id) {
      socket.emit('join', { userId: user._id, role: 'driver' });
    }

    return () => {
      socket.off('ride:new');
      socket.off('ride:update');
      disconnectSocket();
    };
  }, [user?._id, toast]);

  const fetchRides = async () => {
    try {
      const [available, mine] = await Promise.all([
        ridesAPI.getAvailableRides(),
        ridesAPI.getDriverRides(),
      ]);

      const availableArr = Array.isArray(available) ? available : available?.rides || [];
      const mineArr = Array.isArray(mine) ? mine : mine?.rides || [];

      setAvailableRides(availableArr.map(normalizeRide));
      setMyRides(mineArr.map(normalizeRide));
    } catch (error: unknown) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRides();
  };

  const activeRides = myRides.filter((r) => r.status === 'ACCEPTED' || r.status === 'ONGOING');
  const hasActiveRide = activeRides.length > 0;
  const completedRides = myRides.filter((r) => r.status === 'COMPLETED');

  const visibleAvailableRides = availableRides.filter(
    (r) => !dismissedRideIds.has(getRideId(r))
  );

  const handleAcceptRide = async (rideId: string) => {
    if (hasActiveRide) {
      toast({
        variant: 'destructive',
        title: 'Cannot accept ride',
        description: 'Complete your current ride before accepting another.',
      });
      return;
    }

    setProcessingRide(rideId);

    try {
      const response = await ridesAPI.acceptRide(rideId, user?._id || '');
      const originalRide = availableRides.find((r) => getRideId(r) === rideId);

      const acceptedRide = normalizeRide({
        ...(originalRide || {}),
        ...(response || {}),
        status: 'ACCEPTED',
        driver: {
          _id: user?._id || '',
          name: user?.name || '',
          email: user?.email || '',
          vehicleNumber:
            (response as Ride)?.driver?.vehicleNumber ||
            (user as { vehicleNumber?: string })?.vehicleNumber,
        },
      });

      setAvailableRides((prev) => prev.filter((r) => getRideId(r) !== rideId));
      setMyRides((prev) => [acceptedRide, ...prev]);
      setDismissedRideIds((prev) => {
        const next = new Set(prev);
        next.delete(rideId);
        return next;
      });

      toast({
        title: 'Ride accepted',
        description: 'Head to the pickup location.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to accept ride';
      toast({
        variant: 'destructive',
        title: 'Cannot accept ride',
        description: message,
      });
    } finally {
      setProcessingRide(null);
    }
  };

  const handleRejectRide = async (rideId: string) => {
    setProcessingRide(rideId);

    try {
      if (user?._id) {
        await ridesAPI.rejectRide(rideId, user._id);
      }
    } catch {
      // Backend may not implement reject — hide locally for this driver
    }

    setDismissedRideIds((prev) => new Set(prev).add(rideId));
    toast({
      title: 'Request dismissed',
      description: 'This ride was removed from your queue.',
    });
    setProcessingRide(null);
  };

  const handleUpdateStatus = async (rideId: string, status: RideStatus) => {
    setProcessingRide(rideId);

    try {
      const updated = await ridesAPI.updateRideStatus(
        rideId,
        status.toLowerCase(),
        user?._id
      );
      const ridePayload =
        (updated as { ride?: Ride })?.ride ?? (updated as Ride);
      const normalized = normalizeRide(
        ridePayload?.status ? ridePayload : { ...myRides.find((r) => getRideId(r) === rideId)!, status }
      );

      setMyRides((prev) =>
        prev.map((r) => (getRideId(r) === rideId ? mergeRideUpdate(r, normalized) : r))
      );

      const statusMessages: Record<RideStatus, string> = {
        ONGOING: 'Ride started. Drive safely.',
        COMPLETED: 'Ride completed. Great job!',
        ACCEPTED: 'Ride accepted.',
        REQUESTED: 'Ride requested.',
        CANCELLED: 'Ride cancelled.',
      };

      toast({
        title: 'Status updated',
        description: statusMessages[status],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setProcessingRide(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/history">
              <History className="mr-2 h-4 w-4" />
              Ride History
            </Link>
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="available" className="gap-2">
              <Clock className="h-4 w-4" />
              Available
              {visibleAvailableRides.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {visibleAvailableRides.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <Car className="h-4 w-4" />
              Active
              {activeRides.length > 0 && (
                <span className="ml-1 rounded-full bg-success px-2 py-0.5 text-xs text-success-foreground">
                  {activeRides.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {visibleAvailableRides.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">No incoming requests</p>
                  <p className="text-muted-foreground">
                    New ride requests appear here in real time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleAvailableRides.map((ride) => (
                  <RideCard
                    key={getRideId(ride)}
                    ride={ride}
                    userRole="driver"
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                    isLoading={processingRide === getRideId(ride)}
                    acceptDisabled={hasActiveRide}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeRides.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Car className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">No active rides</p>
                  <p className="text-muted-foreground">Accept a ride to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeRides.map((ride) => (
                  <RideCard
                    key={getRideId(ride)}
                    ride={ride}
                    userRole="driver"
                    onUpdateStatus={handleUpdateStatus}
                    isLoading={processingRide === getRideId(ride)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRides.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">No completed rides yet</p>
                  <p className="text-muted-foreground">
                    See full history on the{' '}
                    <Link to="/history" className="text-primary hover:underline">
                      ride history
                    </Link>{' '}
                    page.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {completedRides.slice(0, 10).map((ride) => (
                  <RideCard key={getRideId(ride)} ride={ride} userRole="driver" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DriverDashboard;
