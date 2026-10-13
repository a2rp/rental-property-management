const dateOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const dayOffset = dateOffset;

export const initialProperties = [
  { id: "PR-101", name: "Willow Court", address: "118 Willow Avenue", city: "Portland, OR", type: "Apartments", units: 24, occupied: 21, monthlyPotential: 39600, owner: "Hearthline Residential", yearBuilt: 2018, status: "Active", accent: "sage" },
  { id: "PR-204", name: "The Alder House", address: "804 Alder Street", city: "Seattle, WA", type: "Apartments", units: 12, occupied: 10, monthlyPotential: 23100, owner: "Hearthline Residential", yearBuilt: 2021, status: "Active", accent: "clay" },
  { id: "PR-330", name: "Juniper Row", address: "36 Juniper Lane", city: "Bend, OR", type: "Townhomes", units: 8, occupied: 7, monthlyPotential: 16800, owner: "Juniper Homes LLC", yearBuilt: 2016, status: "Active", accent: "olive" },
  { id: "PR-411", name: "Maple Landing", address: "2200 Maple Drive", city: "Vancouver, WA", type: "Apartments", units: 36, occupied: 31, monthlyPotential: 57200, owner: "Hearthline Residential", yearBuilt: 2019, status: "Active", accent: "gold" },
];

export const initialLeases = [
  { id: "LS-2301", tenant: "Naomi Carter", email: "naomi.carter@example.com", propertyId: "PR-101", unit: "3B", rent: 1650, deposit: 1650, dueDay: 1, starts: dateOffset(-320), ends: dateOffset(18), status: "Active", rentStatus: "Overdue", rentDue: dateOffset(-5) },
  { id: "LS-2314", tenant: "Eli Turner", email: "eli.turner@example.com", propertyId: "PR-101", unit: "5A", rent: 1890, deposit: 1890, dueDay: 5, starts: dateOffset(-220), ends: dateOffset(94), status: "Active", rentStatus: "Paid", rentDue: dateOffset(-8), paidOn: dateOffset(-7) },
  { id: "LS-2299", tenant: "Sofia Reyes", email: "sofia.reyes@example.com", propertyId: "PR-204", unit: "2C", rent: 1925, deposit: 1925, dueDay: 15, starts: dateOffset(-180), ends: dateOffset(36), status: "Active", rentStatus: "Due soon", rentDue: dateOffset(2) },
  { id: "LS-2340", tenant: "Noah Miller", email: "noah.miller@example.com", propertyId: "PR-330", unit: "4", rent: 2125, deposit: 2125, dueDay: 1, starts: dateOffset(-270), ends: dateOffset(21), status: "Active", rentStatus: "Paid", rentDue: dateOffset(-8), paidOn: dateOffset(-8) },
  { id: "LS-2355", tenant: "Priya Shah", email: "priya.shah@example.com", propertyId: "PR-411", unit: "205", rent: 1740, deposit: 1740, dueDay: 10, starts: dateOffset(-90), ends: dateOffset(164), status: "Active", rentStatus: "Paid", rentDue: dateOffset(-3), paidOn: dateOffset(-4) },
  { id: "LS-2360", tenant: "Marcus Bell", email: "marcus.bell@example.com", propertyId: "PR-411", unit: "312", rent: 1810, deposit: 1810, dueDay: 10, starts: dateOffset(-95), ends: dateOffset(159), status: "Active", rentStatus: "Overdue", rentDue: dateOffset(-3) },
  { id: "LS-2378", tenant: "Tessa Moore", email: "tessa.moore@example.com", propertyId: "PR-204", unit: "1A", rent: 2050, deposit: 2050, dueDay: 15, starts: dateOffset(-340), ends: dateOffset(-19), status: "Ended", rentStatus: "Paid", rentDue: dateOffset(-20), paidOn: dateOffset(-21) },
];

export const initialRequests = [
  { id: "MR-8041", title: "Kitchen faucet is leaking", category: "Plumbing", propertyId: "PR-101", unit: "3B", resident: "Naomi Carter", priority: "High", status: "In progress", created: dateOffset(-2), details: "The kitchen faucet drips continuously and the cabinet base is damp." },
  { id: "MR-8036", title: "Hallway light needs a new bulb", category: "Electrical", propertyId: "PR-204", unit: "2C", resident: "Sofia Reyes", priority: "Normal", status: "Open", created: dateOffset(-1), details: "The light outside the apartment is out. The hallway is difficult to see at night." },
  { id: "MR-8029", title: "Heating system check", category: "Heating", propertyId: "PR-330", unit: "4", resident: "Noah Miller", priority: "High", status: "Scheduled", created: dateOffset(-4), details: "The bedroom heater takes longer than usual to warm up." },
  { id: "MR-8012", title: "Window latch is loose", category: "General repair", propertyId: "PR-411", unit: "205", resident: "Priya Shah", priority: "Normal", status: "Open", created: dateOffset(-6), details: "The living room window latch no longer closes securely." },
  { id: "MR-7988", title: "Replace smoke alarm battery", category: "Safety", propertyId: "PR-101", unit: "7D", resident: "Avery Jones", priority: "Urgent", status: "Open", created: dateOffset(-1), details: "The smoke alarm is chirping and needs a fresh battery." },
  { id: "MR-7972", title: "Bathroom drain cleared", category: "Plumbing", propertyId: "PR-411", unit: "312", resident: "Marcus Bell", priority: "Normal", status: "Completed", created: dateOffset(-11), details: "The bathroom sink drained slowly and has now been cleared." },
];
