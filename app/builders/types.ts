import type { Component } from "vue";
import type { ZodType } from "zod";

export interface Field {
  component: Component | string;
  name: string;
  type?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  props?: Record<string, any>;
  attrs?: Record<string, any>;
  validation?: ZodType;
}

export interface FieldRow {
  type: "row";
  fields: Field[];
}

export type FieldOrRow = Field | FieldRow;
