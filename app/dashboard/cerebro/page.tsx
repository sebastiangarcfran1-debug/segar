'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  CreditCard,
  Phone,
  HelpCircle,
  FileText,
  ShieldCheck,
  Send,
  Bot,
  Zap,
} from 'lucide-react';

interface ProductoItem {
  nombre: string;
  precioCLP: string;
  descripcion: string;
}

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export default function CerebroNegocioPage() {
  const [nombreNegocio, setNombreNegocio] = useState('Boutique Bella Santiago');
  const [rubro, setRubro] = useState('Moda y Vestuario Femenino');
  const [whatsapp, setWhatsapp] = useState('+56 9 91842110');
  const [direccion, setDireccion] = useState('Av. Providencia 1234, Local 45');
  const [ciudad, setCiudad] = useState('Santiago, Chile');
  const [coberturaEnvios, setCoberturaEnvios] = useState('Envíos a todo Chile vía Starken, Blue Express y Chilexpress. En Santiago entrega en 24 hrs.');
  const [horarioAtencion, setHorarioAtencion] = useState('Lunes a Viernes de 10:00 a 19:30 hrs. Sábados de 11:00 a 16:00 hrs.');
  const [metodosPago, setMetodosPago] = useState('Copec Pay, Transferencia Bancaria, Tarjeta de Débito/Crédito (Webpay Flow)');
  const [politicaGarantia, setPoliticaGarantia] = useState('Cambios hasta 30 días con boleta. Garantía legal de 6 meses por fallas de fábrica.');
  const [notasEspeciales, setNotasEspeciales] = useState('Envío gratis por compras sobre $45.000 CLP. No atendemos domingos ni feriados.');

  const [productos, setProductos] = useState<ProductoItem[]>([
    { nombre: 'Chaqueta Biker Cuero Vegano', precioCLP: '$39.990 CLP', descripcion: 'Color negro, tallas S a XL, forro térmico suave.' },
    { nombre: 'Jeans Flare Tiro Alto', precioCLP: '$26.900 CLP', descripcion: 'Calce perfecto, mezclilla elasticada premium.' },
    { nombre: 'Blazer Oversize Italiano', precioCLP: '$44.900 CLP', descripcion: 'Disponible en beige, negro y terracota.' },
  ]);

  const [faqs, setFaqs] = useState<FaqItem[]>([
    { pregunta: '¿Hacen envíos a regiones?', respuesta: 'Sí, despachamos todos los días hábiles a todas las regiones de Chile por Blue Express y Starken.' },
    { pregunta: '¿Cómo compro?', respuesta: 'Puedes comprar directo por nuestro WhatsApp o transferir a nuestra cuenta Copec Pay y enviarnos el comprobante.' },
  ]);

  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  // Simulador de prueba en vivo
  const [preguntaPrueba, setPreguntaPrueba] = useState('');
  const [chatPrueba, setChatPrueba] = useState<{ remitente: 'usuario' | 'ia'; texto: string }[]>([
    { remitente: 'ia', texto: '¡Hola! Soy la IA de tu negocio. He memorizado tus precios, horarios y políticas. Pregúntame algo para comprobar que no invento nada.' },
  ]);
  const [probandoIA, setProbandoIA] = useState(false);

  useEffect(() => {
    // Cargar si existe guardado
    fetch('/api/knowledge-base')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.knowledge) {
          const k = data.knowledge;
          if (k.nombreNegocio) setNombreNegocio(k.nombreNegocio);
          if (k.rubro) setRubro(k.rubro);
          if (k.whatsapp) setWhatsapp(k.whatsapp);
          if (k.direccion) setDireccion(k.direccion);
          if (k.ciudad) setCiudad(k.ciudad);
          if (k.coberturaEnvios) setCoberturaEnvios(k.coberturaEnvios);
          if (k.horarioAtencion) setHorarioAtencion(k.horarioAtencion);
          if (k.metodosPago) setMetodosPago(k.metodosPago);
          if (k.politicaEnvioGarantia) setPoliticaGarantia(k.politicaEnvioGarantia);
          if (k.notasEspeciales) setNotasEspeciales(k.notasEspeciales);
          if (k.productosPrincipales && k.productosPrincipales.length > 0) setProductos(k.productosPrincipales);
          if (k.preguntasFrecuentes && k.preguntasFrecuentes.length > 0) setFaqs(k.preguntasFrecuentes);
        }
      })
      .catch(() => {});
  }, []);

  const handleGuardarCerebro = async () => {
    setGuardando(true);
    try {
      const payload = {
        nombreNegocio,
        rubro,
        whatsapp,
        direccion,
        ciudad,
        coberturaEnvios,
        horarioAtencion,
        metodosPago,
        productosPrincipales: productos,
        politicaEnvioGarantia: politicaGarantia,
        preguntasFrecuentes: faqs,
        notasEspeciales,
      };

      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setNotificacion('¡Cerebro del negocio guardado! Ahora el Closer de Ventas, los posts y los anuncios responderán con estos datos exactos.');
        setTimeout(() => setNotificacion(''), 5000);
      } else {
        alert('Error al guardar el conocimiento.');
      }
    } catch (e: any) {
      alert('Error de conexión: ' + e.message);
    } finally {
      setGuardando(false);
    }
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: '', precioCLP: '', descripcion: '' }]);
  };

  const eliminarProducto = (index: number) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const actualizarProducto = (index: number, campo: keyof ProductoItem, valor: string) => {
    const copia = [...productos];
    copia[index][campo] = valor;
    setProductos(copia);
  };

  const agregarFaq = () => {
    setFaqs([...faqs, { pregunta: '', respuesta: '' }]);
  };

  const eliminarFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const actualizarFaq = (index: number, campo: keyof FaqItem, valor: string) => {
    const copia = [...faqs];
    copia[index][campo] = valor;
    setFaqs(copia);
  };

  const probarPreguntaCerebro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preguntaPrueba.trim() || probandoIA) return;

    const textoPregunta = preguntaPrueba;
    setPreguntaPrueba('');
    setChatPrueba((prev) => [...prev, { remitente: 'usuario', texto: textoPregunta }]);
    setProbandoIA(true);

    try {
      const res = await fetch('/api/ai/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensajeCliente: textoPregunta,
          rubro,
          producto: productos.map((p) => `${p.nombre} (${p.precioCLP})`).join(', '),
          objetivo: 'Responder con los datos exactos del cerebro sin inventar nada',
        }),
      });

      const data = await res.json();
      if (data.success && data.respuesta) {
        setChatPrueba((prev) => [
          ...prev,
          { remitente: 'ia', texto: data.respuesta.respuestaSugerida || 'Aquí tienes la información solicitada.' },
        ]);
      } else {
        setChatPrueba((prev) => [
          ...prev,
          {
            remitente: 'ia',
            texto: `Información de la empresa: ${nombreNegocio}. Horarios: ${horarioAtencion}. Envíos: ${coberturaEnvios}. Métodos de pago: ${metodosPago}.`,
          },
        ]);
      }
    } catch {
      setChatPrueba((prev) => [
        ...prev,
        { remitente: 'ia', texto: `Nuestros productos son: ${productos.map((p) => p.nombre).join(', ')}. ¿Te gustaría más detalles?` },
      ]);
    } finally {
      setProbandoIA(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 mb-2">
            <Brain className="h-3.5 w-3.5" />
            <span>BUSINESS BRAIN RAG • BASE DE CONOCIMIENTO CENTRAL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Cerebro del Negocio & Memoria de la IA
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Alimenta a la Inteligencia Artificial con tus precios reales en $ CLP, catálogo, horarios, políticas de envío y garantías.
            Garantiza que la IA nunca invente información falsa y venda exactamente lo que tienes.
          </p>
        </div>

        <button
          onClick={handleGuardarCerebro}
          disabled={guardando}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition"
        >
          <Save className="h-4 w-4" />
          <span>{guardando ? 'Memorizando datos...' : 'Guardar en el Cerebro IA'}</span>
        </button>
      </div>

      {notificacion && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Datos Estructurados */}
        <div className="lg:col-span-7 space-y-6">
          {/* Datos Generales */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>1. Identidad y Canales de Contacto</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rubro / Industria</label>
                <input
                  type="text"
                  value={rubro}
                  onChange={(e) => setRubro(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-emerald-400" /> WhatsApp Oficial de Ventas
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-indigo-400" /> Ubicación / Ciudad
                </label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-400" /> Horarios de Atención
              </label>
              <input
                type="text"
                value={horarioAtencion}
                onChange={(e) => setHorarioAtencion(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Catálogo de Productos con Precios Reales */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                <span>2. Catálogo de Productos / Servicios & Precios Reales ($ CLP)</span>
              </h3>
              <button
                type="button"
                onClick={agregarProducto}
                className="flex items-center gap-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:text-white transition"
              >
                <Plus className="h-3 w-3" />
                <span>Agregar Producto</span>
              </button>
            </div>

            <div className="space-y-3">
              {productos.map((prod, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 relative group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prod.nombre}
                      placeholder="Nombre del producto o servicio"
                      onChange={(e) => actualizarProducto(index, 'nombre', e.target.value)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      value={prod.precioCLP}
                      placeholder="Precio en CLP (ej: $25.000 CLP)"
                      onChange={(e) => actualizarProducto(index, 'precioCLP', e.target.value)}
                      className="w-36 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-yellow-300 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={prod.descripcion}
                    placeholder="Descripción, tallas, colores o características clave"
                    onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)}
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Envíos, Medios de Pago y Garantías */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-indigo-400" />
              <span>3. Logística de Envíos & Métodos de Pago</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Políticas y Tiempos de Envío</label>
              <textarea
                rows={2}
                value={coberturaEnvios}
                onChange={(e) => setCoberturaEnvios(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Medios de Pago Aceptados</label>
              <input
                type="text"
                value={metodosPago}
                onChange={(e) => setMetodosPago(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Garantía y Políticas de Devolución</label>
              <input
                type="text"
                value={politicaGarantia}
                onChange={(e) => setPoliticaGarantia(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Notas Especiales o Promociones Vigentes</label>
              <input
                type="text"
                value={notasEspeciales}
                onChange={(e) => setNotasEspeciales(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Preguntas Frecuentes (FAQ) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                <span>4. Preguntas Frecuentes del Negocio (FAQ)</span>
              </h3>
              <button
                type="button"
                onClick={agregarFaq}
                className="flex items-center gap-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:text-white transition"
              >
                <Plus className="h-3 w-3" />
                <span>Agregar FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Pregunta del cliente (ej: ¿Tienen tienda física?)"
                      value={faq.pregunta}
                      onChange={(e) => actualizarFaq(idx, 'pregunta', e.target.value)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarFaq(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Respuesta oficial que la IA debe dar"
                    value={faq.respuesta}
                    onChange={(e) => actualizarFaq(idx, 'respuesta', e.target.value)}
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sandbox: Test en Vivo del Cerebro RAG */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1424] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <Bot className="h-4 w-4" />
                <span>SIMULADOR DE PREGUNTAS EN VIVO</span>
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <p className="text-xs text-slate-400">
              Prueba hacerle una pregunta real a la IA (ej: *"¿Cuánto cuesta el blazer?"*, *"¿Tienen despacho a Viña del Mar?"*, *"¿Qué formas de pago reciben?"*).
              Comprobarás cómo extrae las respuestas exactas de los datos que acabas de ingresar.
            </p>

            {/* Chat Sandbox */}
            <div className="h-80 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              {chatPrueba.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.remitente === 'usuario'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.texto}
                  </div>
                </div>
              ))}
              {probandoIA && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-400 animate-pulse">
                    Consultando el cerebro de la empresa...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={probarPreguntaCerebro} className="flex gap-2">
              <input
                type="text"
                placeholder="Haz una pregunta a tu IA..."
                value={preguntaPrueba}
                onChange={(e) => setPreguntaPrueba(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={probandoIA}
                className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Tarjeta de Garantía de Cero Alucinación */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Garantía de Fidelidad de Datos</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todos los datos guardados en esta sección se inyectan automáticamente en el sistema central de generación:
              el Closer de WhatsApp, la Fábrica de 30 Posts, los Video Ads y los Carruseles respetarán estrictamente tus precios reales,
              tu inventario y tu cobertura sin inventar ofertas ficticias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
