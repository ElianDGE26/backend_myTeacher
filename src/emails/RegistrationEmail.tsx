import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Button, Preview } from '@react-email/components';

interface RegistrationEmailProps {
  name: string;
}

export const RegistrationEmail = ({ name }: RegistrationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a MyTeacher!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>¡Bienvenido a MyTeacher!</Heading>
          </Section>
          
          <Section style={bodySection}>
            <Text style={paragraph}>Hola <strong style={{ color: '#2354b6' }}>{name}</strong>,</Text>
            <Text style={paragraph}>
              ¡Tu registro se ha completado exitosamente! Ya puedes acceder a la plataforma y comenzar a disfrutar de todas nuestras funcionalidades.
            </Text>

            <Section style={btnContainer}>
              <Button href="https://my-teacher-smoky.vercel.app" style={button}>
                Ir a la plataforma
              </Button>
            </Section>

            <Text style={footerText}>Gracias por formar parte de MyTeacher. ¡Nos vemos dentro!</Text>
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

export default RegistrationEmail;

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
  backgroundColor: '#2354b6',
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

const btnContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#2354b6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 25px',
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
