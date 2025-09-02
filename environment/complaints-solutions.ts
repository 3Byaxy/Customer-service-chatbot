/**
 * Comprehensive Complaints and Solutions Database
 * Covers all business sectors with real-world scenarios
 */

export interface ComplaintSolution {
  id: string
  category: string
  subcategory: string
  complaint: string
  solution: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedTime: string
  escalationRequired: boolean
  localTerms: string[]
  commonPhrases: string[]
  followUpActions: string[]
}

export const TELECOM_COMPLAINTS: ComplaintSolution[] = [
  {
    id: "tel_001",
    category: "Data Services",
    subcategory: "Bundle Purchase",
    complaint: "Cannot buy data bundles, system keeps failing",
    solution:
      'I understand your frustration with the bundle purchase system. Let me help you immediately:\n\n1. Try dialing *131# and select option 1 for data bundles\n2. If that fails, dial *100# for alternative bundle menu\n3. You can also send "DATA" to 131 for bundle options\n4. For immediate assistance, I can process your bundle purchase right now\n\nWhich bundle would you like? We have:\n- Daily: 100MB (UGX 1,000), 500MB (UGX 2,000)\n- Weekly: 1GB (UGX 5,000), 2GB (UGX 8,000)\n- Monthly: 5GB (UGX 15,000), 10GB (UGX 25,000)',
    priority: "high",
    estimatedTime: "2-5 minutes",
    escalationRequired: false,
    localTerms: ["bundles", "sente", "data"],
    commonPhrases: ["system failing", "cannot buy", "not working"],
    followUpActions: ["Verify bundle activation", "Check account balance", "Send confirmation SMS"],
  },
  {
    id: "tel_002",
    category: "Network Issues",
    subcategory: "Poor Signal",
    complaint: "No network coverage in my area, calls keep dropping",
    solution:
      "I sincerely apologize for the network issues in your area. This is a priority concern for us:\n\n**Immediate Solutions:**\n1. Try switching to 3G mode: Settings > Mobile Networks > Network Mode > 3G\n2. Restart your phone to refresh network connection\n3. Check if airplane mode was accidentally enabled\n\n**Area-Specific Help:**\n- Which specific location are you experiencing issues?\n- I'll report this to our network team for urgent investigation\n- We can provide temporary Wi-Fi calling if your phone supports it\n\n**Compensation:**\n- I'll add 2 days to your current bundle for the inconvenience\n- You'll receive priority support for any future issues\n\nNetwork team will investigate within 24 hours and provide updates via SMS.",
    priority: "critical",
    estimatedTime: "24-48 hours",
    escalationRequired: true,
    localTerms: ["network", "signal", "calls"],
    commonPhrases: ["no coverage", "calls dropping", "poor signal"],
    followUpActions: ["Report to network team", "Provide compensation", "Schedule follow-up", "Send SMS updates"],
  },
  {
    id: "tel_003",
    category: "Billing",
    subcategory: "Unexpected Charges",
    complaint: "Strange charges on my account, money deducted without my knowledge",
    solution:
      "I understand your concern about unexpected charges. Let me investigate this immediately:\n\n**Account Review:**\n1. Checking your last 10 transactions...\n2. Looking for any unauthorized services\n3. Reviewing roaming charges if applicable\n\n**Common Causes:**\n- Auto-renewal services (data, SMS bundles)\n- Premium SMS services\n- International calls/SMS\n- Value-added services\n\n**Immediate Actions:**\n1. I'll reverse any unauthorized charges within 24 hours\n2. Block all premium services to prevent future charges\n3. Send detailed transaction history to your phone\n4. Set up spending alerts for your account\n\n**Prevention:**\n- Dial *131*0# to check active services\n- Reply STOP to any unwanted SMS services\n- Enable spending notifications\n\nYou'll receive a full refund if charges are confirmed unauthorized.",
    priority: "high",
    estimatedTime: "1-24 hours",
    escalationRequired: false,
    localTerms: ["sente", "charges", "money"],
    commonPhrases: ["strange charges", "money deducted", "unauthorized"],
    followUpActions: ["Investigate charges", "Process refund", "Block premium services", "Send transaction history"],
  },
]

