import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TerminosPage() {
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
            <FileText className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">Términos y Condiciones del Servicio</h1>
          </div>
          <p className="text-xs text-slate-400">
            SEGAR AI MARKETING — Software as a Service (SaaS) en Chile y Latinoamérica.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">1. Aceptación del Servicio</h2>
            <p>
              Al suscribirse o utilizar SEGAR AI MARKETING, el usuario acepta de manera expresa e irrevocable los presentes Términos y Condiciones.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">2. Planes, Tarifas y Facturación</h2>
            <p>
              El servicio opera bajo modalidad de suscripción mensual recurrente o prepago por transferencia bancaria:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Plan Emprendedor:</strong> $15.000 CLP / $17 USD mensual.</li>
              <li><strong>Plan Pro:</strong> $29.900 CLP / $33 USD mensual.</li>
              <li><strong>Plan Agencia:</strong> $59.900 CLP / $67 USD mensual.</li>
            </ul>
            <p className="mt-2">
              No existen contratos de permanencia ni cláusulas de amarre. El usuario puede cancelar su suscripción en cualquier momento antes del siguiente ciclo de facturación.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">3. Límites de Uso Ético y Cuotas</h2>
            <p>
              Para mantener la estabilidad del sistema y garantizar costos $0 de infraestructura, cada plan cuenta con un cupo asignado de publicaciones y respuestas mensuales. El uso abusivo para spam o generación de contenido ilícito provocará la suspensión inmediata de la cuenta.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">4. Propiedad del Contenido Generado</h2>
            <p>
              Todos los textos, copys publicitarios y creativos generados por la plataforma son de propiedad exclusiva del cliente, quien podrá utilizarlos libremente en sus campañas de marketing y redes sociales.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
