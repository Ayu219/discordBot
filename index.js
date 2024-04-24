const { WebhookClient, EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');

const parser = new Parser();


const webhookConfig = {
  id: '1122426421730623498',
  token: 'CUNZWqTRz3VUluMBND9KgeUlWQ6H3EW7QEvH9anZyfMpqs8-mHmHqEtFmPTW56Lvy8zI',
  username: 'Ecell News Bot'
};

// Define an array of feed URLs
const feedUrls = [
  'https://techcrunch.com/category/startups/feed/','https://inc42.com/feed/','https://officechai.com/feed/'
 
  // Add more feed URLs as needed
];

// Function to create webhook client
function createWebhookClient() {
  return new WebhookClient(webhookConfig);
}

// Function to fetch and parse a feed
async function fetchAndParseFeed(feedUrl) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed;
  } catch (error) {
    console.error('Error fetching/parsing the feed:', error);
    return null;
  }
}

// Function to send message to Discord channel
async function sendMessageToDiscord(webhook, feedItem) {
    
  try {
    console.log('Received new feed item:');
    console.log(feedItem);
    const message = `**${feedItem.title}**\n${feedItem.link}`;
    // const message = new EmbedBuilder()
    //   .setColor('#0099ff')
    //   .setTitle(feedItem.title).setAuthor({name:feedItem.creator}).setThumbnail('https://ecell-web-v2.vercel.app/static/media/ecell_abes.d6428caca61583a3ea25.png').setImage(feedItem.guid);
      
    await webhook.send({
      username: webhook.name,
      content: message
    });

    console.log('Message sent successfully to Discord channel!');
  } catch (error) {
    console.error('Error sending message to Discord:', error);
  }
}

// Function to check for updates for each feed URL
// Keep track of the latest item for each feed URL
// const latestItems = {};

// async function checkForUpdates() {
//   console.log("Running ");
//   const webhook = createWebhookClient();

//   feedUrls.forEach(async (feedUrl) => {
//     setInterval(async () => {
//       const feed = await fetchAndParseFeed(feedUrl);
//       if (feed && feed.items.length > 0) {
//         // Assuming the first item in the feed is the latest one
//         const latestItem = feed.items[0];

//         // Check if the latest item for this feed URL has already been sent
//         if (latestItems[feedUrl] && latestItems[feedUrl].guid === latestItem.guid) {
//           console.log('Latest item for this feed has already been sent.');
//           return;
//         }

//         // Update the latest item for this feed URL
//         latestItems[feedUrl] = latestItem;

//         // Send the latest item to Discord
//         await sendMessageToDiscord(webhook, latestItem);
//       }
//     }, 60000); // Check every minute (adjust as needed)
//   });
// }


// Keep track of the latest item for each feed URL using a Map
const latestItems = new Map();

async function checkForUpdates() {
  console.log("Running ");
  const webhook = createWebhookClient();

  feedUrls.forEach(async (feedUrl) => {
    setInterval(async () => {
      const feed = await fetchAndParseFeed(feedUrl);
      if (feed && feed.items.length > 0) {
        // Assuming the first item in the feed is the latest one
        const latestItem = feed.items[0];

        // Check if the latest item for this feed URL has already been sent
        if (latestItems.has(feedUrl) && latestItems.get(feedUrl).guid === latestItem.guid) {
          console.log('Latest item for this feed has already been sent.');
          return;
        }

        // Update the latest item for this feed URL
        latestItems.set(feedUrl, latestItem);

        // Send the latest item to Discord
        await sendMessageToDiscord(webhook, latestItem);
      }
    }, 60000); // Check every minute (adjust as needed)
  });
}



// Start checking for updates for each feed URL
checkForUpdates();
