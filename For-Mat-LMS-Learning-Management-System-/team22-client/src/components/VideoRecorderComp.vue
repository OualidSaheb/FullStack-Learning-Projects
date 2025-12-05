<script setup lang="ts">
// le chemin d'acces de la video devra probablement etre storer dans la table de l'utilisateur
// cela n'empecheras pas quiconque de visionner une video uploader par un autre utilisateur si il as le chemin d'acces correct...
//faille de securiter a corriger
import { ref, computed } from 'vue'
import FileUpload from '@/components/Widgets/FileUpload.vue'
import VideoRecorder from '@/components/VideoCapture.vue'
const emit = defineEmits(['url-uploaded', 'video-duration'])

interface FileUploadInterface {
  uploadBlobToAzure(blob: Blob, type: string): void
}

const fileUploader = ref<FileUploadInterface | null>(null)

const handleVideoRecorded = (blob: Blob) => {
  fileUploader.value?.uploadBlobToAzure(blob, 'video/webm')
}

//VUE METER
const audioLevel = ref(0)

const audioLevelColor = computed(() => {
  if (audioLevel.value >= 100) {
    return 'red'
  } else if (audioLevel.value >= 80) {
    return 'orange'
  } else {
    return 'green'
  }
})

const handleAudioLevelUpdated = (level: number) => {
  audioLevel.value = level
}

//url
const handleUrlUploaded = (url: string) => {
  // Re-emit url-uploaded
  emit('url-uploaded', url)
  emit('video-duration', 0)
}

//duration de video
const handleVideoDuration = (duration: number) => {
  emit('video-duration', duration)
}
</script>

<template>
  <div>
    <VideoRecorder @video-recorded="handleVideoRecorded" @audio-level-updated="handleAudioLevelUpdated" />
    <div class="audio-level-box">
      <div class="audio-level" :style="{ height: `${audioLevel}px`, backgroundColor: audioLevelColor }"></div>
    </div>

    <FileUpload ref="fileUploader" @url-uploaded="handleUrlUploaded" :hideButton="true"
      @video-duration="handleVideoDuration" />
  </div>
</template>

<style>
.audio-level {
  width: 150px;
  background-color: red;
  transition: height 0.1s ease-in-out;
}

.audio-level-box {
  border: 1px solid purple;
  height: 40px;
  width: 150px;
  position: relative;
}
</style>
