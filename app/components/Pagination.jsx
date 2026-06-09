"use client";

import Pagination from "react-bootstrap/Pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ProductPagination({
  totalPages,
  limit = 8,
  setLoading,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Always derive current page from URL (IMPORTANT FIX)
  const currentPage = Number(searchParams.get("page") || 1);

  const handlePageChange = (page) => {
    setLoading(true)
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const items = [];
  const pageWindow = 2;

  // First
  items.push(
    <Pagination.First
      key="first"
      onClick={() => handlePageChange(1)}
      disabled={currentPage === 1}
    />
  );

  // Prev
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );

  // Start ellipsis + first page
  if (currentPage > pageWindow + 1) {
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
  }

  // Page range around current
  for (
    let page = Math.max(1, currentPage - pageWindow);
    page <= Math.min(totalPages, currentPage + pageWindow);
    page++
  ) {
    items.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}   // ✅ ACTIVE COLOR CHANGE
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  // End ellipsis + last page
  if (currentPage < totalPages - pageWindow) {
    items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);

    items.push(
      <Pagination.Item
        key={totalPages}
        active={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }

  // Next
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  );

  // Last
  items.push(
    <Pagination.Last
      key="last"
      onClick={() => handlePageChange(totalPages)}
      disabled={currentPage === totalPages}
    />
  );

  return <Pagination>{items}</Pagination>;
}