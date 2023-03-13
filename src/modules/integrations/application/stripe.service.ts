import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../../main/config/configuration';

@Injectable()
export class StripeService {
  private stripe = new Stripe(
    this.configService.get('integrations', { infer: true }).API_KEY_STRIPE,
    { apiVersion: '2022-11-15' },
  );
  private secretHook = this.configService.get('integrations', { infer: true })
    .SECRET_HOOK_STRIPE;

  constructor(private configService: ConfigService<ConfigType>) {}

  async createCheckoutSession(signature: string | string[], body: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      //console.log(event); // type: 'checkout.session.completed'

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        // console.log('-----session', session);
        // this.finishPaymentUseCase.excute(session.client_reference_id , event)
      }
    } catch (e) {
      throw new BadRequestException(`Webhook error: ${e.message}`);
    }
  }

  async createBuy(productIds) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'http://localhost:5004/integrations/stripe/success',
        cancel_url: 'http://localhost:5004/integrations/stripe/cancel',
        line_items: [
          {
            price_data: {
              product_data: {
                name: `T-shirt ${productIds}`,
                description: 'Comfortable cotton t-shirt',
              },
              unit_amount: 100 * 100,
              currency: 'USD',
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: '123456789', //sample
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }
}

/*

TYPE EVENT STRIPE
{
  id: 'evt_1Mk2TcIW91ghbnFjiTuyc8ag',
  object: 'event',
  api_version: '2022-11-15',
  created: 1678441384,
  data: {
    object: {
      id: 'cs_test_a1N0zcmhprqBc2IsqWs1fNMvvTobMbu286iLa99bJttG8542yI8J3HPerM',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 10000,
      amount_total: 10000,
      automatic_tax: [Object],
      billing_address_collection: null,
      cancel_url: 'http://localhost:5004/integrations/stripe/cancel',
      client_reference_id: null,
      consent: null,
      consent_collection: null,
      created: 1678441351,
      currency: 'usd',
      custom_fields: [],
      custom_text: [Object],
      customer: null,
      customer_creation: 'if_required',
      customer_details: [Object],
      customer_email: null,
      expires_at: 1678527751,
      invoice: null,
      invoice_creation: [Object],
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'payment',
      payment_intent: 'pi_3Mk2TaIW91ghbnFj0PxHmm4J',
      payment_link: null,
      payment_method_collection: 'always',
      payment_method_options: {},
      payment_method_types: [Array],
      payment_status: 'paid',
      phone_number_collection: [Object],
      recovered_from: null,
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: 'complete',
      submit_type: null,
      subscription: null,
      success_url: 'http://localhost:5004/integrations/stripe/success',
      total_details: [Object],
      url: null
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed'
}

 */

/*
-----session {
  id: 'cs_test_a1N0zcmhprqBc2IsqWs1fNMvvTobMbu286iLa99bJttG8542yI8J3HPerM',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 10000,
  amount_total: 10000,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://localhost:5004/integrations/stripe/cancel',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  created: 1678441351,
  currency: 'usd',
  custom_fields: [],
  custom_text: { shipping_address: null, submit: null },
  customer: null,
  customer_creation: 'if_required',
  customer_details: {
    address: {
      city: null,
      country: 'AE',
      line1: null,
      line2: null,
      postal_code: null,
      state: null
    },
    email: 'admin@admin.com',
    name: 'a',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: null,
  expires_at: 1678527751,
  invoice: null,
  invoice_creation: {
    enabled: false,
    invoice_data: {
      account_tax_ids: null,
      custom_fields: null,
      description: null,
      footer: null,
      metadata: {},
      rendering_options: null
    }
  },
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: 'pi_3Mk2TaIW91ghbnFj0PxHmm4J',
  payment_link: null,
  payment_method_collection: 'always',
  payment_method_options: {},
  payment_method_types: [ 'card' ],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  shipping_options: [],
  status: 'complete',
  submit_type: null,
  subscription: null,
  success_url: 'http://localhost:5004/integrations/stripe/success',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: null
}
[Nest] 79209  - 03/10/2023, 10:43:04 AM     LOG [HTTP] POST /integrations/stripe/webhook 204 No Content
{
  id: 'evt_3Mk2TaIW91ghbnFj0eD8dso6',
  object: 'event',
  api_version: '2022-11-15',
  created: 1678441384,
  data: {
    object: {
      id: 'pi_3Mk2TaIW91ghbnFj0PxHmm4J',
      object: 'payment_intent',
      amount: 10000,
      amount_capturable: 0,
      amount_details: [Object],
      amount_received: 10000,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic',
      client_secret: 'pi_3Mk2TaIW91ghbnFj0PxHmm4J_secret_LQfXjKhmDDrgUWwRso7wjqmG3',
      confirmation_method: 'automatic',
      created: 1678441382,
      currency: 'usd',
      customer: null,
      description: null,
      invoice: null,
      last_payment_error: null,
      latest_charge: 'ch_3Mk2TaIW91ghbnFj02O1Z17j',
      livemode: false,
      metadata: {},
      next_action: null,
      on_behalf_of: null,
      payment_method: 'pm_1Mk2TaIW91ghbnFjuP9YF2Xu',
      payment_method_options: [Object],
      payment_method_types: [Array],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_kyVYeuw3W1NYsw',
    idempotency_key: '2c8287a4-28e6-44b7-b7ac-548971fa72aa'
  },
  type: 'payment_intent.succeeded'
}

 */
