/* ==========================================================================
   CONFIGURAÇÃO E DECLARAÇÃO GLOBAL DO ECOSSISTEMA CANVAS
   ========================================================================== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

/* ==========================================================================
   GERENCIAMENTO DE ATIVOS DE ÁUDIO (SYSTEM AUDIO LOGIC)
   ========================================================================== */
const somFundoMenu = new Audio('Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg'); 
const somFundoJogo = new Audio('8BitBattleLoop.ogg'); 
const somFundoChefe = new Audio('8-bit_danger_strong_boss.mp3'); 
const somMorteInseto = new Audio('sons/hitHurt.wav'); 
const somMurmuro = new Audio(''); 

somFundoMenu.loop = true;
somFundoJogo.loop = true;
somFundoChefe.loop = true;

/* Músicas e Efeitos do Subsistema de Quiz */
const musicaInstrucoes = new Audio('sons/8bit_action_ending_bpm112.mp3');
musicaInstrucoes.loop = true;

const musicaPerguntas = new Audio('sons/kim_lightyear_-_you_and_i.mp3');
musicaPerguntas.loop = true;

const musicaResultado = new Audio('sons/8bitvictory.ogg');
musicaResultado.loop = true;

const somAcertoQuiz = new Audio('sons/Victory!.wav');
const somErroQuiz = new Audio('sons/KL Peach Game Over 1.mp3');

/* ==========================================================================
   MAPEAMENTO E INSTANCIAÇÃO DE TEXTURAS / IMAGENS
   ========================================================================== */
const imgCenarioPreJogo = new Image();
imgCenarioPreJogo.src = 'Images/Gemini_Generated_Image_2p7rak2p7rak2p7r.png'; 
imgCenarioPreJogo.onload = function() {
    if (estadoJogo === 'PRE_JOGO' && jogoAtivo === 1) {
        desenharCiclo();
    }
};

const imgCenarioJogo = new Image();
imgCenarioJogo.src = 'Images/Gemini_Generated_Image_wc4usqwc4usqwc4u.png'; 

const imgFazendeiro = new Image();
imgFazendeiro.src = 'Images/Gemini_Generated_Image_6ng3r06ng3r06ng3-removebg-preview.png'; 

const imgMilho = new Image();
imgMilho.src = 'Images/Gemini_Generated_Image_8ivadh8ivadh8iva-removebg-preview.png'; 

const imgPesticidaSustentavel = new Image();
imgPesticidaSustentavel.src = 'Images/Gemini_Generated_Image_ynpezzynpezzynpe-removebg-preview.png';

const imgPesticidaQuimico = new Image();
imgPesticidaQuimico.src = 'Images/Gemini_Generated_Image_am3h9oam3h9oam3h-removebg-preview.png';

const imgGafanhoto = new Image();
imgGafanhoto.src = 'Images/Gemini_Generated_Image_5tb41g5tb41g5tb4-removebg-preview.png';

const imgLagarta = new Image();
imgLagarta.src = 'Images/Gemini_Generated_Image_h04flkh04flkh04f-removebg-preview.png';

const imgChefao = new Image();
imgChefao.src = 'Images/Gemini_Generated_Image_jmhj0bjmhj0bjmhj-removebg-preview.png';

/* Ativos de Imagem do Quiz */
const imgFundoQuiz = new Image(); 
imgFundoQuiz.src = 'Images/Gemini_Generated_Image_ig0qdjig0qdjig0q.png';

const imgFazendeiroQuiz = new Image(); 
imgFazendeiroQuiz.src = 'Images/Gemini_Generated_Image_6zsuxe6zsuxe6zsu-removebg-preview.png';

const imgOuro = new Image(); 
imgOuro.src = 'Images/Gemini_Generated_Image_6058pu6058pu6058-removebg-preview.png';

const imgPrata = new Image(); 
imgPrata.src = 'Images/Gemini_Generated_Image_y7tj0jy7tj0jy7tj-removebg-preview.png';

const imgBronze = new Image(); 
imgBronze.src = 'Images/Gemini_Generated_Image_ll293tll293tll29-removebg-preview.png';

/* ==========================================================================
   VARIÁVEIS DE CONTROLE DE ESTADO GLOBAL (FINITE STATE MACHINE)
   ========================================================================== */
let jogoAtivo = 1; /* Interruptor de Aplicação: 1 = Minigame 1, 2 = Quiz */
let estadoJogo = 'PRE_JOGO'; 
let jogoPausado = false;
let volumeGeral = 0.5;
let tipoPesticida = ''; 
let textoDialogoAtual = 0;
let hordaAtual = 1;
let insetos = [];
let chefao = null;
let cooldownTeleporte = 0;
let chefaoNasceu = false;
let musicaAtualTocando = null;

/* Estados específicos do Módulo Quiz */
let quizAtual = 0;
let pontuacaoQuiz = 0;
let timerQuiz = 30;
let estadoQuiz = 'PRE_JOGO';
let intervaloTimer;
let feedbackCorreto = false;
let idDoLoopQuiz; 
let instrucaoQuizAtual = 0;
let feedbackAcertou = false;

/* ==========================================================================
   REPOSITÓRIO DE DADOS MATRIZ (DIÁLOGOS E PERGUNTAS)
   ========================================================================== */
