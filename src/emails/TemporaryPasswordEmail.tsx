import * as React from 'react';

import { Html, Head, Body, Container, Section, Text, Heading, Button, Preview, Hr } from '@react-email/components';

interface TemporaryPasswordEmailProps {
  name: string;
  temporaryPassword: string;
}

export const TemporaryPasswordEmail = ({
  name,
  temporaryPassword,
}: TemporaryPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Recupera el acceso a tu cuenta de MyTeacher con tu contraseña temporal.
      </Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Encabezado */}
          <Section style={header}>
            <Text style={brand}>MyTeacher</Text>

            <Section style={iconContainer}>
              <Text style={lockIcon}>🔐</Text>
            </Section>

            <Heading style={heading}>
              Recupera tu cuenta
            </Heading>

            <Text style={headerSubtitle}>
              Estamos aquí para ayudarte
            </Text>
          </Section>

          {/* Contenido principal */}
          <Section style={bodySection}>
            <Text style={greeting}>
              ¡Hola, <strong style={highlight}>{name}</strong>!
            </Text>

            <Text style={paragraph}>
              Hemos recibido una solicitud para recuperar el acceso a tu
              cuenta de MyTeacher. Como no recuerdas tu contraseña anterior,
              te hemos proporcionado una contraseña temporal para que puedas
              volver a ingresar.
            </Text>

            {/* Contraseña temporal */}
            <Section style={passwordCard}>
              <Text style={passwordLabel}>
                TU CONTRASEÑA TEMPORAL
              </Text>

              <Text style={passwordValue}>
                {temporaryPassword}
              </Text>

              <Text style={passwordHint}>
                Utiliza esta contraseña para iniciar sesión en MyTeacher.
              </Text>
            </Section>

            {/* Aviso de seguridad */}
            <Section style={securityCard}>
              <Text style={securityTitle}>
                🛡️ Recomendaciones de seguridad
              </Text>

              <Text style={securityText}>
                • No compartas esta contraseña con nadie.
              </Text>

              <Text style={securityText}>
                • Inicia sesión y cambia la contraseña temporal por una
                nueva, segura y personal, tan pronto como sea posible.
              </Text>

              <Text style={securityText}>
                • Si no solicitaste recuperar tu cuenta, contacta al equipo
                de soporte de MyTeacher.
              </Text>
            </Section>

            {/* Botón de acceso */}
            <Section style={btnContainer}>
              <Button
                href="https://my-teacher-smoky.vercel.app"
                style={button}
              >
                Iniciar sesión →
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              Sabemos que olvidar una contraseña puede pasar. Nos alegra
              ayudarte a recuperar el acceso a tu cuenta y continuar
              aprendiendo con MyTeacher.
            </Text>

            <Text style={signature}>
              ¡Te esperamos!
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
              Este es un correo automático de recuperación de cuenta.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TemporaryPasswordEmail;

// ============================================
// ESTILOS
// ============================================

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

const lockIcon = {
  fontSize: '36px',
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

const passwordCard = {
  backgroundColor: '#f0f7ff',
  border: '1px solid #d6e7ff',
  borderRadius: '12px',
  padding: '25px 18px',
  textAlign: 'center' as const,
  margin: '0 0 22px',
};

const passwordLabel = {
  color: '#475467',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  margin: '0 0 15px',
};

const passwordValue = {
  color: '#17469b',
  backgroundColor: '#ffffff',
  border: '1px dashed #2354b6',
  borderRadius: '8px',
  padding: '15px 10px',
  fontSize: '22px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  wordBreak: 'break-all' as const,
  margin: '0 0 15px',
};

const passwordHint = {
  color: '#667085',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
};

const securityCard = {
  backgroundColor: '#fff8eb',
  borderLeft: '4px solid #f0ad4e',
  borderRadius: '6px',
  padding: '17px',
  margin: '0 0 28px',
};

const securityTitle = {
  color: '#8a5a00',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const securityText = {
  color: '#66501c',
  fontSize: '13px',
  lineHeight: '1.8',
  margin: '0 0 8px',
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
  margin: '0 0 8px',
};

const footerSmall = {
  color: '#98a2b3',
  fontSize: '11px',
  lineHeight: '1.6',
  margin: '0',
};