import React from 'react';
import { Ride, RideStatus } from '@/types/ride';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import RideStatusStepper from '@/components/RideStatusStepper';
import { canStudentCancel, getDriverVehicleNumber } from '@/lib/rideUtils';

interface RideCardProps {
  ride: Ride;
  userRole: 'student' | 'driver';
  onAccept?: (rideId: string) => void;
  onReject?: (rideId: string) => void;
  onCancel?: (rideId: string) => void;
  onUpdateStatus?: (rideId: string, status: RideStatus) => void;
  onEmergency?: (rideId: string) => void;
  isLoading?: boolean;
  /** When true, the Accept button is disabled — driver already has an active ride */
  acceptDisabled?: boolean;
  /** Show live status stepper (student active rides) */
  showLiveStatus?: boolean;
}

const statusConfig: Record<RideStatus, { label: string; className: string }> = {
  REQUESTED: { label: 'Searching', className: 'status-requested' },
  ACCEPTED: { label: 'Accepted', className: 'status-accepted' },
  ONGOING: { label: 'On the way', className: 'status-ongoing' },
  COMPLETED: { label: 'Completed', className: 'status-completed' },
  CANCELLED: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const RideCard: React.FC<RideCardProps> = ({
  ride,
  userRole,
  onAccept,
  onReject,
  onCancel,
  onUpdateStatus,
  onEmergency,
  isLoading,
  acceptDisabled,
  showLiveStatus,
}) => {
  const status = statusConfig[ride.status] || statusConfig.REQUESTED;
  const rideId = ride._id || ride.id || 'unknown';
  const formattedDate = ride.createdAt ? new Date(ride.createdAt).toLocaleString() : 'N/A';
  const vehicleNumber = getDriverVehicleNumber(ride);

  const getAddress = (location: string | { address: string } | undefined) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    return location.address || 'N/A';
  };

  const pickupAddress = getAddress(ride.pickup);
  const dropoffAddress = getAddress(ride.drop || ride.dropoff);

  return (
    <Card
      className={cn(
        'glass-card transition-all duration-200 hover:shadow-card-hover animate-slide-in',
        ride.emergency && 'border-destructive/50 bg-destructive/5'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            {userRole === 'driver' ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{ride.student?.name || 'Student'}</span>
              </div>
            ) : (
              <span>Ride #{rideId.slice(-6).toUpperCase()}</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {ride.emergency && (
              <span className="flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                <AlertTriangle className="h-3 w-3" />
                Emergency
              </span>
            )}
            <span className={cn('rounded-full border px-3 py-1 text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showLiveStatus && userRole === 'student' && (
          <RideStatusStepper status={ride.status} />
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
              <MapPin className="h-3.5 w-3.5 text-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pickup</p>
              <p className="font-medium">{pickupAddress}</p>
            </div>
          </div>

          <div className="ml-3 h-4 border-l-2 border-dashed border-border" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
              <MapPin className="h-3.5 w-3.5 text-destructive" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Drop-off</p>
              <p className="font-medium">{dropoffAddress}</p>
            </div>
          </div>
        </div>

        {userRole === 'student' && ride.driver && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Your Driver</p>
            <p className="font-medium">{ride.driver.name}</p>
            {vehicleNumber && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4 shrink-0" />
                <span>
                  Vehicle: <span className="font-medium text-foreground">{vehicleNumber}</span>
                </span>
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {userRole === 'driver' && ride.status === 'REQUESTED' && onAccept && (
            <Button
              onClick={() => onAccept(rideId)}
              disabled={isLoading || acceptDisabled}
              title={acceptDisabled ? 'Complete your active ride before accepting another' : undefined}
              className="flex-1 gradient-primary"
            >
              {acceptDisabled ? 'Ride In Progress' : 'Accept'}
            </Button>
          )}

          {userRole === 'driver' && ride.status === 'REQUESTED' && onReject && (
            <Button
              onClick={() => onReject(rideId)}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Reject
            </Button>
          )}

          {userRole === 'student' && canStudentCancel(ride) && onCancel && (
            <Button
              onClick={() => onCancel(rideId)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Cancel Ride
            </Button>
          )}

          {userRole === 'driver' && ride.status === 'ACCEPTED' && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(rideId, 'ONGOING')}
              disabled={isLoading}
              className="flex-1"
            >
              Start Ride
            </Button>
          )}

          {userRole === 'driver' && ride.status === 'ONGOING' && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(rideId, 'COMPLETED')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
            >
              Complete Ride
            </Button>
          )}

          {userRole === 'student' &&
            (ride.status === 'ACCEPTED' || ride.status === 'ONGOING') &&
            onEmergency &&
            !ride.emergency && (
              <Button
                onClick={() => onEmergency(rideId)}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
