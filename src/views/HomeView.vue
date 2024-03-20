<script setup lang="ts">
import {ref} from 'vue';
import {PHOTO_CREDITS} from '@/constants';
import InfoDialog from '@/components/InfoDialog.vue';

const creditDialogOpen = ref(false);
</script>

<template>
  <div class="home__overlay text-body-1 text-grey-lighten-5">
    <h1 class="text-h3 text-center">{{ $t('home.title') }}</h1>
    <p>
      {{ $t('home.p1') }}
    </p>
    <p>
      {{ $t('home.p2') }}
    </p>
    <p>
      {{ $t('home.p3') }}
    </p>
    <p>
      <v-icon icon="mdi-github" />
      <a class="text-grey-lighten-5 ml-2" href="https://www.github.com/ajuvonen/getfit">GitHub</a>
    </p>
    <v-btn variant="text" size="x-small" class="home__photo-credit" @click="creditDialogOpen = true">
      {{ $t('home.credits') }}
    </v-btn>
    <InfoDialog
      :show="creditDialogOpen"
      :title="$t('home.credits')"
      @close="creditDialogOpen = false"
    >
      <template #content>
        <ul>
          <li v-for="{name, link} in PHOTO_CREDITS" :key="name">
            <a :href="link" noreferrer noopener>{{ name }}</a>
          </li>
        </ul>
      </template>
    </InfoDialog>
  </div>
</template>
<style lang="scss" scoped>
.home__overlay {
  position: absolute;
  inset: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
}

.home__photo-credit {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

p {
  margin-top: 1rem;
}

ul {
  list-style-type: none;

  a {
    color: inherit;
  }
}
</style>
