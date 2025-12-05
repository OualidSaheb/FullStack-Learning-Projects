<script setup lang="ts">
import { useCourseTestStore } from '@/stores/courseReaderStore'
import type { Course } from '@/interfaces/Main.interface'
import Button from '@/components/Widgets/ButtonComp.vue'
import router from '@/router/index'
import HeaderVert from '@/components/HeaderVert.vue'
import { SiteRole, useUserStore } from '@/stores/userStore'
import { Icon } from '@iconify/vue'
import LSManager from './utils/LSManager.vue'
import { onMounted } from 'vue'

const store = useCourseTestStore()

function addCourse() {
  // remettre a zero quand on ajoute
  store.selectedCourse = null
  // ajouter cours et redirection vers coursecreator
  store.startAddingCourse()
  router.push('/coursecreator')
}
function editCourse(course: Course) {
  store.setSelectedCourse(course)
  store.startEditingCourse(course.id)
  router.push({ name: 'coursecreator', params: { courseId: course.id } })
}
const userStore = useUserStore()

//Local Storage

function loadCoursesFromLocalStorage() {
  const coursesString = localStorage.getItem('courses')
  if (coursesString) {
    const courses = JSON.parse(coursesString)
    store.setCourses(courses)
  }
}
onMounted(loadCoursesFromLocalStorage)
</script>

<template>
  <HeaderVert></HeaderVert>
  <main>
    <div class="container">
      <div class="title">
        <h2 class="title-menu">Cours</h2>
        <LSManager></LSManager>
        <Button v-if="userStore.siteRole === SiteRole.PUB || userStore.siteRole === SiteRole.ADMIN"
          btnText="Ajouter un cours" btnColor="white" btnBgColor="var(--laccent)" btnHoverColor="white"
          btnHoverBgColor="var(--maccent)" @click="addCourse"></Button>
      </div>
      <div class="content">
        <ul>
          <li v-for="course in store.getCourses" :key="course.id" id="courses">
            <router-link :to="`/cours/${course.id}`">
              <img :src="course.imageUrl" alt="Course Image" />
            </router-link>
            <div class="course-name">
              <div>
                <p> {{ course.name }}</p>
              </div>
              <div>
                <Icon v-if="userStore.siteRole === SiteRole.PUB || userStore.siteRole === SiteRole.ADMIN"
                  class="icons edit" icon="ic:sharp-edit" @click="editCourse(course)" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-menu {
  font-size: 30px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.btn-add {
  color: white;
  background-color: var(--laccent);
  cursor: pointer;
}

.btn-add:hover {
  background-color: var(--maccent);
}

.btn-switch {
  margin-top: 50px;
}

#courses {
  list-style-type: none;
  padding: 0;
}

ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

h2 {
  font-weight: 600;
}

li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
  border-radius: 5px;
  padding: 10px;

  cursor: pointer;
  width: 30%;
}

img:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

img {
  margin-top: 40px;
  width: 345px;
  height: 200px;
  object-fit: cover;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 5px solid var(--daccent);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* Text Styling */
p {
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}


.course-name {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

/* Page Background Styling */
main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icons {
  width: 20px;
  height: 20px;
}

.edit {
  color: var(--daccent);
  margin-left: 80px;
}
</style>