export const BANKING_COMPLAINTS: ComplaintSolution[] = [
  {
    id: "bank_001",
    category: "Mobile Money",
    subcategory: "Failed Transaction",
    complaint: "Sent money but recipient didn't receive it, money deducted from my account",
    solution:
      "I understand how concerning this must be. Failed mobile money transactions are our top priority:\n\n**Immediate Investigation:**\n1. Transaction Reference: Please provide the transaction ID\n2. Recipient Details: Confirm the phone number you sent to\n3. Amount & Time: When and how much was sent\n\n**What Happened:**\n- Transaction may be pending in the system\n- Network delays can cause temporary holds\n- Recipient's account might have issues\n\n**Resolution Process:**\n1. **Within 2 hours:** Transaction will be completed or reversed\n2. **If reversal:** Money returns to your account automatically\n3. **If completed:** Recipient receives SMS confirmation\n\n**Immediate Actions:**\n- I've escalated this to our mobile money team\n- You'll receive SMS updates every hour\n- Emergency contact: Call 0800-123-456 for urgent updates\n\n**Compensation:**\n- Transaction fees will be refunded\n- UGX 5,000 goodwill credit for the inconvenience\n\nYour money is safe and will be resolved within 2 hours maximum.",
    priority: "critical",
    estimatedTime: "30 minutes - 2 hours",
    escalationRequired: true,
    localTerms: ["sente", "mobile money", "send"],
    commonPhrases: ["didn't receive", "money deducted", "failed transaction"],
    followUpActions: [
      "Trace transaction",
      "Contact recipient bank",
      "Process reversal/completion",
      "Refund fees",
      "Send updates",
    ],
  },
  {
    id: "bank_002",
    category: "Account Access",
    subcategory: "Locked Account",
    complaint: "My account is locked, cannot access mobile banking or withdraw money",
    solution:
      "Account security is crucial, and I'll help you regain access immediately:\n\n**Security Verification:**\n1. Please confirm your full name and account number\n2. Last 3 transactions you remember making\n3. Your registered phone number\n\n**Common Lock Reasons:**\n- Multiple incorrect PIN attempts\n- Suspicious activity detected\n- Expired identification documents\n- Security system maintenance\n\n**Unlock Process:**\n1. **Identity Verified:** Account unlocked within 15 minutes\n2. **New PIN Required:** Generate new PIN via SMS\n3. **Document Update:** If ID expired, temporary access granted\n\n**Immediate Solutions:**\n- Emergency cash withdrawal: Visit any branch with ID\n- Temporary mobile banking: SMS-based transactions\n- Priority customer service: Direct line 0800-URGENT\n\n**Prevention:**\n- Set up biometric login\n- Enable account notifications\n- Update contact information\n\n**Compensation:**\n- Waived fees for emergency services\n- Priority support for 30 days\n\nYour account will be active within 15 minutes of verification.",
    priority: "critical",
    estimatedTime: "15-30 minutes",
    escalationRequired: false,
    localTerms: ["account", "locked", "PIN"],
    commonPhrases: ["cannot access", "account locked", "withdraw money"],
    followUpActions: ["Verify identity", "Unlock account", "Reset PIN", "Enable notifications", "Waive fees"],
  },
  {
    id: "bank_003",
    category: "Loan Services",
    subcategory: "Loan Application",
    complaint: "Applied for loan 2 weeks ago, no response, need money urgently",
    solution:
      "I sincerely apologize for the delay in your loan application. Urgent financial needs require immediate attention:\n\n**Application Status Check:**\n1. Retrieving your application from 2 weeks ago...\n2. Checking current processing stage\n3. Identifying any missing requirements\n\n**Typical Delays:**\n- Missing documentation\n- Credit verification in progress\n- High application volume\n- Additional income verification needed\n\n**Immediate Actions:**\n1. **Fast-Track Processing:** Your application moved to priority queue\n2. **Missing Documents:** SMS sent with exact requirements\n3. **Alternative Options:** Instant micro-loans available\n4. **Direct Contact:** Loan officer will call within 2 hours\n\n**Emergency Solutions:**\n- Instant loan: Up to UGX 500,000 (approved in 30 minutes)\n- Salary advance: If you have salary account with us\n- Overdraft facility: Temporary credit line\n\n**Timeline:**\n- Decision within 24 hours\n- Funds disbursed same day if approved\n- SMS updates every 4 hours\n\nLoan officer will call you within 2 hours with update.",
    priority: "high",
    estimatedTime: "2-24 hours",
    escalationRequired: true,
    localTerms: ["loan", "sente", "money"],
    commonPhrases: ["no response", "need money urgently", "applied for loan"],
    followUpActions: [
      "Check application status",
      "Fast-track processing",
      "Contact loan officer",
      "Offer alternatives",
      "Provide timeline",
    ],
  },
]

