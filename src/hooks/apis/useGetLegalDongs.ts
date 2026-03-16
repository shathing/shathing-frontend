import { legalDongApi } from '@/apis/legal-dong';
import { useQuery } from '@tanstack/react-query';

type UseGetLegalDongsOptions = {
  code?: string;
  enabled?: boolean;
};

export default function useGetLegalDongs(options: UseGetLegalDongsOptions = {}) {
  const { code, enabled = true } = options;
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["legalDongApi.getList", code],
    queryFn: () => legalDongApi.getList(code).then(({ data }) => data),
    staleTime: Infinity,
    enabled,
  });

  return {
    data,
    isPending,
    isError,
    refetch
  };
}
