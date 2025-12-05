<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AWS from 'aws-sdk';

// AWS Configuration
AWS.config.update({
  region: 'ca-central-1', // Replace with your AWS region
});

const s3 = new AWS.S3();
const bucketName = 'retroaction'; // Replace with your S3 bucket name

const audioFiles = ref<Array<string | undefined>>();

const listAudioFiles = async () => {
  const params = {
    Bucket: bucketName,
    // Add a prefix here if needed
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    audioFiles.value = data.Contents?.map(file => file.Key);
  } catch (error) {
    console.error("Error in listing audio files:", error);
  }
};

onMounted(() => {
  listAudioFiles();
});
</script>

<template>
  <div>
    <h2>Audio Files</h2>
    <ul v-if="audioFiles?.length">
      <li v-for="file in audioFiles" :key="file">
        {{ file }}
      </li>
    </ul>
    <p v-else>No audio files found.</p>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
