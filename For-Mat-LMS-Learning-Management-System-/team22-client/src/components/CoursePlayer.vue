<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseTestStore } from '@/stores/courseReaderStore'
import VideoPlayer from '@/components/Widgets/VideoPlayer.vue'
import type { Chapter, Section, Course } from '@/interfaces/Main.interface'
import { formatTimeWithLocale as fTime } from '@/components/utils/Utils'
import type { Ref } from 'vue'
import Header from '@/components/MainPageComponents/HeaderComponent.vue'
import { Icon } from '@iconify/vue'
import ExamComponent from '@/components/ExamComponent.vue'
const router = useRouter()
const route = useRoute()

const store = useCourseTestStore()
let courseId = Number(route.params.id)
let chapterId = Number(route.params.chapterId)
let sectionId = Number(route.params.sectionId)

const course = ref<Course | null>(null)
// Defining the ref for VideoPlayer component
const videoPlayerComponent: Ref<any> = ref(null)

const currentIndex = ref(0)

onBeforeMount(async () => {
  const fetchedCourse = store.getCourseById(courseId)

  if (fetchedCourse) {
    course.value = fetchedCourse
    for (let i = 1; i <= sectionId; i++) {
      for (let j = 1; j <= chapterId; j++) {
        store.setChapterStatus(courseId, i, j, 'completed')
      }
    }
    if (chapterId) {
      store.setChapterStatus(courseId, sectionId, 0, 'completed')
      const foundIndex = playlist.value.findIndex((c) => c.id === chapterId)
      console.log('Found index:', foundIndex)
      currentIndex.value = foundIndex
    }
  } else {
    console.log('aucun cours trouvé')
  }
})

const playlist = computed(() => {
  if (course.value) {
    return course.value.content.flatMap((section: Section) => section.chapters)
  }
  return []
})

const setCurrentVideo = (chapter: Chapter) => {
  console.log('setCurrentVideo called for chapter:', chapter)
  if (chapter.status === 'completed' || chapter.status === 'open') {
    const foundIndex = playlist.value.findIndex((c) => c.id === chapter.id)
    console.log('Found index:', foundIndex)
    currentIndex.value = foundIndex

    // Find the section for the current chapter
    const sectionForChapter = course.value!.content.find((section) =>
      section.chapters.some((c) => c.id === chapter.id)
    )

    if (sectionForChapter) {
      // Use direct push method on router instance
      router.push({
        name: 'CourseContent',
        params: {
          courseId: course.value!.id.toString(),
          sectionId: sectionForChapter.id.toString(),
          chapterId: chapter.id.toString()
        }
      })
    } else {
      console.error('Section not found for the given chapter.')
    }
  } else if (chapter.status === 'closed') {
    isModalVisible.value = true // Show the modal
  }
}

const progressValue = computed(() => store.progression(courseId))

const isContentVisible = ref(true)

const toggleContentVisibility = () => {
  isContentVisible.value = !isContentVisible.value
}
const isnotContentVisible = ref(false)
const toggleContentInvisibility = () => {
  isnotContentVisible.value = !isnotContentVisible.value
}

const updateCurrentIndex = (index: number) => {
  currentIndex.value = index
}

// Determine if all chapters are open (or completed)
const allChaptersCompleted = computed(() => {
  return (
    course.value &&
    course.value.content.every((section: Section) =>
      section.chapters.every((chapter: Chapter) => chapter.status === 'completed')
    )
  )
})

// To control the visibility of ExamComponent
const showExam = ref(false)
const isModalVisible = ref(false)

const handleExamClick = () => {
  if (allChaptersCompleted.value) {
    showExam.value = true
  } else {
    isModalVisible.value = true // Show the modal
  }
}
const closeModal = () => {
  isModalVisible.value = false // Close the modal
}
</script>

