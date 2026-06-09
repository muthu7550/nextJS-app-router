import { useSearchParams } from "next/navigation";


export function usePaginationParams() {
  const searchParams = useSearchParams();

  return {
    pageNumber: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "8",
  };
}