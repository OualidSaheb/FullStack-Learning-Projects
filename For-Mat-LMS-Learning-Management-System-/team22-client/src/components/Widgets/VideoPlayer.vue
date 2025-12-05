<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { Chapter } from '@/interfaces/Main.interface'
import { useCourseTestStore } from '@/stores/courseReaderStore'
import { useRoute } from 'vue-router'

const emits = defineEmits(['update:index'])

const store = useCourseTestStore()
const route = useRoute()
const courseId = Number(route.params.id)

const props = defineProps({
  playlist: {
    type: Array as () => Chapter[],
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

const videoPlayer = ref<HTMLVideoElement | null>(null)
const currentVideoUrl = computed(() => props.playlist[props.currentIndex].videoUrl)
const countdownValue = ref(3)
const videoHasEnded = ref(false)

const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.oncanplay = null
    videoPlayer.value.oncanplay = () => {
      videoPlayer
        .value!.play()
        .then(() => {
          console.log('Playback started')
        })
        .catch((error) => {
          console.error('Playback error:', error)
        })
    }
    videoPlayer.value.load()
  }
}

const handleVideoStart = () => {
  const currentChapter = props.playlist[localCurrentIndex.value]
  if (currentChapter && currentChapter.status !== 'completed') {
    const sectionId = store.getSectionIdForChapter(currentChapter.id)
    if (sectionId !== null) {
      store.setChapterStatus(courseId, sectionId, currentChapter.id, 'open')
    }
  }
}

const localCurrentIndex = ref(props.currentIndex)
const handleVideoEnd = () => {
  const currentChapter = props.playlist[localCurrentIndex.value]
  console.log('Video ended for chapter:', currentChapter)

  if (currentChapter) {
    const sectionId = store.getSectionIdForChapter(currentChapter.id)
    if (sectionId !== null) {
      store.setChapterStatus(courseId, sectionId, currentChapter.id, 'completed')
      console.log('Chapter status set to completed for:', currentChapter.id)
    }
  }

  videoHasEnded.value = true
  countdownValue.value = 5
  startCountdown()
}

const startCountdown = () => {
  const intervalId = setInterval(() => {
    if (countdownValue.value > 0) {
      countdownValue.value -= 1
    } else {
      clearInterval(intervalId)
      playNextVideo()
    }
  }, 1000)
}

const playNextVideo = () => {
  videoHasEnded.value = false
  if (localCurrentIndex.value < props.playlist.length - 1) {
    localCurrentIndex.value += 1
    const nextChapter = props.playlist[localCurrentIndex.value]
    if (nextChapter && videoPlayer.value) {
      videoPlayer.value.src = nextChapter.videoUrl
      videoPlayer.value.load()
      playVideo()
    } else {
      console.error('Error loading the next video.')
    }
    emits('update:index', localCurrentIndex.value)
  } else {
    console.log('Reached the end of the playlist')
  }
}

const addVideoEventListeners = () => {
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('play', handleVideoStart)
    videoPlayer.value.addEventListener('ended', handleVideoEnd)
  }
}

const removeVideoEventListeners = () => {
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('play', handleVideoStart)
    videoPlayer.value.removeEventListener('ended', handleVideoEnd)
  }
}

onMounted(() => {
  videoPlayer.value = document.querySelector('#videoPlayerContainer video') as HTMLVideoElement
  store.initializeChapters(courseId)
  addVideoEventListeners()
})

onBeforeUnmount(() => {
  removeVideoEventListeners()
})
</script>

<template>
  <div id="videoPlayerContainer">
    <video
      ref="videoPlayer"
      :src="currentVideoUrl"
      controls
      controlsList="nodownload"
      crossOrigin="anonymous"
    ></video>
    <!-- Countdown Display -->
    <div v-if="videoHasEnded && countdownValue < 5" class="countdown">{{ countdownValue }}</div>
  </div>
</template>

<style scoped>
#videoPlayerContainer {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%;
  /* 16:9 Aspect Ratio */
}

video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(138, 7, 253, 0.7);
  color: white;
  padding: 10px 20px;
  font-size: 2rem;
}
</style>
