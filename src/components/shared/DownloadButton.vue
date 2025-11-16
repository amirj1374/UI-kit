<template>
  <v-btn
    v-bind="$attrs"
    :loading="loading"
    @click="handleDownload"
    class="download-button"
  >
    <v-icon v-if="icon" :start="iconStart" :end="iconEnd" :class="iconClass">{{ icon }}</v-icon>
    <span class="download-title">{{ title }}</span>
    <v-icon v-if="!icon" start :icon="icons.download" :class="iconClass"></v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { icons } from '@/plugins/mdi-icon'

interface Props {
  url: string
  title?: string
  icon?: string
  iconStart?: boolean
  iconEnd?: boolean
  filename?: string
  method?: 'anchor' | 'fetch'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'دانلود',
  iconStart: true,
  iconEnd: false,
  method: 'anchor'
})

const emit = defineEmits<{
  download: [url: string]
  error: [error: Error]
  success: [filename: string]
}>()

const loading = ref(false)

// Computed class for icon positioning
const iconClass = computed(() => {
  if (props.iconStart) return 'icon-start'
  if (props.iconEnd) return 'icon-end'
  return ''
})

const handleDownload = async () => {
  if (!props.url) {
    const error = new Error('URL is required for download')
    emit('error', error)
    return
  }

  loading.value = true
  
  try {
    if (props.method === 'fetch') {
      await downloadWithFetch()
    } else {
      await downloadWithAnchor()
    }
  } catch (error) {
    console.error('Download failed:', error)
    emit('error', error as Error)
  } finally {
    loading.value = false
  }
}

const downloadWithAnchor = async () => {
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a')
  link.href = props.url
  link.download = props.filename || ''
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  
  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  emit('download', props.url)
  emit('success', props.filename || 'downloaded-file')
}

const downloadWithFetch = async () => {
  try {
    const response = await fetch(props.url)
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = props.filename || getFilenameFromUrl(props.url) || 'download'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    window.URL.revokeObjectURL(url)
    
    emit('download', props.url)
    emit('success', props.filename || 'downloaded-file')
  } catch (error) {
    throw new Error(`Fetch download failed: ${error}`)
  }
}

const getFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()
    return filename || 'download'
  } catch {
    return 'download'
  }
}

// Inherit all Vuetify button attributes except the ones we override
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.download-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-title {
  margin: 0 4px;
}

.icon-start {
  margin-right: 4px;
}

.icon-end {
  margin-left: 4px;
}

/* RTL Support */
[dir="rtl"] .download-button {
  gap: 8px;
}

[dir="rtl"] .icon-start {
  margin-right: 0;
  margin-left: 4px;
}

[dir="rtl"] .icon-end {
  margin-left: 0;
  margin-right: 4px;
}
</style>
