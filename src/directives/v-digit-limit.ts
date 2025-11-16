import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLInputElement, binding: DirectiveBinding<number>) {
    const maxDigits = binding.value

    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement
      input.value = input.value.replace(/\D/g, '').slice(0, maxDigits)
      input.dispatchEvent(new Event('input')) // Sync v-model
    }

    el.addEventListener('input', handleInput)
  }
}
