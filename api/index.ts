import puppeteer from 'puppeteer';
const totalJobs = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let pages=0; pages<10; pages++) {
    await page.goto(`https://au.indeed.com/jobs?q=software+engineer&l=Parramatta+NSW&start=${pages}0`);
    await page.waitForSelector('.jobsearch-SerpJobCard');
    const jobs = await page.evaluate(() => {
      let title = Array.from(document.querySelectorAll('.jobsearch-SerpJobCard > h2'))
                    .map(item => item.innerText)
      let company = Array.from(document.querySelectorAll('.jobsearch-SerpJobCard .company')) 
                      .map(item => item.innerText)
      let link = Array.from(document.querySelectorAll('.jobsearch-SerpJobCard > h2 > a')) 
                      .map(item => item.href)
      let timePosted = Array.from(document.querySelectorAll('.jobsearch-SerpJobCard .date')) 
                      .map(item => item.innerText)
      let ans = []
      for (let i=0; i<title.length-1; i++) {
        ans.push({
          'title': title[i],
          'company': company[i],
          'timePosted': timePosted[i],
          'link': link[i],
          'source': 'Indeed'
        })
      }
        
      return ans
    });
    totalJobs.push(...jobs)
  }

  for (let pages=1; pages<10; pages++) {
    await page.goto(`https://www.seek.com.au/software-engineer-jobs/in-Parramatta-&-Western-Suburbs-Sydney-NSW?page=${pages}`);
    await page.waitForSelector('html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article');
    const jobs = await page.evaluate(() => {
      let title = Array.from(document.querySelectorAll('html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1'))
                    .map(item => item.innerText)
      let company = Array.from(document.querySelectorAll('html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > *:nth-child(2)')) 
                      .map(item => item.innerText)
      let link = Array.from(document.querySelectorAll('html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1 > a')) 
                      .map(item => item.href)
      let timePosted = Array.from(document.querySelectorAll('html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > span')) 
                      .map(item => item.innerText).filter(item => item != 'at')
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
  
  console.log(totalJobs.length)
  await browser.close()
})()


