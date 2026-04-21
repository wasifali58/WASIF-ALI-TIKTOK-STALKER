// api/tiktok.js
export default async function handler(req, res) {
    // CORS headers for browser access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Helper to send consistent error responses
    const sendError = (statusCode, message) => {
        return res.status(statusCode).json({
            error: message,
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    };

    // Home route - API information
    if (req.url === '/' || req.url === '') {
        return res.json({
            message: "TikTok Stalker API",
            usage: "/api/tiktok?username=wasifali88",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    const username = req.query.username;

    // 1. No username provided
    if (!username) {
        return sendError(400, "Username parameter is required");
    }

    const cleanUsername = username.replace(/@/g, '').trim();

    // 2. Invalid username format (optional basic validation)
    if (cleanUsername.length === 0) {
        return sendError(400, "Invalid username format");
    }

    // Internal sources (never exposed)
    const sourceUrls = [
        `https://apis.prexzyvilla.site/stalk/ttstalk?user=${cleanUsername}`,
        `https://api.siputzx.my.id/api/stalk/tiktok?username=${cleanUsername}`
    ];

    async function fetchFromUrl(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) return null;
            const data = await response.json();

            // Both APIs return { status: true, data: {...} } on success
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
        if (profileData) break;
    }

    // 3. Profile not found
    if (!profileData) {
        return sendError(404, "Profile not found");
    }

    // 4. Success - force download as JSON file
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="tiktok.json"');

    return res.json({
        ...profileData,
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
    });
}
