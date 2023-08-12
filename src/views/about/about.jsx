import styles from './about.module.css'

function About() {
  return (
    <div className={styles.about}>
      <img alt='logo' styles={styles.logo} src='/favicon.ico' />
      <p>plebones is a bare bones UI client for plebbit</p>
      <ul>
        <li><span className={styles.title}>github:</span> <a href='https://github.com/plebbit' target='_blank' rel='noreferrer'>https://github.com/plebbit/plebones</a></li>
      </ul>
      <p>plebbit is a serverless, adminless, decentralized reddit/4chan alternative that has no blockchain transactions fees and uses captchas over peer-to-peer pubsub to prevent spam</p>
      <ul>
        <li><span className={styles.title}>website:</span> <a href='https://plebbit.com' target='_blank' rel='noreferrer'>https://plebbit.com</a></li>
        <li><span className={styles.title}>reddit app:</span> <a href='https://plebbitapp.eth.limo' target='_blank' rel='noreferrer'>https://plebbitapp.eth.limo</a></li>
        <li><span className={styles.title}>4chan app:</span> <a href='https://plebchan.eth.limo' target='_blank' rel='noreferrer'>https://plebchan.eth.limo</a></li>
        <li><span className={styles.title}>whitepaper:</span> <a href='https://github.com/plebbit/whitepaper/discussions/2' target='_blank' rel='noreferrer'>https://github.com/plebbit/whitepaper/discussions/2</a></li>
        <li><span className={styles.title}>github:</span> <a href='https://github.com/plebbit' target='_blank' rel='noreferrer'>https://github.com/plebbit</a></li>
        <li><span className={styles.title}>telegram:</span> <a href='https://t.me/plebbit' target='_blank' rel='noreferrer'>https://t.me/plebbit</a></li>
        <li><span className={styles.title}>discord:</span> <a href='https://discord.gg/E7ejphwzGW' target='_blank' rel='noreferrer'>https://discord.gg/E7ejphwzGW</a></li>
        <li><span className={styles.title}>contract:</span> <a href='https://etherscan.io/token/0xea81dab2e0ecbc6b5c4172de4c22b6ef6e55bd8f' target='_blank' rel='noreferrer'>https://etherscan.io/token/0xea81dab2e0ecbc6b5c4172de4c22b6ef6e55bd8f</a></li>
      </ul>
    </div>
  )
}

export default About
