import './globals.css';

export const metadata = {
  title: 'Finanzas Personales',
  description: 'Aplicación para gestionar finanzas personales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}