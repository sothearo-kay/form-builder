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

| Method                        | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| `addField(field)`             | Adds a single field to the form, stacked vertically          |
| `addRow(fields[])`            | Adds multiple fields in a horizontal row (grid layout)       |
| `addColumns(spans, callback)` | Creates custom grid layouts with flexible column widths      |
| `addSection(options, callback)` | Adds a collapsible section to organize related fields      |
| `addVariant(options)`         | Adds variant switching (e.g., Person vs Company forms)       |
| `build()`                     | Finalizes and returns the form component                     |

## Sections

Organize your form into collapsible sections:

```ts
const MyForm = new FormBuilder()
  .addSection(
    {
      name: "personal",
      label: "Personal Information",
      collapsible: true,
    },
    (section) => {
      section.addRow([
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
      ]);
    }
  )
  .build();
```

## Columns

Create custom grid layouts with flexible column widths using CSS grid:

```ts
const MyForm = new FormBuilder()
  .addSection(
    { name: "profile", label: "Profile" },
    (section) => {
      // Avatar on left (110px), form fields on right (remaining space)
      section.addColumns(["110px", "1fr"], (builders) => {
        // First column (110px) - Avatar
        builders[0]!.addField({
          component: "UFileUpload",
          name: "avatar",
          label: "Profile Picture",
          required: true,
          props: {
            accept: "image/*",
            multiple: false,
          },
        });

        // Second column (1fr) - Form fields
        builders[1]!.addRow([
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
        ]);
      });
    }
  )
  .build();
```

**Column Sizing:**
- **Numbers**: Converted to `fr` units (e.g., `3` → `3fr`)
- **Strings**: Used directly (e.g., `"110px"`, `"1fr"`, `"auto"`, `"minmax(100px, 1fr)"`)
- **Index Mapping**: `builders[i]` corresponds to `spans[i]`

**Examples:**
```ts
// Equal width columns
addColumns([1, 1], (builders) => { ... })

// Fixed sidebar + flexible content
addColumns(["200px", "1fr"], (builders) => { ... })

// Three columns with different widths
addColumns([2, 1, 1], (builders) => { ... })

// Mixed units
addColumns(["auto", "1fr", "200px"], (builders) => { ... })
```

## Variants

Create forms that switch between different structures based on user selection:

```ts
const MyForm = new FormBuilder()
  .addSection(
    {
      name: "applicant",
      label: "Applicant Information",
      collapsible: true,
    },
    (section) => {
      section.addVariant({
        name: "type",
        defaultValue: "person",
        options: [
          { value: "person", label: "Person" },
          { value: "company", label: "Company" },
        ],
        variants: {
          person: (builder) => {
            builder.addSection(
              { name: "person", collapsible: false },
              (section) => {
                section.addField({
                  component: "UInput",
                  name: "firstName",
                  label: "First Name",
                  required: true,
                  validation: z.string().min(2),
                });
              }
            );
          },
          company: (builder) => {
            builder.addSection(
              { name: "company", collapsible: false },
              (section) => {
                section.addField({
                  component: "UInput",
                  name: "companyName",
                  label: "Company Name",
                  required: true,
                  validation: z.string().min(2),
                });
              }
            );
          },
        },
      });
    }
  )
  .build();
```

**Key Features:**
- **Conditional Validation**: Only validates fields in the selected variant
- **Data Persistence**: Switching between variants preserves all data
- **Reactive Schema**: Validation schema updates automatically when variant changes

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
