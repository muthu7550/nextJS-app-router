"use client";



import Link from "next/link";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import {setEncryptedItem} from '../encript'


export default function Register() {

  const [user,setUser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const router = useRouter()

  function handleChange(e){
    const {name,value} = e.target

    setUser((prevUser) => ({
    ...prevUser,      
    [name]: value  
  }));
   
  }

  function handleSubmit(){
  console.log(user)

fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(user),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data.token,"tokennm")
    console.log(data.user,"userrm")

    setEncryptedItem("token",data.token)
    setEncryptedItem("user",data.user)

      //  localStorage.setItem("token", data.token);
      //   localStorage.setItem("user", JSON.stringify(data.user));
     router.push('/admin/dashboard')
}

)
  .catch((err) => console.error(err));

    
  }
  return (
    <div class="w-xl mt-10 bg-white px-8 pt-6 pb-8 mb-4">
      <form class="w-full max-w-lg flex flex-col gap-4" action={handleSubmit}>
          <div class="px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >User Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              name="name"
              placeholder="Jane"
              onChange={(e)=>handleChange(e)}
            />
            {/* <p class="text-red-500 text-xs italic">
              Please fill out this field.
            </p> */}
          </div>

          <div class=" px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
             Email
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-email"
              type="email"
              name='email'
              placeholder="Sample@gmail.com"
              onChange={(e)=>handleChange(e)}
            />
          </div>

        <div class="">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Password
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              name='password'
              placeholder="******************"
              onChange={(e)=>handleChange(e)}
            />
            <p class="text-gray-600 text-xs italic">
              Make it as long and as crazy as you'd like
            </p>
          </div>
        </div>

          <div className="flex justify-between items-center mt-4 flex-1 px-3">
            <button type="submit" class="btn btn-success">
              {/* <Link
                href="/admin/dashboard"
                className="text-blue-600 hover:text-blue-800 text-white button-underline"
              > */}
                Register
              {/* </Link> */}
            </button>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
    </div>
  );
}
