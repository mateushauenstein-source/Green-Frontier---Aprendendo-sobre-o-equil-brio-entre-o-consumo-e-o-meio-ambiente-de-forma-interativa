# Green-Frontier---Aprendendo-sobre-o-equil-brio-entre-o-consumo-e-o-meio-ambiente-de-forma-interativa

1. Descrição do Projeto
O Green Frontier é um ecossistema de minigames educativos desenvolvido para o Concurso Agrinho 2026. O projeto nasceu da necessidade de conectar o público jovem ao universo do agronegócio moderno, desmistificando a ideia de que a produção de alimentos e a preservação ambiental são forças opostas. Através de uma experiência interativa e lúdica, o jogador assume o papel de um produtor consciente que precisa tomar decisões estratégicas para garantir o sucesso de sua lavoura sem esgotar os recursos naturais.

2. Objetivo do Projeto
O objetivo principal é conscientizar e educar sobre a Agricultura Sustentável e o equilíbrio ecológico no campo. O jogo visa demonstrar, de forma prática, como conceitos reais — como o Plantio Direto, a Rotação de Culturas e o Manejo Integrado de Pragas (MIP) — impactam diretamente a economia e a saúde do planeta. A meta é fazer com que o jogador entenda que o produtor rural do século XXI utiliza a tecnologia como sua maior aliada para ser o principal guardião do meio ambiente.

3. Recursos Técnicos
Design e Interface (UI/UX)
Estética Pixel Art: Toda a identidade visual do site adota o estilo clássico de Pixel Art, utilizando a tipografia nostálgica "Press Start 2P". Essa escolha cria uma atmosfera de "videogame retrô" que aumenta o engajamento do público infantojuvenil.

Layout Fluido: Organizado em um sistema de "Single Page Application" (SPA) controlado por seções (.page), permitindo uma navegação instantânea e suave entre o menu e as telas dos jogos, sem recargas de página.

Acessibilidade Integrada
O projeto foi planejado sob os pilares da inclusão digital, contando com um painel de configurações acessível a qualquer momento:

Controle de Tipografia: Botões para aumentar ou diminuir o tamanho da fonte em tempo real, evitando a quebra de elementos na tela.

Modo de Alto Contraste (Modo Escuro): Alternância dinâmica de cores de fundo e texto para melhorar a leitura e reduzir a fadiga visual.

Motor de Leitura de Tela (Acessibilidade por Voz): Integração com o sintetizador de voz nativo dos navegadores, permitindo que o texto descritivo do site seja lido em voz alta para usuários com deficiência visual.

Responsividade: Ajuste automático do tamanho do canvas do jogo e dos textos para garantir jogabilidade tanto em computadores quanto em dispositivos móveis (celulares e tablets).

4. Tecnologias Utilizadas
Estrutura e Estilização
HTML5: Utilizado para a marcação estrutural de todo o site, divisões de páginas, formulários de configurações e a tag <canvas> onde o jogo principal é renderizado.

CSS3: Responsável por toda a estilização visual, sistema de cores (variáveis CSS para os modos Claro/Escuro), posicionamento (Flexbox) e as animações de transição das telas.

Programação e Interatividade
JavaScript (Vanilla): A linguagem principal do projeto. Utilizada para a lógica de transição de telas (goToPage), manipulação da acessibilidade, controle do ciclo de execução dos minigames (renderização do canvas, detecção de colisões, pontuação) e gerenciamento de áudio.

Criação de Ativos (Assets)
Imagens e Cenários: Desenvolvidos com o auxílio da inteligência artificial Gemini (Google), gerando cenários ricos em detalhes que combinam a temática agrícola com o estilo Pixel Art.

Músicas e Efeitos Sonoros: Capturados de bancos de áudio gratuitos e de uso livre (como Pixabay e FreeSound), garantindo trilhas sonoras imersivas para as ações do jogo.

5. Instruções dos Minigames
Jogo 1: Defensor do Milharal
Como funciona: Um jogo de ação e estratégia em tempo real renderizado via Canvas. Pragas avançam em direção à plantação de milho do jogador.

Mecânica: O jogador deve clicar nos botões de ação para escolher entre Defensivos Químicos (ação rápida e agressiva) ou Alternativas Biológicas Sustentáveis (ações de manejo ecológico). O objetivo é salvar a lavoura equilibrando os custos econômicos e o impacto na saúde do solo.

Jogo 2: Mestre da Sustentabilidade
Como funciona: Um jogo de perguntas e respostas dinâmico (Quiz).

Mecânica: São apresentadas situações cotidianas do campo e conceitos de preservação. O jogador deve analisar as alternativas e selecionar a resposta correta. Ao final, o sistema avalia o nível de conhecimento do usuário em consumo consciente e práticas agrícolas.

Jogo 3: Jornada do Produtor (Em breve)
Como funciona: Um minigame de gerenciamento e simulação de percurso.

Mecânica: Dividido em duas etapas: primeiro, o cuidado diário com o plantio, irrigação e adubação da fazenda; segundo, uma mecânica estilo corrida/obstáculos onde o produtor deve transportar a colheita até a cidade desviando de perigos na estrada, recebendo uma pontuação final baseada em sua eficiência ecológica.

6. Agradecimentos
A realização deste projeto não seria possível sem o apoio fundamental de pessoas queridas.

Agradeço primeiramente ao Colégio Estadual Nereu Perondi por proporcionar o espaço e o incentivo à inovação tecnológica. Um agradecimento especial ao meu professor orientador, Jhonattan, cuja mentoria, paciência e direcionamento foram essenciais para transformar uma ideia em código funcional. Por fim, agradeço aos organizadores do Concurso Agrinho 2026 por criarem uma oportunidade onde nós, estudantes, podemos usar a tecnologia que amamos para gerar um impacto positivo e real na conscientização sobre o futuro do nosso planeta.
