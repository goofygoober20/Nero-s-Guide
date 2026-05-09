import DefaultTheme from 'vitepress/theme'
import UnenrollmentFinder from './components/UnenrollmentFinder.vue'
import SettingsPanel from './components/SettingsPanel.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('UnenrollmentFinder', UnenrollmentFinder)
    app.component('SettingsPanel', SettingsPanel)
  }
}