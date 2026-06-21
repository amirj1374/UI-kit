import type { DirectiveBinding } from 'vue'

interface DigitLimitElement extends HTMLInputElement {
  _digitLimitHandler?: (e: Event) => void
}

export default {
  mounted(el: DigitLimitElement, binding: DirectiveBinding<number>) {
    const maxDigits = binding.value

    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement
      const cleaned = input.value.replace(/\D/g, '').slice(0, maxDigits)
      // Only rewrite + re-dispatch when the value actually changed. This both
      // avoids redundant work and prevents the input handler from recursing
      // into itself indefinitely (the re-dispatched event sees cleaned === value
      // and stops).
      if (cleaned !== input.value) {
        input.value = cleaned
        input.dispatchEvent(new Event('input')) // Sync v-model
      }
    }

    el._digitLimitHandler = handleInput
    el.addEventListener('input', handleInput)
  },
  unmounted(el: DigitLimitElement) {
    if (el._digitLimitHandler) {
      el.removeEventListener('input', el._digitLimitHandler)
      delete el._digitLimitHandler
    }
  }
}
