<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Button from '@/components/Widgets/ButtonComp.vue'

const emit = defineEmits(['url-uploaded'])
const uploadedFileURL = ref('')
const uploadedFileType = ref('')
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const userDefinedFilename = ref('')
const selectedFile = ref<File | null>(null)

const handleFileSelectClick = () => {
  fileInput.value?.click()
}

const handleUploadClick = () => {
  if (selectedFile.value) {
    uploadBlobToAzure(selectedFile.value, selectedFile.value.type)
  }
}

const props = defineProps<{
  hideButton?: boolean
}>()

const uploadBlobToAzure = async (file: File | Blob, fileType: string) => {
  const blobServiceURL = import.meta.env.VITE_BLOB_SERVICE_URL
  const sasToken = import.meta.env.VITE_SAS_TOKEN
  try {
    const headers = {
      'x-ms-blob-type': 'BlockBlob'
    }

    const fileExtension = fileType.split('/').pop() || ''
    const uniqueFilename = userDefinedFilename.value
      ? `${userDefinedFilename.value}.${fileExtension}`
      : `${uuidv4()}.${fileExtension}`

    const response = await axios.put(`${blobServiceURL}/${uniqueFilename}${sasToken}`, file, {
      headers,
      onUploadProgress: (progressEvent) => {
        const totalBytes = progressEvent.total || 1
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / totalBytes)
      }
    })

    if (response.status === 201) {
      uploadedFileURL.value = `${blobServiceURL}/${uniqueFilename}${sasToken}`
      uploadProgress.value = 0
      emit('url-uploaded', uploadedFileURL.value)
    } else {
      console.log('Failed to upload the file:', response)
      uploadProgress.value = 0
    }
  } catch (error) {
    console.error('Error uploading to Azure Blob Storage:', error)
  }
}

const uploadToAzure = async (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files ? input.files[0] : null
  if (!selectedFile.value) return

  if (selectedFile.value.type.startsWith('image/')) {
    uploadedFileType.value = 'image'
  } else if (selectedFile.value.type.startsWith('video/')) {
    uploadedFileType.value = 'video'
  } else {
    uploadedFileType.value = 'other'
  }
}

const exposed = {
  uploadBlobToAzure
}

defineExpose(exposed)
</script>

<template>
  <div>
    <input
      type="text"
      v-model="userDefinedFilename"
      placeholder="Entrez nom de fichier(sans extension)"
    />

    <Button
      btnText="Choisir Fichier"
      btnColor="var(--textlight)"
      btnBgColor="var(--laccent)"
      btnHoverColor="var(--daccent)"
      btnHoverBgColor="var(--secondary)"
      @click="handleFileSelectClick"
    />

    <input type="file" ref="fileInput" @change="uploadToAzure" style="display: none" />
    <Button
      v-if="!props.hideButton"
      btnText="Téléverser"
      btnColor="var(--textlight)"
      btnBgColor="var(--laccent)"
      btnHoverColor="var(--daccent)"
      btnHoverBgColor="var(--secondary)"
      @click="handleUploadClick"
    />

    <img v-if="uploadedFileType === 'image'" :src="uploadedFileURL" alt="Téléverser" />
    <video v-else-if="uploadedFileType === 'video'" :src="uploadedFileURL" controls></video>
    <div v-else-if="uploadedFileType === 'other'">Uploaded file is not an image or video.</div>
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-container">
      <div :style="{ width: `${uploadProgress}%` }" class="progress-bar"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  background-color: var(--daccent);
  transition: width 0.4s;
}
</style>
