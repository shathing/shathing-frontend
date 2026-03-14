import { authApi } from '@/apis/auth';
import { useQuery } from '@tanstack/react-query';

type UseGetMeOptions = {
  enabled?: boolean;
};

export default function useGetMe(options: UseGetMeOptions = {}) {
  const { enabled = true } = options;

  const { data, isPending, isError } = useQuery({
    queryKey: ["authApi.me"],
    queryFn: () => authApi.me().then(({ data }) => data),
    enabled,
  });

  return {
    data,
    isPending,
    isError
  };
}
