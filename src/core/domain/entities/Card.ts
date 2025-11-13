export enum CardStatus {
  ACTIVE = "active",
  FLAGGED = "flagged",
  DELETED = "deleted",
}

export interface CardProps {
  id?: string;
  title: string;
  userId: string;
  status: CardStatus;
  views: number;
  clicks: number;
  flagReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card {
  private props: CardProps;

  constructor(props: CardProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): CardStatus {
    return this.props.status;
  }

  get views(): number {
    return this.props.views;
  }

  get clicks(): number {
    return this.props.clicks;
  }

  flag(reason: string): void {
    this.props.status = CardStatus.FLAGGED;
    this.props.flagReason = reason;
    this.props.updatedAt = new Date();
  }

  unflag(): void {
    this.props.status = CardStatus.ACTIVE;
    this.props.flagReason = undefined;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    this.props.status = CardStatus.DELETED;
    this.props.updatedAt = new Date();
  }

  restore(): void {
    this.props.status = CardStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  incrementViews(): void {
    this.props.views++;
    this.props.updatedAt = new Date();
  }

  incrementClicks(): void {
    this.props.clicks++;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      title: this.props.title,
      userId: this.props.userId,
      status: this.props.status,
      views: this.props.views,
      clicks: this.props.clicks,
      flagReason: this.props.flagReason,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
