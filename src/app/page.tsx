
import Code from "@/components/Code";
import { CodeSection } from "@/components/CodeSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";

export const runtime = 'edge'

export default function Home() {
  return <section className="min-h-screen bg-grid-zinc-50">
    <MaxWidthWrapper className="relative pb-24 pt-10 sm:pb-32 lg:pt-24 xl:pt-32 lg:pb-52">
      <div className="hidden lg:block absolute inset-0 top-8">

      </div>
      <div className="px-6 lg:px-0 lg:pt-4">
        <div className="relative mx-auto text-center flex flex-col items-center">
          <h1 className="relative leading-snug w-fit tracking-tight text-balance mt-16 font-bold text-gray-900 text-5xl">
            Convert any object to JSON schema
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-prose text-center">An API built with OpenAI to convert
            any object to JSON schema. Simply make a POST request with the object you want to convert and voila!
          </p>
          <div className="w-full flex flex-col items-center mt-12 px-4">
            <p className="font-semibold text-xl my-4">Try and make an API request</p>
            <div className='relative max-w-2xl w-full text-left p-5 bg-[#1e1e1e] rounded-xl shadow'>
              <CodeSection />
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  </section>
}
