import { z } from 'zod';
export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.email('Please enter a valid email address.').max(254),
  interest: z.enum([
    'General enquiry',
    'Partner as a Hub',
    'Volunteer (Rehabilitation)',
    'Request Help',
  ]),
  message: z.string().trim().max(2000),
});
export type Enquiry = z.infer<typeof enquirySchema>;
export function formatEnquiry(enquiry: Enquiry): string {
  return `DPEEN website enquiry\n\nName: ${enquiry.fullName}\nEmail: ${enquiry.email}\nInterest: ${enquiry.interest}\n\n${enquiry.message}\n`;
}
