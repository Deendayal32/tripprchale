export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { getTripById } from '@/lib/queries'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TripRedirect({ params }: Props) {
  const { id } = await params
  const trip = await getTripById(id).catch(() => null)
  if (!trip) notFound()
  redirect(`/trips/${id}/${trip.slug}`)
}
