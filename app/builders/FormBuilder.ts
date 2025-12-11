import type {
  Field,
  FieldOrRow,
  SectionOptions,
  VariantOption,
} from "./types";
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

  addColumns(
    spans: (number | string)[],
    callback: (builders: FormBuilder[]) => void,
  ): this {
    const builders = spans.map(() => new FormBuilder());
    callback(builders);

    this.items.push({
      type: "columns",
      spans,
      columns: builders.map(b => b.items),
    });

    return this;
  }

  addSection(
    options: SectionOptions & { name: string },
    callback: (builder: FormBuilder) => void,
  ): this {
    const sectionBuilder = new FormBuilder();
    callback(sectionBuilder);

    this.items.push({
      type: "section",
      name: options.name,
      label: options.label,
      description: options.description,
      collapsible: options.collapsible ?? false,
      defaultOpen: options.defaultOpen ?? true,
      items: sectionBuilder.items,
    });

    return this;
  }

  addVariant(options: {
    name: string;
    label?: string;
    defaultValue: string;
    options: VariantOption[];
    variants: Record<string, (builder: FormBuilder) => void>;
  }): this {
    const variants: Record<string, FieldOrRow[]> = {};

    for (const [key, callback] of Object.entries(options.variants)) {
      const variantBuilder = new FormBuilder();
      callback(variantBuilder);
      variants[key] = variantBuilder.items;
    }

    this.items.push({
      type: "variant",
      name: options.name,
      label: options.label,
      defaultValue: options.defaultValue,
      options: options.options,
      variants,
    });

    return this;
  }

  static fromJSON(json: FieldOrRow[]): FormBuilder {
    const builder = new FormBuilder();
    builder.items = json;
    return builder;
  }

  toJSON(): FieldOrRow[] {
    return this.items;
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
      setup(props, { emit, slots, expose }) {
        const formRendererRef = ref<any>(null);

        function submit() {
          formRendererRef.value?.submit();
        }

        expose({
          submit,
        });

        return () =>
          h(
            FormRenderer,
            {
              ref: formRendererRef,
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