const dialogosFazendeiro = [
    "Olá jovem produtor! Pragas estão vindo atacar nosso milharal!",
    "Antes de começar, você deve escolher o seu tipo de pesticida.",
    "Durante o ataque, clique nos insetos rapidamente para eliminá-los.",
    "Se eles alcançarem o milharal no centro, será o fim da plantação!",
    "No final, enfrentaremos o Gafanhoto Gigante. Cuidado, ele se teleporta!",
    "Preparado? Escolha seu pesticida a seguir e defenda a fazenda!"
];

const instrucoesQuiz = [
    "Olá, futuro Mestre da Sustentabilidade! Pronto para testar seus conhecimentos?",
    "Vou te fazer 10 perguntas sobre práticas agrícolas que protegem o nosso planeta.",
    "Para cada pergunta, escolha a alternativa correta cuidando para não errar.",
    "No final, dependendo do seu desempenho, você ganhará uma linda medalha!",
    "Clique na tela para começarmos o nosso quiz!"
];

const perguntasQuiz = [
    {
        pergunta: "Qual é o principal benefício da rotação de culturas para o solo?",
        opcoes: ["Aumentar o uso de químicos.", "Evitar o desgaste e reduzir pragas.", "Deixar a terra sem nenhuma planta.", "Acelerar o crescimento com mais água."],
        correta: 1,
        explicacao: "Alternar as plantas no mesmo terreno evita o desgaste dos nutrientes e quebra o ciclo de pragas naturalmente!"
    },
    {
        pergunta: "O que caracteriza o Controle Biológico de pragas?",
        opcoes: ["Uso de predadores naturais.", "Aplicação de pesticidas fortes.", "Queima controlada da plantação.", "Isolamento da área com telas."],
        correta: 0,
        explicacao: "O controle biológico usa a própria natureza! Joaninhas, por exemplo, combatem pulgões sem precisar de veneno."
    },
    {
        pergunta: "Qual dessas práticas ajuda a economizar água na irrigação?",
        opcoes: ["Inundação de canais.", "Molhar nos horários mais quentes.", "Gotejamento direto nas raízes.", "Ligação contínua dos irrigadores."],
        correta: 2,
        explicacao: "O gotejamento leva a água direto na raiz da planta, evitando o desperdício por evaporação!"
    },
    {
        pergunta: "Por que os polinizadores (como as abelhas) são essenciais?",
        opcoes: ["Eles comem as pragas da lavoura.", "Ajudam a gerar frutos e sementes.", "Limpam as folhas secas do chão.", "Não têm importância direta."],
        correta: 1,
        explicacao: "Sem as abelhas e polinizadores, a maioria das plantas não conseguiria se reproduzir para gerar frutos."
    },
    {
        pergunta: "O que é um defensivo agrícola do tipo 'Sustentável' ou Biológico?",
        opcoes: ["Produto químico de longa duração.", "Adubo feito com sintéticos.", "Feito de microrganismos ou plantas.", "Tinta spray para espantar pássaros."],
        correta: 2,
        explicacao: "Eles são feitos a partir de elementos da natureza, combatendo pragas sem poluir o solo ou a água."
    },
    {
        pergunta: "O que significa o termo 'Desmatamento Zero' na agricultura?",
        opcoes: ["Plantar apenas em áreas já autorizadas.", "Parar de colher e plantar alimentos.", "Substituir matas por árvores falsas.", "Proibir tratores e máquinas."],
        correta: 0,
        explicacao: "Significa produzir de forma inteligente, usando terras que já foram abertas, sem derrubar novas florestas."
    },
    {
        pergunta: "Como a cobertura morta (palhada) ajuda a proteger a lavoura?",
        opcoes: ["Atraindo mais insetos para a área.", "Mantendo a umidade e evitando erosão.", "Apenas melhorando o visual do solo.", "Bloqueando a luz solar das plantas."],
        correta: 1,
        explicacao: "Essa camada de palha protege a terra contra o sol forte, mantém a umidade e evita que a chuva cause erosão."
    },
    {
        pergunta: "Qual é a principal fonte de energia limpa usada em fazendas?",
        opcoes: ["Geradores a óleo diesel.", "Queima de carvão mineral.", "Painéis solares e energia eólica.", "Baterias comuns descartáveis."],
        correta: 2,
        explicacao: "O sol e o vento geram energia limpa e infinita para ligar os sistemas da fazenda sem poluir o air."
    },
    {
        pergunta: "O uso excessivo de fertilizantes químicos pode causar qual problema?",
        opcoes: ["Contaminação de rios e do subsolo.", "Chuva ácida imediata na região.", "Congelamento das raíces.", "Transformação do solo em areia."],
        correta: 0,
        explicacao: "O excesso de química é levado pela chuva até os rios e lençóis freáticos, poluindo a água da região."
    },
    {
        pergunta: "Qual o objetivo da Agricultura de Precisão?",
        opcoes: ["Plantar a mesma semente no mundo todo.", "Usar tecnologia para aplicar o necessário.", "Medir o tamanho das frutas com régua.", "Garantir plantas da mesma altura."],
        correta: 1,
        explicacao: "Usando tecnologia como GPS e sensores, o fazendeiro aplica a quantidade exata de água ou adubo onde precisa."
    }
];

/* ==========================================================================
   SISTEMA DE NAVEGAÇÃO E GERENCIAMENTO DE FLUXO INTERNO
   ========================================================================== */
