import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface BonusDocumentsEmailProps {
  firstName?: string
  documents?: Array<{ title: string; description: string; url: string }>
}

const styles = {
  body: { backgroundColor: '#070B14', margin: 0, fontFamily: 'Inter, Arial, sans-serif' },
  container: { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' },
  card: {
    backgroundColor: '#0E1526',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '16px',
    padding: '28px',
  },
  h1: { color: '#F4F6FA', fontSize: '22px', lineHeight: '30px', margin: '0 0 16px' },
  p: { color: '#93A0B4', fontSize: '15px', lineHeight: '24px', margin: '0 0 16px' },
  docTitle: { color: '#F4F6FA', fontSize: '16px', fontWeight: 600, margin: '0 0 4px' },
  docDesc: { color: '#93A0B4', fontSize: '14px', lineHeight: '21px', margin: '0 0 8px' },
  link: { color: '#83E24E', fontSize: '14px', fontWeight: 600, textDecoration: 'none' },
  hr: { borderColor: 'rgba(255,255,255,0.09)', margin: '20px 0' },
  sig: { color: '#6B7686', fontSize: '13px', lineHeight: '20px', margin: '0' },
}

export function BonusDocumentsEmail({
  firstName = 'there',
  documents = [],
}: BonusDocumentsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your session is confirmed — and here are your three documents</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Heading style={styles.h1}>Your session is confirmed</Heading>
            <Text style={styles.p}>Hi {firstName},</Text>
            <Text style={styles.p}>
              You&apos;ll get a calendar invite with the meeting link separately. Here are the three
              documents that come with your session — yours to keep whether or not we end up working
              together.
            </Text>
            <Hr style={styles.hr} />
            {documents.map((doc) => (
              <Section key={doc.title} style={{ marginBottom: '18px' }}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docDesc}>{doc.description}</Text>
                <Link href={doc.url} style={styles.link}>
                  Download →
                </Link>
              </Section>
            ))}
            <Hr style={styles.hr} />
            <Text style={styles.p}>
              If you can, fill in the Follow-Up Speed Scorecard before we speak. Real numbers turn a
              general conversation into a specific one.
            </Text>
            <Text style={styles.p}>
              These download links expire in 7 days — save the files somewhere safe.
            </Text>
            <Text style={styles.sig}>
              See you on the call.
              <br />
              Akhil Srivastava
              <br />
              Founder, Growth Multiplier AI
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BonusDocumentsEmail,
  displayName: 'Bonus documents (booking confirmed)',
  subject: 'Your ₹9 session is confirmed — and here are your three documents',
  previewData: {
    firstName: 'Akhil',
    documents: [
      {
        title: 'The Landing Page Audit Checklist',
        description:
          '23 checks for finding what your page is losing, before you spend more on traffic.',
        url: 'https://example.com/audit-checklist.pdf',
      },
      {
        title: 'The Follow-Up Speed Scorecard',
        description:
          'Measure how long your enquiries really wait, and what that gap costs you.',
        url: 'https://example.com/speed-scorecard.pdf',
      },
      {
        title: 'The Lead Qualification Question Bank',
        description:
          '42 questions for separating buyers from browsers, in any consultative sale.',
        url: 'https://example.com/question-bank.pdf',
      },
    ],
  },
} satisfies TemplateEntry
