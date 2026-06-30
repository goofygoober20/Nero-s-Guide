import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css' 
import UnenrollmentFinder from './components/UnenrollmentFinder.vue'
import NeroTabs from './components/NeroTabs.vue'
import SettingsPage from './components/SettingsPage.vue'
import PasswordManagerQuiz from './components/PasswordManagerQuiz.vue'
import TwoFactorQuiz from './components/TwoFactorQuiz.vue' 
import SleepSurvey from './components/SleepSurvey.vue'  
import GuideIcon from './components/GuideIcon.vue'
import BackLinks from './components/BackLinks.vue'
import PasswordStrengthTester from './components/PasswordStrengthTester.vue'
import PasswordGenerator from './components/PasswordGenerator.vue'
import DecisionWheel from './components/DecisionWheel.vue'
import UnitConverter from './components/UnitConverter.vue'
import StudySessionTracker from './components/StudySessionTracker.vue'
import WakeUpCalculator from './components/WakeUpCalculator.vue'
import FeedbackTopBar from './components/FeedbackTopBar.vue'
import HelpfulWidget from './components/HelpfulWidget.vue'
import BoxBreathing from './components/BoxBreathing.vue'
import InvestmentCalculator from './components/InvestmentCalculator.vue'
import BMICalculator from './components/BMICalculator.vue'
import GPACalculator from './components/GPACalculator.vue'
import BillSplitCalculator from './components/BillSplitCalculator.vue'
import CoinFlipDiceRoller from './components/CoinFlipDiceRoller.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import DynamicPrompt from './components/DynamicPrompt.vue'
import NotFound from './components/NotFound.vue'
import NoteTakingQuiz from './components/NoteTakingQuiz.vue'

export default {
  extends: DefaultTheme,
  Layout,
  NotFound,
  enhanceApp({ app }) {
    try {
      const saved = localStorage.getItem('neros-guide-settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.accentTheme) {
          document.documentElement.classList.add('accent-' + parsed.accentTheme)
        }
        if (parsed.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (parsed.theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else if (parsed.theme === 'system' || !parsed.theme) {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark')
          }
        }
        if (parsed.fontSize && parsed.fontSize !== 'medium') {
          document.documentElement.classList.add('font-' + parsed.fontSize)
        }
        if (parsed.reducedMotion) {
          document.documentElement.classList.add('reduced-motion')
        }
        if (parsed.autoHideNav) {
          document.documentElement.classList.add('auto-hide-nav')
        }
        if (parsed.showBreadcrumbs === false) {
          document.documentElement.classList.add('hide-breadcrumbs')
        }
        if (parsed.cardStyle && parsed.cardStyle !== 'none') {
          document.documentElement.classList.add('card-style-' + parsed.cardStyle)
        }
      }
    } catch {}

    app.component('UnenrollmentFinder', UnenrollmentFinder)
    app.component('NeroTabs', NeroTabs)
    app.component('SettingsPage', SettingsPage)
    app.component('PasswordManagerQuiz', PasswordManagerQuiz) 
    app.component('TwoFactorQuiz', TwoFactorQuiz) 
    app.component('SleepSurvey', SleepSurvey)
    app.component('GuideIcon', GuideIcon)
    app.component('BackLinks', BackLinks)
    app.component('PasswordStrengthTester', PasswordStrengthTester)
    app.component('PasswordGenerator', PasswordGenerator)
    app.component('DecisionWheel', DecisionWheel)
    app.component('UnitConverter', UnitConverter)
    app.component('StudySessionTracker', StudySessionTracker)
    app.component('WakeUpCalculator', WakeUpCalculator)
    app.component('FeedbackTopBar', FeedbackTopBar)
    app.component('HelpfulWidget', HelpfulWidget)
    app.component('BoxBreathing', BoxBreathing)
    app.component('InvestmentCalculator', InvestmentCalculator)
    app.component('BMICalculator', BMICalculator)
    app.component('GPACalculator', GPACalculator)
    app.component('BillSplitCalculator', BillSplitCalculator)
    app.component('CoinFlipDiceRoller', CoinFlipDiceRoller)
    app.component('CountdownTimer', CountdownTimer)
    app.component('DynamicPrompt', DynamicPrompt)
    app.component('NotFound', NotFound)
    app.component('NoteTakingQuiz', NoteTakingQuiz)
  }
}
