import { Ride, RideStatus } from '@/types/ride';

const STATUS_MAP: Record<string, RideStatus> = {
  REQUESTED: 'REQUESTED',
  SEARCHING: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  ONGOING: 'ONGOING',
  ON_THE_WAY: 'ONGOING',
  'ON THE WAY': 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  CANCELED: 'CANCELLED',
};

export const normalizeRideStatus = (status?: string): RideStatus => {
  if (!status) return 'REQUESTED';
  const key = status.trim().toUpperCase().replace(/\s+/g, '_');
  return STATUS_MAP[key] || (key as RideStatus);
};

export const getRideId = (ride: Ride): string => ride._id || ride.id || '';

export const normalizeRide = (ride: Ride): Ride => ({
  ...ride,
  status: normalizeRideStatus(ride.status),
  driver: ride.driver
    ? {
        ...ride.driver,
        vehicleNumber:
          ride.driver.vehicleNumber ||
          (ride.driver as { vehicle?: string }).vehicle ||
          undefined,
      }
    : ride.driver,
});

export const mergeRideUpdate = (existing: Ride, incoming: Ride): Ride => {
  const normalized = normalizeRide(incoming);
  return normalizeRide({
    ...existing,
    ...normalized,
    pickup: normalized.pickup ?? existing.pickup,
    drop: normalized.drop ?? existing.drop,
    dropoff: normalized.dropoff ?? existing.dropoff,
    student: normalized.student ?? existing.student,
    driver: normalized.driver
      ? {
          ...(existing.driver || {}),
          ...normalized.driver,
          vehicleNumber:
            normalized.driver.vehicleNumber ||
            existing.driver?.vehicleNumber ||
            (normalized.driver as { vehicle?: string }).vehicle,
        }
      : existing.driver,
  });
};

export const getDriverVehicleNumber = (ride: Ride): string | undefined =>
  ride.driver?.vehicleNumber ||
  (ride.driver as { vehicle?: string } | undefined)?.vehicle ||
  (ride as { vehicleNumber?: string }).vehicleNumber;

export const isActiveRide = (ride: Ride): boolean =>
  ride.status !== 'COMPLETED' && ride.status !== 'CANCELLED';

export const isHistoryRide = (ride: Ride): boolean =>
  ride.status === 'COMPLETED' || ride.status === 'CANCELLED';

export const canStudentCancel = (ride: Ride): boolean => ride.status === 'REQUESTED';
