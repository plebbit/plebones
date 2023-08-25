import styles from './about.module.css'
import {useTranslation} from "react-i18next"

function About() {
  const {t, i18n} = useTranslation()
  const {changeLanguage, language} = i18n
  const {supportedLngs} = i18n.options

  const languageOptions = supportedLngs.map(language => <option value={language}>{language.substring(0, 2)}</option>)
  const onSelectLanguage = (e) => changeLanguage(e.target.value)

  return (
    <div className={styles.about}>
      <img alt='logo' className={styles.logo} src='/favicon.ico' />
      <p>{t('about_plebones')}</p>
      <ul>
        <li><span className={styles.title}>github:</span> <a href='https://github.com/plebbit/plebones' target='_blank' rel='noreferrer'>https://github.com/plebbit/plebones</a></li>
        <li><span className={styles.title}>windows/mac/linux app:</span> <a href='https://github.com/plebbit/plebones/releases/latest' target='_blank' rel='noreferrer'>https://github.com/plebbit/plebones/releases/latest</a></li>
        <li><span className={styles.title}>android app:</span> <a href='https://github.com/plebbit/plebones/releases/latest' target='_blank' rel='noreferrer'>https://github.com/plebbit/plebones/releases/latest</a></li>
        <li><span className={styles.title}>open source license (GPL-2.0-only):</span> <a href='https://github.com/plebbit/plebones/blob/master/LICENSE' target='_blank' rel='noreferrer'>https://github.com/plebbit/plebones/blob/master/LICENSE</a></li>
      </ul>
      <p>{t('about_plebbit')}</p>
      <ul>
        <li><span className={styles.title}>website:</span> <a href='https://plebbit.com' target='_blank' rel='noreferrer'>https://plebbit.com</a></li>
        <li><span className={styles.title}>reddit app:</span> <a href='https://plebbitapp.eth.limo' target='_blank' rel='noreferrer'>https://plebbitapp.eth.limo</a></li>
        <li><span className={styles.title}>4chan app:</span> <a href='https://plebchan.eth.limo' target='_blank' rel='noreferrer'>https://plebchan.eth.limo</a></li>
        <li><span className={styles.title}>whitepaper:</span> <a href='https://github.com/plebbit/whitepaper/discussions/2' target='_blank' rel='noreferrer'>https://github.com/plebbit/whitepaper/discussions/2</a></li>
        <li><span className={styles.title}>github:</span> <a href='https://github.com/plebbit' target='_blank' rel='noreferrer'>https://github.com/plebbit</a></li>
        <li><span className={styles.title}>twitter:</span> <a href='https://twitter.com/getplebbit' target='_blank' rel='noreferrer'>https://twitter.com/getplebbit</a></li>
        <li><span className={styles.title}>telegram:</span> <a href='https://t.me/plebbit' target='_blank' rel='noreferrer'>https://t.me/plebbit</a></li>
        <li><span className={styles.title}>discord:</span> <a href='https://discord.gg/E7ejphwzGW' target='_blank' rel='noreferrer'>https://discord.gg/E7ejphwzGW</a></li>
      </ul>
      <p><select onChange={onSelectLanguage} value={language}>{languageOptions}</select></p>
    </div>
  )
}

export default About
