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

export async function getJobs () : Promise<Jobs[]> {
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

/*
  totalJobs.push(...getJobsFromSource({
    source: 'Seek',
    selectors: {
      url: (page) => `https://au.indeed.com/jobs?q=software+engineer&l=Parramatta+NSW&start=${page}0`,
      page: '.jobsearch-SerpJobCard',
      title: '.jobsearch-SerpJobCard > h2',
      company: '.jobsearch-SerpJobCard .company',
      timePosted: '.jobsearch-SerpJobCard > h2 > a',
      link: '.jobsearch-SerpJobCard .date'
    }
  }))
  */

  return totalJobs;
}

async function getJobsFromSource ({
  source,
  selectors
}: {
  source: string
  selectors: Selectors
}) : Promise<Jobs[]> {
 
  const totalJobs : Jobs[] = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let pages=0; pages<2; pages++) {
    await page.goto(selectors.url(pages));
    await page.waitForSelector(selectors.page);

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

    for (let i=0; i<titles.length-1; i++) {
      jobs.push({
        'title': titles[i],
        'company': companies[i],
        'timePosted': timePosted[i],
        'link': links[i],
        'source': source
      })
    }

    totalJobs.push(...jobs)
  }

  await browser.close()
  console.log(totalJobs)
  return totalJobs
}

/*
for (let pages=1; pages<2; pages++) {
    const Selector = 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article'
    await page.goto(`https://www.seek.com.au/software-engineer-jobs/in-Parramatta-&-Western-Suburbs-Sydney-NSW?page=${pages}`);
    await page.waitForSelector(Selector);

    const jobs = await page.evaluate(() => {
    const titleSelector = 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1'
    const companySelector = 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > *:nth-child(2)'
    const linkSelector = 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1 > a'
    const timePostedSelector = 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > span'
      let title = Array.from(document.querySelectorAll(titleSelector))
                    .map(item => (<HTMLElement>item).innerText)
      let company = Array.from(document.querySelectorAll(companySelector)) 
                      .map(item => (<HTMLElement>item).innerText)
      let link = Array.from(document.querySelectorAll(linkSelector)) 
                      .map(item => (<HTMLAnchorElement>item).href)
      let timePosted = Array.from(document.querySelectorAll(timePostedSelector)) 
                      .map(item => (<HTMLElement>item).innerText).filter(item => item != 'at')
      let ans = []
      for (let i=0; i<title.length; i++) {
        ans.push({
          'title': title[i],
          'company': company[i],
          'timePosted': timePosted[i],
          'link': link[i],
          'source': 'Seek'
        })
      }
        
      return ans
    });

    totalJobs.push(...jobs)
  }
  console.log(...totalJobs)
  await browser.close()
}
*/
