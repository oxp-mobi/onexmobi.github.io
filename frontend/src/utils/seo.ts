interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const seoConfigs = {
  home: {
    title: 'eSIM Myanmar - Your Gateway to Seamless Connectivity',
    description: 'Get your eSIM for Myanmar and stay connected effortlessly. Fast activation, reliable data, and affordable plans. Order your eSIM today!',
    keywords: 'eSIM Myanmar, Myanmar eSIM, travel eSIM, data plan Myanmar, mobile connectivity Myanmar, Ooredoo, Telenor, MPT',
    image: 'https://esim.com.mm/images/og-home.jpg',
    url: 'https://esim.com.mm/',
    type: 'website'
  },
  about: {
    title: 'About eSIM Myanmar - Connecting You to Myanmar',
    description: 'Learn more about eSIM Myanmar, our mission to provide reliable and affordable mobile connectivity for travelers and residents in Myanmar.',
    keywords: 'About eSIM Myanmar, eSIM Myanmar mission, Myanmar connectivity, digital Myanmar',
    image: 'https://esim.com.mm/images/og-about.jpg',
    url: 'https://esim.com.mm/about',
    type: 'website'
  },
  contact: {
    title: 'Contact eSIM Myanmar - Get in Touch',
    description: 'Have questions or need support? Contact eSIM Myanmar through our form, email, or phone. We\'re here to help with your connectivity needs.',
    keywords: 'Contact eSIM Myanmar, eSIM Myanmar support, eSIM Myanmar help, customer service Myanmar',
    image: 'https://esim.com.mm/images/og-contact.jpg',
    url: 'https://esim.com.mm/contact',
    type: 'website'
  },
  payment: {
    title: 'Secure Payment - eSIM Myanmar',
    description: 'Complete your eSIM purchase securely with multiple payment options including MPU, UABPay, MMQR, and international cards.',
    keywords: 'eSIM payment Myanmar, secure payment Myanmar, MPU payment, UABPay, MMQR payment',
    image: 'https://esim.com.mm/images/og-payment.jpg',
    url: 'https://esim.com.mm/payment',
    type: 'website'
  },
  privacyPolicy: {
    title: 'Privacy Policy - eSIM Myanmar',
    description: 'Read the Privacy Policy of eSIM Myanmar to understand how we collect, use, and protect your personal data in accordance with GDPR and PDPA.',
    keywords: 'Privacy Policy eSIM Myanmar, data protection Myanmar, GDPR, PDPA Myanmar',
    image: 'https://esim.com.mm/images/og-privacy.jpg',
    url: 'https://esim.com.mm/privacy-policy',
    type: 'website'
  },
  termsOfService: {
    title: 'Terms of Service - eSIM Myanmar',
    description: 'Review the Terms of Service for using eSIM Myanmar\'s services and understand your rights and obligations.',
    keywords: 'Terms of Service eSIM Myanmar, eSIM Myanmar usage terms, legal Myanmar eSIM',
    image: 'https://esim.com.mm/images/og-terms.jpg',
    url: 'https://esim.com.mm/terms-of-service',
    type: 'website'
  }
};

export const generateSEOTags = (config: SEOConfig) => {
  return {
    title: config.title,
    meta: [
      { name: 'description', content: config.description },
      ...(config.keywords ? [{ name: 'keywords', content: config.keywords }] : []),
      { name: 'author', content: 'eSIM Myanmar' },
      { name: 'robots', content: 'index, follow' },
      
      // Open Graph tags
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.type || 'website' },
      ...(config.url ? [{ property: 'og:url', content: config.url }] : []),
      ...(config.image ? [{ property: 'og:image', content: config.image }] : []),
      { property: 'og:site_name', content: 'eSIM Myanmar' },
      { property: 'og:locale', content: 'en_MM' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      ...(config.image ? [{ name: 'twitter:image', content: config.image }] : []),
      
      // Additional meta tags
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#FF6B35' },
      { name: 'msapplication-TileColor', content: '#FF6B35' },
      
      // Geo tags for Myanmar
      { name: 'geo.region', content: 'MM' },
      { name: 'geo.placename', content: 'Myanmar' },
      { name: 'geo.position', content: '21.913965;95.956223' },
      { name: 'ICBM', content: '21.913965, 95.956223' },
      
      // Language tags
      { httpEquiv: 'Content-Language', content: 'en-MM' },
    ],
    link: [
      { rel: 'canonical', href: config.url || 'https://esim.com.mm/' },
      { rel: 'alternate', hrefLang: 'en-MM', href: config.url || 'https://esim.com.mm/' },
      { rel: 'alternate', hrefLang: 'my-MM', href: (config.url || 'https://esim.com.mm/') + '?lang=my' },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'eSIM Myanmar',
          description: 'Leading eSIM provider in Myanmar offering reliable and affordable mobile connectivity solutions.',
          url: 'https://esim.com.mm',
          logo: 'https://esim.com.mm/images/logo.png',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+95-9-123-456-789',
            contactType: 'customer service',
            availableLanguage: ['English', 'Myanmar']
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'MM',
            addressRegion: 'Yangon',
            addressLocality: 'Yangon'
          },
          sameAs: [
            'https://facebook.com/esimmyanmar',
            'https://twitter.com/esimmyanmar'
          ]
        })
      }
    ]
  };
};

export const formatCurrency = (amount: number, currency: string = 'MMK'): string => {
  const formatter = new Intl.NumberFormat('en-MM', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'MMK' ? 0 : 2,
  });
  
  return formatter.format(amount);
};

export const validateMyanmarPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
  const patterns = [
    /^(\+95|95|0)?9[0-9]{8,9}$/, // Mobile numbers
    /^(\+95|95|0)?[1-9][0-9]{6,7}$/, // Landline numbers
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getPaymentMethodIcon = (method: string): string => {
  const icons = {
    'MPU': '💳',
    'MMQR': '📱',
    'UABPAY': '🏦',
    'VISA_MASTERCARD': '💳',
    'UPI': '📲',
  };
  
  return icons[method as keyof typeof icons] || '💳';
};

export const getPaymentMethodName = (method: string): string => {
  const names = {
    'MPU': 'MPU Card',
    'MMQR': 'Myanmar QR',
    'UABPAY': 'UABPay',
    'VISA_MASTERCARD': 'Visa/Mastercard',
    'UPI': 'UPI',
  };
  
  return names[method as keyof typeof names] || method;
};