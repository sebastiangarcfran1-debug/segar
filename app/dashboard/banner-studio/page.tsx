'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Layers,
  Image as ImageIcon,
  Type,
  Zap,
  CheckCircle,
  Share2,
  RefreshCw,
  Sliders,
  DollarSign,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface BannerConfig {
  badge: string;
  titular: string;
  subtitulo: string;
  precio: string;
  ctaTexto: string;
  ctaColor: string;
  badgeColor: string;
  imageUrl: string;
  formato: '1:1' | '9:16' | '16:9';
  logoText: string;
  conversionScore: number;
}

export default function BannerStudioPage() {
  const [rubro, setRubro] = useState('Moda y Vestuario Femenino');
  const [producto, setProducto] = useState('Chaqueta de Cuero Premium 2026');
  const [oferta, setOferta] = useState('30% de Descuento + Envío Gratis a Todo Chile');
  const [estilo, setEstilo] = useState('Lujo Oscuro & Neón');
  const [generando, setGenerando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  const [banner, setBanner] = useState<BannerConfig>({
    badge: 'OFERTA LIMITADA • SÓLO POR HOY',
    titular: 'ELEVA TU ESTILO CON CUERO GENUINO',
    subtitulo: 'Diseño exclusivo confeccionado a mano. Edición limitada de 50 unidades.',
    precio: '$49.990 CLP (Antes $75.000)',
    ctaTexto: 'PEDIR POR WHATSAPP AHORA',
    ctaColor: '#4f46e5', // indigo
    badgeColor: '#e11d48', // rose
    imageUrl: 'https://image.pollinations.ai/prompt/luxury%20leather%20jacket%20fashion%20editorial%20model%20cinematic%20studio%20lighting%20photorealistic?width=1080&height=1080&nologo=true',
    formato: '1:1',
    logoText: 'SEGAR BOUTIQUE',
    conversionScore: 98,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presets = [
    { nombre: 'Moda & Ropa', rubro: 'Boutique de Ropa', producto: 'Vestido de Fiesta Gala', oferta: 'Envío Gratis 24 Horas en Santiago' },
    { nombre: 'Comida & Delivery', rubro: 'Hamburguesería Artesanal', producto: 'Doble Bacon Cheddar Burger', oferta: 'Combo 2x1 los Jueves' },
    { nombre: 'Servicios & Consultoría', rubro: 'Clínica Estética', producto: 'Tratamiento Facial Botox', oferta: 'Evaluación Gratuita + 20% OFF' },
    { nombre: 'Tecnología & E-commerce', rubro: 'Gadgets y Celulares', producto: 'Smartwatch Pro 2026', oferta: 'Garantía 1 Año + Despacho Inmediato' },
  ];

  const handleGenerarConIA = async () => {
    setGenerando(true);
    setNotificacion('');
    try {
      const res = await fetch('/api/ai/banner-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubro, producto, oferta, estilo, formato: banner.formato }),
      });

      const data = await res.json();
      if (data.success && data.banner) {
        setBanner((prev) => ({
          ...prev,
          badge: data.banner.badge || prev.badge,
          titular: data.banner.titular || prev.titular,
          subtitulo: data.banner.subtitulo || prev.subtitulo,
          precio: data.banner.precio || prev.precio,
          ctaTexto: data.banner.ctaTexto || prev.ctaTexto,
          imageUrl: data.banner.imageUrl || prev.imageUrl,
          conversionScore: data.banner.conversionScore || 97,
        }));
        mostrarNotificacion('¡Creatividad publicitaria generada con éxito con IA!');
      } else {
        alert(data.error || 'Error generando contenido publicitario.');
      }
    } catch (err: any) {
      alert('Error al conectar con la IA: ' + err.message);
    } finally {
      setGenerando(false);
    }
  };

  const mostrarNotificacion = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(''), 4000);
  };

  // Renderizar y Descargar en Canvas
  const descargarEnAltaResolucion = () => {
    setDescargando(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1080;
    if (banner.formato === '9:16') {
      width = 1080;
      height = 1920;
    } else if (banner.formato === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = banner.imageUrl;

    img.onload = () => {
      // 1. Dibujar imagen de fondo
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Filtro de viñeta oscura para legibilidad
      const gradient = ctx.createLinearGradient(0, height * 0.3, 0, height);
      gradient.addColorStop(0, 'rgba(7, 11, 20, 0.1)');
      gradient.addColorStop(0.5, 'rgba(7, 11, 20, 0.7)');
      gradient.addColorStop(1, 'rgba(7, 11, 20, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Logo en la esquina superior
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(banner.logoText.toUpperCase(), 70, 90);

      // 4. Badge Superior
      const badgeY = banner.formato === '9:16' ? height * 0.55 : height * 0.48;
      ctx.fillStyle = banner.badgeColor;
      // Dibujar pill redondeado
      const badgeWidth = ctx.measureText(banner.badge).width + 80;
      const badgeHeight = 52;
      ctx.beginPath();
      ctx.roundRect(70, badgeY - 36, badgeWidth, badgeHeight, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(banner.badge.toUpperCase(), 95, badgeY);

      // 5. Titular
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 15;
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY;
      };

      const titularY = badgeY + 70;
      const endTitularY = wrapText(banner.titular, 70, titularY, width - 140, 72);

      // 6. Subtítulo
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'normal 32px sans-serif';
      const endSubY = wrapText(banner.subtitulo, 70, endTitularY + 60, width - 140, 42);

      // 7. Precio
      ctx.fillStyle = '#fde047'; // amarillo brillante
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(banner.precio, 70, endSubY + 65);

      // 8. Botón CTA
      const ctaY = endSubY + 110;
      ctx.fillStyle = banner.ctaColor;
      const ctaWidth = 440;
      const ctaHeight = 76;
      ctx.beginPath();
      ctx.roundRect(70, ctaY, ctaWidth, ctaHeight, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(banner.ctaTexto.toUpperCase(), 70 + ctaWidth / 2, ctaY + 48);

      // Descargar enlace
      const link = document.createElement('a');
      link.download = `segar-anuncio-${banner.formato.replace(':', 'x')}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDescargando(false);
      mostrarNotificacion('¡Anuncio publicitario descargado en alta resolución PNG!');
    };

    img.onerror = () => {
      alert('Error cargando la imagen para el renderizado. Intenta con otra imagen o genera una nueva.');
      setDescargando(false);
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ADCREATIVE STUDIO PRO • COMPOSITOR DE ANUNCIOS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Banner & Ad Studio de Alto Rendimiento
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Genera creatividades publicitarias con diseño gráfico profesional, superposición de logotipos, precios en $ CLP,
            botones de llamada a la acción y descarga en alta definición lista para pauta.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={descargarEnAltaResolucion}
            disabled={descargando}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition"
          >
            <Download className="h-4 w-4" />
            <span>{descargando ? 'Renderizando...' : 'Descargar Anuncio PNG'}</span>
          </button>
        </div>
      </div>

      {notificacion && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Controles y Generador */}
        <div className="lg:col-span-5 space-y-6">
          {/* Plantillas Rápidas */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Plantillas Rápidas de Nicho</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRubro(p.rubro);
                    setProducto(p.producto);
                    setOferta(p.oferta);
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition"
                >
                  <p className="font-bold text-white">{p.nombre}</p>
                  <p className="text-[10px] text-slate-400 truncate">{p.producto}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Campaña */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span>Parámetros del Anuncio</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Rubro de la Empresa</label>
              <input
                type="text"
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Ej: Joyería Fina, Barbería, Consultoría"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Producto o Servicio a Vender</label>
              <input
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Ej: Reloj Sumergible Pro, Limpieza Dental"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Oferta, Gancho o Descuento</label>
              <input
                type="text"
                value={oferta}
                onChange={(e) => setOferta(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Ej: 30% OFF hoy, 2x1, Envío gratis"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Formato</label>
                <select
                  value={banner.formato}
                  onChange={(e) => setBanner({ ...banner, formato: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="1:1">1:1 Cuadrado (Feed Instagram/FB)</option>
                  <option value="9:16">9:16 Vertical (Stories/Reels)</option>
                  <option value="16:9">16:9 Horizontal (Web/Banner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Estilo Visual</label>
                <select
                  value={estilo}
                  onChange={(e) => setEstilo(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Lujo Oscuro & Neón">Lujo Oscuro & Neón</option>
                  <option value="Minimalista Nórdico">Minimalista Nórdico</option>
                  <option value="Vibrante & Oferta Directa">Vibrante & Oferta Directa</option>
                  <option value="Corporativo y Elegante">Corporativo y Elegante</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerarConIA}
              disabled={generando}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{generando ? 'Diseñando Anuncio con IA...' : 'Generar Creatividad Publicitaria IA'}</span>
            </button>
          </div>

          {/* Editor en Vivo de Textos y Colores */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ajuste Manual de Elementos</span>
            </h3>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nombre / Logo de Marca</label>
              <input
                type="text"
                value={banner.logoText}
                onChange={(e) => setBanner({ ...banner, logoText: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Badge de Descuento</label>
              <input
                type="text"
                value={banner.badge}
                onChange={(e) => setBanner({ ...banner, badge: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Titular Principal</label>
              <input
                type="text"
                value={banner.titular}
                onChange={(e) => setBanner({ ...banner, titular: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Subtítulo / Beneficio</label>
              <input
                type="text"
                value={banner.subtitulo}
                onChange={(e) => setBanner({ ...banner, subtitulo: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Precio en $ CLP</label>
              <input
                type="text"
                value={banner.precio}
                onChange={(e) => setBanner({ ...banner, precio: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-yellow-300 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Texto del Botón CTA</label>
                <input
                  type="text"
                  value={banner.ctaTexto}
                  onChange={(e) => setBanner({ ...banner, ctaTexto: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Color del Botón</label>
                <input
                  type="color"
                  value={banner.ctaColor}
                  onChange={(e) => setBanner({ ...banner, ctaColor: e.target.value })}
                  className="w-full h-8 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Render Visual en Tiempo Real */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Bar with Score */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-white">Vista Previa de Anuncio Real</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Score de Conversión:</span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-extrabold text-emerald-300">
                ⚡ {banner.conversionScore}/100 • Alta Pauta
              </span>
            </div>
          </div>

          {/* Visual Canvas Card */}
          <div className="flex justify-center bg-slate-950 p-4 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
            <div
              className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all select-none ${
                banner.formato === '9:16'
                  ? 'w-[320px] h-[568px]'
                  : banner.formato === '16:9'
                  ? 'w-[560px] h-[315px]'
                  : 'w-[440px] h-[440px]'
              }`}
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

              {/* Logo Top Left */}
              <div className="absolute top-5 left-5 z-10">
                <span className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-black tracking-widest text-white border border-white/20">
                  {banner.logoText.toUpperCase()}
                </span>
              </div>

              {/* Content Overlay Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10 space-y-2.5">
                {/* Discount Badge */}
                <div>
                  <span
                    className="inline-block rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg"
                    style={{ backgroundColor: banner.badgeColor }}
                  >
                    {banner.badge}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {banner.titular}
                </h2>

                {/* Subtitle */}
                <p className="text-xs text-slate-200 line-clamp-2 drop-shadow">
                  {banner.subtitulo}
                </p>

                {/* Price Tag */}
                <div className="pt-1">
                  <span className="inline-block text-base font-extrabold text-yellow-400 drop-shadow">
                    {banner.precio}
                  </span>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    className="w-full rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-xl hover:brightness-110 active:scale-95 transition"
                    style={{ backgroundColor: banner.ctaColor }}
                  >
                    {banner.ctaTexto}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={descargarEnAltaResolucion}
              disabled={descargando}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>{descargando ? 'Descargando...' : 'Descargar PNG'}</span>
            </button>

            <button
              onClick={() => {
                const url = `https://wa.me/56991842110?text=${encodeURIComponent(
                  `Hola! Acabo de crear este anuncio para mi negocio: ${banner.titular} (${banner.precio}). Quiero publicarlo con pauta pagada.`
                )}`;
                window.open(url, '_blank');
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md"
            >
              <Share2 className="h-4 w-4" />
              <span>Enviar a WhatsApp</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `🔥 ${banner.badge}\n\n${banner.titular}\n${banner.subtitulo}\n\n💰 Precio: ${banner.precio}\n👉 ${banner.ctaTexto}`
                );
                mostrarNotificacion('¡Textos del anuncio copiados al portapapeles!');
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar Textos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
