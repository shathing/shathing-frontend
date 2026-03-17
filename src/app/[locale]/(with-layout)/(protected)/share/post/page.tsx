"use client";

import { shareApi } from "@/apis/share";
import { fileApi } from "@/apis/file";
import Category from "../../../share/Category";
import LegalDong from "../../../share/LegalDong";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShareSelectionStore } from "@/stores/share-selection";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, MapPin, Tags } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";

const TITLE_MAX_LENGTH = 80;
const CONTENT_MAX_LENGTH = 1200;
const PHOTO_MAX_COUNT = 10;

const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(TITLE_MAX_LENGTH, `제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해 주세요.`),
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력해 주세요.")
    .max(CONTENT_MAX_LENGTH, `내용은 ${CONTENT_MAX_LENGTH}자 이내로 입력해 주세요.`),
  photoUrls: z
    .array(z.custom<File>((value) => value instanceof File, "유효한 파일이 아니에요."))
    .min(1, "사진을 등록해 주세요")
    .max(PHOTO_MAX_COUNT, `사진은 최대 ${PHOTO_MAX_COUNT}장까지 업로드할 수 있어요.`),
  locationCode: z.string().min(1, "위치를 선택해 주세요."),
  categoryId: z.string().min(1, "카테고리를 선택해 주세요."),
});
type PostFormValues = z.infer<typeof postFormSchema>;

export default function Page() {
  const router = useRouter();
  const selectedLegalDong = useShareSelectionStore((state) => state.selectedLegalDong);
  const selectedCategory = useShareSelectionStore((state) => state.selectedCategory);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      photoUrls: [],
      locationCode: selectedLegalDong?.code ?? "",
      categoryId: selectedCategory ? selectedCategory.id.toString() : "",
    },
  });

  useEffect(() => {
    form.setValue("locationCode", selectedLegalDong?.code ?? "", {
      shouldValidate: form.formState.submitCount > 0,
    });
  }, [selectedLegalDong, form]);

  useEffect(() => {
    form.setValue("categoryId", selectedCategory ? selectedCategory.id.toString() : "", {
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
      toast.success("게시 완료");
      router.push("/share");
    } catch {
      toast.error("게시 실패");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-6 md:py-8">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b bg-linear-to-r from-muted/60 to-background py-5">
          <CardTitle className="text-lg">공유하기</CardTitle>
          <CardDescription>빌려줄 물건을 등록해 주세요.</CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6 py-6">
            <section className="space-y-2">
              <FieldLabel htmlFor="post-title">제목</FieldLabel>
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="post-title"
                      maxLength={TITLE_MAX_LENGTH}
                      placeholder="예) 캠핑 의자 2개 빌려드려요"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
            </section>

            <section className="space-y-2">
              <FieldLabel htmlFor="post-content">내용</FieldLabel>
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      className="min-h-44"
                      id="post-content"
                      maxLength={CONTENT_MAX_LENGTH}
                      placeholder="물품 상태, 대여 가능 시간, 보증금 여부 등을 자세히 적어주세요."
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
              <p className="text-muted-foreground text-xs">최대 1200자</p>
            </section>

            <section className="space-y-2">
              <FieldLabel htmlFor="post-images">사진</FieldLabel>
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
                        {field.value.length > 0 ? `${field.value.length}장 선택됨` : "클릭해서 사진 업로드"}
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
                  위치
                </FieldLabel>
                <LegalDong />
                {form.formState.errors.locationCode && <FieldError errors={[form.formState.errors.locationCode]} />}
              </div>
              <div className="flex gap-2 items-center">
                <FieldLabel className="inline-flex items-center gap-1">
                  <Tags className="size-4" />
                  카테고리
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
                취소
              </Button>
              <Button type="submit">등록</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
