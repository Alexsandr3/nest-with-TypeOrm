interface IPaymentAdapter {
  createPayment: (payment: any) => Promise<any>;
}
enum PaymentSystemType {
  Stripe = 'stripe',
  Paypal = 'paypal',
}

class PaymentAdapter {
  adapter: Partial<Record<PaymentSystemType, IPaymentAdapter>> = {};
  constructor(private readonly paypalAdapter: any, private readonly stripeAdapter: any) {
    this.adapter[PaymentSystemType.Stripe] = stripeAdapter;
    this.adapter[PaymentSystemType.Paypal] = paypalAdapter;
  }
  createPayment(payment: any) {
    return this.adapter[payment.system].createPayment(payment);
  }
}
