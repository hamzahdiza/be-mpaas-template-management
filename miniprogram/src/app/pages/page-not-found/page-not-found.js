const languagePacks = require("../../../public/language-pack.json");

/* JShield-obfus:enable */
Page({
  data: {
    lang: {}
  },
  onLoad() {
    let language = ''
    my.call('getValueByKey', {
      key: 'preferredLanguage'
    }, (res) => {
      language = res.data
    })
    if (language) {
      this.setData({
        lang: languagePacks.languagePack[language]
      })
    } else {
      my.call('getValueByKey', {
        key: 'app.defaultLanguageKey'
      }, (res) => {
        language = res.data
        this.setData({
          lang: languagePacks.languagePack[language]
        })
      })
    }
  }
});
/* JShield-obfus:disable */