"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { setEncryptedItem, getDecryptedItem } from "./encript";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function layout ({ children }) {
    const router = useRouter();
        const pathname = usePathname();
          const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getDecryptedItem("token");

    if (token) {
      router.replace("/admin/dashboard");
    } else {
      setIsLoading(false);  
    }
  }, [router]);

    // Prevent login form flash
  if (isLoading) {
    return (
      <div className="w-xl mt-10 mx-auto text-center">
        Loading...
      </div>
    );
  }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div>
                <div className='flex gap-3'>
                    <Link href={`/auth/login`} className={`text-blue-600 hover:text-blue-800 text-3xl  p-2 ${pathname === '/auth/login' ? 'underline font-semibold  border-b-2 button-underline border-black' : 'text-black button-underline '}`}>Login</Link> <span className="text-3xl text-black py-2">| </span>   
                    <Link href="/auth/register" className={`text-blue-600 hover:text-blue-800 text-3xl  p-2 ${pathname === '/auth/register' ? 'underline font-semibold border-b-2 button-underline border-black' : 'text-black button-underline '}`}>Register</Link>
                </div>
            {children}
            </div>
        </div>
    );
}