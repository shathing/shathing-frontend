"use client";

import { shareApi } from "@/apis/share";
import { fileApi } from "@/apis/file";
import Category from "@/components/Category";
import Region from "@/components/Region";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useShareItemPostStore } from "@/stores/useShareItemPostStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, MapPin, Tags } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const TITLE_MAX_LENGTH = 80;
const CONTENT_MAX_LENGTH = 1200;
const PHOTO_MAX_COUNT = 10;

export default function Page() {
  const t = useTranslations("SharePost");
  const router = useRouter();
  const searchParams = useSearchParams();
  const editItemIdParam = searchParams.get("id");
  const editItemId = editItemIdParam ? Number(editItemIdParam) : NaN;
  const isEditMode = Number.isFinite(editItemId) && editItemId > 0;
  const selectedRegion = useShareItemPostStore((state) => state.selectedRegion);
  const selectedCategory = useShareItemPostStore((state) => state.selectedCategory);
  const setSelectedRegion = useShareItemPostStore((state) => state.setSelectedRegion);
  const setSelectedCategory = useShareItemPostStore((state) => state.setSelectedCategory);

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
      .array(z.custom<File | string>((value) => value instanceof File || typeof value === "string", t("validation.photo-invalid")))
      .min(1, t("validation.photo-required"))
      .max(PHOTO_MAX_COUNT, t("validation.photo-max", { max: PHOTO_MAX_COUNT.toString() })),
    regionId: z.string().min(1, t("validation.location-required")),
    categoryId: z.string().min(1, t("validation.category-required")),
  });
  type PostFormValues = z.infer<typeof postFormSchema>;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      photoUrls: [],
      regionId: selectedRegion?.id.toString() ?? "",
      categoryId: selectedCategory?.id.toString() ?? "",
    },
  });

  const {
    data: editingItem,
    isPending: isPendingEditingItem,
    isError: isErrorEditingItem,
  } = useQuery({
    queryKey: ["shareApi.getById", editItemId],
    enabled: isEditMode,
    queryFn: async () => {
      const { data } = await shareApi.getById(editItemId);
      return data;
    },
  });

  useEffect(() => {
    if (!editingItem) return;
    form.reset({
      title: editingItem.title,
      content: editingItem.content,
      photoUrls: editingItem.photoUrls,
      regionId: editingItem.region.id.toString(),
      categoryId: editingItem.category.id.toString(),
    });
    setSelectedRegion(editingItem.region);
    setSelectedCategory(editingItem.category);
  }, [editingItem, form, setSelectedRegion, setSelectedCategory]);

  useEffect(() => {
    form.setValue("regionId", selectedRegion?.id.toString() ?? "", {
      shouldValidate: form.formState.submitCount > 0,
    });
  }, [selectedRegion, form]);

  useEffect(() => {
    form.setValue("categoryId", selectedCategory?.id.toString() ?? "", {
      shouldValidate: form.formState.submitCount > 0,
    });
  }, [selectedCategory, form]);

  const handleSubmit = async (values: PostFormValues) => {
    try {
      const photoUrls = await Promise.all(
        values.photoUrls.map(async (item) => {
          if (typeof item === "string") return item;
          const { data } = await fileApi.getUploadPresignedUrl({
            fileName: item.name,
            contentType: item.type || "application/octet-stream",
          });
          await fileApi.uploadWithPresignedUrl(data.uploadUrl, item);
          return data.key;
        }),
      );

      if (isEditMode) {
        await shareApi.update(editItemId, {
          title: values.title,
          content: values.content,
          photoUrls,
          regionId: Number(values.regionId),
          categoryId: Number(values.categoryId),
        });
        toast.success(t("toast.update-success"));
        router.push(`/share/${editItemId}`);
      } else {
        await shareApi.post({
          title: values.title,
          content: values.content,
          photoUrls,
          regionId: Number(values.regionId),
          categoryId: Number(values.categoryId),
        });
        toast.success(t("toast.success"));
        router.push("/share");
      }
    } catch {
      toast.error(t(isEditMode ? "toast.update-error" : "toast.error"));
    }
  };

  if (isEditMode && isPendingEditingItem) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isEditMode && isErrorEditingItem) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Button onClick={() => router.push("/share")} variant="outline">
          {t("actions.cancel")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-6 md:py-8">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b bg-linear-to-r from-muted/60 to-background py-5">
          <CardTitle className="text-lg">{t(isEditMode ? "edit-title" : "title")}</CardTitle>
          <CardDescription>{t(isEditMode ? "edit-description" : "description")}</CardDescription>
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
                <Region />
                {form.formState.errors.regionId && <FieldError errors={[form.formState.errors.regionId]} />}
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
                  if (isEditMode) {
                    router.push(`/share/${editItemId}`);
                  } else {
                    router.push("/share");
                  }
                }}
              >
                {t("actions.cancel")}
              </Button>
              <Button type="submit">{t(isEditMode ? "actions.update" : "actions.submit")}</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
