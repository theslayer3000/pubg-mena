exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, map, mode } = JSON.parse(event.body);
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return { statusCode: 500, body: 'Webhook URL not configured' };
    }

    const safeUser = String(username || 'Unknown').slice(0, 80);
    const safeMap = String(map || 'Erangel').slice(0, 20);
    const safeMode = String(mode || 'Squad').slice(0, 20);

    const payload = {
      content: `🪂 **${safeUser}** has entered the lobby!`,
      embeds: [
        {
          title: '🎯 Squad Member Connected',
          description:
            `**Player:** ${safeUser}\n` +
            `**Map:** ${safeMap}\n` +
            `**Mode:** ${safeMode}\n` +
            `**Status:** Ready to drop`,
          color: 0xF2A900,
          footer: { text: 'Winner winner chicken dinner.' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { statusCode: 502, body: 'Discord webhook failed' };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