<template>
  <Header></Header>

  <main>
    <div class="container">
      <div v-if="course">
        <div class="title-container">
          <div class="title">
            <h1 class="course-title">{{ course.name }}</h1>
            <p>{{ course.description }}</p>
          </div>
          <div class="progress-container">
            <!-- <p>Votre progression</p> -->

            <div class="progress-content">
              <div class="progress-bar" :style="{ width: progressValue }">
                <p>{{ progressValue }}</p>
              </div>
            </div>
            <Icon icon="solar:cup-star-bold" width="25" height="25" />
          </div>
        </div>

        <div class="contenu">
          <div :class="['video-section', { expanded: !isContentVisible }]">
            <!-- Show VideoPlayer by default -->
            <div v-if="!showExam">
              <VideoPlayer :playlist="playlist" :currentIndex="currentIndex" ref="videoPlayerComponent"
                @update:index="updateCurrentIndex" />
              <div class="video-title">
                <h2>
                  Chapitre {{ playlist[currentIndex].id }} : {{ playlist[currentIndex].name }}
                </h2>
              </div>
              <div>{{ playlist[currentIndex].text }}</div>
            </div>

            <!-- Show ExamComponent if showExam is true -->
            <div v-else>
              <div class="video-title">
                <h2>Examen final</h2>
              </div>
              <ExamComponent :exam="course.exam" @close="() => (showExam = false)" />
            </div>
          </div>

          <button ref="toggleButton" @click="toggleContentVisibility" class="course-content-toggle">
            <Icon :icon="isContentVisible ? 'ph:x' : 'mdi:arrow-left'" />
          </button>

          <div v-if="course" class="course-content" :class="{ hidden: !isContentVisible }">
            <div class="course-content-header">
              <h2>Contenu du cours</h2>
              <!-- Collapsible Button -->
              <button v-if="!isnotContentVisible" @click="toggleContentInvisibility" class="collapsible-btn">
                <Icon icon="mdi:arrow-down" />
              </button>
              <button v-else @click="toggleContentInvisibility" class="collapsible-btn">
                <Icon icon="mdi:arrow-up" />
              </button>
            </div>

            <div class="course-section" :class="{ hidden: !isnotContentVisible }">
              <div v-for="section in course.content" :key="section.id" class="section">
                <div class="section-titre">Section {{ section.id }} : {{ section.name }}</div>
                <router-link v-for="chapter in section.chapters" :key="chapter.id"
                  :to="`/cours/${courseId}/section/${section.id}/chapter/${chapter.id}`" class="chapter"
                  :class="[chapter.status, { active: playlist[currentIndex].id === chapter.id }]"
                  @click="() => setCurrentVideo(chapter)">
                  <div class="status">
                    <div v-if="chapter.status === 'completed'">
                      <div class="icon center column complete">
                        <Icon class="status-icon complete" icon="material-symbols:check" />
                      </div>
                    </div>

                    <div class="icon center column" v-else-if="chapter.status === 'closed'">
                      <div class="icon center column close">
                        <Icon class="status-icon closed" icon="material-symbols:lock-sharp" />
                      </div>
                    </div>

                    <div v-else-if="chapter.status === 'open'">
                      <div class="icon center column opened">
                        <Icon class="status-icon" icon="mdi:play" />
                      </div>
                    </div>
                  </div>
                  <div class="title-time">
                    <div class="chapiter-name">
                      <h4>{{ chapter.name }}</h4>
                    </div>
                    <div class="chapiter-time">
                      <div class="time">
                        <Icon icon="carbon:time" /> {{ fTime(chapter.videoLength) }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
              <!-- Exam title -->
              <div class="course-section">
                <div v-if="allChaptersCompleted" @click="handleExamClick" class="chapter active">
                  <div class="icon center column opened">
                    <Icon class="status-icon" icon="mdi:play" />
                  </div>
                  <div class="chapiter-name">
                    <h4>Examen: {{ course.name }}</h4>
                  </div>
                </div>
                <div v-else @click="handleExamClick" class="chapter">
                  <div class="icon center column close">
                    <Icon class="status-icon closed" icon="material-symbols:lock-sharp" />
                  </div>
                  <div class="chapiter-name">
                    <h4>Examen</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>Course not found</div>
    </div>
  </main>
  <div v-if="isModalVisible" class="modal-background">
    <div class="modal-content">
      <p>You need to finish the course first!</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 20px;
  padding: 20px 0;
  margin: 30px 0;
  border-bottom: var(--baccent) solid 1px;
}

