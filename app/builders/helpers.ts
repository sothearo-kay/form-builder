import type { Field, FieldOrRow, FieldRow, FieldSection } from "./types";
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

function extractFields(item: FieldOrRow): Field[] {
  if (isSection(item))
    return [];
  return isRow(item) ? item.fields : [item];
}

const getSections = (items: FieldOrRow[]) => items.filter(isSection);

function getAllFields(items: FieldOrRow[]) {
  return items.filter(item => !isSection(item)).flatMap(extractFields);
}

export function flattenFields(items: FieldOrRow[]): Field[] {
  return items.flatMap(item =>
    isSection(item) ? flattenFields(item.items) : extractFields(item),
  );
}

export function buildNestedSchema(items: FieldOrRow[]): z.ZodObject<any> {
  const shape: Record<string, any> = {};

  for (const section of getSections(items)) {
    const sectionSchema = buildNestedSchema(section.items);
    if (Object.keys(sectionSchema.shape).length > 0) {
      shape[section.name] = sectionSchema;
    }
  }

  for (const field of getAllFields(items)) {
    if (field.validation) {
      shape[field.name] = field.validation;
    }
  }

  return z.object(shape);
}

export function buildInitialState(
  items: FieldOrRow[],
  initialValues: Record<string, any> = {},
): any {
  const state: Record<string, any> = {};

  for (const section of getSections(items)) {
    state[section.name] = buildInitialState(
      section.items,
      initialValues[section.name] ?? {},
    );
  }

  for (const field of getAllFields(items)) {
    state[field.name] = initialValues[field.name] ?? "";
  }

  return state;
}
