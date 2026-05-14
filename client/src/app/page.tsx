"use client";

import Image from "next/image";
import { useUserData } from "../store/userData";
import Main from "@/components/Main";
import NotUser from "@/components/NotUser";

export default function Home() {
const userName = useUserData((state) => state.userName);
  return (
   <div >
    {userName?
    <Main/>
    :
    <NotUser/>
    }

   </div>
  );
}
