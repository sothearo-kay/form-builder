<script setup lang="ts">
import type { Field } from "./types";
import { componentMap } from "./helpers";

interface Props {
  field: Field;
  path?: string;
}

const props = defineProps<Props>();

const value = defineModel<any>();

const fieldName = computed(() => props.path || props.field.name);

function getComponent(field: Field) {
  if (typeof field.component === "string") {
    return componentMap[field.component] || field.component;
  }
  return field.component;
}
</script>

<template>
  <UFormField
    :name="fieldName"
    :label="field.label"
    :description="field.description"
    :required="field.required"
  >
    <component
      :is="getComponent(field)"
      v-model="value"
      v-bind="{ ...field.props, ...field.attrs }"
      :placeholder="field.placeholder"
      :type="field.type"
      color="neutral"
      class="w-full"
    />
  </UFormField>
</template>
