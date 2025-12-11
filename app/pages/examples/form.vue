<script setup lang="ts">
import { z } from "zod";
import { FormBuilder } from "@/builders";

const toast = useToast();

const DynamicForm = new FormBuilder()
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
                section.addColumns(["110px", "1fr"], (builders) => {
                  // Left column: form fields in 2 columns
                  builders[1]!.addRow([
                    {
                      component: "UInput",
                      name: "firstName",
                      label: "First Name",
                      placeholder: "John",
                      required: true,
                      validation: z.string().min(2, "First name must be at least 2 characters"),
                    },
                    {
                      component: "UInput",
                      name: "lastName",
                      label: "Last Name",
                      placeholder: "Doe",
                      required: true,
                      validation: z.string().min(2, "Last name must be at least 2 characters"),
                    },
                  ]);

                  builders[1]!.addRow([
                    {
                      component: "UInput",
                      name: "email",
                      type: "email",
                      label: "Email",
                      placeholder: "john@example.com",
                      validation: z.string().email().optional(),
                    },
                    {
                      component: "UInput",
                      name: "phone",
                      label: "Phone",
                      placeholder: "+1 234 567 8900",
                      validation: z.string().optional(),
                    },
                  ]);

                  // Right column: avatar
                  builders[0]!.addField({
                    component: "UFileUpload",
                    name: "avatar",
                    label: "Profile Picture",
                    required: true,
                    props: {
                      accept: "image/*",
                      multiple: false,
                    },
                    validation: z.instanceof(File, { message: "Profile picture is required" }),
                  });
                });
              },
            );
          },
          company: (builder) => {
            builder.addSection(
              {
                name: "company",
                collapsible: false,
              },
              (section) => {
                section.addField({
                  component: "UInput",
                  name: "companyName",
                  label: "Company Name",
                  placeholder: "Acme Inc.",
                  required: true,
                  validation: z.string().min(2, "Company name must be at least 2 characters"),
                });

                section.addRow([
                  {
                    component: "UInput",
                    name: "taxId",
                    label: "Tax ID",
                    placeholder: "12-3456789",
                    validation: z.string().optional(),
                  },
                  {
                    component: "UInput",
                    name: "registrationNumber",
                    label: "Registration Number",
                    placeholder: "REG-123456",
                    validation: z.string().optional(),
                  },
                ]);

                section.addRow([
                  {
                    component: "UInput",
                    name: "email",
                    type: "email",
                    label: "Company Email",
                    placeholder: "info@acme.com",
                    validation: z.string().email().optional(),
                  },
                  {
                    component: "UInput",
                    name: "phone",
                    label: "Company Phone",
                    placeholder: "+1 234 567 8900",
                    validation: z.string().optional(),
                  },
                ]);
              },
            );
          },
        },
      });
    },
  )
  .addSection(
    {
      name: "address",
      label: "Address Information",
      collapsible: true,
    },
    (section) => {
      section.addRow([
        {
          component: "UInput",
          name: "street",
          label: "Street",
          placeholder: "123 Main St",
          required: true,
          validation: z.string().min(1, "Street is required"),
        },
        {
          component: "UInput",
          name: "city",
          label: "City",
          placeholder: "New York",
          required: true,
          validation: z.string().min(1, "City is required"),
        },
      ]);

      section.addRow([
        {
          component: "UInput",
          name: "state",
          label: "State",
          placeholder: "NY",
          required: true,
          validation: z.string().min(2, "State must be at least 2 characters"),
        },
        {
          component: "UInput",
          name: "zipCode",
          label: "Zip Code",
          placeholder: "10001",
          required: true,
          validation: z.string().min(5, "Zip code must be at least 5 characters"),
        },
      ]);
    },
  )
  .build();

const initialValues = ref<any>(undefined);

function handleSubmit(data: any) {
  console.log("Form submitted:", data);

  toast.add({
    title: "Success!",
    description: "Form submitted successfully.",
    color: "success",
  });
}

function loadTestData() {
  initialValues.value = {
    applicant: {
      type: "company",
      person: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      company: {
        companyName: "Acme Corporation",
        taxId: "12-3456789",
        registrationNumber: "REG-987654",
        email: "contact@acme.com",
        phone: "+1 555 123 4567",
      },
    },
    address: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  };
}
</script>

<template>
  <UContainer class="max-w-6xl py-16">
    <div class="mb-6 flex justify-end">
      <UButton color="neutral" variant="outline" @click="loadTestData">
        Load Test Data
      </UButton>
    </div>

    <DynamicForm :key="initialValues" :initial-values="initialValues" @submit="handleSubmit">
      <template #actions="{ state }">
        <div class="flex justify-between">
          <UButton type="button" color="neutral" variant="outline" @click="console.log(state)">
            Log State
          </UButton>

          <UButton type="submit" color="neutral">
            Submit
          </UButton>
        </div>
      </template>
    </DynamicForm>
  </UContainer>
</template>
