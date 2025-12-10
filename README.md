# Form Builder

Type-safe form builder with Zod validation and Nuxt UI.

```ts
const MyForm = new FormBuilder()
  .addField({
    component: "UInput", // Nuxt UI component
    name: "email", // Form field name
    type: "email", // Input type
    label: "Email Address", // Field label
    placeholder: "john@example.com", // Placeholder text
    required: true, // Mark as required
    validation: z.string().email(), // Zod validation schema
    props: {}, // Additional component props
  })
  .addRow([
    // Add fields in horizontal row
    {
      component: "UInput",
      name: "firstName",
      label: "First Name",
      validation: z.string().min(2),
    },
    {
      component: "UInput",
      name: "lastName",
      label: "Last Name",
      validation: z.string().min(2),
    },
  ])
  .build();
```

## Available Methods

| Method             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `addField(field)`  | Adds a single field to the form, stacked vertically    |
| `addRow(fields[])` | Adds multiple fields in a horizontal row (grid layout) |
| `build()`          | Finalizes and returns the form component               |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
