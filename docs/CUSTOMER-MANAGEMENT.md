# Customer directory and profiles

Open **Customers** in the administrator sidebar. Search by name or email, combine verification and enabled/disabled filters, and use Previous/Next to browse results. Search covers every account, with 25 results per page. Administrators are included. Reset search clears the search and both filters.

Select a name to open that customer's profile. Its `/admin#customers/ACCOUNT-ID` link can be bookmarked by an administrator. Back to customer directory retains the current search and page. The profile shows account creation, verification, role and enabled state; product access and expiry; licence hints, covered products and device counts; signed-in support enquiries and replies; and related audit events. Licence, support and activity histories have independent pagination (10, 10 and 20 records per page). Guest support enquiries are not assigned to a profile by matching an unverified email address; they remain in Support.

Use **Refresh dashboard** to retrieve current data. Failed reads show a retry control. A temporary profile refresh failure keeps the last data visible and disables changes until a successful read. A rejected administrator session clears the profile data. Expired/active labels reflect the server's time at the last profile read.

Account state changes, product access changes and licence revocation first open a confirmation dialog showing the customer's email and the effect of the action. Cancel or Escape closes it without writing. Errors keep the dialog available for review and retry. Successful actions refresh the profile and overview and are recorded in the server audit log.

Disabling an account ends its sessions and blocks sign-in. It retains the recorded access and licences. An administrator cannot change their own enabled state through this screen, and server checks protect the last enabled administrator. Role and verification status are read-only.

Choose a product, access state and optional expiry, then review and confirm the access change. Expiry is entered in the operator's local time and sent as an explicit UTC timestamp. A manual change replaces that product's current access entry. Setting No access does not revoke an existing licence; use the licence's separate revocation action when required. Revocation removes that licence's devices and removes plan access only when no other valid licence covers the product. It does not remove manual access or change provider billing.

Directory and profile APIs require a current verified administrator session on every read. Queries use bound parameters, result ordering is deterministic, and authentication secrets, device fingerprints and full licence keys are excluded. Mutations retain same-origin checks, rate limits and server authorization. The added database indexes are created automatically without replacing existing tables or records.
