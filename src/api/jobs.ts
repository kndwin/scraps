import puppeteer from 'puppeteer'

export interface Jobs {
  title: string
  company: string
  timePosted: string
  link: string
  source: string
}

interface Selectors {
  url: (page: number) => string
  page: string
  title: string
  company: string
  timePosted: string
  link: string
}

export default async function getJobs () : Promise<Jobs[]> {
  const totalJobs : Jobs[] = [];
	
  let job = await getJobsFromSource({
    source: 'Indeed',
    selectors: {
      url: (page) => `https://au.indeed.com/jobs?q=software+engineer&l=Parramatta+NSW&start=${page}0`,
      page: '.jobsearch-SerpJobCard',
      title: '.jobsearch-SerpJobCard > h2',
      company: '.jobsearch-SerpJobCard .company',
      timePosted: '.jobsearch-SerpJobCard .date',
      link: '.jobsearch-SerpJobCard > h2 > a',
    }
  })

  totalJobs.push(...job)

  job = await getJobsFromSource({
    source: 'Seek',
    selectors: {
      url: (page) => `https://www.seek.com.au/software-engineer-jobs/in-Parramatta-&-Western-Suburbs-Sydney-NSW?page=${page}`,
      page: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article',
      title: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1',
      company: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > *:nth-child(2)', 
      timePosted: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > span',
      link: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1 > a',
    }
  })
	
  totalJobs.push(...job)
  return totalJobs;
}

async function getJobsFromSource ({
  source,
  selectors
}: {
  source: string
  selectors: Selectors
}) : Promise<Jobs[]> {

	console.log(`Loading jobs for ${source}`)

  const totalJobs : Jobs[] = [];

  const browser = await puppeteer.launch({
		'args' : [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--single-process'
		]
	});
  const page = await browser.newPage();

  for (let pages = 0; pages < 15; pages++) {
    await page.goto(selectors.url(pages));
    await page.waitForSelector(selectors.page, {timeout: 0});

    let titles = await page.$$eval(selectors.title, (allTitle) => {
      return allTitle.map(i => (<HTMLElement>i).innerText)
    })
    
    let companies = await page.$$eval(selectors.company, (allCompanies) => {
      return allCompanies.map(company => (<HTMLElement>company).innerText)
    })

    let timePosted = await page.$$eval(selectors.timePosted, (alltimePosted) => {
      return alltimePosted.map(i => (<HTMLElement>i).innerText)
    })

    let links = await page.$$eval(selectors.link, (allLinks) => {
      return allLinks.map(i => (<HTMLAnchorElement>i).href)
    })
   

    let jobs: Jobs[] = []

    for (let i = 0; i < titles.length-1; i++) {
      jobs.push({
        'title': titles[i],
        'company': companies[i],
        'timePosted': timePosted[i],
        'link': links[i],
        'source': source
      })
    }
		if (jobs.length == 1) {
			break
		} else {
			totalJobs.push(...jobs)
		}
		console.log(`- ${jobs.length} jobs added for page ${pages}`)
  }

  await browser.close()
  console.log(`Total jobs: ${totalJobs.length} jobs added\n`)
  return totalJobs
}