export const UTILITIES_COMPLAINTS: ComplaintSolution[] = [
  {
    id: "util_001",
    category: "Electricity",
    subcategory: "Power Outage",
    complaint: "No electricity for 3 days, food spoiling, need immediate solution",
    solution:
      "I deeply understand the urgency of your situation. 3 days without power is unacceptable:\n\n**Emergency Response:**\n1. **Immediate Dispatch:** Technical team dispatched to your area\n2. **Priority Status:** Your case marked as emergency\n3. **ETA:** Technicians will arrive within 4 hours\n\n**Outage Investigation:**\n- Checking if it's area-wide or specific to your connection\n- Reviewing recent maintenance work\n- Identifying transformer or line issues\n\n**Immediate Relief:**\n1. **Generator Service:** Free 24-hour generator rental\n2. **Food Compensation:** UGX 200,000 for spoiled food\n3. **Alternative Accommodation:** Partner hotel discounts\n4. **Priority Restoration:** Your connection restored first\n\n**Communication:**\n- SMS updates every 2 hours\n- Direct hotline: 0800-POWER-NOW\n- WhatsApp updates: +256-XXX-POWER\n\n**Prevention:**\n- Installing backup systems in your area\n- Priority customer status for future issues\n- Direct contact to area manager\n\n**Compensation Package:**\n- Full bill waiver for outage period\n- 50% discount next month\n- Priority maintenance service\n\nTechnical team dispatched - arrival within 4 hours maximum.",
    priority: "critical",
    estimatedTime: "2-8 hours",
    escalationRequired: true,
    localTerms: ["masanyu", "power", "electricity"],
    commonPhrases: ["no electricity", "food spoiling", "immediate solution"],
    followUpActions: [
      "Dispatch technical team",
      "Arrange generator",
      "Process compensation",
      "Provide updates",
      "Restore power",
    ],
  },
  {
    id: "util_002",
    category: "Water Supply",
    subcategory: "No Water",
    complaint: "No water supply for 5 days, family struggling, children getting sick",
    solution:
      "This is an emergency situation that requires immediate action. No family should be without water:\n\n**Emergency Water Supply:**\n1. **Water Truck:** Dispatched to your location within 2 hours\n2. **Free Water:** 1000 liters delivered immediately\n3. **Daily Delivery:** Until your supply is restored\n\n**Problem Investigation:**\n- Checking main supply lines\n- Testing water pressure in your area\n- Identifying pipe bursts or blockages\n- Reviewing pump station status\n\n**Health Priority:**\n1. **Medical Support:** Free health checkup for children\n2. **Clean Water:** Bottled water for drinking (50 bottles)\n3. **Hygiene Kits:** Sanitizers and cleaning supplies\n\n**Repair Timeline:**\n- **Assessment:** Complete within 6 hours\n- **Repair Work:** Start within 12 hours\n- **Full Restoration:** Within 24-48 hours\n\n**Compensation:**\n- Zero bills during outage period\n- UGX 300,000 for inconvenience and health concerns\n- Free water quality testing for 6 months\n- Priority customer status\n\n**Communication:**\n- Engineer will call within 1 hour\n- SMS updates every 3 hours\n- WhatsApp group for real-time updates\n\nWater truck dispatched - arrival within 2 hours.",
    priority: "critical",
    estimatedTime: "2-48 hours",
    escalationRequired: true,
    localTerms: ["amazzi", "water", "supply"],
    commonPhrases: ["no water supply", "family struggling", "children getting sick"],
    followUpActions: [
      "Dispatch water truck",
      "Investigate problem",
      "Provide medical support",
      "Start repairs",
      "Process compensation",
    ],
  },
  {
    id: "util_003",
    category: "Billing",
    subcategory: "High Bill",
    complaint: "Electricity bill is 10 times normal amount, cannot afford to pay",
    solution:
      "An electricity bill 10 times the normal amount is definitely wrong. Let me resolve this immediately:\n\n**Bill Investigation:**\n1. **Meter Reading:** Verifying actual vs. recorded consumption\n2. **Historical Comparison:** Checking your last 12 months usage\n3. **Meter Accuracy:** Testing if meter is faulty\n4. **Billing Errors:** Reviewing calculation mistakes\n\n**Common Causes:**\n- Faulty meter reading\n- Estimated billing errors\n- Meter tampering (not by you)\n- System calculation errors\n- Wrong tariff application\n\n**Immediate Relief:**\n1. **Payment Suspension:** Bill payment frozen until resolved\n2. **Correct Bill:** New accurate bill within 48 hours\n3. **Refund Process:** Overpayment returned immediately\n4. **Payment Plan:** Affordable installments if needed\n\n**Resolution Process:**\n- Meter technician visit within 24 hours\n- Independent meter test\n- Bill recalculation\n- Formal apology and explanation\n\n**Compensation:**\n- Full refund of overcharged amount\n- UGX 50,000 for inconvenience\n- Free meter upgrade to smart meter\n- 20% discount for next 3 months\n\n**Prevention:**\n- Monthly meter photo verification\n- SMS alerts for unusual consumption\n- Direct contact to billing department\n\nMeter technician will visit within 24 hours to resolve this.",
    priority: "high",
    estimatedTime: "24-48 hours",
    escalationRequired: false,
    localTerms: ["bili", "masanyu", "sente"],
    commonPhrases: ["10 times normal", "cannot afford", "high bill"],
    followUpActions: ["Investigate meter", "Suspend payment", "Recalculate bill", "Process refund", "Upgrade meter"],
  },
]

