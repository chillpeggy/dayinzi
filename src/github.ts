// GitHub API Backend Implementation
// Replaces Firebase for a fully free, serverless architecture using Repositories and Issues.

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'chillpeggy/dayinzi';

const API_BASE = 'https://api.github.com';

const getHeaders = () => ({
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
});

// --- Cloud Print Queue via GitHub Issues ---

/**
 * Dispatches a print job by creating a new GitHub Issue
 * with the label "print-job".
 */
export const addPrintJob = async (productData: any, copies: number = 1) => {
    if (!GITHUB_TOKEN) {
        throw new Error('Please configure your GitHub Token in .env');
    }

    try {
        const title = `Print Job: ${productData.style} (${productData.id})`;
        const bodyText = JSON.stringify({
            productData,
            copies,
            createdAt: Date.now()
        }, null, 2);

        const response = await fetch(`${API_BASE}/repos/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                title,
                body: "```json\n" + bodyText + "\n```",
                labels: ['print-job']
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.number; // The issue number serves as the job ID
    } catch (e) {
        console.error("Error creating print job issue:", e);
        throw e;
    }
};

/**
 * Polls for pending print jobs (Open issues with 'print-job' label)
 */
export const fetchPendingPrintJobs = async () => {
    if (!GITHUB_TOKEN) {
        return []; // Return empty if not configured to prevent constant errors
    }

    try {
        // Fetch open issues labeled 'print-job'
        const response = await fetch(`${API_BASE}/repos/${GITHUB_REPO}/issues?state=open&labels=print-job&sort=created&direction=asc`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const issues = await response.json();

        return issues.map((issue: any) => {
            // Extract JSON from the markdown code block in the issue body
            const jsonMatch = issue.body.match(/```json\n([\s\S]*?)\n```/);
            let jobData = {};
            if (jsonMatch && jsonMatch[1]) {
                try {
                    jobData = JSON.parse(jsonMatch[1]);
                } catch (e) { }
            }

            return {
                id: issue.number, // Re-use the issue number as the ID
                ...jobData,
                issueUrl: issue.html_url
            };
        });
    } catch (e) {
        console.error("Error fetching print jobs:", e);
        return [];
    }
};

/**
 * Marks a print job as complete by closing the GitHub Issue.
 */
export const completePrintJob = async (issueNumber: number) => {
    try {
        const response = await fetch(`${API_BASE}/repos/${GITHUB_REPO}/issues/${issueNumber}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({
                state: 'closed'
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        return true;
    } catch (e) {
        console.error("Error closing print job issue:", e);
        throw e;
    }
};
