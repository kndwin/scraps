"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
function getJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalJobs = [];
        let job = yield getJobsFromSource({
            source: 'Indeed',
            selectors: {
                url: (page) => `https://au.indeed.com/jobs?q=software+engineer&l=Parramatta+NSW&start=${page}0`,
                page: '.jobsearch-SerpJobCard',
                title: '.jobsearch-SerpJobCard > h2',
                company: '.jobsearch-SerpJobCard .company',
                timePosted: '.jobsearch-SerpJobCard .date',
                link: '.jobsearch-SerpJobCard > h2 > a',
            }
        });
        totalJobs.push(...job);
        job = yield getJobsFromSource({
            source: 'Seek',
            selectors: {
                url: (page) => `https://www.seek.com.au/software-engineer-jobs/in-Parramatta-&-Western-Suburbs-Sydney-NSW?page=${page}`,
                page: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article',
                title: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1',
                company: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > *:nth-child(2)',
                timePosted: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > span',
                link: 'html > body > #app > div > div > div > div > section > div  > div > div > div > div > div > div > div > div > article > span > span > h1 > a',
            }
        });
        totalJobs.push(...job);
        return totalJobs;
    });
}
exports.default = getJobs;
function getJobsFromSource({ source, selectors }) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalJobs = [];
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        for (let pages = 0; pages < 2; pages++) {
            yield page.goto(selectors.url(pages));
            yield page.waitForSelector(selectors.page);
            let titles = yield page.$$eval(selectors.title, (allTitle) => {
                return allTitle.map(i => i.innerText);
            });
            let companies = yield page.$$eval(selectors.company, (allCompanies) => {
                return allCompanies.map(company => company.innerText);
            });
            let timePosted = yield page.$$eval(selectors.timePosted, (alltimePosted) => {
                return alltimePosted.map(i => i.innerText);
            });
            let links = yield page.$$eval(selectors.link, (allLinks) => {
                return allLinks.map(i => i.href);
            });
            let jobs = [];
            for (let i = 0; i < titles.length - 1; i++) {
                jobs.push({
                    'title': titles[i],
                    'company': companies[i],
                    'timePosted': timePosted[i],
                    'link': links[i],
                    'source': source
                });
            }
            totalJobs.push(...jobs);
        }
        yield browser.close();
        console.log(totalJobs.length);
        return totalJobs;
    });
}