export const ECOMMERCE_COMPLAINTS: ComplaintSolution[] = [
  {
    id: "ecom_001",
    category: "Delivery",
    subcategory: "Late Delivery",
    complaint: "Ordered item 2 weeks ago, still not delivered, need it urgently",
    solution:
      "I sincerely apologize for the significant delay in your delivery. 2 weeks is completely unacceptable:\n\n**Immediate Tracking:**\n1. **Order Status:** Checking current location of your package\n2. **Delivery Partner:** Contacting courier directly\n3. **Route Optimization:** Prioritizing your delivery\n\n**Delay Investigation:**\n- Checking if item was in stock when ordered\n- Reviewing courier pickup and transit times\n- Identifying any customs or logistics delays\n- Verifying delivery address accuracy\n\n**Immediate Solutions:**\n1. **Express Delivery:** Upgraded to same-day delivery (free)\n2. **Alternative Item:** Similar product delivered today if available\n3. **Store Pickup:** Item ready at nearest store within 4 hours\n4. **Direct Courier:** Personal delivery by our team\n\n**Compensation Package:**\n- Full refund of delivery charges\n- 50% discount on current order\n- UGX 20,000 shopping voucher\n- Free express delivery for next 5 orders\n- Priority customer status\n\n**Delivery Guarantee:**\n- Item delivered within 24 hours or full refund\n- Real-time tracking link sent to your phone\n- Delivery person will call 30 minutes before arrival\n- SMS confirmation upon delivery\n\nYour order is now priority #1 - delivery within 24 hours guaranteed.",
    priority: "high",
    estimatedTime: "4-24 hours",
    escalationRequired: false,
    localTerms: ["delivery", "order", "item"],
    commonPhrases: ["still not delivered", "need it urgently", "2 weeks ago"],
    followUpActions: [
      "Track package",
      "Contact courier",
      "Upgrade delivery",
      "Process compensation",
      "Guarantee delivery",
    ],
  },
  {
    id: "ecom_002",
    category: "Product Quality",
    subcategory: "Damaged Item",
    complaint: "Received broken phone, screen cracked, packaging was damaged",
    solution:
      "Receiving a damaged phone is completely unacceptable. This is our highest priority:\n\n**Immediate Response:**\n1. **Replacement Process:** New phone dispatched within 2 hours\n2. **Quality Check:** Personally inspected before dispatch\n3. **Express Delivery:** Same-day delivery guaranteed\n4. **Return Pickup:** Damaged phone collected simultaneously\n\n**Damage Assessment:**\n- Photo documentation for insurance claim\n- Packaging inspection to identify shipping issues\n- Courier accountability review\n- Quality control process improvement\n\n**Replacement Guarantee:**\n1. **Brand New Device:** Factory sealed, latest model\n2. **Extended Warranty:** Additional 6 months coverage\n3. **Free Accessories:** Screen protector, case, charger\n4. **Setup Service:** Free data transfer and setup\n\n**Compensation:**\n- Full refund option if you prefer\n- UGX 100,000 for inconvenience\n- Free premium delivery for 1 year\n- VIP customer status with dedicated support\n- 20% discount on accessories\n\n**Quality Assurance:**\n- Personal quality check by manager\n- Insurance coverage for shipping\n- Tamper-proof packaging\n- Photo confirmation before dispatch\n\n**Follow-up:**\n- Personal call after delivery\n- 7-day satisfaction guarantee\n- Direct line to customer care manager\n\nNew phone dispatched within 2 hours - same-day delivery guaranteed.",
    priority: "critical",
    estimatedTime: "2-8 hours",
    escalationRequired: true,
    localTerms: ["phone", "broken", "damaged"],
    commonPhrases: ["screen cracked", "packaging damaged", "broken phone"],
    followUpActions: [
      "Dispatch replacement",
      "Collect damaged item",
      "Process compensation",
      "Extend warranty",
      "Follow up",
    ],
  },
  {
    id: "ecom_003",
    category: "Payment",
    subcategory: "Payment Failed",
    complaint: "Payment deducted from account but order shows as failed, money gone",
    solution:
      "Payment issues where money is deducted but order fails are our top priority. Your money is safe:\n\n**Immediate Investigation:**\n1. **Payment Verification:** Checking with payment gateway\n2. **Bank Confirmation:** Verifying transaction status\n3. **Order System:** Reviewing order processing logs\n4. **Account Check:** Confirming deduction from your account\n\n**What Likely Happened:**\n- Payment gateway timeout\n- System synchronization delay\n- Bank processing delay\n- Order system temporary glitch\n\n**Resolution Options:**\n1. **Complete Order:** Process order with confirmed payment\n2. **Instant Refund:** Money back within 2 hours\n3. **Store Credit:** Immediate credit + 10% bonus\n4. **Reorder:** Place order again with guaranteed processing\n\n**Immediate Actions:**\n- Payment team contacted\n- Bank reconciliation initiated\n- Order processing team notified\n- Refund process started as backup\n\n**Timeline:**\n- **2 hours:** Order completed OR refund processed\n- **4 hours:** Confirmation SMS sent\n- **24 hours:** Bank statement updated\n\n**Compensation:**\n- UGX 10,000 for inconvenience\n- Free delivery on current order\n- Priority payment processing for future orders\n- Direct contact to payment support team\n\nYour money is completely safe - resolution within 2 hours maximum.",
    priority: "critical",
    estimatedTime: "30 minutes - 2 hours",
    escalationRequired: false,
    localTerms: ["payment", "sente", "money"],
    commonPhrases: ["money deducted", "order failed", "money gone"],
    followUpActions: [
      "Verify payment",
      "Contact bank",
      "Process order/refund",
      "Send confirmation",
      "Provide compensation",
    ],
  },
]

