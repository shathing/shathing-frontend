"use client";

import { authApi } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
    onMutate: () => setSent(true),
    onError: () => {
      setSent(false);
      toast.warning(t("fail-send-email"));
    },
  });

  const handleSubmit = (data: SignInFormValues) => sendAuthEmail(data);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Field>
          {sent ? (
            <CardDescription>{t("success-send-email")}</CardDescription>
          ) : (
            <>
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
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Button>{t("continue-email")}</Button>
            </>
          )}
        </Field>
        <Field>
          <Button variant="outline" asChild>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`}>{t("continue-google")}</Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
