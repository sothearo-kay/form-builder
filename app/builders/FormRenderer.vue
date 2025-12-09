<script setup lang="ts" generic="Data extends Record<string, any>">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Field } from "./types";
import { z } from "zod";
import { componentMap } from "./helpers";

interface Props {
  fields: Field[];
  initialValues?: Data;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: Data];
}>();

const state = reactive<Data>(
  props.fields.reduce((acc, field) => {
    const initialValues = props.initialValues ?? ({} as Data);
    acc[field.name] = initialValues[field.name] ?? "";
    return acc;
  }, {} as Record<string, any>) as Data,
);

const schema = computed(() => {
  const shape: Record<string, any> = {};

  props.fields.forEach((field) => {
    if (field.validation) {
      shape[field.name] = field.validation;
    }
  });

  return z.object(shape);
});

type Schema = z.infer<(typeof schema)["value"]>;

function getComponent(field: Field) {
  if (typeof field.component === "string") {
    return componentMap[field.component] || field.component;
  }
  return field.component;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", event.data as Data);
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      v-for="field in fields"
      :key="field.name"
      :name="field.name"
      :label="field.label"
      :description="field.description"
      :required="field.required"
    >
      <component
        :is="getComponent(field)"
        v-model="state[field.name]"
        :placeholder="field.placeholder"
        :type="field.type"
        v-bind="{ ...field.props, ...field.attrs }"
        class="w-full"
      />
    </UFormField>

    <slot name="actions" :state="state">
      <UButton type="submit">
        Submit
      </UButton>
    </slot>
  </UForm>
</template>
