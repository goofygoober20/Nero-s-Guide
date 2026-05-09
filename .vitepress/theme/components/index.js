import DefaultTheme from 'vitepress/theme'
import UnenrollmentFinder from './components/UnenrollmentFinder.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('UnenrollmentFinder', UnenrollmentFinder)
  }
}