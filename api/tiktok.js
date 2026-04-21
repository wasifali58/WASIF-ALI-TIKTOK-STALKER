export default async function handler(req, res) {
    // CORS headers for browser access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const username = req.query.username;
    if (!username) {
        return res.status(400).json({
            error: "Username parameter is required",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    const cleanUsername = username.replace(/@/g, '').trim();

    // Two working sources (kept internal, never exposed)
    const sourceUrls = [
        `https://apis.prexzyvilla.site/stalk/ttstalk?user=${cleanUsername}`,
        `https://api.siputzx.my.id/api/stalk/tiktok?username=${cleanUsername}`
    ];

    // Helper function to fetch from a URL
    async function fetchFromUrl(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) return null;
            const data = await response.json();
            
            // Both APIs wrap the useful data in a 'data' field when status is true
            if (data && data.status === true && data.data) {
                return data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // Try sources sequentially
    let profileData = null;
    for (const url of sourceUrls) {
        profileData = await fetchFromUrl(url);
        if (profileData) break; // Stop at the first success
    }

    if (!profileData) {
        return res.status(404).json({
            error: "Profile not found",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    // Success: Return the exact structure but with added credits
    return res.json({
        ...profileData,
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
    });
}
