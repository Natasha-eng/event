import CheckoutButton from '@/components/shared/CheckoutButton'
import Collection from '@/components/shared/Collection'
import { formatDate } from '@/components/shared/EventForm'
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.action'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
    const event = await getEventById(id)
    let relatedEvents
    try {
        relatedEvents = await getRelatedEventsByCategory({
            categoryId: event.categoryId,
            eventId: event._id,
            page: searchParams.page as string
        })
    } catch (err) {
        console.log('eventDetails err', err)
    }

    // console.log('EventDetails startDateTime', formatDate(new Date(event.startDateTime)))
    return (
        <>
            <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
                <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
                    <Image src={event.imageUrl || '/assets/images/empty.jpg'}
                        alt='hero image'
                        width={1000}
                        height={1000}
                        className='h-full min-h-[300px] object-cover object-center' />
                    <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
                        <div className='flex flex-col gap-6'>
                            <h2 className='h2-bold'>{event.title}</h2>
                            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                                <div className='flex gap-3'>
                                    <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>{event.isFree ? 'FREE' : (event.price && ('$' + event.price) || 'FREE')}</p>
                                    <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500'>{event.category}</p>
                                </div>
                                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                                    by{' '}
                                    <span className='text-primary-500'>{event.username}</span>
                                </p>
                            </div>
                        </div>
                        {/* checkout button */}
                        <CheckoutButton event={event} />

                        <div className='flex flex-col gap-5'>
                            <div className='flex gap-2 md:gap-3'>
                                <Image src='/assets/icons/calendar.svg'
                                    alt='calendar' width={32} height={32} />
                                <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center'>

                                    <p>{event?.startDateTime ? formatDateTime(event.startDateTime).dateOnly : "no time"} -{' '}
                                        {event?.startDateTime ? formatDateTime(event.startDateTime).timeOnly : "no time"}
                                    </p>
                                    <p>{formatDateTime(new Date(event?.endDateTime)).dateOnly} -{" "}
                                        {formatDateTime(new Date(event?.endDateTime)).timeOnly}
                                    </p>
                                </div>
                            </div>
                            <div className='p-regular-20 flex items-center gap-3'>
                                <Image src='/assets/icons/location.svg' alt='location' width={32} height={32} />
                                <p className='p-medium-16 lg:p-regular-20'>{event.location}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='p-bold-20 text-grey-600'>What You&apos;ll learn:</p>
                            <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
                            <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>{event.url}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
                {/* events with the same category */}
                <h2 className='h2-bold'>Related Events</h2>

                <Collection
                    data={relatedEvents?.data}
                    emptyTitle='No Events Found'
                    emptyStateSubtext='Come back later'
                    collectionType='All_Evnets'
                    limit={3}
                    page={'1'}
                    totalPages={2}
                />
            </section>
        </>
    )
}

export default EventDetails
