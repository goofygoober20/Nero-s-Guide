const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION - REPLACE WITH YOUR VALUES
// ============================================

const DISCORD_TOKEN = 'MTUwODM0NTUyNzYxMDM4MDI4OA.GbnY_z.mHBjcLH7CXm92mZ1biQSDxn0BWODVQJ6Zj5CEo';
const PRIVATE_CHANNEL_ID = '1508343774965923840';
const APPROVED_WEBHOOK_URL = 'https://discord.com/api/webhooks/1508345132557140050/umz_GNVndfX1g9JNUiAKC5NaozDBjesBD9jN8VvrCkUnpIQlYsoMlOIq8wFsvVaKDhJP';

const POSTS_FILE = path.join(__dirname, 'public', 'approved-posts.json');

// ============================================
// HELPER FUNCTIONS
// ============================================

// Function to save post to JSON file
function saveToJsonFile(polished) {
  let posts = [];
  
  if (fs.existsSync(POSTS_FILE)) {
    try {
      const data = fs.readFileSync(POSTS_FILE, 'utf8');
      posts = JSON.parse(data);
    } catch (error) {
      console.log('Could not read existing posts file');
    }
  }
  
  posts.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    message: polished,
    timestamp: new Date().toISOString()
  });
  
  posts = posts.slice(0, 50);
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('💾 Saved to approved-posts.json');
}

// Simple formatter function
function formatMessage(content) {
  const lower = content.toLowerCase();
  
  if (lower.includes('new') || lower.includes('added')) {
    return `✨ New: ${content.charAt(0).toUpperCase() + content.slice(1)}`;
  }
  if (lower.includes('update') || lower.includes('updated') || lower.includes('changed')) {
    return `🔧 Updated: ${content.charAt(0).toUpperCase() + content.slice(1)}`;
  }
  if (lower.includes('fix') || lower.includes('fixed') || lower.includes('bug')) {
    return `🐛 Fixed: ${content.charAt(0).toUpperCase() + content.slice(1)}`;
  }
  if (lower.includes('guide')) {
    return `📚 New Guide: ${content.charAt(0).toUpperCase() + content.slice(1)}`;
  }
  
  return `📢 ${content.charAt(0).toUpperCase() + content.slice(1)}`;
}

// ============================================
// BOT CODE
// ============================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const pendingMessages = new Map();

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  console.log(`Listening in channel: ${PRIVATE_CHANNEL_ID}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== PRIVATE_CHANNEL_ID) return;
  
  const content = message.content.trim();
  if (!content) return;

  console.log(`📝 Received: ${content}`);

  try {
    await message.delete();
  } catch (error) {}

  const polished = formatMessage(content);
  console.log(`✨ Formatted: ${polished}`);

  const approvalEmbed = new EmbedBuilder()
    .setColor(0xF39C12)
    .setTitle('📝 Pending Approval')
    .setDescription(polished)
    .addFields(
      { name: 'Original', value: `\`\`\`${content}\`\`\``, inline: false },
      { name: 'React with ✅ to approve', value: 'React with ❌ to reject', inline: false }
    );

  const approvalMessage = await message.channel.send({ embeds: [approvalEmbed] });
  await approvalMessage.react('✅');
  await approvalMessage.react('❌');
  
  pendingMessages.set(approvalMessage.id, {
    original: content,
    polished: polished
  });
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.channel.id !== PRIVATE_CHANNEL_ID) return;
  
  const pending = pendingMessages.get(reaction.message.id);
  if (!pending) return;
  
  if (reaction.emoji.name === '✅') {
    console.log(`✅ Approved: ${pending.polished}`);
    
    // SAVE TO JSON FILE - THIS IS THE KEY LINE
    saveToJsonFile(pending.polished);
    
    const postEmbed = {
      title: `📢 New Update - ${new Date().toLocaleDateString()}`,
      color: 0x2ECC71,
      fields: [{ name: 'Update', value: pending.polished }]
    };
    
    try {
      await fetch(APPROVED_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Posts Bot', embeds: [postEmbed] })
      });
      
      const approvedEmbed = EmbedBuilder.from(reaction.message.embeds[0])
        .setColor(0x2ECC71)
        .setTitle('✅ Approved & Published');
      
      await reaction.message.edit({ embeds: [approvedEmbed] });
      await reaction.message.reactions.removeAll();
      console.log('✅ Webhook sent and JSON saved');
    } catch (error) {
      console.error('Webhook error:', error);
    }
    
    pendingMessages.delete(reaction.message.id);
  } 
  else if (reaction.emoji.name === '❌') {
    console.log(`❌ Rejected`);
    await reaction.message.delete();
    pendingMessages.delete(reaction.message.id);
  }
});

client.login(DISCORD_TOKEN);