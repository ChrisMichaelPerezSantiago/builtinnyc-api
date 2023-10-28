import * as cheerio from 'cheerio'
import _ from 'lodash'
import apiConfig from './config'
import { CATEGORIES_MAP, COMPANY_SIZE, EXPERIENCE, INDUSTRY, LOCATION_MAP, WORK_OPTION } from './constant'
import request from './request'
import { buildPath, buildQuery, splitAndTrimTags } from './utils'

interface Pagination {
  pagination: {
    page: number
  }
}

interface JobExtraInfo {
  timePosted: string
  workOption: string
  employees: string
}

interface Filter {
  location?: {
    key: number
    values: string[]
  }
  workOption?: {
    values: string[]
  }
  category?: {
    key: number
    values: string[]
  }
  experience?: {
    values: string[]
  }
  industry?: {
    values: string[]
  }
  companySize?: {
    values: string[]
  }
}

interface Search {
  q: string
}

interface Result {
  data: any[]
  pagination: {
    page: number
    totalPages: number | null
  }
}

export type GetJobProps = {
  filter?: Filter
  search?: Search
} & Pagination

function getPagination($: cheerio.Root): number | null {
  const text = $('nav ul.pagination li').text()
  const match = text.match(/\d+/g)
  if (!match)
    return null

  const lastPage = Number(_.nth(match, 1) ?? 0)
  return lastPage
}

function getJobId(slug: string | undefined) {
  if (!slug)
    return null

  const regex = /\/([^/]+)\/?$/
  const match = _.get(slug.match(regex), '[1]', '')

  return Number(match)
}

function getExperience(selectedSubcategories: string[] = []) {
  if (_.isArray(selectedSubcategories)) {
    if (selectedSubcategories.length > 0) {
      const experience = _.intersection(EXPERIENCE, selectedSubcategories)
      return experience
    }
  }

  return []
}

function getIndustry(selectedSubcategories: string[] = []) {
  if (_.isArray(selectedSubcategories)) {
    if (selectedSubcategories.length > 0) {
      const experience = _.intersection(INDUSTRY, selectedSubcategories)
      return experience
    }
  }

  return []
}

function getCompanySize(selectedSubcategories: string[] = []) {
  if (_.isArray(selectedSubcategories)) {
    if (selectedSubcategories.length > 0) {
      const experience = _.intersection(COMPANY_SIZE, selectedSubcategories)
      return experience
    }
  }

  return []
}

function getWorkOption(selectedSubcategories: string[] = []) {
  if (_.isArray(selectedSubcategories)) {
    if (selectedSubcategories.length > 0) {
      const experience = _.intersection(WORK_OPTION, selectedSubcategories)
      return experience
    }
  }

  return []
}

function getCategory(category: number, selectedSubcategories: string[] = []) {
  const categoryValue = _.flatMap(CATEGORIES_MAP.get(category))

  if (_.isArray(categoryValue)) {
    if (selectedSubcategories.length === 0) { return _.flattenDeep([categoryValue]) } // Flatten nested structure

    else if (categoryValue.length > 1) {
      const subcategory = _.intersection(categoryValue[1], selectedSubcategories)
      return _.flatMap([categoryValue[0], subcategory])
    }
  }

  return []
}

function getLocation(category: number, selectedSubcategories: string[] = []) {
  const categoryValue = _.flatMap(LOCATION_MAP.get(category))

  if (_.isArray(categoryValue)) {
    if (selectedSubcategories.length === 0) { return _.flattenDeep([categoryValue]) } // Flatten nested structure

    else if (categoryValue.length > 1) {
      const subcategory = _.intersection(categoryValue[1], selectedSubcategories)
      return _.flatMap([categoryValue[0], subcategory])
    }
  }

  return []
}

function applyFilter(filter: Filter | undefined) {
  const fullPath: string[] = []

  const addToPathIfNotEmpty = (path: string | undefined) => {
    if (path)
      fullPath.push(path)
  }

  if (filter) {
    if (filter.location)
      addToPathIfNotEmpty(buildPath(getLocation(filter.location.key, filter.location.values)))

    if (filter.workOption)
      addToPathIfNotEmpty(buildPath(getWorkOption(filter.workOption.values)))

    if (filter.category)
      addToPathIfNotEmpty(buildPath(getCategory(filter.category.key, filter.category.values)))

    if (filter.experience)
      addToPathIfNotEmpty(buildPath(getExperience(filter.experience.values)))

    if (filter.industry)
      addToPathIfNotEmpty(buildPath(getIndustry(filter.industry.values)))

    if (filter.companySize)
      addToPathIfNotEmpty(buildPath(getCompanySize(filter.companySize.values)))
  }

  return fullPath.join('/')
}

/**
 * Retrieves job listings based on specified filters and pagination.
 * @param {GetJobProps} options - The options for fetching job listings.
 * @returns {Promise<Result>} A Promise that resolves to a Result object containing job listings and pagination information.
 */
export async function getJobs({ filter, pagination, search }: GetJobProps) {
  const appliedFilter = applyFilter(filter)

  const slug = `jobs/${appliedFilter}?${buildQuery({ search: search?.q, ...pagination })}`

  const response = await request<any>('GET', slug)

  const $: cheerio.Root = cheerio.load(response)

  const jobs = $('[data-id="job-card"]')
    .map(async (_index, element) => {
      const $element = $(element)
      const slugId = $element.find('a#job-card-alias').attr('href')
      const id = getJobId($element.find('a#job-card-alias').attr('href'))
      const title = $element.find('h2 a').text() ?? null
      const company = $element.find('[data-id="company-title"]').text() ?? null
      const picture = $element.find('picture [data-id="company-img"]').attr('src')
      const description = _.trim($element.next().find('.fs-xs.fw-regular.mb-md').text()) ?? null
      const location = $element.find('.font-barlow.text-gray-03:nth(1)').text() ?? null
      const tags = splitAndTrimTags($element.find('.font-barlow.fw-medium.mb-md').text()) ?? []
      const applicationLink = `${apiConfig.baseUrl}${slugId}`

      const jobInfo: JobExtraInfo = {
        timePosted: '',
        workOption: '',
        employees: '',
      }

      const iconClassToProperty: Record<string, keyof JobExtraInfo> = {
        'fa-clock': 'timePosted',
        'fa-signal-stream': 'workOption',
        'fa-user-group': 'employees',
      }

      function extractTextByIcon(iconClass: string) {
        const iconElements = $element.find(`.fa-regular.${iconClass}.fs-xs.text-pretty-blue`)
        let text = ''

        if (iconElements.length) {
          const parent = iconElements.first().parent()
          const nextElement = parent.next('.font-barlow.text-gray-03')
          if (nextElement.length)
            text = nextElement.text().trim()
        }

        return text
      }

      for (const iconClass of Object.keys(iconClassToProperty)) {
        const propertyName = iconClassToProperty[iconClass]
        jobInfo[propertyName] = extractTextByIcon(iconClass)
      }

      return {
        id,
        title,
        company,
        picture,
        applicationLink,
        location,
        ...jobInfo,
        description,
        tags,
      }
    })
    .get()
    .map(jobData => Promise.resolve(jobData))

  const totalPages = getPagination($)

  const result: Result = {
    data: await Promise.all(jobs),
    pagination: {
      page: pagination.page,
      totalPages,
    },
  }

  return result
}