.course-title {
  font-weight: 700;
  font-size: 25px;
}

.title {
  width: 100%;
}

.progress-container {
  width: 80%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-content {
  background-color: var(--background);
  height: 25px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: var(--baccent) solid 1px;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(to right, #6a3093, #a044ff);
  transition: width 0.4s;
}

.progress-bar p {
  font-weight: 700;
  font-size: 16px;
  padding: 0px 12px;
  color: var(--background);
}

.contenu {
  display: flex;
  gap: 20px;
}

.video-section {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 70%;
  transition: flex-basis 0.5s ease-in-out;
}

.video-section.expanded {
  flex-basis: 100%;
}


.video-title h2 {
  font-size: 25px;
  font-weight: 700;
  line-height: 1;
}

.video-title {
  margin: 15px 0;
}

section h2 {
  font-size: 16px;
  font-weight: 600;
}

.section {
  margin: 20px 0;
  border-bottom: var(--baccent) solid 1px;
}

.course-content {
  flex: 0 1 30%;
  height: 100%;
  background-color: var(--background);
  padding: 15px;
  margin: 5px 0;
  border: var(--baccent) solid 1px;
}




.course-content.hidden {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  /* to prevent the content from being accessible when it's hidden */
}

a {
  text-decoration: none;
  color: var(--daccent);
}

.chapter {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin: 5px 0px;
  gap: 25px;
}

.chapter:hover {
  background-color: var(--baccent);
  color: var(--laccent);
  transition: all 0.3s ease;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.center {
  align-items: center;
}

.status-icon {
  width: 20px;
  height: 20px;
  color: var(--background);
}

.opened {
  background-color: #670197;
}

.complete {
  background-color: #01974c;
}

.close {
  background-color: #d30000;
}

.title-time {
  display: flex;
  flex-direction: column;
}

.active {
  color: var(--laccent);
}

.section-titre {
  font-weight: 600;
  margin-top: 10px;
}

.time {
  font-size: 10px;
}

.contenu {
  position: relative;
}

.course-content-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  border: 1px solid var(--laccent);
  background-color: var(--background);
  border-radius: 20px;
  padding: 7px;
  cursor: pointer;
  z-index: 6;
  transition: transform 0.4s cubic-bezier(0.2, 0, 0.38, 0.9);
}

.course-content-toggle:hover {
  border: 1px solid var(--daccent);
  background-color: var(--baccent);
  transition: all 0.3s ease;
}

.course-content:not(.visible) .course-content-toggle {
  transform: translateY(-50%) translateX(0%);
}

.course-content-header {
  display: flex;
  justify-content: space-between;
}

.course-content.hidden {
  display: none;
}

.collapsible-btn {
  display: none;
}

.modal-background {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

@media (max-width: 992px) {
  .contenu {
    flex-direction: column-reverse;
  }

  .video-section,
  .course-content {
    width: 100%;
  }

  .course-content-toggle {
    display: none;
  }

  .collapsible-btn {
    display: block;
    border: 1px solid var(--laccent);
    background-color: var(--background);
    border-radius: 20px;
    padding: 7px;
    cursor: pointer;
  }

  .collapsible-btn:hover {
    border: 1px solid var(--daccent);
    background-color: var(--baccent);
    transition: transform 0.4s cubic-bezier(0.2, 0, 0.38, 0.9);
  }

  .course-section {
    display: none;
  }

  .course-section.hidden {
    display: none;
  }

  .course-section:not(.hidden) {
    display: block;
  }
}

@media (max-width: 576px) {
  .title-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .progress-container {
    width: 100%;
  }
}
</style>
