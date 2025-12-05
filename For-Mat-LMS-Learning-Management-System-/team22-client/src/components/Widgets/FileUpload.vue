<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Button from './ButtonComp.vue'

const emit = defineEmits(['url-uploaded', 'video-duration'])
const uploadedFileURL = ref('')
const uploadedFileType = ref('')
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const handleButtonClick = () => {
  fileInput.value?.click()
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
    const uniqueFilename = `${uuidv4()}.${fileExtension}`

    const response = await axios.put(`${blobServiceURL}/${uniqueFilename}${sasToken}`, file, {
      headers,
      onUploadProgress: (progressEvent) => {
        const totalBytes = progressEvent.total || 1
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / totalBytes)
      }
    })

    if (response.status === 201) {
      uploadedFileURL.value = `${blobServiceURL}/${uniqueFilename}`
      uploadProgress.value = 0
      emit('url-uploaded', uploadedFileURL.value)
      if (fileType.startsWith('video/')) {
        const videoElement = document.createElement('video')
        videoElement.preload = 'metadata'
        videoElement.src = uploadedFileURL.value
        videoElement.onloadedmetadata = function () {
          window.URL.revokeObjectURL(videoElement.src)
          const duration = Math.round(videoElement.duration)
          emit('video-duration', duration)
        }
      }
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
  const file = input.files ? input.files[0] : null
  if (!file) return

  if (file.type.startsWith('image/')) {
    uploadedFileType.value = 'image'
  } else if (file.type.startsWith('video/')) {
    uploadedFileType.value = 'video'
  } else {
    uploadedFileType.value = 'other'
  }

  uploadBlobToAzure(file, file.type)
}

// Expose methods
const exposed = {
  uploadBlobToAzure
}

defineExpose(exposed)
</script>

<template>
  <div class="file-container">
    <input type="file" ref="fileInput" @change="uploadToAzure" style="display: none" />
    <Button v-if="!props.hideButton" class="btn-save" btnText="Téléverser" btnColor="var(--textlight)"
      btnBgColor="var(--laccent)" btnHoverColor="var(--laccent)" btnHoverBgColor="var(--textlight)"
      @click="handleButtonClick" />

    <img class="element" v-if="uploadedFileType === 'image'" :src="uploadedFileURL" alt="Téléverser" />
    <video class="element" v-else-if="uploadedFileType === 'video'" :src="uploadedFileURL" controls></video>
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

.file-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
}

.element {
  width: 100%;
  height: 100%;
}

.btn-save {
  font-size: 14px;
  border: var(--laccent) solid 1px;
}

.btn-save:hover {
  border: var(--laccent) solid 1px;
  transform: scale(1);
}

.progress-bar {
  height: 100%;
  background-color: var(--daccent);
  transition: width 0.4s;
}
</style>

<!-- azure blob storage GPV2
Needs ressource sharing CORS -->
