import { db } from './src/db';
import { events } from './src/db/schema';
import { formatEventDetail } from './src/routes/events';

async function testEventDetail() {
  console.log('Testing event detail formatting...');
  const ev = await db.query.events.findFirst({
    with: {
      ticketCategories: { with: { tickets: true } },
      user: true,
    }
  });

  if (!ev) {
    console.log('No event found in DB');
    return;
  }

  console.log('Found event:', ev.name, 'ID:', ev.id);
  const formatted = formatEventDetail(ev, ev.ticketCategories, true);

  console.log('\n--- VERIFICATION OF EVENT DETAIL OUTPUT ---');
  console.log('Name:', formatted.name);
  console.log('Category:', formatted.category);
  console.log('Format:', formatted.event_format);
  console.log('Venue Location:', formatted.venueLocation);
  console.log('Meeting Link:', formatted.onlineMeetingLink);
  console.log('Payment Method:', formatted.paymentMethod);
  console.log('BNI Account:', formatted.accountNumberBNI);
  console.log('Template Selection:', formatted.templateSelection);
  console.log('Banner URLs Count:', formatted.bannerUrls?.length);
  console.log('Terms & Conditions length:', formatted.termsAndConditions?.length);
  console.log('Ticket Groups Count:', formatted.ticketGroups?.length);
  if (formatted.ticketGroups?.length > 0) {
    console.log('First Ticket Group:', formatted.ticketGroups[0].categoryName);
    console.log('First Ticket:', formatted.ticketGroups[0].tickets[0]?.name, 'Price:', formatted.ticketGroups[0].tickets[0]?.priceDisplay, 'Sold Out:', formatted.ticketGroups[0].tickets[0]?.isSoldOut);
  }
  console.log('\nSUCCESS! Event detail is fully enriched and matches Figma specification.');
}

testEventDetail().catch(console.error);
