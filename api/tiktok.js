export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const username = req.query.username;

    if (!username) {
        return res.status(400).json({
            success: false,
            error: "Username parameter is required",
            developer: "WASIF ALI",
            telegram: "@FREEHACKS95"
        });
    }

    const cleanUsername = username.replace(/@/g, '').trim();

    const sources = [
        {
            url: `https://apis.prexzyvilla.site/stalk/ttstalk?user=${cleanUsername}`,
            parse: (data) => data?.status ? data.data : null
        },
        {
            url: `https://api.siputzx.my.id/api/stalk/tiktok?username=${cleanUsername}`,
            parse: (data) => data?.status ? data.data : null
        },
        {
            url: `https://api.alyachan.my.id/api/tiktok?username=${cleanUsername}`,
            parse: (data) => data?.status ? data.data : data?.result
        }
    ];

    for (const source of sources) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(source.url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) continue;
            
            const data = await response.json();
            const parsed = source.parse(data);
            
            if (parsed) {
                const user = parsed.user || parsed;
                const stats = parsed.stats || user.stats || {};
                
                return res.json({
                    success: true,
                    username: user.uniqueId || user.username || cleanUsername,
                    nickname: user.nickname || user.name || '-',
                    avatar: user.avatarLarger || user.avatarMedium || user.avatar || '',
                    verified: user.verified || false,
                    private: user.privateAccount || user.isPrivate || false,
                    signature: user.signature || user.bio || '',
                    stats: {
                        followers: stats.followerCount || stats.followers || 0,
                        following: stats.followingCount || stats.following || 0,
                        videos: stats.videoCount || stats.videos || 0,
                        likes: stats.heartCount || stats.diggCount || stats.likes || 0
                    },
                    details: {
                        userId: user.id || '-',
                        region: user.region || user.country || '-',
                        language: user.language || '-',
                        created: user.createTime ? new Date(user.createTime * 1000).toISOString() : null
                    },
                    developer: "WASIF ALI",
                    telegram: "@FREEHACKS95"
                });
            }
        } catch (e) {
            console.error('Source failed:', e.message);
        }
    }

    return res.status(404).json({
        success: false,
        error: "Profile not found",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
    });
}
