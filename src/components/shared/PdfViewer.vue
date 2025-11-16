<template>
  <div class="pdf-viewer-container" :class="{ 'fullscreen': isFullscreen }">
    <!-- Header with controls -->
    <div class="pdf-viewer-header" v-if="showHeader">
      <div class="pdf-viewer-title">
        <h3>{{ title || 'PDF Viewer' }}</h3>
      </div>
      
      <div class="pdf-viewer-controls">
                 <!-- Zoom Controls -->
         <div class="zoom-controls" v-if="showZoomControls">
           <v-btn
             size="small"
             variant="text"
             @click="zoomOut"
             :disabled="zoom <= minZoom"
             title="Zoom Out"
           >
             <IconMinus size="16" color="white" />
           </v-btn>
           <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
           <v-btn
             size="small"
             variant="text"
             @click="zoomIn"
             :disabled="zoom >= maxZoom"
             title="Zoom In"
           >
             <IconPlus size="16" color="white" />
           </v-btn>
           <v-btn
             size="small"
             variant="text"
             @click="resetZoom"
             title="Reset Zoom"
           >
             <IconRefresh size="16" color="white" />
           </v-btn>
         </div>

                 <!-- Navigation Controls -->
         <div class="navigation-controls" v-if="showNavigationControls">
           <v-btn
             size="small"
             variant="text"
             @click="previousPage"
             :disabled="currentPage <= 1"
             title="Previous Page"
           >
             <IconChevronLeft size="16" color="white" />
           </v-btn>
           <span class="page-info">
             {{ currentPage }} / {{ totalPages }}
           </span>
           <v-btn
             size="small"
             variant="text"
             @click="nextPage"
             :disabled="currentPage >= totalPages"
             title="Next Page"
           >
             <IconChevronRight size="16" color="white" />
           </v-btn>
         </div>

                 <!-- Action Controls -->
         <div class="action-controls">
           <v-btn
             v-if="showDownload"
             size="small"
             variant="text"
             @click="downloadPdf"
             :loading="downloading"
             title="Download PDF"
           >
             <IconDownload size="16" color="white" />
           </v-btn>
           <v-btn
             v-if="showPrint"
             size="small"
             variant="text"
             @click="printPdf"
             title="Print PDF"
           >
             <IconPrinter size="16" color="white" />
           </v-btn>
           <v-btn
             v-if="showFullscreen"
             size="small"
             variant="text"
             @click="toggleFullscreen"
             :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
           >
             <IconMaximize v-if="!isFullscreen" size="16" color="white" />
             <IconMinimize v-else size="16" color="white" />
           </v-btn>
           <v-btn
             v-if="showClose"
             size="small"
             variant="text"
             @click="$emit('close')"
             title="Close"
           >
             <IconX size="16" color="white" />
           </v-btn>
         </div>
      </div>
    </div>

    <!-- PDF Content -->
    <div class="pdf-viewer-content" :style="contentStyle">
      <!-- Loading State -->
      <div v-if="loading" class="pdf-loading">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p>{{ loadingText || 'Loading PDF...' }}</p>
      </div>

             <!-- Error State -->
       <div v-else-if="error" class="pdf-error">
         <IconFileText size="64" color="error" />
         <h3>{{ errorTitle || 'Error Loading PDF' }}</h3>
        <p>{{ error }}</p>
        <v-btn
          color="primary"
          @click="loadPdf"
          :loading="loading"
        >
          Retry
        </v-btn>
      </div>

      <!-- PDF Display -->
      <div v-else class="pdf-display">
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          :style="iframeStyle"
          @load="onPdfLoad"
          @error="onPdfError"
          :title="title || 'PDF Document'"
        />
        
                 <!-- Fallback for browsers that don't support PDF -->
         <div v-else class="pdf-fallback">
           <IconFileText size="64" color="grey" />
           <h3>PDF Preview Not Available</h3>
          <p>Your browser does not support PDF preview.</p>
          <v-btn
            color="primary"
            @click="downloadPdf"
            :loading="downloading"
          >
            Download PDF
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Footer with page info -->
    <div class="pdf-viewer-footer" v-if="showFooter">
      <div class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="file-info" v-if="fileSize">
        {{ formatFileSize(fileSize) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  IconMinus, 
  IconPlus, 
  IconRefresh, 
  IconChevronLeft, 
  IconChevronRight, 
  IconDownload, 
  IconPrinter, 
  IconMaximize, 
  IconMinimize, 
  IconX, 
  IconFileText 
} from '@tabler/icons-vue';

// Props
interface Props {
  src?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  showHeader?: boolean;
  showFooter?: boolean;
  showZoomControls?: boolean;
  showNavigationControls?: boolean;
  showDownload?: boolean;
  showPrint?: boolean;
  showFullscreen?: boolean;
  showClose?: boolean;
  loadingText?: string;
  errorTitle?: string;
  fileSize?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  autoLoad?: boolean;
  downloadFileName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: true,
  showZoomControls: true,
  showNavigationControls: true,
  showDownload: true,
  showPrint: true,
  showFullscreen: true,
  showClose: false,
  loadingText: 'Loading PDF...',
  errorTitle: 'Error Loading PDF',
  initialZoom: 1,
  minZoom: 0.25,
  maxZoom: 3,
  autoLoad: true,
  downloadFileName: 'document.pdf'
});

