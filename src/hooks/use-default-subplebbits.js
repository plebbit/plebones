import {useState, useEffect} from 'react'

let cache

const mockedSubplebbits = [
  {
    title: 'Test sub',
    address: '12D3KooWG3XbzoVyAE6Y9vHZKF64Yuuu4TjdgQKedk14iYmTEPWu',
  },
  {
    title: 'Test sub #2',
    address: '12D3KooWAdnytMQQMvAk8a6T7tLTCJCpcjh88FN25foambA5wYxP',
  },
  {
    address: 'meta.plebchan.eth',
    tags: ['plebchan', 'web3'],
  },
  {
    title: 'Plebbit Token',
    address: 'plebtoken.eth',
    tags: ['ethereum', 'eth', 'crypto'],
  },
  {
    title: 'Plebbit Lore',
    address: 'pleblore.eth',
    tags: ['storytelling'],
  },
  {
    title: 'Brasilandia',
    address: 'brasilandia.eth',
    tags: ['brazil'],
  },
  {
    title: '/pol/',
    address: 'politically-incorrect.eth',
    tags: ['politics', 'news'],
  },
  {
    title: '/biz/',
    address: 'business-and-finance.eth',
    tags: ['crypto', 'defi', 'finance', 'business'],
  },
  {
    address: 'movies-tv-anime.eth',
    tags: ['movies', 'tv', 'anime'],
  },
  {
    address: 'plebmusic.eth',
    tags: ['music'],
  },
  {
    address: 'videos-livestreams-podcasts.eth',
    tags: ['podcast', 'video', 'livestream'],
  },
  {
    address: 'health-nutrition-science.eth',
    tags: ['health', 'fitness'],
  },
  {
    address: 'censorship-watch.eth',
    tags: ['censorship', 'freespeech'],
  },
  {
    address: 'reddit-screenshots.eth',
    tags: ['reddit', 'funny'],
  },
  {
    address: 'plebbit-italy.eth',
    tags: ['italy'],
  },
  {
    address: 'weaponized-autism.eth',
    tags: ['motivation', 'autism'],
  },
  {
    address: 'monarkia.eth',
  },
  {
    address: 'mktwallet.eth',
    tags: ['marketing', 'business'],
  },
  {
    address: 'pleblabs.eth',
  },
  {
    address: '💩posting.eth',
    tags: ['funny', 'meme'],
  },
  {
    address: 'bitcoinbrothers.eth',
  },
  {
    address: 'plebbrothers.eth',
  },
  {
    address: 'networkeconomics.eth',
    tags: ['networking'],
  },
  {
    title: 'Thrifty Plebs',
    address: '12D3KooWLiXLKwuWmfzwTRtBasTzDQVNagv8zU63eCEcdw2dT4zB',
  },
  {
    title: 'Plebs Helping Plebs',
    address: 'plebshelpingplebs.eth',
  },
  {
    title: 'Pleb Whales',
    address: 'plebwhales.eth',
  },
  {
    title: 'Anti Plebbit',
    address: 'antiplebbit.eth',
  },
  {
    title: 'Ask Plebbit',
    address: 'askplebbit.eth',
  },
  {
    title: 'Current Events',
    address: 'currentevents.eth',
    tags: ['politics', 'news'],
  },
  {
    title: 'So I Became Comfy',
    address: 'soibecamecomfy.eth',
  },
  {
    title: 'Server of indecision',
    address: '12D3KooWNsRyNMfd1sn6TDztxmVnR13gD5Q4HnJiDzdm1qacGYJu',
  },
]

const useDefaultSubplebbits = () => {
  return mockedSubplebbits

  const [subplebbits, setSubplebbits] = useState([])

  useEffect(() => {
    if (cache) {
      return
    }
    ;(async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json'
          // { cache: 'no-cache' }
        ).then((res) => res.json())
        cache = multisub.subplebbits
        setSubplebbits(multisub.subplebbits)
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [])

  return cache || subplebbits
}

export default useDefaultSubplebbits
