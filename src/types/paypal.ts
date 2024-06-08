type Address = {
  address_line_1: string;
  address_line_2?: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
};

type Name = {
  full_name?: string;
  given_name?: string;
  surname?: string;
};

type ShippingAddress = {
  name: Name;
  address: Address;
};

type Subscriber = {
  shipping_address: ShippingAddress;
  name: Name;
  email_address: string;
  payer_id: string;
};

type Money = {
  currency_code: string;
  value: string;
};

type CycleExecution = {
  tenure_type: string;
  sequence: number;
  cycles_completed: number;
  cycles_remaining: number;
  total_cycles: number;
};

type BillingInfo = {
  outstanding_balance: Money;
  cycle_executions: CycleExecution[];
  last_payment: {
    amount: Money;
    time: string;
  };
  next_billing_time: string;
  failed_payments_count: number;
};

type Link = {
  href: string;
  rel: string;
  method: string;
};

export type SubscriptionDetails = {
  id: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount: Money;
  subscriber: Subscriber;
  billing_info: BillingInfo;
  create_time: string;
  update_time: string;
  links: Link[];
  status: string;
  status_update_time: string;
};

export type CreatedSubscription = {
  id: string;
  status: string;
  status_update_time: string;
  plan_id: string;
  plan_overridden: boolean;
  start_time: string;
  quantity: string;
  shipping_amount: Money;
  subscriber: Subscriber;
  create_time: string;
  links: Link[];
};