function startMinigame(id) {
    if(id === 1) {
        jogoAtivo = 1;
        if(document.getElementById('btn-engrenagem')) {
            document.getElementById('btn-engrenagem').style.display = 'none';
        }
        if(document.getElementById('btn-pause')) {
            document.getElementById('btn-pause').style.display = 'block';
        }
        goToPage('page-game');
        initDefensorDoMilharal();
    } else if(id === 2) {
        jogoAtivo = 2;
        if(document.getElementById('btn-pause')) {
            document.getElementById('btn-pause').style.display = 'none';
        }
        if(document.getElementById('btn-engrenagem')) {
            document.getElementById('btn-engrenagem').style.display = 'block';
        }
        goToPage('page-game'); 
        initMestreSustentabilidade();
    }
}

function initDefensorDoMilharal() {
    jogoAtivo = 1;
    estadoJogo = 'PRE_JOGO';
    document.getElementById('game-title').innerText = "Defensor do Milharal";
    jogoPausado = false;
    hordaAtual = 1;
    insetos = [];
    chefao = null;
    chefaoNasceu = false;
    
    pararTodosOsSons();
    trocarMusicaDeFundo(somFundoMenu);
    
    document.getElementById('btn-pause').style.display = 'none'; 
    desenharCiclo();
}

function initMestreSustentabilidade() {
    jogoAtivo = 2; 
    pararTodosOsSons(); 
    document.getElementById('game-title').innerText = "Mestre da Sustentabilidade";
    estadoQuiz = 'PRE_JOGO';
    quizAtual = 0;
    pontuacaoQuiz = 0;
    gameLoopQuiz();
}

function gameLoopQuiz() {
    if (jogoAtivo !== 2) return; 
    desenharQuiz();
    idDoLoopQuiz = requestAnimationFrame(gameLoopQuiz);
}

/* ==========================================================================
   CONTROLE DE MODULAÇÃO DE ÁUDIO E MIXAGEM SOUNDSCAPE
   ========================================================================== */
function updateVolume(val) {
    volumeGeral = val / 100;
    
    somFundoMenu.volume = volumeGeral;
    somFundoJogo.volume = volumeGeral;
    somFundoChefe.volume = volumeGeral;
    somMorteInseto.volume = volumeGeral;
    somMurmuro.volume = volumeGeral;

    if (typeof musicaInstrucoes !== 'undefined' && musicaInstrucoes) musicaInstrucoes.volume = volumeGeral;
    if (typeof musicaPerguntas !== 'undefined' && musicaPerguntas) musicaPerguntas.volume = volumeGeral;
    if (typeof musicaResultado !== 'undefined' && musicaResultado) musicaResultado.volume = volumeGeral;
    if (typeof somAcertoQuiz !== 'undefined' && somAcertoQuiz) somAcertoQuiz.volume = volumeGeral;
    if (typeof somErroQuiz !== 'undefined' && somErroQuiz) somErroQuiz.volume = volumeGeral;
}

function trocarMusicaDeFundo(novaMusica) {
    if (!novaMusica || !novaMusica.src) return;
    if (musicaAtualTocando !== novaMusica) {
        pararTodosOsSons();
        musicaAtualTocando = novaMusica;
        musicaAtualTocando.loop = true;
        musicaAtualTocando.currentTime = 0;
    }
    musicaAtualTocando.play().catch(e => console.log("Áudio pendente de interação com o usuário."));
}

function tocarEfeitoSonoro(efeito) {
    if (!efeito || !efeito.src) return;
    let clone = efeito.cloneNode();
    clone.volume = volumeGeral;
    clone.play().catch(e => console.log("Execução de efeito restrita."));
    
    if (musicaAtualTocando === somFundoMenu && somFundoMenu.paused) {
        somFundoMenu.play().catch(e => {});
    }
}

function pararTodosOsSons() {
    [
        somFundoMenu, somFundoJogo, somFundoChefe, somMurmuro,
        musicaInstrucoes, musicaPerguntas, musicaResultado, somAcertoQuiz, somErroQuiz
    ].forEach(s => {
        if(s && s.src) {
            s.pause();
            s.currentTime = 0; 
        }
    });
}

/* ==========================================================================
   SISTEMAS DE PAUSE, RETORNO E INTERRUPÇÃO DE GAMEPLAY
   ========================================================================== */
function pauseGame() {
    if(estadoJogo === 'HORDAS' && jogoAtivo === 1) {
        jogoPausado = !jogoPausado; 
        const botoesExtras = document.getElementById('menu-pausa-botoes');
        
        if(jogoPausado) {
            if(botoesExtras) botoesExtras.style.display = 'flex'; 
            toggleSettings(); 
        } else {
            if(botoesExtras) botoesExtras.style.display = 'none'; 
            toggleSettings(); 
            desenharCiclo(); 
        }
    }
}

function resumeGame() {
    jogoPausado = false;
    document.getElementById('settings-modal').style.display = 'none';
}

function reiniciarDoPause() { 
    toggleSettings(); 
    initDefensorDoMilharal(); 
}

function voltarDoPause() {
    jogoPausado = false;
    pararTodosOsSons(); 
    
    if (typeof musicaResultado !== 'undefined' && musicaResultado) {
        musicaResultado.pause();
        musicaResultado.currentTime = 0;
    }

    toggleSettings(); 

    if (document.getElementById('menu-pausa-botoes')) {
        document.getElementById('menu-pausa-botoes').style.display = 'none';
    }
    
    if (typeof estadoJogo !== 'undefined') {
        estadoJogo = 'MENU'; 
    }
    
    if (typeof idDoLoopQuiz !== 'undefined') {
        cancelAnimationFrame(idDoLoopQuiz);
    }
    jogoAtivo = 0;
    if (typeof estadoQuiz !== 'undefined') estadoQuiz = 'PRE_JOGO';
    if (typeof quizAtual !== 'undefined') quizAtual = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    goToPage('page-selection'); 
}

