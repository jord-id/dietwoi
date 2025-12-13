// SEO composable for meta tags, JSON-LD, and Open Graph

export interface SeoConfig {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export interface CalculatorSchema {
  name: string
  description: string
  url: string
  applicationCategory: string
}

/**
 * Set page SEO meta tags, Open Graph, Twitter Cards, and canonical URL
 */
export function useSeo(config: SeoConfig) {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl as string
  const siteName = runtimeConfig.public.siteName as string

  const fullUrl = `${siteUrl}${config.path}`
  const imageUrl = config.image ? `${siteUrl}${config.image}` : `${siteUrl}/og-image.png`
  const fullTitle = config.path === '/' ? config.title : `${config.title} | ${siteName}`

  useSeoMeta({
    // Basic meta
    title: fullTitle,
    description: config.description,

    // Open Graph
    ogTitle: fullTitle,
    ogDescription: config.description,
    ogImage: imageUrl,
    ogUrl: fullUrl,
    ogType: config.type || 'website',
    ogSiteName: siteName,

    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: config.description,
    twitterImage: imageUrl,

    // Robots
    robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  // Canonical URL
  useHead({
    link: [{ rel: 'canonical', href: fullUrl }],
  })
}

/**
 * Generate JSON-LD structured data for WebApplication (calculators)
 */
export function useCalculatorSchema(calculator: CalculatorSchema) {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl as string

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': calculator.name,
    'description': calculator.description,
    'url': `${siteUrl}${calculator.url}`,
    'applicationCategory': calculator.applicationCategory,
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'provider': {
      '@type': 'Organization',
      'name': 'Dietwoi',
      'url': siteUrl,
    },
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}

/**
 * Generate JSON-LD for the main website
 */
export function useWebsiteSchema() {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl as string

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Dietwoi',
    'description': 'Free online health calculators for BMI, BMR, TDEE, body fat percentage, and more.',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}

/**
 * Generate breadcrumb structured data
 */
export function useBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl as string

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${siteUrl}${item.url}`,
    })),
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}

/**
 * FAQ structured data for calculator pages
 */
export function useFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ],
  })
}
