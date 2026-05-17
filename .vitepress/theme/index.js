import DefaultTheme from 'vitepress/theme'
import UnenrollmentFinder from './components/UnenrollmentFinder.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import BuyMeACoffee from './components/BuyMeACoffee.vue'
import Grid from './components/Grid.vue'
import ShareButtons from './components/ShareButtons.vue'
import RandomGuide from './components/RandomGuide.vue'
import Footer from './components/Footer.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('UnenrollmentFinder', UnenrollmentFinder)
    app.component('SettingsPanel', SettingsPanel)
    app.component('BuyMeACoffee', BuyMeACoffee)
    app.component('Grid', Grid)
    app.component('ShareButtons', ShareButtons)
    app.component('RandomGuide', RandomGuide)
    app.component('Footer', Footer)  // Register Footer component
  }
}