/* ==========================================================================
   LÓGICA DO JOGO 1: DEFENSOR DO MILHARAL (MECÂNICAS E RENDER)
   ========================================================================== */
function iniciarHorda() {
    estadoJogo = 'HORDAS';
    insetos = [];
    chefao = null;
    chefaoNasceu = false;

    const btnPause = document.getElementById('btn-pause');
    if (btnPause) {
        btnPause.style.display = 'block'; 
        btnPause.innerText = 'PAUSAR';    
    }
    
    trocarMusicaDeFundo(somFundoJogo);
    let qtdInsetos = hordaAtual * 6; 
    
    for (let i = 0; i < qtdInsetos; i++) {
        let angulo = Math.random() * Math.PI * 2;
        let raio = 500; 
        let spawnX = (canvas.width/2) + Math.cos(angulo) * raio;
        let spawnY = (canvas.height/2) + Math.sin(angulo) * raio;
        
        insetos.push({
            x: spawnX,
            y: spawnY,
            tipo: Math.random() > 0.5 ? 'gafanhoto' : 'lagarta',
            tamanho: 50,
            velocidade: 0.2 + (hordaAtual * 0.1),
            morrendo: false
        });
    }
}

function desenharCiclo() {
    if (jogoAtivo !== 1) return; 

    if (jogoPausado) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText("JOGO PAUSADO", 280, 250);
        return; 
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === 'PRE_JOGO') {
        if (imgCenarioPreJogo.complete) {
            ctx.drawImage(imgCenarioPreJogo, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#27ae60'; ctx.fillRect(0,0,canvas.width,canvas.height);
        }
        ctx.fillStyle = '#f1c40f'; ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.fillRect(320, 220, 160, 60); ctx.strokeRect(320, 220, 160, 60);
        ctx.fillStyle = '#000'; ctx.font = '14px "Press Start 2P"';
        ctx.fillText("INICIAR", 350, 255);
    }
    else {
        if (imgCenarioJogo.complete) {
            ctx.drawImage(imgCenarioJogo, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#2ecc71'; ctx.fillRect(0,0,canvas.width,canvas.height);
        }
        if (imgMilho.complete) {
            ctx.drawImage(imgMilho, 360, 210, 80, 80);
        } else {
            ctx.fillStyle = '#f1c40f'; ctx.fillRect(380, 230, 40, 40);
        }
    }

    if (estadoJogo === 'DIALOGO') {
        if (imgFazendeiro.complete) ctx.drawImage(imgFazendeiro, 50, 250, 150, 200);
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.fillRect(220, 280, 530, 120); ctx.strokeRect(220, 280, 530, 120);
        ctx.fillStyle = '#000'; ctx.font = '10px "Press Start 2P"';
        let linhas = quebrarTexto(dialogosFazendeiro[textoDialogoAtual], 30);
        linhas.forEach((linha, index) => {
            ctx.fillText(linha, 240, 315 + (index * 20));
        });
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText("[Clique para Avançar]", 560, 385);
    }
    else if (estadoJogo === 'ESCOLHA') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#fff'; ctx.font = '12px "Press Start 2P"';
        ctx.fillText("ESCOLHA SEU DEFENSIVO AGRICOLA:", 180, 100);

        ctx.fillStyle = '#2ecc71'; ctx.fillRect(150, 200, 150, 150); ctx.strokeRect(150, 200, 150, 150);
        if(imgPesticidaSustentavel.complete) ctx.drawImage(imgPesticidaSustentavel, 190, 220, 70, 70);
        ctx.fillStyle = '#fff'; ctx.fillText("SUSTENTÁVEL", 160, 320);

        ctx.fillStyle = '#e74c3c'; ctx.fillRect(500, 200, 150, 150); ctx.strokeRect(500, 200, 150, 150);
        if(imgPesticidaQuimico.complete) ctx.drawImage(imgPesticidaQuimico, 540, 220, 70, 70);
        ctx.fillStyle = '#fff'; ctx.fillText("QUÍMICO", 535, 320);
    }
    else if (estadoJogo === 'HORDAS') {
        if (!jogoPausado) {
            for (let i = insetos.length - 1; i >= 0; i--) {
                let ins = insetos[i];
                if (ins.morrendo) {
                    ins.tamanho -= 4;
                    if (ins.tamanho <= 0) {
                        insetos.splice(i, 1);
                        continue;
                    }
                } else {
                    let dx = 400 - ins.x;
                    let dy = 250 - ins.y;
                    let distancia = Math.sqrt(dx*dx + dy*dy);
                    if (distancia < 40) {
                        estadoJogo = 'GAMEOVER'; 
                    }
                    ins.x += (dx / distancia) * ins.velocidade;
                    ins.y += (dy / distancia) * ins.velocidade;
                }

                let img = ins.tipo === 'gafanhoto' ? imgGafanhoto : imgLagarta;
                if(img.complete) {
                    let angulo = Math.atan2(250 - ins.y, 400 - ins.x);
                    ctx.save(); 
                    ctx.translate(ins.x + ins.tamanho / 2, ins.y + ins.tamanho / 2);
                    ctx.rotate(angulo + (Math.PI / 2));
                    ctx.drawImage(img, -ins.tamanho / 2, -ins.tamanho / 2, ins.tamanho, ins.tamanho);
                    ctx.save();
                    ctx.restore(); 
                    ctx.restore(); 
                } else {
                    ctx.fillStyle = ins.tipo === 'gafanhoto' ? '#27ae60' : '#8e44ad';
                    ctx.fillRect(ins.x, ins.y, ins.tamanho, ins.tamanho);
                }
            }

            if (hordaAtual === 3 && insetos.length === 0 && !chefao && !chefaoNasceu) {
                chefao = { x: 50, y: 50, tamanho: 100, vida: 10, velocidade: 0.3, angulo: 0 };
                chefaoNasceu = true; 
                trocarMusicaDeFundo(somFundoChefe);
            }

            if (chefao) {
                let centroX = canvas.width / 2;
                let centroY = canvas.height / 2;
                let dx = centroX - (chefao.x + chefao.tamanho / 2);
                let dy = centroY - (chefao.y + chefao.tamanho / 2);
                let distancia = Math.sqrt(dx * dx + dy * dy);
                chefao.angulo = Math.atan2(dy, dx);

                if (distancia < 60) estadoJogo = 'GAMEOVER';

                chefao.x += (dx / distancia) * chefao.velocidade;
                chefao.y += (dy / distancia) * chefao.velocidade;

                cooldownTeleporte++;
                if (cooldownTeleporte > 120) { 
                    let posicaoSeguraAchada = false;
                    while (!posicaoSeguraAchada) {
                        let novoX = Math.random() * (canvas.width - chefao.tamanho);
                        let novoY = Math.random() * (canvas.height - chefao.tamanho);
                        let checkDx = centroX - (novoX + chefao.tamanho / 2);
                        let checkDy = centroY - (novoY + chefao.tamanho / 2);
                        if (Math.sqrt(checkDx * checkDx + checkDy * checkDy) > 220) {
                            chefao.x = novoX;
                            chefao.y = novoY;
                            posicaoSeguraAchada = true;
                        }
                    }
                    cooldownTeleporte = 0;
                }

                ctx.save(); 
                ctx.translate(chefao.x + chefao.tamanho / 2, chefao.y + chefao.tamanho / 2);
                ctx.rotate(chefao.angulo + Math.PI / 2);
                if (imgChefao.complete) {
                    ctx.drawImage(imgChefao, -chefao.tamanho / 2, -chefao.tamanho / 2, chefao.tamanho, chefao.tamanho);
                } else {
                    ctx.fillStyle = '#d35400'; ctx.fillRect(-chefao.tamanho / 2, -chefao.tamanho / 2, chefao.tamanho, chefao.tamanho);
                }
                ctx.restore(); 

                ctx.fillStyle = '#c0392b'; ctx.fillRect(chefao.x, chefao.y - 15, chefao.tamanho, 8);
                ctx.fillStyle = '#2ecc71'; ctx.fillRect(chefao.x, chefao.y - 15, chefao.tamanho * (chefao.vida / 10), 8);

                if (chefao.vida <= 0) estadoJogo = 'FINAL';
            }

            if (insetos.length === 0 && hordaAtual < 3 && !chefao) {
                hordaAtual++;
                iniciarHorda();
            }
        }

        ctx.fillStyle = '#000'; ctx.font = '10px "Press Start 2P"';
        ctx.fillText(`HORDA: ${hordaAtual}/3`, 20, 40);
        ctx.fillText(`DEFENSIVO: ${tipoPesticida}`, 20, 60);
    }
    else if (estadoJogo === 'FINAL') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#2ecc71'; ctx.font = '20px "Press Start 2P"';
        ctx.fillText("PARABÉNS! VOCÊ VENCEU!", 180, 150);
        ctx.fillStyle = '#fff'; ctx.font = '10px "Press Start 2P"';
        
        if (tipoPesticida === 'QUIMICO') {
            ctx.fillStyle = '#e74c3c'; ctx.fillText("FINAL RUIM", 340, 220);
            ctx.fillStyle = '#fff';
            ctx.fillText("Você matou as pragas, mas contaminou o solo", 120, 260);
            ctx.fillText("e perdeu todo o seu milho para a química!", 135, 290);
        } else {
            ctx.fillStyle = '#2ecc71'; ctx.fillText("FINAL BOM", 340, 220);
            ctx.fillStyle = '#fff';
            ctx.fillText("Você venceu as pragas com sucesso e o milho", 120, 260);
            ctx.fillText("não foi prejudicado pelo pesticida não sustentável!", 125, 290);
        }
        desenharBotoesFinais();
    }
    else if (estadoJogo === 'GAMEOVER') {
        ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#e74c3c'; ctx.font = '24px "Press Start 2P"';
        ctx.fillText("GAME OVER", 280, 180);
        ctx.fillStyle = '#fff'; ctx.font = '10px "Press Start 2P"';
        ctx.fillText("As pragas devoraram todo o seu milharal!", 170, 240);
        desenharBotoesFinais();
    }

    requestAnimationFrame(desenharCiclo);
}

