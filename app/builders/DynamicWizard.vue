<script setup lang="ts">
import type { StepConfig } from "./FormWizardBuilder";

interface Props {
  steps: StepConfig[];
  initialValues?: Record<string, any>;
  linear?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
  linear: true,
});

const emit = defineEmits<{
  finish: [data: Record<string, any>];
  stepChange: [payload: { from: number; to: number; data: Record<string, any> }];
  stepSubmit: [payload: { step: number; stepName: string; data: any }];
}>();

const currentStep = ref(0);
const stepData = ref<Record<number, any>>({});
const stepRefs = ref<any[]>([]);

const currentStepConfig = computed(() => props.steps[currentStep.value]);
const isFirstStep = computed(() => currentStep.value === 0);
const isLastStep = computed(() => currentStep.value === props.steps.length - 1);

const stepperItems = computed(() =>
  props.steps.map(step => ({
    label: step.label,
    description: step.description,
  })),
);

const allData = computed(() =>
  Object.values(stepData.value).reduce(
    (acc, data) => ({ ...acc, ...data }),
    { ...props.initialValues },
  ),
);

function setStepRef(el: any, index: number) {
  if (el) {
    stepRefs.value[index] = el;
  }
}

function handleStepSubmit(data: any) {
  if (!currentStepConfig.value)
    return;

  stepData.value[currentStep.value] = data;

  emit("stepSubmit", {
    step: currentStep.value,
    stepName: currentStepConfig.value.name,
    data,
  });

  if (isLastStep.value) {
    emit("finish", allData.value);
  }
  else {
    const fromStep = currentStep.value;
    currentStep.value++;
    emit("stepChange", {
      from: fromStep,
      to: currentStep.value,
      data: allData.value,
    });
  }
}

function goNext() {
  const currentRef = stepRefs.value[currentStep.value];
  if (currentRef?.submit) {
    currentRef.submit();
  }
}

function goPrev() {
  if (!isFirstStep.value) {
    const fromStep = currentStep.value;
    currentStep.value--;
    emit("stepChange", {
      from: fromStep,
      to: currentStep.value,
      data: allData.value,
    });
  }
}

function onStepperClick(rawValue: string | number | undefined) {
  if (rawValue === undefined)
    return;

  const newStep = Number(rawValue);
  const oldStep = currentStep.value;

  if (props.linear && newStep > oldStep) {
    goNext();
  }
  else if (newStep < oldStep) {
    currentStep.value = newStep;
    emit("stepChange", {
      from: currentStep.value,
      to: newStep,
      data: allData.value,
    });
  }
}

const navProps = computed(() => ({
  isFirstStep: isFirstStep.value,
  isLastStep: isLastStep.value,
  goNext,
  goPrev,
}));
</script>

<template>
  <div class="space-y-8">
    <UStepper
      :model-value="currentStep"
      :items="stepperItems"
      color="neutral"
      @update:model-value="onStepperClick"
    />

    <component
      :is="currentStepConfig?.component"
      :ref="(el: any) => setStepRef(el, currentStep)"
      :initial-values="allData"
      @submit="handleStepSubmit"
    />

    <slot name="actions" v-bind="navProps" />
  </div>
</template>
