export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string = "SAR"
  ) {
    if (amount < 0) {
      throw new ValidationError("Amount cannot be negative");
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ValidationError("Cannot add money with different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }
}
