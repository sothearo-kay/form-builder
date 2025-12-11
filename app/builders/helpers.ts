import type {
  Field,
  FieldOrRow,
  FieldRow,
  FieldSection,
  FieldVariant,
} from "./types";
import {
  UCheckbox,
  UInput,
  UInputMenu,
  URadioGroup,
  USelect,
  USelectMenu,
  UTextarea,
} from "#components";
import { z } from "zod";

export const componentMap: Record<string, any> = {
  UInput,
  UInputMenu,
  UTextarea,
  USelect,
  USelectMenu,
  URadioGroup,
  UCheckbox,
};

export function isRow(item: FieldOrRow): item is FieldRow {
  return "type" in item && item.type === "row";
}

export function isSection(item: FieldOrRow): item is FieldSection {
  return "type" in item && item.type === "section";
}

export function isVariant(item: FieldOrRow): item is FieldVariant {
  return "type" in item && item.type === "variant";
}

function extractFields(item: FieldOrRow): Field[] {
  if (isSection(item) || isVariant(item))
    return [];
  if (isRow(item))
    return item.fields;
  return [item];
}

const getSections = (items: FieldOrRow[]) => items.filter(isSection);
const getVariants = (items: FieldOrRow[]) => items.filter(isVariant);

function getAllFields(items: FieldOrRow[]) {
  return items.filter(item => !isSection(item) && !isVariant(item)).flatMap(extractFields);
}

export function flattenFields(items: FieldOrRow[]): Field[] {
  return items.flatMap((item) => {
    if (isSection(item))
      return flattenFields(item.items);
    if (isVariant(item))
      return Object.values(item.variants).flatMap(flattenFields);
    return extractFields(item);
  });
}

export function buildNestedSchema(items: FieldOrRow[], state?: Record<string, any>): z.ZodObject<any> {
  const shape: Record<string, any> = {};

  getSections(items).forEach((section) => {
    const sectionState = state?.[section.name];
    const schema = buildNestedSchema(section.items, sectionState);

    if (Object.keys(schema.shape).length > 0) {
      shape[section.name] = schema;
    }
  });

  getVariants(items).forEach((variant) => {
    shape[variant.name] = z.string();

    const selectedVariant = state?.[variant.name] ?? variant.defaultValue;

    const variantItems = variant.variants[selectedVariant];
    if (variantItems) {
      const schema = buildNestedSchema(variantItems, state);
      Object.assign(shape, schema.shape);
    }
  });

  getAllFields(items).forEach((field) => {
    if (field.validation) {
      shape[field.name] = field.validation;
    }
  });

  return z.object(shape);
}

export function buildInitialState(
  items: FieldOrRow[],
  initialValues: Record<string, any> = {},
): any {
  const state: Record<string, any> = {};

  getSections(items).forEach((section) => {
    state[section.name] = buildInitialState(
      section.items,
      initialValues[section.name] ?? {},
    );
  });

  getVariants(items).forEach((variant) => {
    const selectedVariant = initialValues[variant.name] ?? variant.defaultValue;
    state[variant.name] = selectedVariant;

    // Initialize state for ALL variants, not just the selected one
    Object.entries(variant.variants).forEach(([key, variantItems]) => {
      const variantState = buildInitialState(variantItems, initialValues);
      Object.assign(state, variantState);
    });
  });

  getAllFields(items).forEach((field) => {
    state[field.name] = initialValues[field.name] ?? "";
  });

  return state;
}
