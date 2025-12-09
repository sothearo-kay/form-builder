import type { Field, FieldOrRow } from "./types";
import FormRenderer from "./FormRenderer.vue";

export default class FormBuilder {
  private items: FieldOrRow[] = [];

  addField(field: Field): this {
    this.items.push(field);
    return this;
  }

  addRow(fields: Field[]): this {
    this.items.push({
      type: "row",
      fields,
    });
    return this;
  }

  build() {
    const items = this.items;

    return defineComponent({
      name: "DynamicForm",
      props: {
        initialValues: {
          type: Object,
          default: () => ({}),
        },
      },
      emits: ["submit"],
      setup(props, { emit, slots }) {
        return () =>
          h(
            FormRenderer,
            {
              items,
              initialValues: props.initialValues,
              onSubmit: (data: any) => emit("submit", data),
            },
            slots,
          );
      },
    });
  }
}
