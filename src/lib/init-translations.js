import i18next from "i18next"
import HttpBackend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from "react-i18next"

// put the translations in /public/translations/en/default.json
// lng -> language, 
// ns -> namespace, which is set to default
const loadPath = `/translations/{{lng}}/{{ns}}.json`

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // supported languages
    fallbackLng: "en",
    supportedLngs: ["pt","it","ja","af","cs","eo","gl","sq","hy","eu","am","az","lt","mt","ur","ar","da","nl","fi","gu","hi","mk","ms","be","bn","fr","ka","he","ku","or","ug","bs","bg","id","kk","sk","my","ig","sn","si","uz","vi","ca","hr","hu","ml","tl","ta","tr","zh","ru","et","de","ckb","mg","pa","te","el","uk","ht","ga","ha","lo","is","fy","kn","rw","no","fa","th","km","lb","mr","es","sw","ko","sr","ky","mn","zu","lv","ne","ps","ro","so","sv","cy","pl","gd","sl","yi","yo","en"],

    // namespace
    ns: ["default"],
    defaultNS: "default",

    // path to fetch the languages from
    backend: {loadPath}
  })
