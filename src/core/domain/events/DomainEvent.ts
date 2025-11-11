export interface IDomainEvent {
  occurredOn: Date;
  getAggregateId(): string;
}

export abstract class DomainEvent implements IDomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }

  getAggregateId(): string {
    return this.aggregateId;
  }
}

// Example domain events
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(aggregateId);
  }
}

export class OrderCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderNumber: string,
    public readonly customerId: string,
    public readonly total: number
  ) {
    super(aggregateId);
  }
}

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly price: number
  ) {
    super(aggregateId);
  }
}

// Event dispatcher
export interface IEventDispatcher {
  dispatch(event: IDomainEvent): Promise<void>;
  register(
    eventName: string,
    handler: (event: IDomainEvent) => Promise<void>
  ): void;
}

export class EventDispatcher implements IEventDispatcher {
  private handlers: Map<string, Array<(event: IDomainEvent) => Promise<void>>> =
    new Map();

  register(
    eventName: string,
    handler: (event: IDomainEvent) => Promise<void>
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async dispatch(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${eventName}:`, error);
      }
    }
  }
}
