import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ridesAPI } from '@/services/api';
import { Ride } from '@/types/ride';
import RideCard from '@/components/RideCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { History, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { getRideId, isHistoryRide, normalizeRide } from '@/lib/rideUtils';

const RideHistory: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const data =
        user?.role === 'driver'
          ? await ridesAPI.getDriverRides()
          : await ridesAPI.getMyRides();
      const ridesArr = Array.isArray(data) ? data : data?.rides || [];
      const history = ridesArr.map(normalizeRide).filter(isHistoryRide);
      history.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      );
      setRides(history);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not load ride history';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchHistory();
    }
  }, [isAuthenticated, user?._id, user?.role]);

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role === 'driver' ? 'driver' : 'student';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <History className="h-8 w-8 text-primary" />
            Ride History
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'driver'
              ? 'Completed and cancelled rides you have driven.'
              : 'Your past campus rides.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsRefreshing(true);
              fetchHistory();
            }}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : rides.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No ride history yet</p>
            <p className="text-muted-foreground">Finished rides will show up here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rides.map((ride) => (
            <RideCard key={getRideId(ride)} ride={ride} userRole={userRole} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory;
