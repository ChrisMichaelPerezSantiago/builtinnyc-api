# Built In NYC (Jobs)
*The [Built In NYC Job](https://www.builtinnyc.com/jobs) Listings API provides a programmatic way to access and retrieve job listings from the Built In NYC website. Built In NYC is a platform that connects job seekers with innovative companies in the New York City tech and startup ecosystem. This API allows developers to search for job opportunities in a specific location, category, with various work options, and more.*


# Installation
## npm
```shell
npm i builtinnyc-api
```

## yarn 
```shell
yarn add builtinnyc-api
```

# 📚 Example

# `getJobs` Function Documentation

The `getJobs` function is used to retrieve job listings with filtering options on the job search platform. This function scrapes job listings based on various parameters such as location, work option, category, experience, industry, and company size. It also allows for searching by keywords.

## Function Signature

```typescript
getJobs(options: GetJobProps): Promise<Result>
```

## Parameters

- **`filter`** (optional): An object that specifies filter options for job listings. It includes various filter categories.

- **`location`** (optional): Object specifying location filters.

- **`workOption`** (optional): Object specifying work option filters.

- **`category`** (optional): Object specifying category filters.

- **`experience`** (optional): Object specifying experience filters.

- **`industry`** (optional): Object specifying industry filters.

- **`companySize`** (optional): Object specifying company size filters.

- **`pagination`**: Object specifying the pagination options.
  -  **`page`**: The page number for job listings.

- **`search`** (optional): An object specifying search filters.
  - **`q`**: The search query to filter job listings based on keywords.





## Usage
```ts
import { getJobs } from 'builtinnyc-api'

const options = {
  filter: {
    location: {
      key: 1,
      values: ['new-york-city'],
    },
    workOption: {
      values: ['office'],
    },
    category: {
      key: 3,
      values: ['security', 'it', 'technical-support'],
    },
    experience: {
      values: ['senior'],
    },
    industry: {
      values: ['cybersecurity', 'data-privacy'],
    },
    companySize: {
      values: ['51-200', '501-1000'],
    },
  },
  search: {
    q: 'developer',
  },
  pagination: {
    page: 1,
  },
}

getJobs(options)
  .then(result => console.log(result))
  .catch((error) => {
    console.error('Error:', error)
  })
```

# Job Search Constants Documentation

## Categories Map

The `Categories Map` constant maps job categories to their respective subcategories.

```ts
CATEGORIES_MAP = [
  [1, ['content']],
  [2, ['customer-success']],
  [3, [['cybersecurity-it', ['security', 'it', 'technical-support']]]],
  [4, [['data-analytics', ['analytics', 'analysis-reporting', 'business-intelligence', 'data-engineering', 'data-science', 'machine-learning', 'management', 'other']]]],
  [5, ['design-ux']],
  [6, [['dev-engineering', ['android', 'cpp', 'c-sharp', 'devops', 'front-end', 'golang', 'java', 'javascript', 'hardware', 'ios', 'linux', 'management', 'net', 'perl', 'php', 'python', 'qa', 'ruby', 'salesforce', 'sales-engineer', 'scala', 'other']]]],
  [7, ['finance']],
  [8, ['hr']],
  [9, ['internships']],
  [10, ['legal']],
  [11, ['marketing']],
  [12, [['operations', ['office-management', 'operations-management', 'other']]]],
  [13, ['product']],
  [14, ['project-management']],
  [15, [['sales', ['account-executive', 'account-management', 'leadership', 'sales-operations', 'sales-development', 'sales-engineer']]]],
]
```

## Experience

The `Experience` constant contains job experience levels.

```ts
EXPERIENCE = ['entry-level', 'mid-level', 'senior']
```

## Industry

The `Industry` constant includes various industries in the job market.

```ts
INDUSTRY = [
  '3d-printing',
  '3pl-third-party-logistics',
  'adtech',
  'aerospace',
  'agency',
  'agriculture',
  'analytics-industry',
  'angel-vcfirm',
  'app-development',
  'appliances',
  'artificial-intelligence',
  'automation',
  'automotive',
  'beauty',
  'big-data',
  'big-data-analytics',
  'biotech',
  'blockchain',
  'business-intelligence-industry',
  'cannabis',
  'chemical',
  'cloud',
  'co-working-space-incubator',
  'computer-vision',
  'consulting',
  'consumer-web',
  'conversational-ai',
  'coupons',
  'cryptocurrency',
  'cybersecurity',
  'data-privacy',
  'database',
  'defense',
  'design',
  'digital-media',
  'ecommerce',
  'edtech',
  'energy',
  'enterprise-web',
  'esports',
  'events',
  'fashion',
  'financial-services',
  'fintech',
  'fitness',
  'food',
  'gaming',
  'generative-ai',
  'greentech',
  'hardware-industry',
  'healthtech',
  'hospitality',
  'hr-tech',
  'industrial',
  'information-technology',
  'infrastructure-as-a-service-iaas',
  'insurance',
  'iot',
  'kids-family',
  'legal-tech',
  'logistics',
  'machine-learning-industry',
  'manufacturing',
  'marketing-tech',
  'metaverse',
  'mobile',
  'music',
  'nanotechnology',
  'natural-language-processing',
  'news-entertainment',
  'nft',
  'on-demand',
  'other-industry',
  'payments',
  'pet',
  'pharmaceutical',
  'productivity',
  'professional-services',
  'proptech',
  'quantum-computing',
  'real-estate',
  'renewable-energy',
  'retail',
  'robotics',
  'sales-industry',
  'security-industry',
  'semiconductor',
  'seo',
  'sharing-economy',
  'social-impact',
  'social-media',
  'software',
  'solar',
  'sports',
  'telehealth',
  'transportation',
  'travel',
  'utilities',
  'virtual-reality',
  'wearables',
  'web3',
]
```

## Company Size

The `Company Size` constant includes different ranges of company sizes.

```ts
COMPANY_SIZE = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000',
]
```

## Work Option

The `Work Option` constant lists various work options.

```ts
WORK_OPTION = [
  'remote',
  'hybrid',
  'office',
]
```

## Location Map

The `Location Map` constant maps location categories to their respective sublocations.

```ts
LOCATION_MAP = [[1, [['new-york-city', ['bronx', 'brooklyn', 'greater-new-york-area', 'manhattan', 'north-jersey', 'other-nyc-location', 'princeton-trenton']]]]]
```


## Example of Use

```ts
import { GetJobProps, getJobs } from 'builtinnyc-api'

// Example 1: Basic search without filters
const searchWithoutFilters: GetJobProps = {
  pagination: { page: 1 },
  search: { q: 'software developer' },
}

getJobs(searchWithoutFilters)
  .then((result) => {
    console.log('Example 1 - Basic Search without Filters:')
    console.log(result)
  })

// Example 2: Adding location filter
const searchWithLocationFilter: GetJobProps = {
  pagination: { page: 1 },
  search: { q: 'frontend developer' },
  filter: {
    location: { key: 1, values: ['manhattan'] }, // Adjust the location key and values as needed
  },
}

getJobs(searchWithLocationFilter)
  .then((result) => {
    console.log('Example 2 - Search with Location Filter:')
    console.log(result)
  })

// Example 3: Adding multiple filters
const searchWithMultipleFilters: GetJobProps = {
  pagination: { page: 1 },
  search: { q: 'marketing manager' },
  filter: {
    location: { key: 1, values: ['brooklyn'] },
    workOption: { values: ['remote'] },
    category: { key: 11, values: ['marketing'] },
  },
}

getJobs(searchWithMultipleFilters)
  .then((result) => {
    console.log('Example 3 - Search with Multiple Filters:')
    console.log(result)
  })
```

## Output Structure
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "totalPages": 6
  }
}
```


## **:handshake: Contributing**

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request

---

### **:busts_in_silhouette: Credits**

- [Chris Michael](https://github.com/ChrisMichaelPerezSantiago) (Project Leader, and Developer)

---

### **:anger: Troubleshootings**

This is just a personal project created for study / demonstration purpose and to simplify my working life, it may or may
not be a good fit for your project(s).

---

### **:heart: Show your support**

Please :star: this repository if you like it or this project helped you!\
Feel free to open issues or submit pull-requests to help me improving my work.

---

### **:robot: Author**

_*Chris M. Perez*_

> You can follow me on
> [github](https://github.com/ChrisMichaelPerezSantiago)&nbsp;&middot;&nbsp;[twitter](https://twitter.com/Chris5855M)

---

Copyright ©2023 [builtinnyc-api](https://github.com/ChrisMichaelPerezSantiago/builtinnyc-api).
