export const dynamic = 'force-dynamic';

import EventRegistrationForm from '@/components/EventRegistrationForm';
import HeroSection from '@/components/HeroSection';
import SectionWrapper from '@/components/SectionWrapper';
import Button from '@/components/Button';
import dbConnect from '@/lib/database/connect';
import Event, { IEvent } from '@/lib/models/Event';
import { notFound } from 'next/navigation';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  await dbConnect();
  const event = await Event.findById(params.id).lean<IEvent>();

  if (!event || event.status === 'cancelled') {
    notFound();
  }

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <HeroSection
        title={event.title}
        subtitle={event.description}
      />

      <SectionWrapper>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Event Overview</p>
                  <h1 className="mt-3 text-3xl font-bold text-gray-900">{event.title}</h1>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                    {event.status}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Date</p>
                    <p className="text-lg text-gray-900">{eventDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Location</p>
                    <p className="text-lg text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Type</p>
                    <div className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">{event.type}</div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Capacity</p>
                    <p className="text-lg text-gray-900">{event.registeredCount}/{event.capacity}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">What to Expect</h2>
                  <p className="mt-3 text-gray-600 leading-7">{event.description}</p>
                </div>

                {event.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                    <p className="mt-3 text-gray-600">{event.requirements}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Need Assistance?</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">Contact the organizer</h2>
                </div>
                <Button href={`mailto:${event.contactEmail}`} variant="outline" size="md">
                  Email Organizer
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div id="register">
              <EventRegistrationForm eventId={event._id.toString()} eventTitle={event.title} />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
