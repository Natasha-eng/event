'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { eventFormSchema } from "@/lib/validator"
import * as z from "zod"
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { FileUploader } from "./FileUploader"
import { useUploadThing } from '@/lib/uploadthing'
import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import CreateEvent from "@/app/(root)/events/create/page"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.action"
import { Event } from "@/types"
import { format, parseISO } from "date-fns"
// import parseISO from "date-fns/parseISO"
import el from "date-fns/locale/el"; // the locale you want
registerLocale("el", el);



type EventFormProps = {
    userId: string;
    type: 'Create' | 'Update',
    eventId?: string,
    event?: Event
}

export const formatDate = (dateItem: Date) => {
    const date = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Australia/Sydney',
    }).format(dateItem)
    console.log('dateItem', new Date(dateItem))
    return date
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {

    const [files, setFiles] = useState<File[]>([])




    const initialValues = event && type === 'Update' ? {
        ...event,
        startDateTime: event.endDateTime,
        endDateTime: event.endDateTime,
    } : eventDefaultValues
    const router = useRouter()

    const { startUpload } = useUploadThing('imageUploader')

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {

        let uploadedImageUrl = values.imageUrl
        if (files.length > 0) {
            const uploadImages = await startUpload(files)

            if (!uploadImages) {
                return
            }

            uploadedImageUrl = uploadImages[0].url
        }

        if (type === 'Create') {
            try {
                const newEvent = await createEvent({
                    event: { ...values, startDateTime: values?.startDateTime.toString(), endDateTime: values?.endDateTime.toString(), imageUrl: uploadedImageUrl },
                    userId,
                    path: '/profile'
                })

                form.reset()
                // router.push(`/events/${newEvent.recordId}`)

            } catch (err) {
                console.log(err)
            }
        }
        if (type === 'Update') {
            if (!eventId) {
                router.back()
                return;
            }
            try {

                const updatedEvent: Event | undefined = event && await updateEvent({
                    userId,
                    eventId,
                    event: { ...values, startDateTime: values?.startDateTime.toString(), endDateTime: values?.endDateTime.toString(), imageUrl: uploadedImageUrl },
                    path: `/events/${eventId}`
                })

                if (updatedEvent?.recordId) {
                    form.reset()
                    router.push(`/events/${updatedEvent.recordId}`)
                }
            } catch (err) {
                console.log(err)
            }
        }

    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Event title" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <FileUploader onFieldChange={field.onChange}
                                        imageUrl={field.value}
                                        setFiles={setFiles} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                        <Image
                                            src='/assets/icons/location-grey.svg'
                                            alt='location'
                                            width={24}
                                            height={24} />
                                        <Input placeholder="Event location or Online" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => {
                            console.log('time field.value create start', field.value)
                            // console.log('time field.value create formatDate start', formatDate(field.value))
                            return < FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                        <Image
                                            src='/assets/icons/calendar.svg'
                                            alt='calendar'
                                            width={24}
                                            height={24}
                                            className="filter-grey" />
                                        <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>

                                        {/* <DatePicker selected={parseISO(field.value.toString())}
                                            locale="el"
                                            required
                                            onChange={(date: Date) => {
                                                console.log('locale, onchange')
                                                field.onChange(date)
                                            }}
                                            showTimeSelect timeInputLabel="Time:"
                                            dateFormat='dd/MM/yyyy h:mm'
                                            wrapperClassName="datePicker" /> */}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (

                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                        <Image
                                            src='/assets/icons/calendar.svg'
                                            alt='calendar'
                                            width={24}
                                            height={24}
                                            className="filter-grey" />
                                        <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                                        {/* <DatePicker selected={parseISO(field.value.toString())}
                                            required
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect timeInputLabel="Time:"
                                            dateFormat='dd/MM/yyyy h:mm'
                                            wrapperClassName="datePicker"
                                            locale="el"
                                        /> */}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                        <Image
                                            src='/assets/icons/dollar.svg'
                                            alt='dollar'
                                            width={24}
                                            height={24}
                                            className="filter-grey" />
                                        <Input type='number'
                                            placeholder="Price"
                                            {...field}
                                            className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />

                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem >
                                                    <FormControl>
                                                        <div className="flex item-center">
                                                            <label className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor='isFree'>Free Ticket</label>
                                                            <Checkbox required={false} checked={field.value} onCheckedChange={field.onChange} id='isFree' className="mr-2 h-5 w-5 border-2 border-primary-500" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                        <Image
                                            src='/assets/icons/link.svg'
                                            alt='link'
                                            width={24}
                                            height={24} />
                                        <Input placeholder="URL" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <Button type="submit" size='lg' disabled={form.formState.isSubmitting} className="button col-span-2 w-full" >{form.formState.isSubmitting ? (
                    'Submitting...'
                ) : `${type} Event`}</Button>
            </form >
        </Form >
    )
}

export default EventForm
