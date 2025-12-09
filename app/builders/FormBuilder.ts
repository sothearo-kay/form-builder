import type { Field } from "./types";
import FormRenderer from "./FormRenderer.vue";

export default class FormBuilder {
  private fields: Field[] = [];

  addField(field: Field): this {
    this.fields.push(field);
    return this;
  }

  build() {
    const fields = this.fields;

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
              fields,
              initialValues: props.initialValues,
              onSubmit: (data: any) => emit("submit", data),
            },
            slots,
          );
      },
    });
  }
}
