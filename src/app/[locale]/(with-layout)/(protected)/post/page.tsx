"use client";

import { shareApi } from "@/apis/share";
import { fileApi } from "@/apis/file";
import Category from "@/components/Category";
import Location from "@/components/Location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShareItemPostStore } from "@/stores/useShareItemPostStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, MapPin, Tags } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TITLE_MAX_LENGTH = 80;
const CONTENT_MAX_LENGTH = 1200;
const PHOTO_MAX_COUNT = 10;

export default function Page() {
  const t = useTranslations("SharePost");
  const router = useRouter();
  const selectedLocation = useShareItemPostStore((state) => state.selectedLocation);
  const selectedCategory = useShareItemPostStore((state) => state.selectedCategory);

  const postFormSchema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t("validation.title-required"))
      .max(TITLE_MAX_LENGTH, t("validation.title-max", { max: TITLE_MAX_LENGTH.toString() })),
    content: z
      .string()
      .trim()
      .min(1, t("validation.content-required"))
      .max(CONTENT_MAX_LENGTH, t("validation.content-max", { max: CONTENT_MAX_LENGTH.toString() })),
    photoUrls: z
      .array(z.custom<File>((value) => value instanceof File, t("validation.photo-invalid")))
      .min(1, t("validation.photo-required"))
      .max(PHOTO_MAX_COUNT, t("validation.photo-max", { max: PHOTO_MAX_COUNT.toString() })),
    locationCode: z.string().min(1, t("validation.location-required")),
    categoryId: z.string().min(1, t("validation.category-required")),
  });
  type PostFormValues = z.infer<typeof postFormSchema>;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      photoUrls: [],
      locationCode: selectedLocation?.code ?? "",
      categoryId: selectedCategory?.id.toString() ?? "",
    },
  });

  useEffect(() => {
    form.setValue("locationCode", selectedLocation?.code ?? "", {
      shouldValidate: form.formState.submitCount > 0,
    });
  }, [selectedLocation, form]);

  useEffect(() => {
    form.setValue("categoryId", selectedCategory?.id.toString() ?? "", {
      shouldValidate: form.formState.submitCount > 0,
    });
  }, [selectedCategory, form]);

  const handleSubmit = async (values: PostFormValues) => {
    try {
      const photoUrls = await Promise.all(
        values.photoUrls.map(async (file) => {
          const { data } = await fileApi.getUploadPresignedUrl({
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
          });
          await fileApi.uploadWithPresignedUrl(data.uploadUrl, file);
          return data.key;
        }),
      );

      await shareApi.post({
        title: values.title,
        content: values.content,
        photoUrls,
        legalDongCode: values.locationCode,
        categoryId: Number(values.categoryId),
      });
      toast.success(t("toast.success"));
      router.push("/share");
    } catch {
      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-6 md:py-8">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b bg-linear-to-r from-muted/60 to-background py-5">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6 py-6">
            <section className="space-y-2">
              <FieldLabel htmlFor="post-title">{t("fields.title.label")}</FieldLabel>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="post-title"
                      maxLength={TITLE_MAX_LENGTH}
                      placeholder={t("fields.title.placeholder")}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
            </section>

            <section className="space-y-2">
              <FieldLabel htmlFor="post-content">{t("fields.content.label")}</FieldLabel>
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      className="min-h-44"
                      id="post-content"
                      maxLength={CONTENT_MAX_LENGTH}
                      placeholder={t("fields.content.placeholder")}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
              <p className="text-muted-foreground text-xs">
                {t("fields.content.max-hint", { max: CONTENT_MAX_LENGTH.toString() })}
              </p>
            </section>

            <section className="space-y-2">
              <FieldLabel htmlFor="post-images">{t("fields.photo.label")}</FieldLabel>
              <Controller
                control={form.control}
                name="photoUrls"
                render={({ field, fieldState }) => (
                  <>
                    <label
                      className="hover:bg-muted/70 flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors"
                      htmlFor="post-images"
                    >
                      <ImagePlus className="text-muted-foreground size-5" />
                      <p className="text-muted-foreground text-sm">
                        {field.value.length > 0
                          ? t("fields.photo.selected-count", { count: field.value.length.toString() })
                          : t("fields.photo.placeholder")}
                      </p>
                    </label>
                    <Input
                      accept="image/*"
                      className="hidden"
                      id="post-images"
                      multiple
                      type="file"
                      onChange={(event) => {
                        const nextFiles = Array.from(event.target.files ?? []);
                        field.onChange(nextFiles);
                      }}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-2 items-center">
                <FieldLabel className="inline-flex items-center gap-1">
                  <MapPin className="size-4" />
                  {t("fields.location.label")}
                </FieldLabel>
                <Location />
                {form.formState.errors.locationCode && <FieldError errors={[form.formState.errors.locationCode]} />}
              </div>
              <div className="flex gap-2 items-center">
                <FieldLabel className="inline-flex items-center gap-1">
                  <Tags className="size-4" />
                  {t("fields.category.label")}
                </FieldLabel>
                <Category />
                {form.formState.errors.categoryId && <FieldError errors={[form.formState.errors.categoryId]} />}
              </div>
            </section>
          </CardContent>

          <CardFooter className="border-t py-4">
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  router.push("/share");
                }}
              >
                {t("actions.cancel")}
              </Button>
              <Button type="submit">{t("actions.submit")}</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
