"use client";

import { AnchorHTMLAttributes, FormEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WHATSAPP = "5598989030398";
const logo = "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/LOGO_MOSSORO_PNG.png";

const productCards = [
  { title: "Mobiliário corporativo", text: "Mesas, armários, estações de trabalho e soluções para ambientes mais organizados, funcionais e profissionais.", ideal: "Escritórios, salas administrativas, recepções e salas de reunião.", image: "https://mossoroempresarial.com.br/wp-content/uploads/slider/cache/6540a0d8804d5b2f75221dd770ce6c2f/avantti-1.jpg", tag: "MOBILIÁRIO" },
  { title: "Mobiliário de aço", text: "Armários, roupeiros e produtos resistentes para empresas que precisam melhorar a organização no dia a dia.", ideal: "Empresas, indústrias, vestiários e áreas de grande circulação.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/moveis-de-aco.jpg", tag: "AÇO" },
  { title: "Cadeiras corporativas", text: "Conforto, funcionalidade e uma apresentação profissional para cada ambiente da sua empresa.", ideal: "Postos de trabalho, clínicas, recepções e diretorias.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/cadeira-de-escritorio.jpg", tag: "CADEIRAS" },
];

const galleryImages = [
  { src: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/avantti-1.jpg", alt: "Escritório executivo com mesa, armários e cadeira corporativa", label: "Escritórios executivos" },
  { src: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/47156838473725d7ba6e15578f.jpg", alt: "Ambiente corporativo com estações de trabalho integradas", label: "Estações de trabalho" },
  { src: "https://mossoroempresarial.com.br/wp-content/uploads/2022/11/Sofa-Cabine.png", alt: "Sofás em formato de cabine para espaços de concentração", label: "Concentração e privacidade" },
  { src: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/fundo-cadeiras.jpg", alt: "Sala educacional equipada com mesas e cadeiras", label: "Ambientes educacionais" },
  { src: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/banner.png", alt: "Sala colaborativa com cadeiras corporativas e elementos naturais", label: "Espaços colaborativos" },
];

const clientLogos = [
  { src: "/logos-clientes/Logotipo_Vale.svg.webp", alt: "Vale" },
  { src: "/logos-clientes/regular_642f24cc9fa5e8c1836873e6ff29c5c7.png", alt: "Ambev" },
  { src: "/logos-clientes/coca-cola.png", alt: "Coca-Cola" },
  { src: "/logos-clientes/Alcoa_logo_(2016).svg.webp", alt: "Alcoa" },
  { src: "/logos-clientes/Logo-Ultracargo-para-fundo-Cinza-ou-Branco_PNG.png", alt: "Ultracargo" },
  { src: "/logos-clientes/images.png", alt: "Eneva" },
  { src: "/logos-clientes/LogoCarreiras.png", alt: "VLI" },
  { src: "/logos-clientes/tracbel-2.png", alt: "Tracbel" },
  { src: "/logos-clientes/IMG_3713.PNG", alt: "Canopus" },
  { src: "/logos-clientes/IMG_3714.PNG", alt: "Ceuma Universidade" },
  { src: "/logos-clientes/IMG_3715.PNG", alt: "Lucena Infraestrutura" },
  { src: "/logos-clientes/IMG_3716.JPG.jpeg", alt: "Maple Bear" },
  { src: "/logos-clientes/IMG_3717.JPG.jpeg", alt: "VIP Leilões" },
];

const benefits = [
  ["01", "Atendimento especializado", "Opções adequadas ao espaço, rotina e necessidade da sua empresa."],
  ["02", "Soluções em um só lugar", "Mobiliário corporativo, cadeiras, armários e linha de aço para seu projeto."],
  ["03", "Para cada necessidade", "Da troca de algumas cadeiras à estruturação de novos ambientes."],
  ["04", "Entrega e montagem", "Mais praticidade para receber o mobiliário pronto para utilização."],
  ["05", "Experiência corporativa", "Soluções para empresas que valorizam funcionalidade e presença profissional."],
];

function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* Parâmetros de rastreio capturados da URL e mantidos durante toda a sessão. */
const TRACKING_STORAGE_KEY = "mossoro:tracking";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
const TRACKING_FIELDS = [...UTM_FIELDS, "referrer", "landing_page"] as const;

type TrackingData = Record<(typeof TRACKING_FIELDS)[number], string>;

const EMPTY_TRACKING = Object.fromEntries(TRACKING_FIELDS.map((field) => [field, ""])) as TrackingData;

/* A primeira visita com UTMs vence: cliques internos sem parâmetros não apagam a origem do lead. */
function loadTracking(): TrackingData {
  const tracking = { ...EMPTY_TRACKING };
  if (typeof window === "undefined") return tracking;

  let stored: Partial<TrackingData> = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(TRACKING_STORAGE_KEY) ?? "{}");
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const urlHasUtm = UTM_FIELDS.some((field) => params.get(field));
  UTM_FIELDS.forEach((field) => {
    tracking[field] = (urlHasUtm ? params.get(field) : stored[field]) ?? "";
  });
  tracking.referrer = stored.referrer || document.referrer || "";
  tracking.landing_page = stored.landing_page || window.location.href;

  try {
    window.sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));
  } catch {
    /* sessionStorage indisponível (modo privado): segue apenas em memória. */
  }

  return tracking;
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const target = window as unknown as { dataLayer?: Record<string, unknown>[] };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push(payload);
}

/* Nome e local do botão viajam no evento para virar gatilho/variável no GTM. */
function trackButtonClick(buttonName: string, buttonLocation: string) {
  pushDataLayer({ event: "click_botao", button_text: buttonName, button_name: buttonName, button_location: buttonLocation });
}

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  buttonName: string;
  buttonLocation: string;
  children: ReactNode;
};

function CtaLink({ buttonName, buttonLocation, children, onClick, ...rest }: CtaLinkProps) {
  return (
    <a
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      data-gtm-event="click_botao"
      data-gtm-button={buttonName}
      data-gtm-location={buttonLocation}
      onClick={(event) => {
        trackButtonClick(buttonName, buttonLocation);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

/* Aceita apenas dígitos e devolve (00) 00000-0000 / (00) 0000-0000. */
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const isMobile = digits.length > 10;
  const middle = isMobile ? digits.slice(2, 7) : digits.slice(2, 6);
  const end = isMobile ? digits.slice(7) : digits.slice(6);
  const formatted = `(${digits.slice(0, 2)}) ${middle}`;

  return end ? `${formatted}-${end}` : formatted;
}

function SplitText({ text }: { text: string }) {
  const segments = text.split(/(\s+)/).filter(Boolean);

  return (
    <span className="split-text" aria-label={text}>
      {segments.map((segment, segmentIndex) =>
        /^\s+$/.test(segment) ? (
          <span className="split-space" aria-hidden="true" key={`space-${segmentIndex}`}>
            {" "}
          </span>
        ) : (
          <span className="split-word" aria-hidden="true" key={`word-${segmentIndex}`}>
            {Array.from(segment).map((character, index) => (
              <span className="split-char" key={`${character}-${index}`}>
                {character}
              </span>
            ))}
          </span>
        )
      )}
    </span>
  );
}

export default function Home() {
  const [sent, setSent] = useState(false);
  const [tracking, setTracking] = useState<TrackingData>(EMPTY_TRACKING);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const page = useRef<HTMLElement>(null);

  useEffect(() => setTracking(loadTracking()), []);

  useLayoutEffect(() => {
    if (!page.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".topbar", { y: -22, autoAlpha: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".hero-copy .eyebrow, .hero-copy .hero-lead, .hero-proof", {
        y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.13, delay: 0.2, ease: "power3.out"
      });
      gsap.from(".hero-copy .split-char", {
        yPercent: 115, autoAlpha: 0, duration: 0.58, stagger: 0.018, delay: 0.3, ease: "power4.out"
      });
      gsap.from(".quote-form", { x: 42, autoAlpha: 0, duration: 0.85, delay: 0.4, ease: "power3.out" });
      gsap.from(".hero-orb", { scale: 0.75, autoAlpha: 0, duration: 1.4, ease: "power2.out" });

      gsap.utils.toArray<HTMLElement>("[data-reveal-section]").forEach((section) => {
        const splitChars = section.querySelectorAll(".split-char");
        const revealItems = section.querySelectorAll("[data-reveal-item]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 76%", once: true }
        });

        if (splitChars.length) {
          timeline.from(splitChars, { yPercent: 115, autoAlpha: 0, duration: 0.52, stagger: 0.012, ease: "power4.out" });
        }
        if (revealItems.length) {
          timeline.from(revealItems, { y: 28, autoAlpha: 0, duration: 0.65, stagger: 0.11, ease: "power3.out" }, splitChars.length ? "-=0.2" : 0);
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-card-grid]").forEach((grid) => {
        gsap.from(grid.children, {
          y: 36, autoAlpha: 0, duration: 0.65, stagger: 0.13, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 81%", once: true }
        });
      });
    }, page);

    return () => context.revert();
  }, []);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const phoneDigits = String(data.get("whatsapp") ?? "").replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    const buttonName = "Quero falar com a Mossoró";
    trackButtonClick(buttonName, "formulario-hero");
    setSending(true);
    setError(false);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.get("nome"),
          email: data.get("email"),
          whatsapp: data.get("whatsapp"),
          whatsappDigitos: phoneDigits,
          empresa: data.get("empresa") || "",
          origem: "landing-page-mossoro",
          enviadoEm: new Date().toISOString(),
          ...tracking,
        }),
      });
      if (!response.ok) throw new Error("Falha ao enviar lead");
      const message = `Olá, sou ${data.get("nome")}. Gostaria de solicitar uma cotação para mobiliário empresarial.${data.get("empresa") ? ` Minha empresa é ${data.get("empresa")}.` : ""}`;
      pushDataLayer({ event: "gerar_lead", button_text: buttonName, button_name: buttonName, button_location: "formulario-hero", ...tracking });
      setSent(true);
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      form.reset();
      setPhone("");
    } catch { setError(true); }
    finally { setSending(false); }
  }

  const cta = whatsappLink("Olá! Gostaria de solicitar uma cotação para mobiliário empresarial.");

  return (
    <main ref={page}>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Mossoró Empresarial">
          <img src={logo} alt="Mossoró Móveis Empresariais" />
        </a>
        <div className="topbar-right">
          <span className="support"><i>●</i> Atendimento especializado</span>
          <CtaLink className="header-cta" href={cta} buttonName="Falar no WhatsApp" buttonLocation="header">Falar no WhatsApp <b>↗</b></CtaLink>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid"></div><div className="hero-orb"></div>
        <div className="wrap hero-content">
          <div className="hero-copy">
            <p className="eyebrow">MOBILIÁRIO PARA EMPRESAS</p>
            <h1><SplitText text="Seu ambiente de trabalho fala sobre o seu negócio." /></h1>
            <p className="hero-lead">Equipamentos e móveis profissionais para empresas que precisam de mais organização, conforto e funcionalidade.</p>
            <div className="hero-proof"><p>Mais de 10 anos oferecendo soluções para ambientes profissionais.</p></div>
          </div>
          <form className="quote-form" onSubmit={submit}>
            <div className="form-heading"><div><strong>Solicite sua cotação</strong><small>Fale com nossa equipe sem compromisso.</small></div></div>
            {TRACKING_FIELDS.map((field) => <input key={field} type="hidden" name={field} value={tracking[field]} readOnly />)}
            <label>Seu nome<input required name="nome" placeholder="Como podemos chamar você?" /></label>
            <label>E-mail<input required name="email" type="email" autoComplete="email" placeholder="voce@suaempresa.com.br" /></label>
            <label>WhatsApp<input
              required
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={15}
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(event) => { setPhone(formatPhone(event.target.value)); setPhoneError(false); }}
              aria-invalid={phoneError}
            /></label>
            {phoneError && <p className="error">Informe um WhatsApp válido com DDD.</p>}
            <label>Empresa <span>(opcional)</span><input name="empresa" placeholder="Nome da sua empresa" /></label>
          <button type="submit" disabled={sending} data-gtm-event="click_botao" data-gtm-button="Quero falar com a Mossoró" data-gtm-location="formulario-hero">{sending ? "ENVIANDO..." : "QUERO FALAR COM A MOSSORÓ"} {!sending && <b>→</b>}</button>
          {sent && <p className="success">Seu WhatsApp foi aberto. Até já!</p>}
          {error && <p className="error">Não foi possível enviar agora. Tente novamente.</p>}
            <small className="privacy">Seus dados são usados apenas para este atendimento.</small>
          </form>
        </div>
      </section>

      <section className="solutions-banner">
        <div className="wrap solutions-banner-inner">
          <div className="solutions-banner-copy"><span>SOLUÇÃO COMPLETA</span><strong>Tudo para o seu espaço profissional.</strong></div>
          <ul className="solutions-banner-list" aria-label="Categorias de soluções">
            <li>Mobiliário</li><li>Aço</li><li>Cadeiras</li><li>Projetos</li>
          </ul>
          <span className="solutions-banner-delivery">● Entrega e montagem</span>
        </div>
      </section>

      <section className="clients" data-reveal-section>
        <div className="wrap"><p className="eyebrow blue clients-eyebrow" data-reveal-item>EMPRESAS QUE CONFIAM NA MOSSORÓ</p></div>
        <div className="clients-marquee" data-reveal-item>
          <div className="clients-track">
            {[...clientLogos, ...clientLogos].map((logo, index) => (
              <div className="client-logo" key={`${logo.alt}-${index}`}><img src={logo.src} alt={logo.alt} loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section benefits" data-reveal-section><div className="wrap">
        <div className="section-intro" data-reveal-item><p className="eyebrow blue">POR QUE ESCOLHER A MOSSORÓ</p><h2><SplitText text="Muito mais do que móveis." /><br /><em><SplitText text="A solução certa" /></em><SplitText text=" para o seu ambiente." /></h2><p>Na Mossoró Empresarial, cada atendimento começa entendendo o que sua empresa realmente precisa.</p></div>
        <div className="benefit-grid" data-card-grid>{benefits.map(([number, title, text]) => <article className="benefit" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <CtaLink href={cta} className="text-link" data-reveal-item buttonName="Fale com nossa equipe" buttonLocation="beneficios">FALE COM NOSSA EQUIPE <b>→</b></CtaLink>
      </div></section>

      <section className="section products" id="produtos" data-reveal-section><div className="wrap">
        <div className="product-heading" data-reveal-item><div><p className="eyebrow orange">NOSSAS SOLUÇÕES</p><h2><SplitText text="Escolha o que" /><br /><em><SplitText text="sua empresa precisa." /></em></h2></div><p>Produtos para transformar a rotina e a presença do seu ambiente profissional.</p></div>
        <div className="product-grid" data-card-grid>{productCards.map((product) => <article className="product" key={product.title}><div className="product-img"><img src={product.image} alt={product.title} /><span>{product.tag}</span></div><div className="product-info"><h3>{product.title}</h3><p>{product.text}</p><small><b>Ideal para:</b> {product.ideal}</small><CtaLink href={cta} buttonName="Quero um orçamento" buttonLocation={`produtos-${product.tag.toLowerCase()}`}>QUERO UM ORÇAMENTO <b>→</b></CtaLink></div></article>)}</div>
      </div></section>

      <section className="section photo-gallery" data-reveal-section>
        <div className="wrap">
          <div className="photo-gallery-heading" data-reveal-item><div><p className="eyebrow blue">AMBIENTES MOSSORÓ</p><h2><SplitText text="Soluções que transformam" /><br /><SplitText text="a experiência de cada espaço." /></h2></div><p>Conheça algumas possibilidades para criar ambientes mais funcionais, confortáveis e alinhados à rotina da sua empresa.</p></div>
          <div className="photo-gallery-grid" data-card-grid>
            {galleryImages.map((image, index) => <figure className={`photo-gallery-item photo-gallery-item-${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{image.label}</figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className="showcase" data-reveal-section><div className="showcase-media"></div><div className="showcase-shade"></div><div className="wrap showcase-content"><p className="eyebrow light" data-reveal-item>AMBIENTES QUE FUNCIONAM MELHOR</p><h2><SplitText text="Mais organização." /><br /><SplitText text="Mais conforto." /><br /><SplitText text="Mais resultado." /></h2><CtaLink href={cta} className="outline-button" data-reveal-item buttonName="Solicitar cotação" buttonLocation="showcase">SOLICITAR COTAÇÃO <b>→</b></CtaLink></div></section>

      <section className="section about" data-reveal-section><div className="wrap about-grid"><div className="about-visual" data-reveal-item><div className="visual-frame"></div></div><div className="about-copy"><p className="eyebrow blue" data-reveal-item>QUEM SOMOS</p><h2><SplitText text="Mossoró Empresarial:" /><br /><em><SplitText text="mobiliário para quem leva o trabalho a sério." /></em></h2><p data-reveal-item>A Mossoró Empresarial oferece soluções em mobiliário para empresas e ambientes profissionais, reunindo diferentes categorias de produtos para atender desde necessidades pontuais até projetos completos.</p><p data-reveal-item>Nosso objetivo é tornar a compra mais simples: entender a sua necessidade, indicar as melhores soluções e acompanhar o processo até a entrega.</p><CtaLink href={cta} className="dark-button" data-reveal-item buttonName="Conheça nossas soluções" buttonLocation="sobre">CONHEÇA NOSSAS SOLUÇÕES <b>→</b></CtaLink></div></div></section>

      <section className="final-cta" data-reveal-section><div className="wrap final-inner"><div><p className="eyebrow light" data-reveal-item>VAMOS COMEÇAR?</p><h2><SplitText text="Seu espaço pode" /><br /><SplitText text="trabalhar melhor." /></h2></div><CtaLink href={cta} className="yellow-button" data-reveal-item buttonName="Solicitar uma cotação" buttonLocation="cta-final">SOLICITAR UMA COTAÇÃO <b>→</b></CtaLink></div></section>

      <footer><div className="wrap footer-inner"><img src={logo} alt="Mossoró" /><p>Av. Eng. Emiliano Macieira, 655 – Tirirical<br />São Luís – MA, 65055-215</p><a href="tel:+559832454276" data-gtm-event="click_botao" data-gtm-button="Telefone fixo" data-gtm-location="rodape" onClick={() => trackButtonClick("Telefone fixo", "rodape")}>(98) 3245-4276</a><CtaLink href={cta} buttonName="WhatsApp rodapé" buttonLocation="rodape">WhatsApp: (98) 98903-0398</CtaLink></div></footer>
      <CtaLink className="floating-whatsapp" href={cta} buttonName="Fale no WhatsApp" buttonLocation="botao-flutuante">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.017 2C6.484 2 2 6.484 2 12.017c0 1.982.578 3.83 1.573 5.383L2 22l4.723-1.552A9.943 9.943 0 0 0 12.017 22C17.55 22 22 17.549 22 12.017 22 6.484 17.549 2 12.017 2zm.001 18.06a8.03 8.03 0 0 1-4.084-1.119l-.293-.174-3.036.998.998-3.045-.19-.297A8.03 8.03 0 1 1 20.06 12.02c0 4.442-3.6 8.04-8.042 8.04z" />
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.768.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
        <span>Fale no WhatsApp</span>
      </CtaLink>
    </main>
  );
}
