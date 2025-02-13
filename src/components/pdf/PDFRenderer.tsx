"use client"
import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, RotateCw, Search, TriangleAlert, ZoomIn } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from "../ui/use-toast";
import { useResizeDetector } from "react-resize-detector"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import SimpleBar from "simplebar-react"
import PDFFullScreen from "./PDFFullScreen";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PDFRendererProps = {
    url: string
}

const PDFRenderer = ({ url }: PDFRendererProps) => {

    const { toast } = useToast()

    const [numberOfPages, setNumberOfPages] = useState<number>()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [scale, setScale] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)
    const [renderedScale, setRenderedScale] = useState<number | null>(null)

    const isLoading = renderedScale !== scale

    const CustomPageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numberOfPages!)
    })

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1"
        },
        resolver: zodResolver(CustomPageValidator)
    })

    const { width, ref } = useResizeDetector()

    const handlePageSubmit = ({ page, }: TCustomPageValidator) => {
        setCurrentPage(Number(page))
        setValue("page", String(page))
    }

    return (
        <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    <Button disabled={currentPage <= 1} onClick={() => {
                        setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
                        setValue("page", String(currentPage - 1 > 1 ? currentPage - 1 : 1))
                    }} variant="ghost" aria-label="previous page">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className='flex items-center gap-1.5'>
                        {errors.page ? (<TriangleAlert className="text-red-500" />) : null}
                        <Input {...register("page")} className="w-12 h-8" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(handlePageSubmit)()
                            }
                        }} />
                        <p className="text-zinc-700 text-sm space-x-1">
                            {numberOfPages ? (<><span>/</span>
                                <span>{numberOfPages}</span></>) : null}
                        </p>
                    </div>

                    <Button disabled={numberOfPages === undefined || currentPage === numberOfPages} onClick={() => {
                        setCurrentPage((prev) => prev + 1 > numberOfPages! ? numberOfPages! : prev + 1)
                        setValue("page", String(currentPage + 1 > numberOfPages! ? numberOfPages! : currentPage + 1))
                    }} variant="ghost" aria-label="next page">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                                <ZoomIn className="h-4 w-4" />
                                {scale * 100}%<ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.25)}>125%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.75)}>175%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2.25)}>225%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2.75)}>275%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(3)}>300%</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={() => setRotation((prev) => prev + 90)} variant="ghost" aria-label="rotate 90 degrees">
                        <RotateCw className="h-4 w-4" />
                    </Button>

                    <PDFFullScreen url={url} />
                </div>
            </div>

            <div className="flex-1 w-full max-h-screen">
                <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
                    <div ref={ref}>
                        <Document loading={
                            <div className="flex justify-center">
                                <Loader2 className="my-24 h-6 w-6 animate-spin" />
                            </div>
                        }
                            onLoadError={() => {
                                toast({
                                    title: "Error loading PDF!",
                                    description: "Please try again.",
                                    variant: "destructive"
                                })
                            }}
                            onLoadSuccess={({ numPages }) => setNumberOfPages(numPages)}
                            file={url}
                            className="max-h-full">
                            {isLoading && renderedScale ? <Page key={"@" + renderedScale} width={width ? width : 1} pageNumber={currentPage} scale={scale} rotate={rotation} /> : null}
                            <Page key={"@" + scale} className={cn(isLoading ? "hidden" : "")} width={width ? width : 1} pageNumber={currentPage} scale={scale} rotate={rotation} loading={<div className="flex justify-center"><Loader2 className="my-24 h-6 w-6 animate-spin" /></div>} onRenderSuccess={() => setRenderedScale(scale)} />
                        </Document>
                    </div>
                </SimpleBar>

            </div>
        </div>
    )
}

export default PDFRenderer