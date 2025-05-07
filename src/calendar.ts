import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function bookMeeting(patientName: string, therapistEmail: string, datetime: string) {
  const event = {
    summary: `Therapy Session with ${patientName}`,
    description: 'Booked via chatbot prototype',
    start: { dateTime: datetime },
    end: { dateTime: new Date(new Date(datetime).getTime() + 30 * 60000).toISOString() },
    attendees: [{ email: therapistEmail }],
  };

  const res = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID!,
    requestBody: event,
  });

  return res.data.htmlLink;
}
