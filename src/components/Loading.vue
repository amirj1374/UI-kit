<template>
  <transition name="fade">
    <div class="loading-overlay" v-if="customizer.loading">
      <div class="loading-wrapper">
        <Vue3Lottie
          :animation-link="'/persian.json'"
          :loop="true"
          :autoplay="true"
          class="lottie-animation"
        />
        <!-- Add a separate transition for the span -->
        <transition name="fade-slide">
          <span v-if="customizer.loading">لطفا منتظر بمانید</span>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
</script>

<style scoped>
/* Fade transition for the loading overlay */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Fade and slide transition for the span */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px); /* Start slightly below */
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0); /* End at its original position */
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Slide down on leave */
}

/* Fullscreen loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* Light translucent white */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it overlays other content */
  backdrop-filter: blur(8px); /* Apply blur effect to the overlay */
}

/* Center the animation */
.loading-wrapper {
  width: 200px;
  height: 200px;
  text-align: center;
}

/* Blur transition for background content */
.blur-background {
  filter: blur(10px);
  pointer-events: none; /* Disable interactions with blurred content */
  transition: filter 0.5s ease; /* Smooth blur transition */
}
</style>
