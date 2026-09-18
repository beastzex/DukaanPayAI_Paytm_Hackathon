export declare class PhoneNumber {
    private readonly value;
    constructor(rawPhone: string);
    getValue(): string;
    toString(): string;
    equals(other: PhoneNumber): boolean;
}
export declare class Money {
    readonly amount: number;
    readonly currency: string;
    constructor(amount: number, currency?: string);
    add(other: Money): Money;
    subtract(other: Money): Money;
    toString(): string;
}
//# sourceMappingURL=value-objects.d.ts.map