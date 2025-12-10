<script setup lang="ts" generic="Data extends Record<string, any>">
import type { FormSubmitEvent } from "@nuxt/ui";
import type * as z from "zod";
import type { FieldOrRow } from "./types";
import FormField from "./FormField.vue";
import { buildInitialState, buildNestedSchema, isRow, isSection } from "./helpers";

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

const schema = computed(() => buildNestedSchema(props.items));

type Schema = z.infer<(typeof schema)["value"]>;

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
    <template v-for="(item, index) in items" :key="index">
      <div v-if="isSection(item)" class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold">
            {{ item.label }}
          </h3>
          <p v-if="item.description" class="text-sm text-gray-600">
            {{ item.description }}
          </p>
        </div>

        <div class="space-y-4">
          <template v-for="(sectionItem, idx) in item.items" :key="idx">
            <div
              v-if="isRow(sectionItem)"
              class="grid grid-cols-[repeat(var(--cols),1fr)] gap-4"
              :style="{ '--cols': sectionItem.fields.length }"
            >
              <FormField
                v-for="field in sectionItem.fields"
                :key="field.name"
                v-model="state[item.name][field.name]"
                :field="field"
                :path="`${item.name}.${field.name}`"
              />
            </div>

            <FormField
              v-else-if="!isSection(sectionItem)"
              v-model="state[item.name][sectionItem.name]"
              :field="sectionItem"
              :path="`${item.name}.${sectionItem.name}`"
            />
          </template>
        </div>
      </div>

      <div
        v-else-if="isRow(item)"
        class="grid grid-cols-[repeat(var(--cols),1fr)] gap-4"
        :style="{ '--cols': item.fields.length }"
      >
        <FormField
          v-for="field in item.fields"
          :key="field.name"
          v-model="state[field.name]"
          :field="field"
        />
      </div>

      <FormField
        v-else
        v-model="state[item.name]"
        :field="item"
      />
    </template>

    <slot name="actions" :state="state">
      <UButton type="submit">
        Submit
      </UButton>
    </slot>
  </UForm>
</template>
