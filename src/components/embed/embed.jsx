import styles from './embed.module.css'

const Embed = ({parsedUrl}) => {
  if (youtubeHosts.has(parsedUrl.host)) {
    return <YoutubeEmbed parsedUrl={parsedUrl} />
  }
  if (twitterHosts.has(parsedUrl.host)) {
    return <TwitterEmbed parsedUrl={parsedUrl} />
  }
  if (redditHosts.has(parsedUrl.host)) {
    return <RedditEmbed parsedUrl={parsedUrl} />
  }
}

const youtubeHosts = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'])

const YoutubeEmbed = ({parsedUrl}) => {
  let youtubeId
  if (parsedUrl.host.endsWith('youtu.be')) {
    youtubeId = parsedUrl.pathname.replaceAll('/', '')
  }
  else {
    youtubeId = parsedUrl.searchParams.get('v')
  }
  return <iframe 
    className={styles.youtubeEmbed}
    height="100%"
    width="100%"
    frameborder="0" 
    credentialless
    referrerpolicy='no-referrer'
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
    title={parsedUrl.href}
    src={`https://www.youtube.com/embed/${youtubeId}`}
  />
}

const twitterHosts = new Set(['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'])

const TwitterEmbed = ({parsedUrl}) => {
  return <iframe 
    className={styles.twitterEmbed}
    height="100%"
    width="100%"
    frameborder="0" 
    credentialless
    referrerpolicy='no-referrer'
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" 
    title={parsedUrl.href}
    srcdoc={`
      <blockquote class="twitter-tweet" data-theme="dark">
        <a href="${parsedUrl.href}"></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `}
  />
}

const redditHosts = new Set(['reddit.com', 'www.reddit.com', 'old.reddit.com'])

const RedditEmbed = ({parsedUrl}) => {
  return <iframe 
    className={styles.redditEmbed}
    height="100%"
    width="100%"
    frameborder="0" 
    credentialless
    referrerpolicy='no-referrer'
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" 
    title={parsedUrl.href}
    srcdoc={`
      <style>
        /* fix reddit iframe being centered */
        iframe {
          margin: 0!important;
        }
      </style>
      <blockquote class="reddit-embed-bq" style="height:240px" data-embed-theme="dark">
        <a href="${parsedUrl.href}"></a>    
      </blockquote>
      <script async src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>
    `}
  />
}

const canEmbedHosts = new Set([...youtubeHosts, ...twitterHosts, ...redditHosts])
export const canEmbed = (parsedUrl) => canEmbedHosts.has(parsedUrl.host)

export default Embed
