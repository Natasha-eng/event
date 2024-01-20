import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.action'
import { Event, UpdateEventParams } from '@/types'
// import { auth } from '@clerk/nextjs'

type UpdateEventProps = {
    params: {
        id: string
    }
}

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
    // const { sessionClaims } = auth()
    const userId = "user_2aDnZqWYGVSOYojKfjVcrxUIoBY" //sessionClaims?.sub as string

    let event
    try {
        event = await getEventById(id)
    } catch (err) {
        console.log('UpdateEvent err', err)
    }


    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Update Event</h3>
            </section>
            <div className='wrapper my-8'>
                <EventForm userId={userId} type='Update' event={event} eventId={event.recordId} />
            </div>
        </>
    )
}

export default UpdateEvent
