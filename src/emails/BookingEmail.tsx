import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Preview, Hr } from '@react-email/components';

interface BookingEmailProps {
  type: string;
  status: string;
  message: string;
  date: string;
  startTime: string;
}

export const BookingEmail = ({ type, status, message, date, startTime }: BookingEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Actualización de tu reserva - Estado: {status}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>Actualización de tu reserva</Heading>
          </Section>
          
          <Section style={bodySection}>
            <Text style={paragraph}>Hola,</Text>
            <Text style={paragraph}>{message}</Text>

            <Hr style={hr} />

            <Heading as="h4" style={subheading}>Detalles de la reserva:</Heading>
            <Section style={detailsContainer}>
              <Text style={detailText}><strong>Estado:</strong> <span style={{ color: '#4CAF50'}}>{status}</span></Text>
              <Text style={detailText}><strong>Fecha:</strong> {date}</Text>
              <Text style={detailText}><strong>Hora:</strong> {startTime}</Text>
              <Text style={detailText}><strong>Tipo:</strong> {type}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={footerText}>Gracias por usar MyTeacher.</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} MyTeacher. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#4CAF50',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  margin: '0',
};

const bodySection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderLeft: '1px solid #e0e0e0',
  borderRight: '1px solid #e0e0e0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const subheading = {
  fontSize: '18px',
  color: '#333333',
  margin: '0 0 10px 0',
};

const detailsContainer = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '5px',
};

const detailText = {
  fontSize: '15px',
  color: '#555555',
  margin: '5px 0',
};

const footerText = {
  fontSize: '14px',
  color: '#666666',
};

const footer = {
  backgroundColor: '#f1f1f1',
  padding: '15px',
  textAlign: 'center' as const,
  borderRadius: '0 0 8px 8px',
  border: '1px solid #e0e0e0',
  borderTop: 'none',
};

const footerCopyright = {
  margin: '0',
  fontSize: '12px',
  color: '#888888',
};
