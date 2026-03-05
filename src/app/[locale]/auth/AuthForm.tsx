"use client";

import { authApi } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function AuthForm() {
  const t = useTranslations("Auth");

  const SignInformSchema = z.object({
    email: z.email(t("invalid-email")),
  });
  type SignInFormValues = z.infer<typeof SignInformSchema>;

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInformSchema),
    defaultValues: {
      email: "",
    },
  });

  const [sent, setSent] = useState(false);

  const { mutate: sendAuthEmail } = useMutation({
    mutationFn: (data: SignInFormValues) => authApi.sendAuthEmail(data),
    onMutate: () => {
      setSent(true);
      toast.success(t("success-send-email"));
    },
    onError: () => setSent(false),
  });

  const handleSubmit = (data: SignInFormValues) => sendAuthEmail(data);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                id="email"
                type="email"
                placeholder={t("placeholder")}
                disabled={sent}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button disabled={sent}>{t("continue-email")}</Button>
          {/* TODO: 구글 OAuth */}
          <Button variant="outline" type="button">
            {t("continue-google")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
