/* import * as React from 'react';
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
 */


import * as React from 'react';

import { Html, Head, Body, Container, Section, Text, Heading, Button, Preview, Hr } from '@react-email/components';

interface RegistrationEmailProps {
  name: string;
}

export const RegistrationEmail = ({ name }: RegistrationEmailProps) => {
  return (<Html> <Head /> <Preview>
    ¡Bienvenido a MyTeacher! Tu cuenta está lista para comenzar. </Preview>

    <Body style={main}>
      <Container style={container}>
        {/* Encabezado */}
        <Section style={header}>
          <Text style={brand}>MyTeacher</Text>

          <Section style={iconContainer}>
            <Text style={welcomeIcon}>✦</Text>
          </Section>

          <Heading style={heading}>
            ¡Bienvenido a MyTeacher!
          </Heading>

          <Text style={headerSubtitle}>
            Nos alegra tenerte con nosotros
          </Text>
        </Section>

        {/* Contenido principal */}
        <Section style={bodySection}>
          <Text style={greeting}>
            ¡Hola, <strong style={highlight}>{name}</strong>!
          </Text>

          <Text style={paragraph}>
            ¡Tu registro se ha completado exitosamente! Estamos muy
            felices de que formes parte de nuestra comunidad educativa.
          </Text>

          <Section style={welcomeCard}>
            <Text style={welcomeCardIcon}>🎓</Text>

            <Text style={welcomeTitle}>
              ¡Tu aventura comienza aquí!
            </Text>

            <Text style={welcomeDescription}>
              Ya puedes acceder a MyTeacher y comenzar a disfrutar
              de todas las funcionalidades que tenemos preparadas para ti.
              Aprende, descubre y alcanza nuevas metas con nosotros.
            </Text>
          </Section>

          <Section style={btnContainer}>
            <Button
              href="https://my-teacher-smoky.vercel.app"
              style={button}
            >
              Ir a la plataforma →
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={footerText}>
            Gracias por confiar en MyTeacher. Estamos encantados de
            acompañarte en este camino de aprendizaje.
          </Text>

          <Text style={signature}>
            ¡Nos vemos dentro!
            {'\n'}
            <strong style={highlight}>Equipo MyTeacher</strong>
          </Text>
        </Section>

        {/* Pie de página */}
        <Section style={footer}>
          <Text style={footerBrand}>MyTeacher</Text>

          <Text style={footerCopyright}>
            © {new Date().getFullYear()} MyTeacher.
            {' '}Todos los derechos reservados.
          </Text>

          <Text style={footerSmall}>
            Este es un correo automático de bienvenida.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>


  );
};

export default RegistrationEmail;

// ESTILOS

const main = {
  backgroundColor: '#eef3fb',
  fontFamily: 'Arial, Helvetica, sans-serif',
  padding: '20px 10px',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden' as const,
  border: '1px solid #e0e7f2',
};

const header = {
  backgroundColor: '#2354b6',
  backgroundImage: 'linear-gradient(135deg, #2354b6, #15377e)',
  padding: '35px 25px 40px',
  textAlign: 'center' as const,
};

const brand = {
  color: '#ffffff',
  fontSize: '25px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '0 0 25px',
};

const iconContainer = {
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  width: '76px',
  height: '76px',
  margin: '0 auto 20px',
  textAlign: 'center' as const,
};

const welcomeIcon = {
  color: '#2354b6',
  fontSize: '48px',
  fontWeight: 'bold',
  lineHeight: '76px',
  margin: '0',
};

const heading = {
  color: '#ffffff',
  fontSize: '27px',
  lineHeight: '1.3',
  margin: '0 0 10px',
  fontWeight: 'bold',
};

const headerSubtitle = {
  color: '#dbe7ff',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const bodySection = {
  padding: '35px 30px',
};

const greeting = {
  color: '#1d2939',
  fontSize: '20px',
  lineHeight: '1.5',
  margin: '0 0 15px',
};

const highlight = {
  color: '#2354b6',
};

const paragraph = {
  color: '#475467',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 25px',
};

const welcomeCard = {
  backgroundColor: '#f0f7ff',
  border: '1px solid #d6e7ff',
  borderRadius: '12px',
  padding: '22px 18px',
  textAlign: 'center' as const,
  margin: '0 0 22px',
};

const welcomeCardIcon = {
  fontSize: '32px',
  margin: '0 0 10px',
};

const welcomeTitle = {
  color: '#17469b',
  fontSize: '17px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const welcomeDescription = {
  color: '#475467',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#2354b6',
  backgroundImage: 'linear-gradient(135deg, #3268d5, #2354b6)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '15px 32px',
};

const divider = {
  borderColor: '#eaecf0',
  margin: '30px 0 20px',
};

const footerText = {
  color: '#667085',
  fontSize: '13px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
};

const signature = {
  color: '#475467',
  fontSize: '14px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
  margin: '20px 0 0',
  whiteSpace: 'pre-line' as const,
};

const footer = {
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e9eef5',
  padding: '25px 20px',
  textAlign: 'center' as const,
};

const footerBrand = {
  color: '#2354b6',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const footerCopyright = {
  color: '#667085',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 8px'
};

const footerSmall = {
  color: '#98a2b3',
  fontSize: '11px',
  lineHeight: '1.6',
  margin: '0',
};