// Combine all complaints for easy access
export const ALL_COMPLAINTS = {
  telecom: TELECOM_COMPLAINTS,
  banking: BANKING_COMPLAINTS,
  utilities: UTILITIES_COMPLAINTS,
  ecommerce: ECOMMERCE_COMPLAINTS,
}

// Search function for complaints
export function findRelevantSolution(query: string, businessType: string): ComplaintSolution | null {
  const complaints = ALL_COMPLAINTS[businessType as keyof typeof ALL_COMPLAINTS] || []

  const queryLower = query.toLowerCase()

  // Find best match based on complaint text, common phrases, and local terms
  const matches = complaints.map((complaint) => {
    let score = 0

    // Check complaint description
    if (complaint.complaint.toLowerCase().includes(queryLower)) score += 10

    // Check common phrases
    complaint.commonPhrases.forEach((phrase) => {
      if (queryLower.includes(phrase.toLowerCase())) score += 5
    })

    // Check local terms
    complaint.localTerms.forEach((term) => {
      if (queryLower.includes(term.toLowerCase())) score += 3
    })

    // Check category and subcategory
    if (queryLower.includes(complaint.category.toLowerCase())) score += 2
    if (queryLower.includes(complaint.subcategory.toLowerCase())) score += 2

    return { complaint, score }
  })

  // Return highest scoring match if score > 0
  const bestMatch = matches.reduce((best, current) => (current.score > best.score ? current : best), {
    complaint: null,
    score: 0,
  })

  return bestMatch.score > 0 ? bestMatch.complaint : null
}
