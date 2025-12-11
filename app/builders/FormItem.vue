<script setup lang="ts">
import type { FieldOrRow } from "./types";
import FormField from "./FormField.vue";
import { isColumns, isRow, isSection, isVariant } from "./helpers";

interface Props {
  items: FieldOrRow[];
  state: Record<string, any>;
  parentPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  parentPath: "",
});

function getCurrentState() {
  if (!props.parentPath)
    return props.state;

  const keys = props.parentPath.split(".");
  let obj = props.state;

  for (const key of keys) {
    if (obj && typeof obj === "object" && key in obj) {
      obj = obj[key];
    }
    else {
      return {};
    }
  }

  return obj;
}

function getPath(fieldName: string) {
  return props.parentPath ? `${props.parentPath}.${fieldName}` : fieldName;
}
</script>

<template>
  <template v-for="(item, index) in items" :key="index">
    <div v-if="isSection(item)" class="space-y-4" :class="{ 'mb-6': index < items.length - 1 }">
      <UCollapsible v-if="item.collapsible" default-open>
        <UButton
          :label="item.label"
          color="neutral"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          block
        />

        <template #content>
          <div class="space-y-4 pt-4">
            <p v-if="item.description" class="mb-4 text-sm text-neutral-600">
              {{ item.description }}
            </p>
            <FormItem
              :items="item.items"
              :state="state"
              :parent-path="getPath(item.name)"
            />
          </div>
        </template>
      </UCollapsible>

      <div v-else class="space-y-4">
        <div v-if="item.label || item.description" class="mb-4">
          <h3 v-if="item.label" class="text-lg font-semibold">
            {{ item.label }}
          </h3>
          <p v-if="item.description" class="text-sm text-neutral-600">
            {{ item.description }}
          </p>
        </div>

        <FormItem
          :items="item.items"
          :state="state"
          :parent-path="getPath(item.name)"
        />
      </div>
    </div>

    <div v-else-if="isVariant(item)" class="space-y-4">
      <div v-if="item.label" class="mb-4">
        <label class="text-sm font-medium text-neutral-700">{{ item.label }}</label>
      </div>

      <URadioGroup
        v-model="getCurrentState()[item.name]"
        color="neutral"
        variant="card"
        orientation="horizontal"
        :items="item.options.map(opt => ({ label: opt.label, value: opt.value }))"
        :ui="{ item: 'p-2.5' }"
      />

      <template v-for="(variantItems, variantKey) in item.variants" :key="variantKey">
        <div v-if="getCurrentState()[item.name] === variantKey" class="space-y-4">
          <FormItem
            :items="variantItems"
            :state="state"
            :parent-path="parentPath"
          />
        </div>
      </template>
    </div>

    <div
      v-else-if="isColumns(item)"
      class="grid gap-4"
      :style="{ gridTemplateColumns: item.spans.map(span => typeof span === 'number' ? `${span}fr` : span).join(' ') }"
    >
      <div v-for="(column, colIndex) in item.columns" :key="colIndex" class="flex flex-col gap-4">
        <FormItem
          :items="column"
          :state="state"
          :parent-path="parentPath"
        />
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
        v-model="getCurrentState()[field.name]"
        :field="field"
        :path="getPath(field.name)"
      />
    </div>

    <FormField
      v-else
      v-model="getCurrentState()[item.name]"
      :field="item"
      :path="getPath(item.name)"
    />
  </template>
</template>
