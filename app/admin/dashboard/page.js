import Dashboard from "./DashboardClient";

export default function Page({ searchParams }) {
  // Server component receives searchParams automatically
  const pageNumber = Number(searchParams.page || 1);
  const limit = Number(searchParams.limit || 8);

  return <Dashboard pageNumber={pageNumber} limit={limit} />;
}