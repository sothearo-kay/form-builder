import type { Component } from "vue";

export interface StepConfig {
  name: string;
  label: string;
  description?: string;
  component: Component;
}

export default class FormWizardBuilder {
  private steps: StepConfig[] = [];

  addStep(
    label: string,
    component: Component,
    options?: {
      name?: string;
      description?: string;
    },
  ): this {
    const name = options?.name || this.generateStepName(label);

    this.steps.push({
      name,
      label,
      description: options?.description,
      component,
    });

    return this;
  }

  private generateStepName(label: string): string {
    return label.toLowerCase().replace(/\s+/g, "-");
  }

  build() {
    return {
      steps: this.steps,
    };
  }
}
