export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-3 mt-auto absolute bottom-0 w-full sticky z-50">
            <div className="text-center" id="footer">
                &copy; {new Date().getFullYear()} My Company. All rights reserved.
            </div>
        </footer>
    ); 
}