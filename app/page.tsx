"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WHATSAPP = "5598989030398";
const logo = "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/LOGO_MOSSORO_PNG.png";

const productCards = [
  { title: "Mobiliário corporativo", text: "Mesas, armários, estações de trabalho e soluções para ambientes mais organizados, funcionais e profissionais.", ideal: "Escritórios, salas administrativas, recepções e salas de reunião.", image: "https://mossoroempresarial.com.br/wp-content/uploads/slider/cache/6540a0d8804d5b2f75221dd770ce6c2f/avantti-1.jpg", tag: "MOBILIÁRIO" },
  { title: "Mobiliário de aço", text: "Armários, roupeiros e produtos resistentes para empresas que precisam melhorar a organização no dia a dia.", ideal: "Empresas, indústrias, vestiários e áreas de grande circulação.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/moveis-de-aco.jpg", tag: "AÇO" },
  { title: "Cadeiras corporativas", text: "Conforto, funcionalidade e uma apresentação profissional para cada ambiente da sua empresa.", ideal: "Postos de trabalho, clínicas, recepções e diretorias.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/cadeira-de-escritorio.jpg", tag: "CADEIRAS" },
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
  const page = useRef<HTMLElement>(null);

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
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError(false);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: data.get("nome"), whatsapp: data.get("whatsapp"), empresa: data.get("empresa") || "", origem: "landing-page-mossoro", enviadoEm: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error("Falha ao enviar lead");
    const message = `Olá, sou ${data.get("nome")}. Gostaria de solicitar uma cotação para mobiliário empresarial.${data.get("empresa") ? ` Minha empresa é ${data.get("empresa")}.` : ""}`;
    setSent(true);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    event.currentTarget.reset();
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
          <a className="header-cta" href={cta} target="_blank">Falar no WhatsApp <b>↗</b></a>
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
            <label>Seu nome<input required name="nome" placeholder="Como podemos chamar você?" /></label>
            <label>WhatsApp<input required name="whatsapp" type="tel" placeholder="(00) 00000-0000" /></label>
            <label>Empresa <span>(opcional)</span><input name="empresa" placeholder="Nome da sua empresa" /></label>
          <button type="submit" disabled={sending}>{sending ? "ENVIANDO..." : "QUERO FALAR COM A MOSSORÓ"} {!sending && <b>→</b>}</button>
          {sent && <p className="success">Seu WhatsApp foi aberto. Até já!</p>}
          {error && <p className="error">Não foi possível enviar agora. Tente novamente.</p>}
            <small className="privacy">Seus dados são usados apenas para este atendimento.</small>
          </form>
        </div>
      </section>

      <section className="trust-strip"><div className="wrap trust-inner"><span>UMA SOLUÇÃO COMPLETA PARA O SEU ESPAÇO</span><div><b>MOBILIÁRIO</b><b>AÇO</b><b>CADEIRAS</b><b>PROJETOS</b></div><span className="delivery">● ENTREGA E MONTAGEM</span></div></section>

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
        <a href={cta} target="_blank" className="text-link" data-reveal-item>FALE COM NOSSA EQUIPE <b>→</b></a>
      </div></section>

      <section className="section products" id="produtos" data-reveal-section><div className="wrap">
        <div className="product-heading" data-reveal-item><div><p className="eyebrow orange">NOSSAS SOLUÇÕES</p><h2><SplitText text="Escolha o que" /><br /><em><SplitText text="sua empresa precisa." /></em></h2></div><p>Produtos para transformar a rotina e a presença do seu ambiente profissional.</p></div>
        <div className="product-grid" data-card-grid>{productCards.map((product) => <article className="product" key={product.title}><div className="product-img"><img src={product.image} alt={product.title} /><span>{product.tag}</span></div><div className="product-info"><h3>{product.title}</h3><p>{product.text}</p><small><b>Ideal para:</b> {product.ideal}</small><a href={cta} target="_blank">QUERO UM ORÇAMENTO <b>→</b></a></div></article>)}</div>
      </div></section>

      <section className="showcase" data-reveal-section><div className="showcase-media"></div><div className="showcase-shade"></div><div className="wrap showcase-content"><p className="eyebrow light" data-reveal-item>AMBIENTES QUE FUNCIONAM MELHOR</p><h2><SplitText text="Mais organização." /><br /><SplitText text="Mais conforto." /><br /><SplitText text="Mais resultado." /></h2><a href={cta} target="_blank" className="outline-button" data-reveal-item>SOLICITAR COTAÇÃO <b>→</b></a></div></section>

      <section className="section about" data-reveal-section><div className="wrap about-grid"><div className="about-visual" data-reveal-item><div className="visual-frame"></div></div><div className="about-copy"><p className="eyebrow blue" data-reveal-item>QUEM SOMOS</p><h2><SplitText text="Mossoró Empresarial:" /><br /><em><SplitText text="mobiliário para quem leva o trabalho a sério." /></em></h2><p data-reveal-item>A Mossoró Empresarial oferece soluções em mobiliário para empresas e ambientes profissionais, reunindo diferentes categorias de produtos para atender desde necessidades pontuais até projetos completos.</p><p data-reveal-item>Nosso objetivo é tornar a compra mais simples: entender a sua necessidade, indicar as melhores soluções e acompanhar o processo até a entrega.</p><a href={cta} target="_blank" className="dark-button" data-reveal-item>CONHEÇA NOSSAS SOLUÇÕES <b>→</b></a></div></div></section>

      <section className="final-cta" data-reveal-section><div className="wrap final-inner"><div><p className="eyebrow light" data-reveal-item>VAMOS COMEÇAR?</p><h2><SplitText text="Seu espaço pode" /><br /><SplitText text="trabalhar melhor." /></h2></div><a href={cta} target="_blank" className="yellow-button" data-reveal-item>SOLICITAR UMA COTAÇÃO <b>→</b></a></div></section>

      <footer><div className="wrap footer-inner"><img src={logo} alt="Mossoró" /><p>Av. Eng. Emiliano Macieira, 655 – Tirirical<br />São Luís – MA, 65055-215</p><a href="tel:+559832454276">(98) 3245-4276</a><a href={cta} target="_blank">WhatsApp: (98) 98903-0398</a></div></footer>
      <a className="floating-whatsapp" href={cta} target="_blank" aria-label="Falar no WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.017 2C6.484 2 2 6.484 2 12.017c0 1.982.578 3.83 1.573 5.383L2 22l4.723-1.552A9.943 9.943 0 0 0 12.017 22C17.55 22 22 17.549 22 12.017 22 6.484 17.549 2 12.017 2zm.001 18.06a8.03 8.03 0 0 1-4.084-1.119l-.293-.174-3.036.998.998-3.045-.19-.297A8.03 8.03 0 1 1 20.06 12.02c0 4.442-3.6 8.04-8.042 8.04z" />
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.768.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </a>
    </main>
  );
}
