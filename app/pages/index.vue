<script setup lang="ts">
import { z } from "zod";
import { FormBuilder } from "@/builders";

const ContactForm = new FormBuilder()
  .addField({
    component: "UInput",
    name: "name",
    label: "Full Name",
    placeholder: "John Doe",
    required: true,
    validation: z.string().min(2, "Name must be at least 2 characters"),
  })
  .addField({
    component: "UInput",
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    required: true,
    validation: z.string().email("Please enter a valid email"),
  })
  .addField({
    component: "USelect",
    name: "subject",
    label: "Subject",
    placeholder: "Select subject",
    required: true,
    props: {
      items: [
        { label: "General Inquiry", value: "general" },
        { label: "Support", value: "support" },
        { label: "Sales", value: "sales" },
      ],
    },
    validation: z.string(),
  })
  .addField({
    component: "UTextarea",
    name: "message",
    label: "Message",
    placeholder: "Your message here...",
    required: true,
    props: {
      rows: 4,
    },
    validation: z.string().min(10, "Message must be at least 10 characters"),
  })
  .build();

const toast = useToast();

async function handleSubmit(data: any) {
  console.warn("Form submitted:", data);

  await new Promise(resolve => setTimeout(resolve, 1000));

  toast.add({
    title: "Success!",
    description: "Your message has been sent.",
  });
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <UContainer class="py-16">
      <div class="mx-auto max-w-2xl">
        <h1 class="mb-2 text-4xl font-bold">
          Form Builder
        </h1>
        <p class="mb-12 text-gray-400">
          Type-safe forms with Zod validation and Nuxt UI
        </p>

        <ContactForm @submit="handleSubmit">
          <template #actions="{ state }">
            <div class="flex justify-end gap-4">
              <UButton type="button" @click="console.log(state)">
                Log State
              </UButton>
              <UButton type="submit">
                Submit
              </UButton>
            </div>
          </template>
        </ContactForm>
      </div>
    </UContainer>
  </div>
</template>