function desenharBotoesFinais() {
    ctx.lineWidth = 3; ctx.strokeStyle = '#000';
    ctx.fillStyle = '#f1c40f'; ctx.fillRect(220, 380, 160, 50); ctx.strokeRect(220, 380, 160, 50);
    ctx.fillStyle = '#000'; ctx.font = '8px "Press Start 2P"'; ctx.fillText("JOGAR DE NOVO", 240, 410);
    
    ctx.fillStyle = '#95a5a6'; ctx.fillRect(420, 380, 160, 50); ctx.strokeRect(420, 380, 160, 50);
    ctx.fillStyle = '#000'; ctx.fillText("VOLTAR", 475, 410);
}

/* ==========================================================================
   LÓGICA DO JOGO 2: MESTRE DA SUSTENTABILIDADE (SISTEMA DE QUIZ)
   ========================================================================== */
function desenharQuiz() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoQuiz === 'PRE_JOGO') {
        if (imgFundoQuiz.complete) ctx.drawImage(imgFundoQuiz, 0, 0, 800, 500);
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0,0,800,500);
        desenharBotaoPixel(300, 350, 200, 60, "INICIAR", "#f1c40f");
    }
    else if (estadoQuiz === 'INSTRUCOES') {
        if (imgFundoQuiz.complete) ctx.drawImage(imgFundoQuiz, 0, 0, 800, 500);
        ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0,0,800,500); 

        ctx.fillStyle = "#2c3e50"; ctx.fillRect(50, 50, 700, 220);
        ctx.strokeStyle = "#95a5a6"; ctx.lineWidth = 10; ctx.strokeRect(55, 55, 690, 210);

        ctx.fillStyle = "#fff"; ctx.font = '11px "Press Start 2P"';
        wrapText(instrucoesQuiz[instrucaoQuizAtual], 90, 110, 620, 26);

        if (imgFazendeiroQuiz.complete) ctx.drawImage(imgFazendeiroQuiz, 620, 280, 180, 220);
        desenharBotaoPixel(280, 350, 240, 50, "AVANÇAR", "#3498db");
    }
    else if (estadoQuiz === 'PERGUNTA') {
        ctx.fillStyle = "#2c3e50"; ctx.fillRect(50, 50, 700, 250);
        ctx.strokeStyle = "#95a5a6"; ctx.lineWidth = 10; ctx.strokeRect(55, 55, 690, 240);

        ctx.fillStyle = "#fff"; ctx.font = '14px "Press Start 2P"';
        const p = perguntasQuiz[quizAtual];
        wrapText(p.pergunta, 100, 120, 600, 30);

        ctx.fillStyle = "#e74c3c"; ctx.fillRect(50, 315, (timerQuiz / 30) * 700, 10);

        p.opcoes.forEach((opt, i) => {
            let cor = "#34495e";
            desenharCaixaOpcao(50, 335 + (i * 38), 700, 32, opt, cor);
        });

        if (imgFazendeiroQuiz.complete) ctx.drawImage(imgFazendeiroQuiz, 620, 280, 180, 220);

        ctx.fillStyle = "#000"; ctx.font = '12px "Press Start 2P"';
        ctx.fillText(`PONTOS: ${pontuacaoQuiz}`, 50, 30);

        ctx.fillStyle = "#3498db"; ctx.fillRect(720, 10, 40, 40);
        ctx.fillStyle = "#fff"; ctx.fillText("🔊", 725, 38);
    }
    else if (estadoQuiz === 'FEEDBACK') {
        const p = perguntasQuiz[quizAtual];
        
        ctx.fillStyle = "#2c3e50"; ctx.fillRect(50, 50, 700, 250);
        ctx.strokeStyle = "#95a5a6"; ctx.lineWidth = 10; ctx.strokeRect(55, 55, 690, 240);

        ctx.font = '12px "Press Start 2P"';
        if (feedbackCorreto) {
            ctx.fillStyle = "#27ae60"; ctx.fillText("✔ CORRETO!", 100, 95);
        } else {
            ctx.fillStyle = "#e74c3c"; ctx.fillText("✘ INCORRETO...", 100, 95);
        }

        ctx.fillStyle = "#fff"; ctx.font = '10px "Press Start 2P"';
        wrapText(p.explicacao, 100, 135, 600, 22);

        p.opcoes.forEach((opt, i) => {
            let cor = "#34495e";
            if (i === p.correta) cor = "#27ae60"; 
            else cor = "#c0392b";                
            desenharCaixaOpcao(50, 335 + (i * 38), 700, 32, opt, cor);
        });

        if (imgFazendeiroQuiz.complete) ctx.drawImage(imgFazendeiroQuiz, 620, 280, 180, 220);

        ctx.fillStyle = "#000"; ctx.font = '12px "Press Start 2P"';
        ctx.fillText(`PONTOS: ${pontuacaoQuiz}`, 50, 30);

        desenharBotaoPixel(300, 240, 200, 40, "CONTINUAR", "#f1c40f");
    }
    else if (estadoQuiz === 'RESULTADO') {
        desenharTelaFinalQuiz();
    }
}

