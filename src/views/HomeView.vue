<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
</script>

<template>
  <h1 class="text-h2 text-center">{{ t('home.title') }}</h1>
</template>
