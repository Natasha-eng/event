import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.action'
import { SearchParamProps } from '@/types'
// import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
    // const { sessionClaims } = auth()
    const userId = 'user_2aDnZqWYGVSOYojKfjVcrxUIoBY' //sessionClaims?.sub as string

    const eventsPage = searchParams.eventsPage as string || '1'
    let organizedEvents;
    try {
        organizedEvents = await getEventsByUser({ userId, limit: eventsPage })
    } catch (err) {
        console.log('profile err', err)
    }


    const ordersPage = Number(searchParams.ordersPage) || 1

    console.log('organizedEvents', organizedEvents)
    return (
        <>
            {/* my tickets */}
            <section className='bg-primary-50 bg-dotted-pattern
            ng-cover bg-center py-5 md:10'>
                <div className='wrapper flex items-center 
                justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                    <Button asChild size='lg' className='button hidden sm:flex'>
                        <Link href='/#events'>Explore More Events</Link>
                    </Button>
                </div>
            </section>
            {/* <section className='wrapper my-8'>

                <Collection
                    data={relatedEvents?.data}
                    emptyTitle='No events tickets purchesed yet'
                    emptyStateSubtext='No worries - plenty of exciting events to explore!'
                    collectionType='My_Tickets'
                    limit={3}
                    page={1}
                    totalPages={2}
                    urlParamName='ordersPage'
                />
            </section> */}

            {/* events organized */}
            <section className='bg-primary-50 bg-dotted-pattern
            ng-cover bg-center py-5 md:10'>
                <div className='wrapper flex items-center 
                justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild size='lg' className='button hidden sm:flex'>
                        <Link href='/events/create'>Create New Event</Link>
                    </Button>
                </div>
            </section>

            <section className='wrapper my-8'>

                <Collection
                    data={organizedEvents?.data}
                    emptyTitle='No events have been created yet'
                    emptyStateSubtext='Go create some now'
                    collectionType='Events_Organized'
                    limit={3}
                    page={eventsPage}
                    totalPages={organizedEvents?.totalPages}
                    urlParamName='eventsPage'
                />
            </section>
        </>
    )
}

export default ProfilePage