function desenharBotaoPixel(x, y, w, h, texto, cor) {
    ctx.fillStyle = cor; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#000"; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#000"; ctx.font = '14px "Press Start 2P"';
    ctx.fillText(texto, x + (w/4), y + (h/1.7));
}

function desenharCaixaOpcao(x, y, w, h, texto, cor) {
    ctx.fillStyle = cor; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#ecf0f1"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#fff"; ctx.font = '12px "Press Start 2P"';
    ctx.fillText(texto, x + 20, y + 28);
}

function iniciarPergunta() {
    estadoQuiz = 'PERGUNTA'; timerQuiz = 30;
    clearInterval(intervaloTimer);
    intervaloTimer = setInterval(() => {
        timerQuiz--;
        if (timerQuiz <= 0) verificarResposta(-1); 
    }, 1000);
}

function verificarResposta(indice) {
    clearInterval(intervaloTimer);
    const p = perguntasQuiz[quizAtual];
    musicaPerguntas.pause();

    if (indice === p.correta) { 
        pontuacaoQuiz++; 
        feedbackCorreto = true; 
        somAcertoQuiz.play().catch(e => {});
        somAcertoQuiz.onended = function() {
            if (estadoQuiz === 'FEEDBACK') {
                musicaPerguntas.play().catch(e => {});
            }
        };
    } else { 
        feedbackCorreto = false; 
        somErroQuiz.play().catch(e => {});
        somErroQuiz.onended = function() {
            if (estadoQuiz === 'FEEDBACK') {
                musicaPerguntas.play().catch(e => {});
            }
        };
    }
    
    estadoQuiz = 'FEEDBACK';
    desenharQuiz();
}

