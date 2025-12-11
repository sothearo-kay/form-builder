<script setup lang="ts">
interface Props {
  error?: boolean;
}

withDefaults(defineProps<Props>(), {
  error: false,
});

const modelValue = defineModel<File | null>();
</script>

<template>
  <UFileUpload
    v-model="modelValue"
    v-bind="$attrs"
    :ui="{
      base: error ? 'border-red-500 dark:border-red-400' : '',
    }"
  />
</template>
