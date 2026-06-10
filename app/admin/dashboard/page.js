  // app/admin/dashboard/products/page.js
  import DashboardClient from "./DashboardClient";

  export default function Page({ searchParams }) {
    const pageNumber = Number(searchParams?.page || 1); 
    const limit = Number(searchParams?.limit || 8);
 console.log(pageNumber,"pp")
 
    return <DashboardClient pageNumber={pageNumber} limit={limit} />;
  }