// Emits
const emit = defineEmits<{
  load: [pdf: any];
  error: [error: string];
  pageChange: [page: number];
  zoomChange: [zoom: number];
  download: [url: string];
  print: [url: string];
  close: [];
}>();

// Reactive state
const loading = ref(false);
const error = ref<string | null>(null);
const downloading = ref(false);
const isFullscreen = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const zoom = ref(props.initialZoom);

// Computed properties
const pdfUrl = computed(() => {
  if (!props.src) return null;
  
  // If it's already a blob URL or data URL, return as is
  if (props.src.startsWith('blob:') || props.src.startsWith('data:')) {
    return props.src;
  }
  
  // For regular URLs, add zoom parameter if supported
  const url = new URL(props.src, window.location.origin);
  url.searchParams.set('zoom', zoom.value.toString());
  return url.toString();
});

const contentStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '500px',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left'
}));

const iframeStyle = computed(() => ({
  width: '100%',
  height: '100%',
  border: 'none'
}));

// Methods
const loadPdf = async () => {
  if (!props.src) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // For now, we'll just set the URL and let the iframe handle loading
    // In a real implementation, you might want to fetch and validate the PDF
    loading.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load PDF';
    loading.value = false;
    emit('error', error.value);
  }
};

const onPdfLoad = () => {
  loading.value = false;
  // Note: Getting actual page count from iframe is complex due to CORS
  // This is a simplified implementation
  totalPages.value = 1; // You might want to implement actual page counting
  emit('load', { currentPage: currentPage.value, totalPages: totalPages.value });
};

const onPdfError = () => {
  error.value = 'Failed to load PDF document';
  loading.value = false;
  emit('error', error.value);
};

const zoomIn = () => {
  if (zoom.value < props.maxZoom) {
    zoom.value = Math.min(zoom.value + 0.25, props.maxZoom);
    emit('zoomChange', zoom.value);
  }
};

const zoomOut = () => {
  if (zoom.value > props.minZoom) {
    zoom.value = Math.max(zoom.value - 0.25, props.minZoom);
    emit('zoomChange', zoom.value);
  }
};

const resetZoom = () => {
  zoom.value = props.initialZoom;
  emit('zoomChange', zoom.value);
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit('pageChange', currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emit('pageChange', currentPage.value);
  }
};

const downloadPdf = async () => {
  if (!props.src) return;
  
  downloading.value = true;
  
  try {
    const response = await fetch(props.src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = props.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    emit('download', props.src);
  } catch (err) {
    console.error('Download failed:', err);
    // Fallback: open in new tab
    window.open(props.src, '_blank');
  } finally {
    downloading.value = false;
  }
};

const printPdf = () => {
  if (!props.src) return;
  
  const printWindow = window.open(props.src, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
  emit('print', props.src);
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (!isFullscreen.value) return;
  
  switch (event.key) {
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen();
      }
      break;
    case 'ArrowLeft':
      previousPage();
      break;
    case 'ArrowRight':
      nextPage();
      break;
    case '+':
    case '=':
      zoomIn();
      break;
    case '-':
      zoomOut();
      break;
    case '0':
      resetZoom();
      break;
  }
};

// Lifecycle
onMounted(() => {
  if (props.autoLoad) {
    loadPdf();
  }
  
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// Watch for src changes
watch(() => props.src, () => {
  if (props.autoLoad) {
    loadPdf();
  }
});

// Expose methods
defineExpose({
  loadPdf,
  zoomIn,
  zoomOut,
  resetZoom,
  previousPage,
  nextPage,
  downloadPdf,
  printPdf,
  toggleFullscreen
});
</script>

<style lang="scss" scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  height: 456px;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    border: none;
    border-radius: 0;
  }
}

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff9f9;
  border-bottom: 1px solid #e0e0e0;
  
  .pdf-viewer-title {
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .pdf-viewer-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .zoom-controls,
    .navigation-controls,
    .action-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      
      .zoom-level,
      .page-info {
        font-size: 14px;
        color: #666;
        min-width: 60px;
        text-align: center;
      }
    }
  }
}

.pdf-viewer-content {
  flex: 1;
  position: relative;
  overflow: auto;
  background: #f9f9f9;
  
  .pdf-loading,
  .pdf-error,
  .pdf-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;
    text-align: center;
    
    p {
      margin: 16px 0 0 0;
      color: #666;
    }
    
    h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }
  }
  
  .pdf-display {
    width: 100%;
    height: 100%;
    
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.pdf-viewer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
  
  .page-info,
  .file-info {
    font-weight: 500;
  }
}

// Responsive design
@media (max-width: 768px) {
  .pdf-viewer-header {
    flex-direction: column;
    gap: 12px;
    
    .pdf-viewer-controls {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  
  .pdf-viewer-footer {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .pdf-viewer-container {
    background: #1e1e1e;
    border-color: #333;
  }
  
  .pdf-viewer-header,
  .pdf-viewer-footer {
    background: #2d2d2d;
    border-color: #333;
    
    .pdf-viewer-title h3 {
      color: #fff;
    }
    
    .zoom-level,
    .page-info {
      color: #ccc;
    }
  }
  
  .pdf-viewer-content {
    background: #1e1e1e;
    
    .pdf-loading,
    .pdf-error,
    .pdf-fallback {
      p {
        color: #ccc;
      }
      
      h3 {
        color: #fff;
      }
    }
  }
}
</style>
