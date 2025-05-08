import { google } from 'googleapis';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));
const token = JSON.parse(fs.readFileSync('token.json', 'utf-8'));


const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);

export async function bookMeeting(patientName: string, therapistEmail: string, time: string): Promise<string> {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const startTime = new Date(time);
  const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 mins

  const event = {
    summary: `Therapy Appointment - ${patientName}`,
    start: { dateTime: startTime.toISOString(), timeZone: 'America/New_York' },
    end: { dateTime: endTime.toISOString(), timeZone: 'America/New_York' },
    attendees: [
      { email: therapistEmail },
      { email: 'healthcli@gmail.com' } // ← patient (you) for now
    ]
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event
  });

  return res.data.htmlLink || 'No link returned';
}
