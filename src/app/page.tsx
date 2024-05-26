import Image from "next/image";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>

        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-red-600">PDFs</span> in seconds.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">Have conversations with any PDF document. Simply upload your file and start asking questions right away.</p>

        <Link className={buttonVariants({
          size: "lg",
          className: "mt-5"
        })} href="/dashboard">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
      </MaxWidthWrapper>



    </>
  );
}
