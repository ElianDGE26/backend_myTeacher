import * as React from 'react';

import { Html, Head, Body, Container, Section, Text, Heading, Button, Preview, Hr } from '@react-email/components';

interface PasswordChangeEmailProps {
    name: string;
}

export const PasswordChangeEmail = ({ name }: PasswordChangeEmailProps) => {
    return (<Html> <Head /> <Preview>
        ¡Contraseña actualizada! Tu cuenta de MyTeacher está lista. </Preview>


        <Body style={main}>
            <Container style={container}>
                {/* Encabezado */}
                <Section style={header}>
                    <Text style={brand}>MyTeacher</Text>

                    <Section style={iconContainer}>
                        <Text style={checkIcon}>✓</Text>
                    </Section>

                    <Heading style={heading}>
                        ¡Contraseña actualizada!
                    </Heading>

                    <Text style={headerSubtitle}>
                        Tu seguridad es nuestra prioridad
                    </Text>
                </Section>

                {/* Contenido principal */}
                <Section style={bodySection}>
                    <Text style={greeting}>
                        ¡Hola,{' '}
                        <strong style={highlight}>{name}</strong>!
                    </Text>

                    <Text style={paragraph}>
                        Te confirmamos que la contraseña de tu cuenta de MyTeacher
                        se ha cambiado correctamente.
                    </Text>

                    <Section style={successCard}>
                        <Text style={successIcon}>🔐</Text>

                        <Text style={successTitle}>
                            Cambio realizado con éxito
                        </Text>

                        <Text style={successDescription}>
                            Tu nueva contraseña ya está activa. Puedes seguir
                            disfrutando de todas las funcionalidades de la plataforma.
                        </Text>
                    </Section>

                    <Section style={securityCard}>
                        <Text style={securityTitle}>
                            🛡️ Aviso de seguridad
                        </Text>

                        <Text style={securityText}>
                            Si realizaste este cambio, no necesitas hacer nada más.
                            Si no reconoces esta actividad, te recomendamos cambiar
                            tu contraseña inmediatamente y contactar al equipo de soporte.
                        </Text>
                    </Section>

                    <Section style={btnContainer}>
                        <Button
                            href="https://my-teacher-smoky.vercel.app"
                            style={button}
                        >
                            Ir a MyTeacher →
                        </Button>
                    </Section>

                    <Hr style={divider} />

                    <Text style={footerText}>
                        Gracias por confiar en MyTeacher. Seguimos trabajando
                        para ofrecerte una experiencia segura y confiable.
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
                        Este es un correo automático de seguridad.
                        Por favor, no respondas a este mensaje.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>


    );
};

export default PasswordChangeEmail;

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

const checkIcon = {
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

const successCard = {
    backgroundColor: '#f0f7ff',
    border: '1px solid #d6e7ff',
    borderRadius: '12px',
    padding: '22px 18px',
    textAlign: 'center' as const,
    margin: '0 0 22px',
};

const successIcon = {
    fontSize: '32px',
    margin: '0 0 10px',
};

const successTitle = {
    color: '#17469b',
    fontSize: '17px',
    fontWeight: 'bold',
    margin: '0 0 10px',
};

const successDescription = {
    color: '#475467',
    fontSize: '14px',
    lineHeight: '1.7',
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
    margin: '0 0 10px',
};

const securityText = {
    color: '#66501c',
    fontSize: '13px',
    lineHeight: '1.8',
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
