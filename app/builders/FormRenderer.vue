<script setup lang="ts" generic="Data extends Record<string, any>">
import type { FormSubmitEvent } from "@nuxt/ui";
import type * as z from "zod";
import type { FieldOrRow } from "./types";
import FormItem from "./FormItem.vue";
import { buildInitialState, buildNestedSchema } from "./helpers";

interface Props {
  items: FieldOrRow[];
  initialValues?: Data;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: Data];
}>();

const state = reactive<Data>(
  buildInitialState(props.items, props.initialValues ?? {}) as Data,
);

const schema = computed(() => buildNestedSchema(props.items, state));

type Schema = z.infer<(typeof schema)["value"]>;

const formRef = ref<any>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", event.data as Data);
}

function submit() {
  formRef.value?.submit();
}

defineExpose({
  submit,
});
</script>

<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <FormItem :items="items" :state="state" />
    <slot name="actions" :state="state" />
  </UForm>
</template>
