export type TrustedItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
  vendor: string
  badges: string[]
  rating: number
  trusted: boolean
}

export const TRUSTED_ITEMS: TrustedItem[] = [
  {
    id: "washer-001",
    name: "AquaClean Washing Machine 7kg",
    description: "Energy‑efficient, 2‑year warranty, great for families.",
    price: "$349",
    image: "/media/sample/washer.jpg",
    category: "appliances",
    vendor: "CleanHome Ltd",
    badges: ["Quality Assurance", "Warranty", "Verified Seller"],
    rating: 4.6,
    trusted: true,
  },
  {
    id: "bottle-002",
    name: "Stainless Thermo Bottle",
    description: "Keeps drinks hot/cold for 12h; BPA free.",
    price: "$19",
    image: "/media/sample/bottle.jpg",
    category: "outdoor",
    vendor: "PureSip Co",
    badges: ["Quality Assurance", "Eco"],
    rating: 4.4,
    trusted: true,
  },
  {
    id: "car-003",
    name: "Certified Used Sedan (2019)",
    description: "Inspected, service record available; low mileage.",
    price: "$8,900",
    image: "/media/sample/car.jpg",
    category: "cars",
    vendor: "TrustAuto",
    badges: ["Verified Seller", "Inspection Report"],
    rating: 4.3,
    trusted: true,
  },
]