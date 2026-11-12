import { ref } from 'vue'

export const useOnboarding = () => ({
  steps: ref([]),
  activeStep: ref(null),
  completed: ref(false),
})
export const Onboarding = { render: () => null }
export const HelpModal = { render: () => null }
export const GettingStartedBanner = { render: () => null }
export const IntermediateStepModal = { render: () => null }
export const showHelpModal = ref(false)
export const minimize = ref(false)

export default {
  useOnboarding,
  Onboarding,
  HelpModal,
  GettingStartedBanner,
  IntermediateStepModal,
  showHelpModal,
  minimize,
}
