'use client'

import { Event } from '@/types'
// import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

const CheckoutButton = ({ event }: { event: Event }) => {
    // const { user } = useUser()
    const userId = 'user_2aDnZqWYGVSOYojKfjVcrxUIoBY' //user?.publicMetadata.userId as string
    const hasEventFinished = new Date(event.endDateTime) < new Date()

    return (
        <div className='flex items-center gap-3'>
            {/* cannot buy past event */}
            {hasEventFinished ? (
                <p className='p-2 text-red-400'>Sorry, tickets are no longer available.</p>
            ) : (
                <>
                    {userId ?
                        (<Button asChild className='button rounded-full' size='lg'>
                            <Link href='/sign-in'>
                                Get Tickets
                            </Link>
                        </Button>)

                        :

                        <Checkout event={event} userId={userId} />

                    }
                </>
            )}
        </div>
    )
}

export default CheckoutButton
