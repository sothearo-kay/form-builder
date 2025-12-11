<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date";
import MonthYearCalendar from "./MonthYearCalendar.vue";

interface Props {
  placeholder?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select a date",
  error: false,
});

const stringValue = defineModel<string>();

const isOpen = ref(false);

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const dateValue = computed<DateValue | undefined>({
  get() {
    if (!stringValue.value)
      return undefined;
    try {
      return parseDate(stringValue.value);
    }
    catch {
      return undefined;
    }
  },
  set(value: DateValue | undefined) {
    if (value) {
      stringValue.value = value.toString();
    }
    else {
      stringValue.value = undefined;
    }
  },
});

const displayValue = computed(() => {
  if (!dateValue.value)
    return props.placeholder;
  return df.format(dateValue.value.toDate(getLocalTimeZone()));
});

const calendarPlaceholder = shallowRef(
  dateValue.value || new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1),
);

const minValue = shallowRef(props.minValue);
const maxValue = shallowRef(props.maxValue);

watch(dateValue, (newValue) => {
  if (newValue) {
    calendarPlaceholder.value = newValue;
  }
});
</script>

<template>
  <UPopover v-model:open="isOpen">
    <UButton
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
      block
      :class="{
        'ring-red-500 bg-red-50 hover:bg-red-100 text-red-600 dark:ring-red-400 dark:bg-red-950/50 dark:hover:bg-red-950/70 dark:text-red-400': error
      }"
      :ui="error ? { icon: { base: 'text-red-600 dark:text-red-400' } } : {}"
    >
      {{ displayValue }}
    </UButton>

    <template #content>
      <div class="p-2">
        <UCalendar
          v-model="dateValue"
          v-model:placeholder="calendarPlaceholder"
          :min-value="minValue"
          :max-value="maxValue"
          color="neutral"
          @update:model-value="isOpen = false"
        >
          <template #heading="{ value }">
            <MonthYearCalendar
              v-model:placeholder="calendarPlaceholder"
              :min-value="minValue"
              :max-value="maxValue"
            >
              {{ value }}
            </MonthYearCalendar>
          </template>
        </UCalendar>
      </div>
    </template>
  </UPopover>
</template>
