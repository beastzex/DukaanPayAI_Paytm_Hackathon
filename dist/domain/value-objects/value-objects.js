"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = exports.PhoneNumber = void 0;
const domain_exceptions_1 = require("../exceptions/domain-exceptions");
class PhoneNumber {
    value;
    constructor(rawPhone) {
        const cleaned = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
        const e164Regex = /^\+?[1-9]\d{1,14}$/;
        if (!e164Regex.test(cleaned)) {
            throw new domain_exceptions_1.ValidationException(`Invalid E.164 phone number format: ${rawPhone}`);
        }
        this.value = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.getValue();
    }
}
exports.PhoneNumber = PhoneNumber;
class Money {
    amount;
    currency;
    constructor(amount, currency = 'INR') {
        this.amount = amount;
        this.currency = currency;
        if (amount < 0) {
            throw new domain_exceptions_1.ValidationException('Monetary amount cannot be negative');
        }
    }
    add(other) {
        if (this.currency !== other.currency) {
            throw new domain_exceptions_1.ValidationException(`Currency mismatch: ${this.currency} vs ${other.currency}`);
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    subtract(other) {
        if (this.currency !== other.currency) {
            throw new domain_exceptions_1.ValidationException(`Currency mismatch: ${this.currency} vs ${other.currency}`);
        }
        if (this.amount - other.amount < 0) {
            throw new domain_exceptions_1.ValidationException('Insufficient funds result');
        }
        return new Money(this.amount - other.amount, this.currency);
    }
    toString() {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }
}
exports.Money = Money;
//# sourceMappingURL=value-objects.js.map