export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sendError = (statusCode, message) => {
        return res.status(statusCode).json({
            error: message,
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    };

    if (req.url === '/' || req.url === '') {
        return res.json({
            message: "TikTok Stalker API",
            usage: "/api/tiktok?username=wasifali88",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    const username = req.query.username;

    if (!username) {
        return sendError(400, "Username parameter is required");
    }

    const cleanUsername = username.replace(/@/g, '').trim();

    if (cleanUsername.length === 0) {
        return sendError(400, "Invalid username format");
    }

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
            if (data && data.status === true && data.data) return data.data;
            return null;
        } catch (error) {
            return null;
        }
    }

    let profileData = null;
    for (const url of sourceUrls) {
        profileData = await fetchFromUrl(url);
        if (profileData) break;
    }

    if (!profileData) {
        return sendError(404, "Profile not found");
    }

    // Always return JSON response — no download headers
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
        ...profileData,
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
    });
}
