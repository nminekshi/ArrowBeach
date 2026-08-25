export function HotelJsonLd() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    'name': 'Arrow Beach Hotel',
    'alternateName': ['Arrow Beach Resort', 'Arrow Beach Hotel Galle', 'Arrow Beach Resort Sri Lanka'],
    'url': 'https://arrowbeachresort.com',
    'logo': 'https://arrowbeachresort.com/images/logo.png',
    'image': [
      'https://arrowbeachresort.com/images/logo.png',
      'https://arrowbeachresort.com/images/hero-suite.jpg',
      'https://arrowbeachresort.com/images/hero.jpg'
    ],
    'description': 'Arrow Beach Hotel is a luxury beachfront hotel in Galle, Sri Lanka near Pitiwella Beach. Features ocean view double & triple rooms, private balcony suites, serene beach access, and authentic Sri Lankan hospitality.',
    'telephone': '+94775290351',
    'email': 'arrowbeachresort@gmail.com',
    'priceRange': '$18 - $50',
    'currenciesAccepted': 'USD, LKR',
    'paymentAccepted': 'Cash, Credit Card',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Arrow Beach Hotel, Pitiwella Beach',
      'addressLocality': 'Galle',
      'addressRegion': 'Southern Province',
      'postalCode': '80000',
      'addressCountry': 'LK'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 6.0963,
      'longitude': 80.1706
    },
    'hasMap': 'https://maps.google.com/?q=Arrow+Beach+Hotel,+Galle,+Sri+Lanka',
    'starRating': {
      '@type': 'Rating',
      'ratingValue': '4.9',
      'bestRating': '5'
    },
    'checkinTime': '14:00',
    'checkoutTime': '11:00',
    'petsAllowed': false,
    'amenityFeature': [
      { '@type': 'LocationFeatureSpecification', 'name': 'Direct Beach Access', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Free High-Speed WiFi', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Air Conditioning', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Ocean View Balcony', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Onsite Restaurant', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Free Onsite Parking', 'value': true },
      { '@type': 'LocationFeatureSpecification', 'name': 'Room Service', 'value': true }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
