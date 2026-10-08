import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, ArrowLeft } from 'lucide-react';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">Política de Privacidad</h1>
          </div>
          <p className="text-xs text-slate-400">
            Última actualización: 5 de Octubre de 2026 • Conforme a la legislación de Chile (Ley N° 19.628) y políticas de Meta Developers.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">1. Identificación del Responsable</h2>
            <p>
              SEGAR AI MARKETING SpA ("Segar AI", "nosotros"), con domicilio en Chile, es responsable del tratamiento de los datos personales suministrados por los usuarios en el sitio web y aplicaciones asociadas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">2. Información que Recopilamos</h2>
            <p>Recopilamos la información estrictamente necesaria para la prestación del servicio SaaS:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Datos de contacto:</strong> Nombre, dirección de correo electrónico, nombre comercial y rubro de su empresa.</li>
              <li><strong>Información de redes sociales:</strong> Nombre de usuario público de Instagram (@handle) y catálogos comerciales proporcionados por el cliente para el entrenamiento del asistente.</li>
              <li><strong>Mensajería de WhatsApp Cloud API y Meta Graph API:</strong> Mensajes recibidos exclusivamente con el fin de generar respuestas automatizadas de ventas guiadas por el Closer IA.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">3. Seguridad en los Pagos</h2>
            <p>
              Segar AI <strong>NO almacena números de tarjetas de crédito, débito ni claves bancarias</strong>. Todas las transacciones con tarjeta son procesadas de manera segura y encriptada por la pasarela de pagos <strong>Mercado Pago</strong> bajo estándares PCI-DSS. Las transferencias bancarias directas se efectúan de forma manual hacia cuentas autorizadas en Banco Estado / Cuenta RUT.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">4. Uso de Inteligencia Artificial (Google Gemini)</h2>
            <p>
              Los textos de posts y consultas de clientes son procesados a través de la API empresarial de Google Gemini sin fines de entrenamiento general con datos confidenciales de terceros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">5. Derechos del Usuario (ARCO)</h2>
            <p>
              Conforme a la Ley 19.628 de Protección de la Vida Privada de Chile, usted tiene derecho a solicitar el acceso, rectificación, cancelación u oposición al tratamiento de sus datos personales escribiéndonos a <strong className="text-white">operaciones.segar.ant@gmail.com</strong> o a través de nuestro soporte oficial de WhatsApp al <strong className="text-emerald-400">+56 9 91842110</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
