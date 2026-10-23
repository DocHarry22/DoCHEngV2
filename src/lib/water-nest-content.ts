// Public storefront and catalogue checked on 23 October 2026.
// These are dated catalogue examples, not DoCHEng software offers.
export const waterNestUrl = "https://waternest.co.za";

export const waterNestFeatures = [
  {
    title: "Find products for your system",
    description: "Browse product categories, search by name and narrow the catalogue by price. Sort by featured items, newest additions or price. The current catalogue includes filters, cartridges and related water-treatment products.",
    path: "/shop",
    action: "Browse the catalogue",
  },
  {
    title: "Check the details before choosing",
    description: "Open a product to inspect its description, displayed price, SKU, stock and quantity controls. Check the selected specification and ask Water Nest to confirm compatibility with your equipment before ordering.",
    path: "/shop/inline-alkaline-filter-click-for-more-info",
    action: "See an example product",
  },
  {
    title: "Request labour for equipment you own",
    description: "Configure installation, maintenance or repair without buying another machine. The three-step request covers the service, existing equipment, hours, crew, work intensity, urgency and location, with optional stocked parts.",
    path: "/services/book",
    action: "Configure a service request",
  },
  {
    title: "Explore services and request a quote",
    description: "Browse installation, maintenance, water testing, borehole services, wastewater treatment and consultation. Describe your requirements through the quote route so Water Nest can confirm the scope and pricing.",
    path: "/services",
    action: "View service categories",
  },
  {
    title: "Review products and bookings",
    description: "The storefront provides a product cart, a separate service-booking area and customer sign-in. Review your selected items and request details directly with Water Nest; its own checkout and order terms apply.",
    path: "/cart",
    action: "Open the store cart",
  },
  {
    title: "Get guidance from the store",
    description: "Use the contact page for product questions, site requirements and service enquiries. The store also provides water-care articles, FAQs, shipping information and returns policies to review before you buy.",
    path: "/contact",
    action: "Contact Water Nest",
  },
] as const;

export const waterNestPriceExamples = [
  { name: "Melted Spray Sediment Filters", price: "R50", stock: "In stock" },
  { name: "T33 Taste and Odour Filter", price: "R85", stock: "In stock" },
  { name: 'Sediment Filter 10" x 4.5" – 1 Micron', price: "R120", stock: "In stock" },
  { name: "Inline Alkaline Filter", price: "R395", stock: "In stock" },
  { name: "Melted Spray Antibacterial Filters", price: "R115", stock: "Out of stock" },
] as const;

export const waterNestFaq = [
  {
    question: "Is Water Nest a software subscription?",
    answer: "Water Nest is an independent store for physical products and water-treatment services. The prices here are examples from its product catalogue, not DoCHEng licence fees or subscription plans. Orders, quotes, accounts and payments are handled by Water Nest under its own terms.",
  },
  {
    question: "Are these the final prices for my order?",
    answer: "These are the catalogue prices and stock labels observed on 23 October 2026. Check the current product page, selected size or variant, quantity, delivery charges and final total with Water Nest. Prices and stock may change, and a catalogue listing is not a reserved item or confirmed order.",
  },
  {
    question: "Can I request installation without buying equipment?",
    answer: "Yes. The service-request interface lets you say that you already own the machine and request labour only. You can also add available parts. Your selected hours, staffing, urgency and travel area are preliminary; Water Nest confirms the scope and supplies a written quotation before the work is agreed.",
  },
  {
    question: "Does sending a request confirm a booking?",
    answer: "A request or quote enquiry still needs Water Nest’s confirmation of scope, availability, scheduling and price. This product page does not submit a request or take payment. No order, booking or payment was submitted as part of this review.",
  },
  {
    question: "How do I check suitability and service terms?",
    answer: "Ask Water Nest for the specification, compatibility, applicable certification evidence and written warranty terms for the exact product or service you need. Store screenshots may display marketing claims; their presence here is not independent validation of water-purity, health, certification, rating or warranty claims.",
  },
] as const;
