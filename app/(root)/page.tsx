import CategoryFilter from '@/components/shared/CategoryFilter'
import Collection from '@/components/shared/Collection'
import Search from '@/components/shared/Search'
import { Button } from '@/components/ui/button'
import { getAllEvents, getEvents } from '@/lib/actions/event.action'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home({ searchParams, params }: SearchParamProps) {
  const page = searchParams?.page as string || '1'
  const searchText = (searchParams?.query as string) || ''
  const category = (searchParams?.category as string) || ''

  let eventsData;
  let events
  // try {
  //   searchText || category ? eventsData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getEvents?query=${searchText}&category=${category}`) :
  //     eventsData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getEvents`)
  //   console.log('home events', eventsData)
  //   events = await eventsData.json()
  //   console.log('home events parsed', events)
  // } catch (err) {
  //   console.log('home page error', err)
  // }

  try {
    events = await getEvents(searchText, category)
    console.log('events home', events)
  } catch (err) {
    console.log('home page error', err)
  }

  return (
    < >
      <section className='bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 gap-5 
        md:col-2 2xl:gap-0'>
          <div className='flex flex-col justify-center gap-8'>
            <h1 className='h1-bold'>
              Host, Connect, Celebrate: Your Events, Our Platform
            </h1>
            <p className='p-regular-20 md:p-regular-24'>
              Book and learn helpful tips from 3,168+ mentors in world-class companies with our global commutity.
            </p>
            <Button size='lg' asChild className='button w-full sm:w-fit'>
              <Link href='#events'>Explore Now</Link>
            </Button>
          </div>

          <Image src='/assets/images/hero.png' alt='hero' width={1000} height={1000} className='max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]' />
        </div>
      </section>
      <section id='events' className='wrapper my-8 flex flex-col gap-89 md:gap-12' >
        <h2 className='h2-bold'>Trusted by<br /> Thousands of Events </h2>
        <div className='flex w-full flex-col gap-5 md:flex-row '>
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle='No Events Found'
          emptyStateSubtext='Come back later'
          collectionType='All_Evnets'
          limit={3}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  )
}
