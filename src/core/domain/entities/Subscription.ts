export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PAST_DUE = "past_due",
}

export interface SubscriptionProps {
  id?: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subscription {
  private props: SubscriptionProps;

  constructor(props: SubscriptionProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  cancel(): void {
    this.props.cancelAtPeriodEnd = true;
    this.props.cancelledAt = new Date();
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.cancelAtPeriodEnd = false;
    this.props.updatedAt = new Date();
  }

  expire(): void {
    this.props.status = SubscriptionStatus.EXPIRED;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      userId: this.props.userId,
      planId: this.props.planId,
      status: this.props.status,
      currentPeriodStart: this.props.currentPeriodStart,
      currentPeriodEnd: this.props.currentPeriodEnd,
      cancelAtPeriodEnd: this.props.cancelAtPeriodEnd,
      cancelledAt: this.props.cancelledAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
