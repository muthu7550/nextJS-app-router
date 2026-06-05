"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';


export default function layout ({ children }) {
        const pathname = usePathname();

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