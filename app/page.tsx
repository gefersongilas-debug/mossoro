"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WHATSAPP = "5598987827060";
const logo = "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/LOGO_MOSSORO_PNG.png";

const productCards = [
  { title: "Mobiliário corporativo", text: "Mesas, armários, estações de trabalho e soluções para ambientes mais organizados, funcionais e profissionais.", ideal: "Escritórios, salas administrativas, recepções e salas de reunião.", image: "https://mossoroempresarial.com.br/wp-content/uploads/slider/cache/6540a0d8804d5b2f75221dd770ce6c2f/avantti-1.jpg", tag: "MOBILIÁRIO" },
  { title: "Mobiliário de aço", text: "Armários, roupeiros e produtos resistentes para empresas que precisam melhorar a organização no dia a dia.", ideal: "Empresas, indústrias, vestiários e áreas de grande circulação.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/moveis-de-aco.jpg", tag: "AÇO" },
  { title: "Cadeiras corporativas", text: "Conforto, funcionalidade e uma apresentação profissional para cada ambiente da sua empresa.", ideal: "Postos de trabalho, clínicas, recepções e diretorias.", image: "https://mossoroempresarial.com.br/wp-content/uploads/2022/10/cadeira-de-escritorio.jpg", tag: "CADEIRAS" },
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
  return (
    <span className="split-text" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span className="split-char" aria-hidden="true" key={`${character}-${index}`}>
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
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
            <h1><SplitText text="Seu ambiente de trabalho " /><em><SplitText text="fala" /></em><SplitText text=" sobre o seu negócio." /></h1>
            <p className="hero-lead">Equipamentos e móveis profissionais para empresas que precisam de mais organização, conforto e funcionalidade.</p>
            <div className="hero-proof"><span>+10</span><p>anos oferecendo soluções<br />para ambientes profissionais</p></div>
          </div>
          <form className="quote-form" onSubmit={submit}>
            <div className="form-heading"><span className="form-mark">↗</span><div><strong>Solicite sua cotação</strong><small>Fale com nossa equipe sem compromisso.</small></div></div>
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

      <section className="section benefits" data-reveal-section><div className="wrap">
        <div className="section-intro" data-reveal-item><p className="eyebrow blue">POR QUE ESCOLHER A MOSSORÓ</p><h2><SplitText text="Muito mais do que móveis." /><br /><em><SplitText text="A solução certa" /></em><SplitText text=" para o seu ambiente." /></h2><p>Na Mossoró Empresarial, cada atendimento começa entendendo o que sua empresa realmente precisa.</p></div>
        <div className="benefit-grid" data-card-grid>{benefits.map(([number, title, text]) => <article className="benefit" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <a href={cta} target="_blank" className="text-link" data-reveal-item>FALE COM NOSSA EQUIPE <b>→</b></a>
      </div></section>

      <section className="section products" id="produtos" data-reveal-section><div className="wrap">
        <div className="product-heading" data-reveal-item><div><p className="eyebrow orange">NOSSAS SOLUÇÕES</p><h2><SplitText text="Escolha o que" /><br /><em><SplitText text="sua empresa precisa." /></em></h2></div><p>Produtos para transformar a rotina e a presença do seu ambiente profissional.</p></div>
        <div className="product-grid" data-card-grid>{productCards.map((product) => <article className="product" key={product.title}><div className="product-img"><img src={product.image} alt={product.title} /><span>{product.tag}</span></div><div className="product-info"><h3>{product.title}</h3><p>{product.text}</p><small><b>Ideal para:</b> {product.ideal}</small><a href={cta} target="_blank">QUERO UM ORÇAMENTO <b>→</b></a></div></article>)}</div>
      </div></section>

      <section className="showcase" data-reveal-section><div className="showcase-media"></div><div className="showcase-shade"></div><div className="wrap showcase-content"><p className="eyebrow light" data-reveal-item>AMBIENTES QUE FUNCIONAM MELHOR</p><h2><SplitText text="Mais organização." /><br /><SplitText text="Mais conforto." /><br /><em><SplitText text="Mais resultado." /></em></h2><a href={cta} target="_blank" className="outline-button" data-reveal-item>SOLICITAR COTAÇÃO <b>→</b></a></div></section>

      <section className="section about" data-reveal-section><div className="wrap about-grid"><div className="about-visual" data-reveal-item><div className="visual-frame"></div><div className="visual-label"><b>+ de 10 anos</b><span>no mercado corporativo</span></div></div><div className="about-copy"><p className="eyebrow blue" data-reveal-item>QUEM SOMOS</p><h2><SplitText text="Mossoró Empresarial:" /><br /><em><SplitText text="mobiliário para quem leva o trabalho a sério." /></em></h2><p data-reveal-item>A Mossoró Empresarial oferece soluções em mobiliário para empresas e ambientes profissionais, reunindo diferentes categorias de produtos para atender desde necessidades pontuais até projetos completos.</p><p data-reveal-item>Nosso objetivo é tornar a compra mais simples: entender a sua necessidade, indicar as melhores soluções e acompanhar o processo até a entrega.</p><a href={cta} target="_blank" className="dark-button" data-reveal-item>CONHEÇA NOSSAS SOLUÇÕES <b>→</b></a></div></div></section>

      <section className="final-cta" data-reveal-section><div className="wrap final-inner"><div><p className="eyebrow light" data-reveal-item>VAMOS COMEÇAR?</p><h2><SplitText text="Seu espaço pode" /><br /><SplitText text="trabalhar " /><em><SplitText text="melhor." /></em></h2></div><a href={cta} target="_blank" className="yellow-button" data-reveal-item>SOLICITAR UMA COTAÇÃO <b>→</b></a></div></section>

      <footer><div className="wrap footer-inner"><img src={logo} alt="Mossoró" /><p>Av. Eng. Emiliano Macieira, 655 – Tirirical<br />São Luís – MA, 65055-215</p><a href="tel:+559832454276">(98) 3245-4276</a><a href={cta} target="_blank">WhatsApp: (98) 98782-7060</a></div></footer>
      <a className="floating-whatsapp" href={cta} target="_blank" aria-label="Falar no WhatsApp">◔</a>
    </main>
  );
}
