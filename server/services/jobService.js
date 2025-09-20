// Filename: server/services/jobService.js
// (Final, clean version with multiple API fetchers)

import axios from 'axios';
import jobModel from '../models/jobModel.js';

const fetchFromJSearch = async (query) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: { query, page: '1', num_pages: '10' },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const jobs = response.data.data || [];
        return jobs.map(job => ({
            title: job.job_title,
            companyName: job.employer_name,
            location: job.job_country === 'IN' && job.job_city ? `${job.job_city}, India` : (job.job_location || 'Remote'),
            description: job.job_description || 'No description available.',
            jobType: 'Full-time',
            sourceUrl: job.job_apply_link,
            postedDate: job.job_posted_at_datetime_utc,
            apiSource: 'JSearch',
            employer_logo: job.employer_logo
        }));
    } catch (error) {
        console.error("JSearch API Error:", error.message);
        return [];
    }
};

const fetchFromAdzuna = async (query, location) => {
    try {
        const options = {
            method: 'GET',
            url: `https://api.adzuna.com/v1/api/jobs/${location}/search/1`,
            params: {
                app_id: process.env.ADZUNA_APP_ID,
                app_key: process.env.ADZUNA_APP_KEY,
                results_per_page: '50',
                what: query
            },
        };
        const response = await axios.request(options);
        const jobs = response.data.results || [];
        return jobs.map(job => ({
            title: job.title,
            companyName: job.company.display_name,
            location: job.location.display_name,
            description: job.description,
            jobType: job.contract_time === 'full_time' ? 'Full-time' : 'Part-time',
            sourceUrl: job.redirect_url,
            postedDate: job.created,
            apiSource: 'Adzuna'
        }));
    } catch (error) {
        console.error("Adzuna API Error:", error.message);
        return [];
    }
};

const fetchFromJobicy = async () => {
    try {
        const response = await axios.get('https://jobicy.com/api/v2/remote-jobs');
        const jobs = response.data.jobs || [];
        return jobs.map(job => ({
            title: job.jobTitle,
            companyName: job.companyName,
            location: 'Remote',
            description: job.jobDescription.replace(/<[^>]*>/g, ''),
            jobType: job.jobType.includes('Full-Time') ? 'Full-time' : 'Part-time',
            sourceUrl: job.url,
            postedDate: job.pubDate,
            apiSource: 'Jobicy'
        }));
    } catch (error) {
        console.error("Jobicy API Error:", error.message);
        return [];
    }
};

export const fetchAllJobsAndSave = async (query = 'Software Engineer') => {
    console.log("Starting job fetch from all sources...");
    const results = await Promise.allSettled([
        fetchFromJSearch(`${query} in India`),
        fetchFromAdzuna(query, 'in'),
        fetchFromJobicy()
    ]);

    const allJobs = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value);

    if (allJobs.length === 0) {
        console.log("No new jobs found from any API source.");
        return { newJobs: 0, updatedJobs: 0, totalFetched: 0 };
    }

    let newJobsCount = 0;
    let updatedJobsCount = 0;

    const operations = allJobs
        .filter(job => job.sourceUrl && job.title && job.companyName)
        .map(job => ({
            updateOne: {
                filter: { sourceUrl: job.sourceUrl },
                update: { $set: job },
                upsert: true
            }
        }));

    if (operations.length > 0) {
        const result = await jobModel.bulkWrite(operations);
        newJobsCount = result.upsertedCount;
        updatedJobsCount = result.modifiedCount;
    }
    
    console.log(`Job fetch process complete. New: ${newJobsCount}, Updated: ${updatedJobsCount}, Total Processed: ${operations.length}`);
    return { newJobs: newJobsCount, updatedJobs: updatedJobsCount, totalFetched: allJobs.length };
};