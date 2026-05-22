import DefaultTheme from 'vitepress/theme'
import UnenrollmentFinder from './components/UnenrollmentFinder.vue'
import BuyMeACoffee from './components/BuyMeACoffee.vue'
import Grid from './components/Grid.vue'
import ShareButtons from './components/ShareButtons.vue'
import RandomGuide from './components/RandomGuide.vue'
import NeroTabs from './components/NeroTabs.vue'
import SettingsPage from './components/SettingsPage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('UnenrollmentFinder', UnenrollmentFinder)
    app.component('BuyMeACoffee', BuyMeACoffee)
    app.component('Grid', Grid)
    app.component('ShareButtons', ShareButtons)
    app.component('RandomGuide', RandomGuide)
    app.component('NeroTabs', NeroTabs)
    app.component('SettingsPage', SettingsPage)
  }
}
