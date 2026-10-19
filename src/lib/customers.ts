import type { AdminRow } from "./admin";
export type Customer = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  verified: number;
  disabled: number;
  created_at: number;
};
export type CustomerPage<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};
export type CustomerDirectoryData = CustomerPage<Customer>;
export type CustomerEntitlement = {
  product_slug: string;
  state: string;
  source: string;
  expires_at: number | null;
};
export type CustomerLicence = {
  id: string;
  product_slug: string;
  key_hint: string;
  device_limit: number;
  devices: number;
  expires_at: number | null;
  revoked: number;
  products: string[];
};
export type CustomerTicket = {
  id: string;
  enquiry_type: string;
  product: string;
  message: string;
  status: string;
  created_at: number;
  replies: {
    id: string;
    message: string;
    created_at: number;
    author_name: string;
  }[];
};
export type CustomerProfileData = {
  asOf: number;
  customer: Customer;
  currentUserId: string;
  entitlements: CustomerEntitlement[];
  licences: CustomerPage<CustomerLicence>;
  tickets: CustomerPage<CustomerTicket>;
  activity: CustomerPage<AdminRow>;
};
export const customerHash = (id: string) => "#customers/" + id;
export function customerFromHash(hash: string) {
  return /^#customers\/([a-f0-9-]{36})$/i.exec(hash)?.[1] ?? "";
}
