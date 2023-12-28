<script setup lang="ts"></script>

<template>
  <div class="home__overlay">
    <h1 class="text-h3 text-center text-white">{{ $t('home.title') }}</h1>
    <p class="text-body-1 text-white">
      {{ $t('home.p1') }}
    </p>
    <p class="text-body-1 text-white">
      {{ $t('home.p2') }}
    </p>
    <p class="text-body-1 text-white">
      {{ $t('home.p3') }}
    </p>
    <p class="text-white">
      <v-icon icon="mdi-github" />
      <a class="text-white ml-2" href="https://www.github.com/ajuvonen/getfit">GitHub</a>
    </p>
    <i18n-t keypath="home.credit" tag="p" class="text-caption text-white home__photo-credit">
      <template #image>
        <a
          class="text-white"
          href="https://www.pexels.com/photo/blank-paper-on-a-clipboard-8155155/"
          >Alesia Kozik</a
        >
      </template>
    </i18n-t>
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
</style>