function proximaPergunta() {
    somAcertoQuiz.pause();
    somAcertoQuiz.currentTime = 0;
    somErroQuiz.pause();
    somErroQuiz.currentTime = 0;
    quizAtual++;
    if (quizAtual < perguntasQuiz.length) { iniciarPergunta(); } 
    else { estadoQuiz = 'RESULTADO'; }
}

/* ==========================================================================
   MÓDULO DE ACESSIBILIDADE: LEITURA SINTETIZADA (TEXT-TO-SPEECH API)
   ========================================================================== */
function lerTextoQuiz() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (typeof musicaPerguntas !== 'undefined' && estadoQuiz === 'PERGUNTA') {
            musicaPerguntas.play().catch(e => {});
        }
        return; 
    }

    window.speechSynthesis.cancel();
    const p = perguntasQuiz[quizAtual];
    let msg = new SpeechSynthesisUtterance(p.pergunta + ". Alternativas: " + p.opcoes.join(", "));
    msg.lang = 'pt-BR'; 

    if (typeof musicaPerguntas !== 'undefined') {
        musicaPerguntas.pause();
    }

    msg.onend = function() {
        if (typeof musicaPerguntas !== 'undefined' && estadoQuiz === 'PERGUNTA') {
            musicaPerguntas.play().catch(e => {});
        }
    };

    window.speechSynthesis.speak(msg);
}

function desenharTelaFinalQuiz() {
    ctx.fillStyle = "#fff"; ctx.fillRect(0,0,800,500);
    ctx.fillStyle = "#000"; ctx.font = '20px "Press Start 2P"';
    ctx.fillText("RESULTADO FINAL", 250, 100);
    
    let medalha; let msgFinal = "";
    let totalPerguntas = perguntasQuiz.length;
    
    if (pontuacaoQuiz === totalPerguntas) { msgFinal = "Gênio da Sustentabilidade!"; medalha = imgOuro; } 
    else if (pontuacaoQuiz >= totalPerguntas * 0.5) { msgFinal = "Dominante da Sustentabilidade!"; medalha = imgPrata; } 
    else { msgFinal = "Iniciante da Sustentabilidade!"; medalha = imgBronze; }

    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(msgFinal, 50, 200);
    ctx.fillText(`Pontos: ${pontuacaoQuiz} de ${totalPerguntas}`, 300, 250);
    
    if (medalha && medalha.complete) ctx.drawImage(medalha, 150, 280, 180, 180);

    ctx.fillStyle = "#95a5a6"; 
    ctx.fillRect(500, 350, 200, 50); 
    
    ctx.fillStyle = "#fff";
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText("SAIR", 565, 382); 
}

/* ==========================================================================
   FUNÇÕES UTILS / AUXILIARES DE FORMATAÇÃO E TIPOGRAFIA NO CANVAS
   ========================================================================== */
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' '); let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y); line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.fillText(line, x, y);
}

function quebrarTexto(texto, maxCaracteres) {
    let palavras = texto.split(' '); let linhas = []; let lineAtual = '';
    palavras.forEach(palavra => {
        if ((lineAtual + palavra).length > maxCaracteres) {
            linhas.push(lineAtual); lineAtual = palavra + ' ';
        } else { lineAtual += palavra + ' '; }
    });
    linhas.push(lineAtual); return linhas;
}

/* ==========================================================================
   DISPATCHER CENTRALIZADOR DE ENTRADA POR CLIQUES (MOUSE EVENT LISTENER)
   ========================================================================== */
canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    /* --- ENTRADA DE EVENTOS: COMPONENTE JOGO 1 --- */
    if (jogoAtivo === 1) { 
        if (estadoJogo === 'PRE_JOGO' && somFundoMenu.paused) {
            somFundoMenu.play().catch(e => console.log("Áudio retido"));
        }
        if (jogoPausado) return;

        if (estadoJogo === 'PRE_JOGO') {
            if (mouseX >= 320 && mouseX <= 480 && mouseY >= 220 && mouseY <= 280) {
                somFundoMenu.play().catch(e => {});
                estadoJogo = 'DIALOGO'; textoDialogoAtual = 0;
                document.getElementById('btn-pause').style.display = 'block'; 
                tocarEfeitoSonoro(somMurmuro);
            }
        }
        else if (estadoJogo === 'DIALOGO') {
            textoDialogoAtual++;
            if (textoDialogoAtual >= dialogosFazendeiro.length) {
                estadoJogo = 'ESCOLHA';
                if(somMurmuro.src) somMurmuro.pause();
            } else {
                tocarEfeitoSonoro(somMurmuro);
            }
        }
        else if (estadoJogo === 'ESCOLHA') {
            if (mouseX >= 150 && mouseX <= 300 && mouseY >= 200 && mouseY <= 350) {
                tipoPesticida = 'SUSTENTAVEL'; iniciarHorda();
            }
            else if (mouseX >= 500 && mouseX <= 650 && mouseY >= 200 && mouseY <= 350) {
                tipoPesticida = 'QUIMICO'; iniciarHorda();
            }
        }
        else if (estadoJogo === 'HORDAS') {
            for (let i = insetos.length - 1; i >= 0; i--) {
                let ins = insetos[i];
                if (!ins.morrendo && mouseX >= ins.x && mouseX <= ins.x + ins.tamanho && mouseY >= ins.y && mouseY <= ins.y + ins.tamanho) {
                    ins.morrendo = true; tocarEfeitoSonoro(somMorteInseto); break;
                }
            }
            if (chefao && mouseX >= chefao.x && mouseX <= chefao.x + chefao.tamanho && mouseY >= chefao.y && mouseY <= chefao.y + chefao.tamanho) {
                chefao.vida--; tocarEfeitoSonoro(somMorteInseto);
                let posAchada = false;
                while (!posAchada) {
                    let nX = Math.random() * (canvas.width - chefao.tamanho);
                    let nY = Math.random() * (canvas.height - chefao.tamanho);
                    if (Math.sqrt(Math.pow((canvas.width/2)-(nX+50),2)+Math.pow((canvas.height/2)-(nY+50),2)) > 220) {
                        chefao.x = nX; chefao.y = nY; posAchada = true;
                    }
                }
            }
        }
        else if (estadoJogo === 'FINAL' || estadoJogo === 'GAMEOVER') {
            if (mouseX >= 220 && mouseX <= 380 && mouseY >= 380 && mouseY <= 430) initDefensorDoMilharal();
            else if (mouseX >= 420 && mouseX <= 580 && mouseY >= 380 && mouseY <= 430) {
                pararTodosOsSons(); goToPage('page-selection');
            }
        }
    }

    /* --- ENTRADA DE EVENTOS: COMPONENTE JOGO 2 (QUIZ) --- */
    if (jogoAtivo === 2) {
        if (estadoQuiz === 'PRE_JOGO') {
            if (mouseX > 300 && mouseX < 500 && mouseY > 350 && mouseY < 410) {
                estadoQuiz = 'INSTRUCOES';
                instrucaoQuizAtual = 0;
                pararTodosOsSons(); 
                musicaInstrucoes.play().catch(e => console.log("Restrição de áudio em instruções"));
                desenharQuiz();
            }
        }
        else if (estadoQuiz === 'INSTRUCOES') {
            if (mouseX >= 280 && mouseX <= 520 && mouseY >= 350 && mouseY <= 400) {
                instrucaoQuizAtual++;
                if (instrucaoQuizAtual >= instrucoesQuiz.length) {
                    musicaInstrucoes.pause();
                    musicaInstrucoes.currentTime = 0;
                    
                    quizAtual = 0;
                    pontuacaoQuiz = 0;
                    estadoQuiz = 'PERGUNTA';
                    iniciarPergunta(); 
                    
                    musicaPerguntas.play().catch(e => {});
                } else {
                    desenharQuiz();
                }
            }
        }
        else if (estadoQuiz === 'PERGUNTA') {
            perguntasQuiz[quizAtual].opcoes.forEach((_, i) => {
                if (mouseX > 50 && mouseX < 750 && mouseY > 335 + (i * 38) && mouseY < 367 + (i * 38)) verificarResposta(i);
            });
            if (mouseX > 720 && mouseX < 760 && mouseY > 10 && mouseY < 50) lerTextoQuiz();
        }
        else if (estadoQuiz === 'FEEDBACK') {
            if (mouseX > 300 && mouseX < 500 && mouseY > 240 && mouseY < 280) {
                somAcertoQuiz.pause(); somAcertoQuiz.currentTime = 0;
                somErroQuiz.pause(); somErroQuiz.currentTime = 0;

                quizAtual++;
                if (quizAtual < perguntasQuiz.length) {
                    estadoQuiz = 'PERGUNTA';
                    iniciarPergunta(); 
                    musicaPerguntas.play().catch(e => {});
                } else {
                    estadoQuiz = 'RESULTADO';
                    musicaPerguntas.pause();
                    musicaPerguntas.currentTime = 0;
                    musicaResultado.play().catch(e => {});
                    desenharQuiz(); 
                }
            }
        }
        else if (estadoQuiz === 'RESULTADO') {
            if (mouseX >= 500 && mouseX <= 700 && mouseY >= 350 && mouseY <= 400) {
                musicaResultado.pause();
                musicaResultado.currentTime = 0;
                
                if (typeof idDoLoopQuiz !== 'undefined') {
                    cancelAnimationFrame(idDoLoopQuiz);
                }
                
                jogoAtivo = 0; 
                estadoQuiz = 'PRE_JOGO';
                quizAtual = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                goToPage('page-selection');
            }
        }
    }
});

/* ==========================================================================
   GERENCIADORES DE INTERFACE E EXIBIÇÃO DE MODAL (VIEW CONTROLLERS)
   ========================================================================== */
function abrirTela(id) {
    pararTodosOsSons(); 
    document.getElementById(id).style.display = 'flex';
}

function fecharTela(id) {
    document.getElementById(id).style.display = 'none';
}
