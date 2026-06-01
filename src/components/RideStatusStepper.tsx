import React from 'react';
import { RideStatus } from '@/types/ride';
import { cn } from '@/lib/utils';
import { Check, Loader2, MapPin, Search, Car } from 'lucide-react';

const STEPS: { status: RideStatus; label: string; icon: React.ElementType }[] = [
  { status: 'REQUESTED', label: 'Searching', icon: Search },
  { status: 'ACCEPTED', label: 'Accepted', icon: Check },
  { status: 'ONGOING', label: 'On the way', icon: Car },
  { status: 'COMPLETED', label: 'Completed', icon: MapPin },
];

const statusOrder: Record<RideStatus, number> = {
  REQUESTED: 0,
  ACCEPTED: 1,
  ONGOING: 2,
  COMPLETED: 3,
  CANCELLED: -1,
};

interface RideStatusStepperProps {
  status: RideStatus;
  className?: string;
}

const RideStatusStepper: React.FC<RideStatusStepperProps> = ({ status, className }) => {
  if (status === 'CANCELLED') {
    return (
      <p className={cn('text-sm font-medium text-destructive', className)}>Ride cancelled</p>
    );
  }

  const currentIndex = statusOrder[status] ?? 0;

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Live status
      </p>
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.status}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors',
                    isComplete && 'border-success bg-success text-success-foreground',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    !isComplete && !isCurrent && 'border-border bg-muted/50 text-muted-foreground'
                  )}
                >
                  {isCurrent && status !== 'COMPLETED' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isComplete || (isCurrent && status === 'COMPLETED') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium leading-tight sm:text-xs',
                    isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mb-6 h-0.5 flex-1 max-w-[2rem] rounded',
                    index < currentIndex ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RideStatusStepper;
