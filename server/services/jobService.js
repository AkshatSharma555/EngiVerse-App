// Filename: server/services/jobService.js

import axios from 'axios';
import jobModel from '../models/jobModel.js';

// Yeh function JSearch API se data fetch karke DB mein save karega
export const fetchAndSaveJobs = async (query = 'Software Developer in India') => {
    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: query,
            page: '1',
            num_pages: '1' // Shuruwat mein 1 page (approx 40 jobs) laayenge
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        console.log("Fetching jobs from JSearch API...");
        const response = await axios.request(options);
        const jobs = response.data.data;

        if (!jobs || jobs.length === 0) {
            console.log("No jobs found from API for the given query.");
            return { newJobs: 0, updatedJobs: 0 };
        }

        let newJobsCount = 0;
        let updatedJobsCount = 0;

        // Har job ko database mein save/update karo
        for (const job of jobs) {
            // API se aaye data ko humare jobModel ke format mein map karo
            const jobToSave = {
                title: job.job_title,
                companyName: job.employer_name,
                location: job.job_country === 'IN' && job.job_city ? `${job.job_city}, India` : job.job_location,
                description: job.job_description,
                jobType: 'Full-time', // API yeh detail nahi deti, hum default set kar rahe hain
                sourceUrl: job.job_apply_link,
                postedDate: job.job_posted_at_datetime_utc,
                apiSource: 'JSearch'
            };
            
            // Production Best Practice: `upsert`
            // Yeh command check karegi ki 'sourceUrl' se job pehle se hai ya nahi.
            // Agar hai, toh use update kar degi. Agar nahi, toh naya create kar degi.
            // Isse hum duplicate jobs save nahi karenge.
            const result = await jobModel.updateOne(
                { sourceUrl: jobToSave.sourceUrl },
                { $set: jobToSave },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                newJobsCount++;
            } else if (result.modifiedCount > 0) {
                updatedJobsCount++;
            }
        }
        
        console.log(`Successfully processed jobs. New: ${newJobsCount}, Updated: ${updatedJobsCount}`);
        return { newJobs: newJobsCount, updatedJobs: updatedJobsCount };

    } catch (error) {
        console.error('Error fetching or saving jobs:', error.message);
        throw new Error('Failed to fetch jobs from external API.');
    }
};