<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="DUO ACTIVE - moda fitness com estética minimalista, conforto e energia para se mover."
    />
    <title>DUO ACTIVE | Moda fitness</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header" aria-label="Cabeçalho">
      <a class="brand" href="#inicio" aria-label="DUO ACTIVE">
        <img src="assets/duo-active-logo-transparent.png" alt="DUO ACTIVE Moda Fitness" />
      </a>
      <nav class="nav" aria-label="Navegação principal">
        <a href="#colecoes">Coleção</a>
        <a href="#beneficios">Sobre</a>
        <a href="#instagram">Instagram</a>
      </nav>
      <button class="cart-toggle" type="button" aria-label="Abrir carrinho" aria-haspopup="dialog">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7 8V7a5 5 0 0 1 10 0v1h2.2l.8 13H4L4.8 8H7Zm2 0h6V7a3 3 0 0 0-6 0v1Z" />
        </svg>
        <span class="cart-count" data-cart-count>0</span>
      </button>
      <a class="header-action" href="#colecao">Comprar</a>
      <button class="menu-button" type="button" aria-label="Abrir menu" aria-expanded="false">
        <span></span>
        <span></span>
      </button>
    </header>

    <main id="inicio">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-overlay">
          <p class="kicker">@duoactive__</p>
          <h1 id="hero-title">DUO ACTIVE</h1>
          <p class="hero-label">Moda fitness</p>
          <h2>Seu treino também é autocuidado.</h2>
          <p class="hero-copy">
            Conforto para treinar. Elegância para viver. Peças criadas para acompanhar a mulher que você está se tornando.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#colecao">Ver peças</a>
          </div>
          <div class="hero-proof" aria-label="Diferenciais DUO ACTIVE">
            <span>Alta sustentação</span>
            <span>Toque premium</span>
            <span>Troca facilitada</span>
          </div>
        </div>
        <div class="hero-slider" aria-label="Campanha principal">
          <figure class="hero-slide active photo-frame photo-frame-hero">
            <span>Foto editorial principal</span>
          </figure>
          <figure class="hero-slide photo-frame photo-frame-detail">
            <span>Detalhe de tecido e movimento</span>
          </figure>
          <figure class="hero-slide photo-frame photo-frame-lifestyle">
            <span>Campanha lifestyle DUO ACTIVE</span>
          </figure>
        </div>
      </section>

      <section class="section collections" id="colecoes" aria-labelledby="collections-title">
        <div class="section-heading">
          <p class="kicker">Coleções</p>
          <h2 id="collections-title">Conforto para treinar. Elegância para viver.</h2>
          <p>
            Navegue pela coleção Essence a partir dos detalhes que fazem cada peça acompanhar seu movimento com confiança.
          </p>
        </div>
        <div class="collection-grid editorial-collection-grid">
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-flare">
            <span>Close da barra</span>
            <strong>Essence Flare</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-sprint">
            <span>Movimento em corrida</span>
            <strong>Essence Sprint</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-motion">
            <span>Close do bolso</span>
            <strong>Essence Motion</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-sculpt">
            <span>Costas da peça</span>
            <strong>Essence Sculpt</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-balance">
            <span>Close do top</span>
            <strong>Essence Balance</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-flow">
            <span>Frente única</span>
            <strong>Essence Flow</strong>
          </a>
          <a class="collection-card collection-photo-card" href="#colecao" data-open-category="essence-power">
            <span>Top 3 em 1</span>
            <strong>Essence Power</strong>
          </a>
        </div>
      </section>

      <section class="category-showcase" aria-labelledby="category-title">
        <p class="kicker">ESSENCE</p>
        <h2 id="category-title">Cada movimento merece uma escolha.</h2>
        <p class="category-copy">
          Descubra a coleção Essence, criada para acompanhar diferentes estilos de treino com conforto, sustentação e elegância. Escolha o modelo que mais combina com você.
        </p>
        <div class="category-grid">
          <a class="category-card" href="#colecao" data-open-category="essence-flare">
            <span class="category-photo-slot">Foto Essence Flare</span>
            <span>Essence Flare</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-sprint">
            <span class="category-photo-slot">Foto Essence Sprint</span>
            <span>Essence Sprint</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-motion">
            <span class="category-photo-slot">Foto Essence Motion</span>
            <span>Essence Motion</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-sculpt">
            <span class="category-photo-slot">Foto Essence Sculpt</span>
            <span>Essence Sculpt</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-balance">
            <span class="category-photo-slot">Foto Essence Balance</span>
            <span>Essence Balance</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-flow">
            <img src="assets/duo-aura-product.jpeg" alt="Conjunto Essence Flow short e top frente única" />
            <span>Essence Flow</span>
          </a>
          <a class="category-card" href="#colecao" data-open-category="essence-power">
            <span class="category-photo-slot">Foto Essence Power</span>
            <span>Essence Power</span>
          </a>
        </div>
      </section>

      <section class="section collection" id="colecao" aria-labelledby="collection-title">
        <div class="section-heading">
          <p class="kicker">ESSENCE</p>
          <h2 id="collection-title">Peças para acompanhar seu ritmo</h2>
        </div>
        <div class="collection-intro">
          <p>
            A coleção Essence nasceu para acompanhar mulheres que transformam movimento em autocuidado.
            Peças que unem conforto, segurança e autenticidade para você se sentir forte em cada treino.
          </p>
        </div>
        <div class="product-tabs" role="tablist" aria-label="Modelos da coleção Essence">
          <button class="product-tab active" type="button" role="tab" aria-selected="true" data-product-tab="all">
            Ver tudo
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-flare">
            Essence Flare
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-sprint">
            Essence Sprint
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-motion">
            Essence Motion
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-sculpt">
            Essence Sculpt
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-balance">
            Essence Balance
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-flow">
            Essence Flow
          </button>
          <button class="product-tab" type="button" role="tab" aria-selected="false" data-product-tab="essence-power">
            Essence Power
          </button>
        </div>
        <div class="product-grid active" data-product-panel="essence-flare">
          <article class="product-card">
            <div class="product-media">
              <span class="badge">ESSENCE</span>
              <img src="assets/product-jacket.png" alt="Conjunto Legging Flare Essence Flare na cor Azul Celeste" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Legging Flare</p>
              <h3>Essence Flare</h3>
              <p><strong>Cor:</strong> Azul Celeste. Conjunto legging flare com caimento elegante, cintura alta e conforto para treinos e rotina.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Flare">
                <span class="color-pill active">✓ Azul Celeste</span><span class="color-pill">Vermelho</span>
              </div>
              <div class="buy-row">
                <span>R$ 189,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Flare - Azul Celeste"
                  data-price="189.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-jacket.png" alt="Conjunto Legging Flare Essence Flare na cor Vermelho" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Legging Flare</p>
              <h3>Essence Flare</h3>
              <p><strong>Cor:</strong> Vermelho. Conjunto legging flare com caimento elegante, cintura alta e conforto para treinos e rotina.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Flare">
                <span class="color-pill">Azul Celeste</span><span class="color-pill active">✓ Vermelho</span>
              </div>
              <div class="buy-row">
                <span>R$ 189,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Flare - Vermelho"
                  data-price="189.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-sprint">
          <article class="product-card">
            <div class="product-media">
              <span class="badge">Novo</span>
              <img src="assets/campaign-detail.png" alt="Macaquinho Essence Sprint costas nuas com bolsos na cor Preto" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho costas nua com bolsos</p>
              <h3>Essence Sprint</h3>
              <p><strong>Cor:</strong> Preto. Macaquinho com costas nuas, bolsos funcionais e sustentação para acompanhar treinos intensos.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sprint">
                <span class="color-pill active">✓ Preto</span><span class="color-pill">Azul Marinho</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sprint - Preto"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/campaign-detail.png" alt="Macaquinho Essence Sprint costas nuas com bolsos na cor Azul Marinho" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho costas nua com bolsos</p>
              <h3>Essence Sprint</h3>
              <p><strong>Cor:</strong> Azul Marinho. Macaquinho com costas nuas, bolsos funcionais e sustentação para acompanhar treinos intensos.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sprint">
                <span class="color-pill">Preto</span><span class="color-pill active">✓ Azul Marinho</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sprint - Azul Marinho"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-motion">
          <article class="product-card">
            <div class="product-media">
              <span class="badge">Mais vendido</span>
              <img src="assets/product-shorts.png" alt="Conjunto Bermuda Essence Motion com 3 bolsos na cor Rosa Flamingo" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Bermuda com 3 bolsos</p>
              <h3>Essence Motion</h3>
              <p><strong>Cor:</strong> Rosa Flamingo. Conjunto com bermuda de compressão e 3 bolsos para praticidade, segurança e liberdade de movimento.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Motion">
                <span class="color-pill active">✓ Rosa Flamingo</span><span class="color-pill">Azul Celeste</span><span class="color-pill">Light Tomato</span><span class="color-pill">Mocha Mousse</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Motion - Rosa Flamingo"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-shorts.png" alt="Conjunto Bermuda Essence Motion com 3 bolsos na cor Azul Celeste" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Bermuda com 3 bolsos</p>
              <h3>Essence Motion</h3>
              <p><strong>Cor:</strong> Azul Celeste. Conjunto com bermuda de compressão e 3 bolsos para praticidade, segurança e liberdade de movimento.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Motion">
                <span class="color-pill">Rosa Flamingo</span><span class="color-pill active">✓ Azul Celeste</span><span class="color-pill">Light Tomato</span><span class="color-pill">Mocha Mousse</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Motion - Azul Celeste"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-shorts.png" alt="Conjunto Bermuda Essence Motion com 3 bolsos na cor Light Tomato" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Bermuda com 3 bolsos</p>
              <h3>Essence Motion</h3>
              <p><strong>Cor:</strong> Light Tomato. Conjunto com bermuda de compressão e 3 bolsos para praticidade, segurança e liberdade de movimento.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Motion">
                <span class="color-pill">Rosa Flamingo</span><span class="color-pill">Azul Celeste</span><span class="color-pill active">✓ Light Tomato</span><span class="color-pill">Mocha Mousse</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Motion - Light Tomato"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-shorts.png" alt="Conjunto Bermuda Essence Motion com 3 bolsos na cor Mocha Mousse" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Bermuda com 3 bolsos</p>
              <h3>Essence Motion</h3>
              <p><strong>Cor:</strong> Mocha Mousse. Conjunto com bermuda de compressão e 3 bolsos para praticidade, segurança e liberdade de movimento.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Motion">
                <span class="color-pill">Rosa Flamingo</span><span class="color-pill">Azul Celeste</span><span class="color-pill">Light Tomato</span><span class="color-pill active">✓ Mocha Mousse</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Motion - Mocha Mousse"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-sculpt">
          <article class="product-card">
            <div class="product-media">
              <img src="assets/hero-activewear.png" alt="Macaquinho Essence Sculpt com detalhe frontal na cor Light Avelã" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho com detalhe frontal</p>
              <h3>Essence Sculpt</h3>
              <p><strong>Cor:</strong> Light Avelã. Macaquinho com detalhe frontal, toque firme e modelagem pensada para valorizar o corpo com conforto.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sculpt">
                <span class="color-pill active">✓ Light Avelã</span><span class="color-pill">Light Marsala</span><span class="color-pill">Marrom</span><span class="color-pill">Grafite</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sculpt - Light Avelã"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/hero-activewear.png" alt="Macaquinho Essence Sculpt com detalhe frontal na cor Light Marsala" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho com detalhe frontal</p>
              <h3>Essence Sculpt</h3>
              <p><strong>Cor:</strong> Light Marsala. Macaquinho com detalhe frontal, toque firme e modelagem pensada para valorizar o corpo com conforto.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sculpt">
                <span class="color-pill">Light Avelã</span><span class="color-pill active">✓ Light Marsala</span><span class="color-pill">Marrom</span><span class="color-pill">Grafite</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sculpt - Light Marsala"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/hero-activewear.png" alt="Macaquinho Essence Sculpt com detalhe frontal na cor Marrom" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho com detalhe frontal</p>
              <h3>Essence Sculpt</h3>
              <p><strong>Cor:</strong> Marrom. Macaquinho com detalhe frontal, toque firme e modelagem pensada para valorizar o corpo com conforto.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sculpt">
                <span class="color-pill">Light Avelã</span><span class="color-pill">Light Marsala</span><span class="color-pill active">✓ Marrom</span><span class="color-pill">Grafite</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sculpt - Marrom"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/hero-activewear.png" alt="Macaquinho Essence Sculpt com detalhe frontal na cor Grafite" />
            </div>
            <div class="product-copy">
              <p class="product-type">Macaquinho com detalhe frontal</p>
              <h3>Essence Sculpt</h3>
              <p><strong>Cor:</strong> Grafite. Macaquinho com detalhe frontal, toque firme e modelagem pensada para valorizar o corpo com conforto.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Sculpt">
                <span class="color-pill">Light Avelã</span><span class="color-pill">Light Marsala</span><span class="color-pill">Marrom</span><span class="color-pill active">✓ Grafite</span>
              </div>
              <div class="buy-row">
                <span>R$ 179,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Sculpt - Grafite"
                  data-price="179.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-balance">
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-set.png" alt="Conjunto Essence Balance short e top manga comprida na cor Bordô" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Short + Top Manga Comprida</p>
              <h3>Essence Balance</h3>
              <p><strong>Cor:</strong> Bordô. Conjunto short e top manga comprida para quem busca equilíbrio entre proteção, estilo e performance.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Balance">
                <span class="color-pill active">✓ Bordô</span><span class="color-pill">Preto</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Balance - Bordô"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-set.png" alt="Conjunto Essence Balance short e top manga comprida na cor Preto" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Short + Top Manga Comprida</p>
              <h3>Essence Balance</h3>
              <p><strong>Cor:</strong> Preto. Conjunto short e top manga comprida para quem busca equilíbrio entre proteção, estilo e performance.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Balance">
                <span class="color-pill">Bordô</span><span class="color-pill active">✓ Preto</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Balance - Preto"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-flow">
          <article class="product-card">
            <div class="product-media">
              <span class="badge">Novo</span>
              <img src="assets/duo-aura-product.jpeg" alt="Conjunto Essence Flow short e top frente única na cor Funghi" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Short + Top Frente Única</p>
              <h3>Essence Flow</h3>
              <p><strong>Cor:</strong> Funghi. Conjunto short e top frente única com visual leve, sustentação e caimento confortável para se movimentar.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Flow">
                <span class="color-pill active">✓ Funghi</span><span class="color-pill">Cherry</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Flow - Funghi"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/duo-aura-product.jpeg" alt="Conjunto Essence Flow short e top frente única na cor Cherry" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Short + Top Frente Única</p>
              <h3>Essence Flow</h3>
              <p><strong>Cor:</strong> Cherry. Conjunto short e top frente única com visual leve, sustentação e caimento confortável para se movimentar.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Flow">
                <span class="color-pill">Funghi</span><span class="color-pill active">✓ Cherry</span>
              </div>
              <div class="buy-row">
                <span>R$ 149,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Flow - Cherry"
                  data-price="149.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
        <div class="product-grid active" data-product-panel="essence-power">
          <article class="product-card">
            <div class="product-media">
              <span class="badge">Lançamento</span>
              <img src="assets/product-set.png" alt="Conjunto Essence Power legging e top 3 em 1 na cor Preto" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Legging + Top 3 em 1</p>
              <h3>Essence Power</h3>
              <p><strong>Cor:</strong> Preto. Conjunto legging e top 3 em 1 com sustentação, versatilidade e presença para diferentes treinos.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Power">
                <span class="color-pill active">✓ Preto</span><span class="color-pill">Malbec</span><span class="color-pill">Cereja</span>
              </div>
              <div class="buy-row">
                <span>R$ 189,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Power - Preto"
                  data-price="189.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-set.png" alt="Conjunto Essence Power legging e top 3 em 1 na cor Malbec" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Legging + Top 3 em 1</p>
              <h3>Essence Power</h3>
              <p><strong>Cor:</strong> Malbec. Conjunto legging e top 3 em 1 com sustentação, versatilidade e presença para diferentes treinos.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Power">
                <span class="color-pill">Preto</span><span class="color-pill active">✓ Malbec</span><span class="color-pill">Cereja</span>
              </div>
              <div class="buy-row">
                <span>R$ 189,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Power - Malbec"
                  data-price="189.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
          <article class="product-card">
            <div class="product-media">
              <img src="assets/product-set.png" alt="Conjunto Essence Power legging e top 3 em 1 na cor Cereja" />
            </div>
            <div class="product-copy">
              <p class="product-type">Conjunto Legging + Top 3 em 1</p>
              <h3>Essence Power</h3>
              <p><strong>Cor:</strong> Cereja. Conjunto legging e top 3 em 1 com sustentação, versatilidade e presença para diferentes treinos.</p>
              <div class="color-pill-group" aria-label="Cores disponíveis para Essence Power">
                <span class="color-pill">Preto</span><span class="color-pill">Malbec</span><span class="color-pill active">✓ Cereja</span>
              </div>
              <div class="buy-row">
                <span>R$ 189,90</span>
                <button
                  class="cart-button"
                  type="button"
                  data-checkout
                  data-title="Essence Power - Cereja"
                  data-price="189.90"
                >
                  Adicionar ao carrinho
                </button>
              <ul class="trust-strip" aria-label="Diferenciais do produto">
                <li>Modelagem premium</li>
                <li>Alta sustentação</li>
                <li>Envio para todo Brasil</li>
                <li>Troca facilitada</li>
              </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section editorial" aria-label="Campanha DUO ACTIVE">
        <img src="assets/campaign-detail.png" alt="Campanha DUO ACTIVE com detalhe de movimento" />
        <div class="editorial-copy">
          <p class="kicker">DUO ACTIVE</p>
          <h2>O autocuidado também começa pelo que você veste.</h2>
          <p>
            Conforto, qualidade e confiança para acompanhar a mulher que você escolhe ser todos os
            dias.
          </p>
        </div>
      </section>

      <section class="section benefits" id="beneficios" aria-labelledby="benefits-title">
        <div class="section-heading compact">
          <p class="kicker">Sobre a DUO ACTIVE</p>
          <h2 id="benefits-title">Conforto pensado para acompanhar você.</h2>
        </div>
        <div class="benefit-grid">
          <article>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M4 12h16M12 4v16" />
            </svg>
            <h3>Elasticidade</h3>
            <p>Liberdade para agachar, correr e alongar sem perder o caimento.</p>
          </article>
          <article>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5 19c4-10 10-14 14-14M6 13h8M10 17h7" />
            </svg>
            <h3>Respirabilidade</h3>
            <p>Tecidos leves ajudam a manter o conforto nos treinos mais intensos.</p>
          </article>
          <article>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" />
            </svg>
            <h3>Acabamento</h3>
            <p>Costuras limpas, linhas discretas e toque premium para uso frequente.</p>
          </article>
          <article>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 5c3 2 7 2 10 0M6 12c4 3 8 3 12 0M8 19c2-2 6-2 8 0" />
            </svg>
            <h3>Modelagem</h3>
            <p>Desenvolvida para valorizar o corpo com conforto, segurança e liberdade de movimento.</p>
          </article>
        </div>
      </section>

      <section class="section size-guide" id="tamanhos" aria-labelledby="size-title">
        <div>
          <p class="kicker">Escolha sem dúvida</p>
          <h2 id="size-title">Guia rápido de medidas</h2>
          <div class="size-options" aria-label="Numerações disponíveis">
            <span>36 ao 40</span>
            <span>42 ao 44</span>
            <span>44 ao 46</span>
          </div>
          <div class="size-howto">
            <h3>Como escolher seu tamanho</h3>
            <ul>
              <li>36 ao 40 → Único</li>
              <li>42 ao 44 → G</li>
              <li>44 ao 46 → GG</li>
            </ul>
          </div>
        </div>
        <div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Numeração</th>
                  <th>Busto</th>
                  <th>Cintura</th>
                  <th>Quadril</th>
                  <th>Tamanho</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>36</td>
                  <td>82–86 cm</td>
                  <td>62–66 cm</td>
                  <td>88–92 cm</td>
                  <td>Único</td>
                </tr>
                <tr>
                  <td>38</td>
                  <td>86–90 cm</td>
                  <td>66–70 cm</td>
                  <td>92–96 cm</td>
                  <td>Único</td>
                </tr>
                <tr>
                  <td>40</td>
                  <td>90–94 cm</td>
                  <td>70–74 cm</td>
                  <td>96–100 cm</td>
                  <td>Único</td>
                </tr>
                <tr>
                  <td>42</td>
                  <td>94–98 cm</td>
                  <td>74–78 cm</td>
                  <td>100–104 cm</td>
                  <td>G</td>
                </tr>
                <tr>
                  <td>44</td>
                  <td>98–102 cm</td>
                  <td>78–82 cm</td>
                  <td>104–108 cm</td>
                  <td>G</td>
                </tr>
                <tr>
                  <td>46</td>
                  <td>102–106 cm</td>
                  <td>82–86 cm</td>
                  <td>108–112 cm</td>
                  <td>GG</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="size-note">
            Nossos tecidos possuem alta elasticidade e se adaptam ao corpo. Se você estiver entre
            dois tamanhos, escolha o menor para maior compressão ou o maior para um ajuste mais
            confortável.
          </p>
        </div>
      </section>

      <section class="section checkout" id="checkout" aria-labelledby="checkout-title">
        <div>
          <p class="kicker">Pagamento seguro</p>
          <h2 id="checkout-title">Checkout Mercado Pago</h2>
          <p>
            O botão de compra cria uma preferência de pagamento no Mercado Pago com Pix, cartão e
            boleto, conforme os meios ativos na sua conta.
          </p>
        </div>
        <div class="payment-grid" aria-label="Meios de pagamento">
          <span>Pix</span>
          <span>Cartão</span>
          <span>Boleto</span>
        </div>
        <p class="mp-status" role="status" aria-live="polite"></p>
      </section>
      <section class="section instagram-section" id="instagram" aria-labelledby="instagram-title">
        <div class="section-heading compact">
          <p class="kicker">Instagram</p>
          <h2 id="instagram-title">Movimento, textura e presença real.</h2>
          <p>
            Um espaço preparado para receber fotos editoriais da DUO ACTIVE: detalhes do tecido,
            costuras, bolsos, luz natural e momentos de autocuidado em movimento.
          </p>
        </div>
        <div class="instagram-grid" aria-label="Prévia do Instagram DUO ACTIVE">
          <span>Foto 01</span>
          <span>Foto 02</span>
          <span>Foto 03</span>
          <span>Foto 04</span>
          <span>Foto 05</span>
          <span>Foto 06</span>
        </div>
        <a class="button instagram-cta" href="https://www.instagram.com/duoactive__?igsh=ZnRnZ2k1NDhkMzFt" target="_blank" rel="noopener">
          Ver mais no Instagram
        </a>
      </section>

    </main>

    <footer class="footer brand-closing">
      <p class="closing-phrase">Para mulheres que encontram força em cada movimento.</p>
      <img src="assets/duo-active-logo-transparent.png" alt="DUO ACTIVE Moda Fitness" />
    </footer>

    <div class="cart-backdrop" data-cart-backdrop hidden></div>
    <aside class="cart-drawer" id="cart" aria-label="Carrinho de compras" aria-hidden="true">
      <div class="cart-drawer-header">
        <div>
          <p class="kicker">Sua sacola</p>
          <h2>Carrinho</h2>
        </div>
        <button class="cart-close" type="button" data-cart-close aria-label="Fechar carrinho">Fechar</button>
      </div>
      <div class="cart-items" data-cart-items></div>
      <section class="checkout-panel customer-panel" aria-label="Dados da cliente">
        <h3>Dados da cliente</h3>
        <div class="customer-fields">
          <label>
            Nome
            <input type="text" autocomplete="name" placeholder="Seu nome" data-customer-name />
          </label>
          <label>
            E-mail
            <input type="email" autocomplete="email" placeholder="seuemail@exemplo.com" data-customer-email />
          </label>
        </div>
      </section>
      <p class="cart-empty" data-cart-empty>Seu carrinho está vazio.</p>
      <section class="checkout-panel" aria-label="Forma de pagamento">
        <h3>Forma de pagamento</h3>
        <div class="payment-options">
          <label>
            <input type="radio" name="paymentMethod" value="pix" data-payment-method checked />
            <span>PIX</span>
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="credit_card" data-payment-method />
            <span>Cartão de Crédito</span>
          </label>
        </div>
        <p class="payment-note" data-payment-note>Você economiza 5% pagando via PIX.</p>
      </section>
      <section class="checkout-panel" aria-label="Frete">
        <h3>Frete</h3>
        <div class="field-row">
          <label>
            CEP
            <input type="text" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" data-zip-input />
          </label>
          <button type="button" data-shipping-button>Calcular Frete</button>
        </div>
        <p class="checkout-hint" data-shipping-message>Calcule o frete para continuar.</p>
        <div class="shipping-address" data-shipping-address hidden></div>
        <div class="shipping-options" data-shipping-options></div>
      </section>
      <section class="checkout-panel" aria-label="Cupom de desconto">
        <h3>Cupom</h3>
        <div class="field-row">
          <label>
            Cupom de desconto
            <input type="text" autocomplete="off" placeholder="Digite seu cupom" data-coupon-input />
          </label>
          <button type="button" data-coupon-button>Aplicar</button>
        </div>
        <p class="checkout-hint" data-coupon-message>Cupons serão liberados em breve.</p>
      </section>
      <div class="cart-summary" aria-label="Resumo do carrinho">
        <div>
          <span>Subtotal</span>
          <strong data-cart-subtotal>R$ 0,00</strong>
        </div>
        <div>
          <span>Frete</span>
          <strong data-cart-shipping>R$ 0,00</strong>
        </div>
        <div>
          <span>Desconto PIX</span>
          <strong data-cart-pix-discount>-R$ 0,00</strong>
        </div>
        <div>
          <span>Cupom</span>
          <strong data-cart-coupon>R$ 0,00</strong>
        </div>
        <div class="cart-summary-total">
          <span>Total Final</span>
          <strong data-cart-total>R$ 0,00</strong>
        </div>
      </div>
      <p class="cart-status" data-cart-status role="status" aria-live="polite"></p>
      <button class="cart-checkout" type="button" data-cart-checkout>Continuar para pagamento</button>
    </aside>

    <script src="script.js"></script>
  </body>
</html>


