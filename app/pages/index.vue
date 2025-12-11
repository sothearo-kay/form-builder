<script setup lang="ts">
import { z } from "zod";
import { DynamicWizard, FormBuilder, FormWizardBuilder } from "@/builders";

const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?$/;

const AccountDetailsStep = new FormBuilder()
  .addRow([
    {
      component: "UInput",
      name: "username",
      label: "Username",
      placeholder: "John Doe",
      required: true,
      validation: z.string().min(3, "Username must be at least 3 characters"),
    },
    {
      component: "UInput",
      name: "email",
      label: "Email",
      placeholder: "john.doe@example.com",
      required: true,
      validation: z.string().regex(emailRegex, "Please enter a valid email"),
    },
  ])
  .addRow([
    {
      component: "UInput",
      name: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      validation: z.string().min(6, "Password must be at least 6 characters"),
    },
    {
      component: "UInput",
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm Password",
      type: "password",
      required: true,
      validation: z.string().min(6, "Please confirm your password"),
    },
  ])
  .addField({
    component: "UInput",
    name: "profileLink",
    label: "Profile Link",
    placeholder: "https://example.com",
    validation: z.string().regex(urlRegex, "Please enter a valid URL"),
  })
  .build();

const PersonalInfoStep = new FormBuilder()
  .addRow([
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
  ])
  .addRow([
    {
      component: "UInput",
      name: "mobile",
      label: "Mobile",
      placeholder: "+1 (555) 123-4567",
      required: true,
      validation: z.string().min(10, "Please enter a valid mobile number"),
    },
    {
      component: "UInput",
      name: "pincode",
      label: "Pincode",
      placeholder: "Postal Code",
      required: true,
      validation: z.string().min(5, "Please enter a valid pincode"),
    },
  ])
  .addField({
    component: "UInput",
    name: "address",
    label: "Address",
    placeholder: "123 Main St",
    required: true,
    validation: z.string().min(5, "Address must be at least 5 characters"),
  })
  .addField({
    component: "UInput",
    name: "landmark",
    label: "Landmark",
    placeholder: "Near Central Park, New York",
    validation: z.string().optional(),
  })
  .addRow([
    {
      component: "UInput",
      name: "city",
      label: "City",
      placeholder: "New York",
      required: true,
      validation: z.string().min(2, "City must be at least 2 characters"),
    },
    {
      component: "UInput",
      name: "state",
      label: "State",
      placeholder: "NY",
      required: true,
      validation: z.string().min(2, "State must be at least 2 characters"),
    },
  ])
  .build();

const BillingStep = new FormBuilder()
  .addField({
    component: "UInput",
    name: "cardNumber",
    label: "Card Number",
    placeholder: "1234 5678 9012 3456",
    required: true,
    validation: z.string().min(16, "Please enter a valid card number"),
  })
  .addRow([
    {
      component: "UInput",
      name: "nameOnCard",
      label: "Name on Card",
      placeholder: "John Doe",
      required: true,
      validation: z.string().min(3, "Name must be at least 3 characters"),
    },
    {
      component: "UInput",
      name: "expiryDate",
      label: "Expiry Date",
      placeholder: "MM/YY",
      required: true,
      validation: z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
    },
    {
      component: "UInput",
      name: "cvc",
      label: "CVC",
      placeholder: "123",
      required: true,
      validation: z.string().length(3, "CVC must be 3 digits"),
    },
  ])
  .build();

const { steps } = new FormWizardBuilder()
  .addStep("Account Details", AccountDetailsStep, {
    name: "account-details",
    description: "Setup Account Details",
  })
  .addStep("Personal Information", PersonalInfoStep, {
    name: "personal-information",
    description: "Add Personal Info",
  })
  .addStep("Billing", BillingStep, {
    name: "billing",
    description: "Payment Details",
  })
  .build();

const toast = useToast();

function handleFinish(data: Record<string, any>) {
  console.log("Wizard completed with data:", data);

  toast.add({
    title: "Success!",
    description: "Your account has been created successfully.",
    color: "success",
  });
}

function handleStepSubmit({ step, stepName, data }: { step: number; stepName: string; data: any }) {
  console.log(`Step ${step} (${stepName}) submitted:`, data);
}
</script>

<template>
  <UContainer class="max-w-6xl py-16">
    <DynamicWizard
      :steps="steps"
      :linear="true"
      @finish="handleFinish"
      @step-submit="handleStepSubmit"
    >
      <template #actions="{ goNext, goPrev, isFirstStep, isLastStep }">
        <div class="flex justify-between">
          <UButton
            :disabled="isFirstStep"
            color="neutral"
            variant="outline"
            @click="goPrev"
          >
            Previous
          </UButton>

          <UButton
            v-if="!isLastStep"
            color="neutral"
            @click="goNext"
          >
            Next
          </UButton>

          <UButton
            v-else
            color="neutral"
            @click="goNext"
          >
            Finish
          </UButton>
        </div>
      </template>
    </DynamicWizard>
  </UContainer>
</template>
