export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { type, name, email, message, page, subject } = await request.json()

    if (!type || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const webhookMap = {
      feedback: process.env.FEEDBACK_WEBHOOK || process.env.VITE_FEEDBACK_WEBHOOK,
      suggestion: process.env.SUGGESTIONS_WEBHOOK || process.env.VITE_SUGGESTIONS_WEBHOOK,
      appreciation: process.env.APPRECIATION_WEBHOOK || process.env.VITE_APPRECIATION_WEBHOOK,
      help: process.env.WEBSITE_HELP_WEBHOOK || process.env.VITE_WEBSITE_HELP_WEBHOOK,
      other: process.env.SOMETHING_ELSE_WEBHOOK || process.env.VITE_SOMETHING_ELSE_WEBHOOK,
    }

    const webhookUrl = webhookMap[type]
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const typeConfig = {
      feedback: { title: '🐛 Feedback', color: 0xe74c3c, bot: 'Feedback Bot', fieldLabel: 'Message' },
      suggestion: { title: '💡 Suggestion', color: 0x3498db, bot: 'Suggestion Bot', fieldLabel: 'Suggestion' },
      appreciation: { title: '🙏 Appreciation', color: 0x2ecc71, bot: 'Appreciation Bot', fieldLabel: 'Message' },
      help: { title: '🛟 Website Help Request', color: 0xf39c12, bot: 'Help Bot', fieldLabel: 'Question' },
      other: { title: `💬 ${subject || 'Something Else'}`, color: 0x9b59b6, bot: 'Something Else Bot', fieldLabel: 'Message' },
    }

    const config = typeConfig[type]
    const fromValue = name ? (email ? `${name} (${email})` : name) : 'Anonymous'

    const fields = [
      { name: 'From', value: fromValue, inline: true },
    ]

    if (page) {
      fields.push({ name: 'Page', value: page, inline: true })
    }

    if (type === 'other' && subject) {
      fields.push({ name: 'Type', value: subject, inline: true })
    }

    fields.push({ name: config.fieldLabel, value: message })

    const payload = {
      username: config.bot,
      embeds: [{
        title: config.title,
        color: config.color,
        timestamp: new Date().toISOString(),
        fields,
      }],
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Webhook delivery failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: "/api/feedback",
}
