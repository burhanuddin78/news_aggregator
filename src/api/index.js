/* eslint-disable eqeqeq */
/* eslint-disable-next-line */
import axios from 'axios';

// API keys and endpoints
const NEWS_API_KEY = 'afc35e6b0b8747dc93a0831f800e2dc4';
const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?apiKey=${NEWS_API_KEY}&sortBy=publishedAt`;

const GUARDIAN_API_KEY = 'test';
const GUARDIAN_API_ENDPOINT = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=webTitle,fields,headline,webUrl,webPublicationDates&show-tags=contributor&show-fields=thumbnail`;

const NY_API_KEY = 'Q1xTwVsLUqLLHK46WLC5FVDilb8CwE9d';
const NY_API_ENDPOINT = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NY_API_KEY}&sort=newest&fl=source,headline,lead_paragraph,multimedia,pub_date,web_url,byline`;

// Mapping of tabs to categories
const tabs = {
	0: `${new Date().toString().split('(')[1].split(' ')[0]} AND (Trends OR Update OR Current Events)`, // general
	1: '(Cricket OR football OR Soccer OR Matches OR Athletes)',
	2: '(Movies OR Celebrities OR Music OR TV shows OR Events)',
	3: '(technology OR Innovation OR Software OR Internet)',
	4: '(science OR Research OR Discoveries OR Space OR Biology OR Physics)',
	5: '(business OR Finance OR Markets OR Companies OR Economy OR Startups)',
};

const keywordsWithSearch = {
	0: '',
	1: ' AND sports',
	2: ' AND entertainment',
	3: ' AND technology',
	4: ' AND science',
	5: ' AND business',
};

// Function to get start and end dates based on input.

const getDates = (dateOption) => {
	let startDate, endDate;
	const currentDate = new Date();
	const formattedDate = currentDate.toISOString().split('T')[0];

	if (dateOption == 'today') {
		startDate = new Date(formattedDate).toISOString();
		endDate = currentDate.toISOString();
	} else if (dateOption == 'yesterday') {
		const yesterday = new Date(currentDate);
		yesterday.setDate(currentDate.getDate() - 1);
		const formattedYesterday = yesterday.toISOString().split('T')[0];
		startDate = new Date(formattedYesterday).toISOString();
		endDate = new Date().toISOString();
	} else if (dateOption == 'lastMonth') {
		const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
		const formattedLastMonthDate = lastMonthDate.toISOString().split('T')[0];
		startDate = new Date(formattedLastMonthDate).toISOString();
		endDate = new Date().toISOString();
	} else if (dateOption == 'lastYear') {
		const lastYearDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
		const formattedLastYearDate = lastYearDate.toISOString().split('T')[0];
		startDate = new Date(formattedLastYearDate).toISOString();
		endDate = new Date().toISOString();
	}

	return { start: startDate, end: endDate };
};

// Function to construct search parameters for APIs
const getSearchParams = (tab, search, keyword, dateOption, author) => {
	let tabKeyword = tabs[tab];
	let queryString = `${tabKeyword}`;

	if (search) {
		tabKeyword = keywordsWithSearch[tab];
		queryString = `${search}${tabKeyword}`;
	}

	if (keyword) {
		queryString += ` OR ${keyword}`;
	}

	let queryString1 = `${queryString}`;
	let queryString2 = `${queryString}`;
	let queryString3 = `${queryString}`;

	if (author) {
		queryString1 = `${queryString1} AND ${author}`;
		queryString2 = `${queryString1} AND ${author}`;
		queryString2 = `${queryString1}&fq:line=${author}`;
	}

	queryString1 = `q=${encodeURIComponent(queryString)}`;
	queryString2 = `q=${encodeURIComponent(queryString)}`;
	queryString3 = `fq=${encodeURIComponent(queryString)}`;

	if (dateOption) {
		const { start, end } = getDates(dateOption);

		let startDateWithoutTime = new Date(start)?.toISOString()?.split('T')[0];
		let endDateWithoutTime = new Date(end)?.toISOString()?.split('T')[0];

		let formattedStartDate = new Date(start).toISOString().split('T')[0].replaceAll('-', '');
		let formattedEndtDate = new Date(end).toISOString().split('T')[0].replaceAll('-', '');

		queryString1 = `${queryString1}&from=${start}&to=${end}`;
		queryString2 = `${queryString2}&from-date=${startDateWithoutTime}&to-date=${endDateWithoutTime}`;
		queryString3 = `${queryString3}&begin_date=${formattedStartDate}&end_date=${formattedEndtDate}`;
	}

	return { queryString1, queryString2, queryString3 };
};

// Function to fetch news from multiple APIs
export const fetchNews = async (tab = 0, search = '', keyword = '', dateOption = null, author = null) => {
	try {
		// Get search parameters
		const { queryString1, queryString2, queryString3 } = getSearchParams(tab, search, keyword, dateOption, author);

		// Construct API URLs
		const API_URL_1 = `${NEWS_API_ENDPOINT}&${queryString1}`;
		const API_URL_2 = `${GUARDIAN_API_ENDPOINT}&${queryString2}`;
		const API_URL_3 = `${NY_API_ENDPOINT}&${queryString3}`;

		// Fetch data from all APIs concurrently
		const responses = await Promise.allSettled([axios.get(API_URL_1), axios.get(API_URL_2), axios.get(API_URL_3)]);
		const successfulResponses = responses.filter((response) => response.status === 'fulfilled');

		if (successfulResponses.length === 0) {
			return [];
		}

		// Merge and return news
		const combinedNews = mergeNews(successfulResponses);
		return combinedNews;
	} catch (error) {
		console.error(error);
		return [];
	}
};

// Function to merge news from different APIs
const mergeNews = (responses) => {
	let combinedNews = [];
	responses.forEach((response) => {
		let data = [];

		if (response.value.data.articles) {
			// News Org API response
			data = response.value.data.articles.map((article) => ({
				title: article.title,
				description: article.description || article.content,
				coverImage: article.urlToImage,
				publishedAt: article.publishedAt,
				url: article.url,
				source: article?.source?.name || '',
				author: article.author,
			}));
		} else if (response.value.data.response.results) {
			// Guardian API response
			data = response.value.data.response.results.map((result) => {
				let author = 'Unknown';
				const contributorTag = result?.tags?.find((tag) => tag.type === 'contributor');
				if (contributorTag) {
					author = contributorTag.webTitle;
				}
				return {
					title: result.webTitle,
					description: result.webTitle,
					coverImage: result?.fields?.thumbnail || '',
					publishedAt: result.webPublicationDate,
					url: result.webUrl,
					source: 'Guardian News',
					author: author,
				};
			});
		} else if (response.value.data.response.docs) {
			// New York Times API response
			data = response.value.data.response.docs.map((doc) => ({
				title: doc.headline.main,
				description: doc.lead_paragraph,
				coverImage: doc?.multimedia[0]?.url ? `https://www.nytimes.com/${doc?.multimedia[0]?.url}` : null,
				publishedAt: doc.pub_date,
				url: doc.web_url,
				source: doc.source,
				author: doc.byline?.original,
			}));
		}

		combinedNews = [...combinedNews, ...data];
	});

	// Sort by date
	combinedNews = combinedNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

	return combinedNews;
};
