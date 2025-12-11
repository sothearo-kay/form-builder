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

export interface SectionOptions {
  name: string;
  label?: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface FieldSection {
  type: "section";
  name: string;
  label?: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  items: FieldOrRow[];
}

export interface VariantOption {
  value: string;
  label: string;
}

export interface FieldVariant {
  type: "variant";
  name: string;
  label?: string;
  defaultValue: string;
  options: VariantOption[];
  variants: Record<string, FieldOrRow[]>;
}

export interface FieldColumns {
  type: "columns";
  spans: (number | string)[];
  columns: FieldOrRow[][];
}

export type FieldOrRow = Field | FieldRow | FieldSection | FieldVariant | FieldColumns;
