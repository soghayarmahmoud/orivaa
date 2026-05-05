export const dynamic = 'force-dynamic';

import HeroSection from '@/components/HeroSection';
import SectionWrapper from '@/components/SectionWrapper';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import dbConnect from '@/lib/database/connect';
import Event, { IEvent } from '@/lib/models/Event';

export default async function HackathonsPage() {
  await dbConnect();
  const hackathons = await Event.find({ type: 'hackathon', status: 'upcoming' }).sort({ date: 1 }).lean<IEvent[]>();

  return (
    <div>
      <HeroSection
        title="Hackathons"
        subtitle="Join high-impact hackathons where innovation meets community and real problems get solved."
      />

      <SectionWrapper>
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {hackathons.map((hackathon) => (
              <motion.div
                key={hackathon._id.toString()}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-red-600 font-semibold">Hackathon</p>
                    <h3 className="mt-3 text-2xl font-semibold text-gray-900">{hackathon.title}</h3>
                  </div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">{hackathon.type}</span>
                </div>

                <p className="text-gray-600 leading-7">{hackathon.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Date</p>
                    <p className="mt-2">{new Date(hackathon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="mt-2">{hackathon.location}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {hackathon.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <Button href={`/events/${hackathon._id}`} variant="primary" size="md">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {hackathons.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-lg font-medium text-gray-900">No upcoming hackathons are scheduled yet.</p>
              <p className="mt-3 text-gray-600">Check back soon or reach out to the Oriva team for upcoming community innovation events.</p>
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
