<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
  <UApp>
    <header class="sticky top-0 z-50 border-b border-dashed border-neutral-200 bg-white/75 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <UContainer class="flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <NuxtLink to="/">
            <h1 class="text-lg font-semibold">
              Form Builder
            </h1>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-1">
          <ClientOnly>
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
              color="neutral"
              variant="link"
              aria-label="Toggle dark mode"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
            />
            <template #fallback>
              <div class="h-8 w-8" />
            </template>
          </ClientOnly>
          <UButton
            to="https://github.com/sothearo-kay/form-builder"
            external
            target="_blank"
            icon="i-lucide-github"
            color="neutral"
            variant="link"
            aria-label="View on GitHub"
          />
        </div>
      </UContainer>
    </header>
    <NuxtPage />
  </UApp>
</template>
