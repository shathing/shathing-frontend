"use client";

import { authApi } from "@/apis/auth";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SignInForm() {
  const t = useTranslations("Signin");
  const router = useRouter();

  const SignInformSchema = z.object({
    email: z.email(t("invalid-email")),
    password: z.string().min(1, t("input-password")),
  });
  type SignInFormValues = z.infer<typeof SignInformSchema>;

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: (data: SignInFormValues) => authApi.signIn(data),
    onSuccess: () => router.replace("/"),
    onError: () => {
      // TODO: 로그인 실패에 따른 처리
      // 아이디 및 비밀번호 틀림
      // toast.warning(t("fail-to-signin"), { description: t("incorrect-email-password") });
      // api error
      // toast.error(t("error-to-signin"), { description: t("try-again-later") });
    },
  });

  const handleSubmit = (data: SignInFormValues) => signIn(data);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input aria-invalid={fieldState.invalid} id="email" type="email" placeholder={t("email")} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                id="password"
                type="password"
                placeholder={t("password")}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <LoadingButton isLoading={isPending}>{t("title")}</LoadingButton>
          {/* TODO: 구글 로그인 */}
          <Button variant="outline" type="button">
            {t("login-with-google")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
