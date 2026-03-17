import http, { s3Client } from "./config";
import { UploadPresignedUrlRequest, UploadPresignedUrlResponse } from "@/types/apis/file";

const toContentType = (file: File) => file.type || "application/octet-stream";

export const fileApi = {
  /** 버킷의 persigned url 얻기 */
  getUploadPresignedUrl: (request: UploadPresignedUrlRequest) =>
    http.post<UploadPresignedUrlResponse>("/uploads/presigned-url", request),

  /** persigned url 을 이용하여 버킷에 업로드 */
  uploadWithPresignedUrl: async (uploadUrl: string, file: File) => {
    await s3Client.put(uploadUrl, file, {
      headers: {
        "Content-Type": toContentType(file),
      },
    });
  },
};
