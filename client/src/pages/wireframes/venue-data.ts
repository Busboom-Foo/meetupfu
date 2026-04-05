// Public venues sourced from data/Library.csv with region assignments.
// Eventually this will come from a POI database.

export interface Venue {
  name: string;
  address: string;
  city: string;
  zip: string;
  region: string;
}

export const venues: Venue[] = [
  // South Bay
  { name: 'Civic Center Branch', address: '365 F Street', city: 'Chula Vista', zip: '91910', region: 'South Bay' },
  { name: 'South Chula Vista Branch', address: '389 Orange Avenue', city: 'Chula Vista', zip: '91911', region: 'South Bay' },
  { name: 'Otay Ranch Branch', address: '2015 Birch Road, Suite 409', city: 'Chula Vista', zip: '91915', region: 'South Bay' },
  { name: 'Coronado Public Library', address: '640 Orange Avenue', city: 'Coronado', zip: '92118', region: 'South Bay' },
  { name: 'National City Public Library', address: '1401 National City Blvd', city: 'National City', zip: '91950', region: 'South Bay' },
  { name: 'Imperial Beach Branch', address: '810 Imperial Beach Blvd.', city: 'Imperial Beach', zip: '91932', region: 'South Bay' },
  { name: 'Lincoln Acres Branch', address: '2725 Granger Ave.', city: 'National City', zip: '91950', region: 'South Bay' },
  { name: 'Bonita-Sunnyside Branch', address: '4375 Bonita Rd.', city: 'Bonita', zip: '91902', region: 'South Bay' },
  { name: 'Otay Mesa/Nestor Library', address: '3003 Coronado Avenue', city: 'San Diego', zip: '92154', region: 'South Bay' },
  { name: 'San Ysidro Library', address: '4235 Beyer Blvd', city: 'San Diego', zip: '92173', region: 'South Bay' },
  { name: 'Paradise Hills Library', address: '5922 Rancho Hills Drive', city: 'San Diego', zip: '92139', region: 'South Bay' },

  // Central San Diego
  { name: 'San Diego Central Library', address: '330 Park Blvd', city: 'San Diego', zip: '92101', region: 'Central San Diego' },
  { name: 'La Jolla / Riford Library', address: '7555 Draper Ave', city: 'La Jolla', zip: '92037', region: 'Central San Diego' },
  { name: 'Mission Hills-Hillcrest / Knox Library', address: '215 West Washington St', city: 'San Diego', zip: '92103', region: 'Central San Diego' },
  { name: 'University Heights Library', address: '4193 Park Boulevard', city: 'San Diego', zip: '92103', region: 'Central San Diego' },
  { name: 'North Park Library', address: '3795 31st Street', city: 'San Diego', zip: '92104', region: 'Central San Diego' },
  { name: 'Kensington - Normal Heights Library', address: '4121 Adams Avenue', city: 'San Diego', zip: '92116', region: 'Central San Diego' },
  { name: 'Ocean Beach Library', address: '4801 Santa Monica Avenue', city: 'San Diego', zip: '92107', region: 'Central San Diego' },
  { name: 'Point Loma/Hervey Library', address: '3701 Voltaire Street', city: 'San Diego', zip: '92107', region: 'Central San Diego' },
  { name: 'Pacific Beach / Taylor Library', address: '4275 Cass St', city: 'San Diego', zip: '92109', region: 'Central San Diego' },
  { name: 'Clairemont Library', address: '2920 Burgener Boulevard', city: 'San Diego', zip: '92110', region: 'Central San Diego' },
  { name: 'North Clairemont Library', address: '4616 Clairemont Drive', city: 'San Diego', zip: '92117', region: 'Central San Diego' },
  { name: 'Balboa Library', address: '4255 Mt. Abernathy Avenue', city: 'San Diego', zip: '92117', region: 'Central San Diego' },
  { name: 'Linda Vista Library', address: '2160 Ulric Street', city: 'San Diego', zip: '92111', region: 'Central San Diego' },
  { name: 'Mission Valley Library', address: '2123 Fenton Parkway', city: 'San Diego', zip: '92108', region: 'Central San Diego' },
  { name: 'Serra Mesa-Kearny Mesa Library', address: '9005 Aero Dr', city: 'San Diego', zip: '92123', region: 'Central San Diego' },
  { name: 'Tierrasanta Library', address: '4985 La Cuenta Drive', city: 'San Diego', zip: '92124', region: 'Central San Diego' },
  { name: 'Allied Gardens / Benjamin Library', address: '5188 Zion Avenue', city: 'San Diego', zip: '92120', region: 'Central San Diego' },
  { name: 'San Carlos Library', address: '7265 Jackson Dr', city: 'San Diego', zip: '92119', region: 'Central San Diego' },
  { name: 'College-Rolando Library', address: '6600 Montezuma Road', city: 'San Diego', zip: '92115', region: 'Central San Diego' },
  { name: 'University Community Library', address: '4155 Governor Drive', city: 'San Diego', zip: '92122', region: 'Central San Diego' },
  { name: 'North University Community Library', address: '8820 Judicial Dr', city: 'San Diego', zip: '92112', region: 'Central San Diego' },
  { name: 'Scripps Miramar Ranch Library', address: '10301 Scripps Lake Drive', city: 'San Diego', zip: '92131', region: 'Central San Diego' },
  { name: 'Logan Heights Library', address: '567 South 28th Street', city: 'San Diego', zip: '92113', region: 'Central San Diego' },
  { name: 'Valencia Park / Malcolm X Library', address: '5148 Market Street', city: 'San Diego', zip: '92114', region: 'Central San Diego' },
  { name: 'City Heights / Weingart Library', address: '3795 Fairmount Ave.', city: 'San Diego', zip: '92105', region: 'Central San Diego' },
  { name: 'Oak Park Library', address: '2802 54th Street', city: 'San Diego', zip: '92105', region: 'Central San Diego' },
  { name: 'Skyline Hills Library', address: '7900 Paradise Valley Rd', city: 'San Diego', zip: '92139', region: 'Central San Diego' },
  { name: 'Mountain View/Beckwourth Library', address: '721 San Pasqual St', city: 'San Diego', zip: '92113', region: 'Central San Diego' },

  // North County Inland
  { name: 'Mira Mesa Library', address: '8405 New Salem St', city: 'San Diego', zip: '92126', region: 'North County Inland' },
  { name: 'Rancho Bernardo Library', address: '17110 Bernardo Center Drive', city: 'San Diego', zip: '92128', region: 'North County Inland' },
  { name: 'Carmel Mountain Ranch Library', address: '12095 World Trade Dr.', city: 'San Diego', zip: '92128', region: 'North County Inland' },
  { name: 'Rancho Penasquitos Library', address: '13330 Salmon River Road', city: 'San Diego', zip: '92129', region: 'North County Inland' },
  { name: '4S Ranch Branch', address: '10433 Reserve Drive', city: 'San Diego', zip: '92127', region: 'North County Inland' },
  { name: 'Escondido Public Library', address: '239 South Kalmia Street', city: 'Escondido', zip: '92025', region: 'North County Inland' },
  { name: 'Poway Branch', address: '13137 Poway Rd', city: 'Poway', zip: '92064', region: 'North County Inland' },
  { name: 'Ramona Branch', address: '1275 Main Street', city: 'Ramona', zip: '92065', region: 'North County Inland' },
  { name: 'San Marcos Branch', address: '2 Civic Center Drive', city: 'San Marcos', zip: '92069', region: 'North County Inland' },
  { name: 'Valley Center Branch', address: '29200 Cole Grade Rd.', city: 'Valley Center', zip: '92082', region: 'North County Inland' },
  { name: 'Vista Branch', address: '700 Eucalyptus Ave.', city: 'Vista', zip: '92084', region: 'North County Inland' },

  // North County Coastal
  { name: 'Carlsbad City Library', address: '1775 Dove Lane', city: 'Carlsbad', zip: '92011', region: 'North County Coastal' },
  { name: 'Georgina Cole Library (Carlsbad)', address: '1250 Carlsbad Village Dr', city: 'Carlsbad', zip: '92008', region: 'North County Coastal' },
  { name: 'Oceanside Civic Center Library', address: '330 North Coast Highway', city: 'Oceanside', zip: '92054', region: 'North County Coastal' },
  { name: 'Mission Branch (Oceanside)', address: '3861 B Mission Avenue', city: 'Oceanside', zip: '92054', region: 'North County Coastal' },
  { name: 'Cardiff-by-the-Sea Branch', address: '2081 Newcastle Ave.', city: 'Cardiff-by-the-Sea', zip: '92007', region: 'North County Coastal' },
  { name: 'Encinitas Branch', address: '540 Cornish Drive', city: 'Encinitas', zip: '92024', region: 'North County Coastal' },
  { name: 'Del Mar Branch', address: '1309 Camino Del Mar', city: 'Del Mar', zip: '92014', region: 'North County Coastal' },
  { name: 'Solana Beach Branch', address: '157 Stevens Ave.', city: 'Solana Beach', zip: '92075', region: 'North County Coastal' },
  { name: 'Rancho Santa Fe Branch', address: '17040 Avenida de Acacias', city: 'Rancho Santa Fe', zip: '92067', region: 'North County Coastal' },
  { name: 'Carmel Valley Library', address: '3919 Townsgate Drive', city: 'San Diego', zip: '92130', region: 'North County Coastal' },
  { name: 'Pacific Highlands Ranch Library', address: '12911 Pacific Place', city: 'San Diego', zip: '92130', region: 'North County Coastal' },
  { name: 'Fallbrook Branch', address: '124 S. Mission Rd.', city: 'Fallbrook', zip: '92028', region: 'North County Coastal' },

  // East County
  { name: 'El Cajon Branch', address: '201 E. Douglas', city: 'El Cajon', zip: '92020', region: 'East County' },
  { name: 'Fletcher Hills Branch', address: '576 Garfield Ave.', city: 'El Cajon', zip: '92020', region: 'East County' },
  { name: 'Crest Branch', address: '105 Juanita Lane', city: 'El Cajon', zip: '92021', region: 'East County' },
  { name: 'Rancho San Diego Branch', address: '11555 Via Rancho San Diego', city: 'El Cajon', zip: '92019', region: 'East County' },
  { name: 'La Mesa Branch', address: '8074 Allison Avenue', city: 'La Mesa', zip: '91942', region: 'East County' },
  { name: 'Lemon Grove Branch', address: '3001 School Ln.', city: 'Lemon Grove', zip: '91945', region: 'East County' },
  { name: 'Santee Branch', address: '9225 Carlton Hills Blvd. #17', city: 'Santee', zip: '92071', region: 'East County' },
  { name: 'Lakeside Branch', address: '12428 Woodside Ave', city: 'Lakeside', zip: '92040', region: 'East County' },
  { name: 'Alpine Branch', address: '1752 Alpine Blvd.', city: 'Alpine', zip: '91901', region: 'East County' },
  { name: 'Spring Valley Branch', address: '836 Kempton St.', city: 'Spring Valley', zip: '91977', region: 'East County' },
  { name: 'Casa de Oro Branch', address: '9805 Campo Rd. #180', city: 'Spring Valley', zip: '91977', region: 'East County' },
];

/** Search venues by name, address, city, or zip. Returns top matches. */
export function searchVenues(query: string): Venue[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return venues
    .filter((v) =>
      v.name.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.zip.includes(q)
    )
    .slice(0, 8);
}
