<script setup lang="ts">
import FUA from '@/components/utils/FileUploadAdmin.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { SiteRole } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()

const username = ref('patate')
const password = ref('hunter2')
const id = ref('01234')
const email = ref('aaa@aaa.com')
const image: Ref<string | File> = ref(
  'https://team22blob.blob.core.windows.net/team22blobstorage/mario.png'
)
const siteRole = ref(SiteRole.USER)
const role = ref('')

const siteRoles = Object.values(SiteRole)

const storeUser = () => {
  userStore.setTemporaryUser({
    username: username.value,
    password: password.value,
    id: id.value,
    email: email.value,
    image: image.value,
    siteRole: siteRole.value,
    role: role.value
  })
}

// const onFileChange = (event: Event) => {
//   const inputElement = event.target as HTMLInputElement
//   const file = inputElement.files ? inputElement.files[0] : null
//   if (file) {
//     image.value = file // Assign the selected file to the 'image' ref
//   }
// }

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div>
    <input v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <input v-model="id" placeholder="ID" />
    <input v-model="email" type="email" placeholder="Email" />
    <!-- <input type="file" @change="onFileChange" placeholder="Image" /> -->
    <select v-model="siteRole">
      <option v-for="role in siteRoles" :key="role" :value="role">{{ role }}</option>
    </select>

    <select v-model="role">
      <!-- liste de role... devrais probablement etre recuperer du backend -->
    </select>

    <button @click="storeUser">Store Temporary User</button>
    <button @click="goBack">Go Back</button>
  </div>
  <FUA></FUA>
</template>
