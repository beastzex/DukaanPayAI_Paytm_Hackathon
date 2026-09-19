import { ValidationException } from '../exceptions/domain-exceptions';

export class PhoneNumber {
  private readonly value: string;

  constructor(rawPhone: string) {
    const cleaned = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
    const e164Regex = /^\+?[1-9]\d{1,14}$/;

    if (!e164Regex.test(cleaned)) {
      throw new ValidationException(`Invalid E.164 phone number format: ${rawPhone}`);
    }

    this.value = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.getValue();
  }
}

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'INR'
  ) {
    if (amount < 0) {
      throw new ValidationException('Monetary amount cannot be negative');
    }
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ValidationException(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ValidationException(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
    if (this.amount - other.amount < 0) {
      throw new ValidationException('Insufficient funds result');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  public toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
