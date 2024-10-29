// Dados das perguntas, incluindo o texto e a imagem da pergunta
const questions = [
    {
        text: "Qual é o significado da placa?",
        options: ["Parada obrigatória", "Siga em frente", "Curva perigosa", "Proibido estacionar", "Pista escorregadia"],
        answer: "A",
        image: "imagens/placapare.jpg" // Caminho da imagem
    },
    {
        text: "Qual a velocidade máxima permitida em uma via urbana?",
        options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h", "70 km/h"],
        answer: "C"
    },

    {
        text: "Ocorre o recolhimento da CNH quando o condutor:",
        options: ["Estacionar em local proibido pela sinalização.", "Estacionar sobre a faixa de pedestre.", "Dirigir veículo se a CNH estiver vencida a mais de 30 dias.", "Dirigir veículo sem utilizar o cinto de segurança"],
        answer: "C"
    },
    {
        text: "O uso abusivo de álcool e drogas pelo condutor causa efeitos comprometendo a sua capacidade de auto-avaliação e:",
        options: ["Aumento de acuidade visual", "A melhoria da audição", "O desenvolvimento de atenção", "O retardamento dos reflexos"],
        answer: "D"
    },
    {
        text: "Além dos males causados pela poluição do ar por veículos, assinale a alternativa que corresponde a consequência da chuva ácida:",
        options: ["Corrosão em metais", "Tontura", "Dor de cabeça", "Edema pulmonar"],
        answer: "A"
    },
    {
        text: "Melhoram a percepção do condutor e separam as faixas de trânsito:",
        options: ["As marcas transversais", "Faixas contínuas", "As taxas e os tachões", "Todas as afirmativas acima"],
        answer: "C"
    },

    {
        text: "O condutor que dirige com segurança é aquele que:",
        options: ["Circula em alta velocidade em qualquer situação.", "Circula com velocidade adequada a via.", "Ultrapassar outro veículo pela direita.", "Ultrapassa nos viadutos e pontes."],
        answer: "B"
    },
    
    {
        text: "Na sinalização horizontal a cor utilizada para a regulação de fluxos de sentidos opostos é:",
        options: ["Amarela", "Branca", "Azul", "Preta"],
        answer: "A"
    },
   
    {
    text: "A placa de forma triangular é característica de sinalização de:",
        options: ["Sentido proibido.", "Dê a preferência.", "Parada obrigatória.", "Proibido estacionar.",],
        answer: "B",
        image: "imagens/preferencia.jpg" // Caminho da imagem
    },

    {
        text: "A placa A-42a adverte o condutor da existência adiante de:",
            options: ["Inicio da pista dupla", "Fim da pista dupla", "Mão dupla adiante", "Pista irregular",],
            answer: "A",
            image: "imagens/iniciopistadupla.png" // Caminho da imagem
    },
    
    {
        text: "A placa A-14 adverte que você vai encontrar:",
            options: ["Um estreitamento de pista.", "Um canteiro de obras à frente.", "Um cruzamento.", "Um semáforo à frente.",],
            answer: "D",
            image: "imagens/semafaro.jpg" // Caminho da imagem
    },
    
    
    {
        text: "Diante da placa R-28 você entende que:",
            options: ["É proibido realizar a operação de ultrapassagem no trecho regulamentado.", " Os ônibus e caminhões devem usar, obrigatoriamente, a faixa da direita.", " É permitido o tráfego nos dois sentidos.", "É proibido mudar de faixa e rolamento.",],
            answer: "C",
            image: "imagens/trafegoduplo.jpg" // Caminho da imagem
    },
       

    
];


// Variáveis de controle para a pontuação e pergunta atual
let currentQuestionIndex = 0;
let score = 0;
let blankQuestions = 0;
let totalTime = 60 * 60; // Tempo total do quiz em segundos (60 minutos)
let timerInterval;
let startTime;
let answeredQuestions = []; // Array para armazenar perguntas respondidas ou em branco
let skippedQuestions = []; // Array para perguntas que o usuário apenas avançou sem responder

// Seleciona os elementos da interface
const quizContainer = document.getElementById('quiz-container');
const startScreen = document.getElementById('start-screen');
const questionText = document.getElementById('question-text');
const imageContainer = document.getElementById('image-container');
const optionsContainer = document.querySelectorAll('.option');
const startButton = document.getElementById('start-btn');
const endButton = document.getElementById('end-btn');

// Função para iniciar o quiz com contagem regressiva
startButton.addEventListener('click', () => {
    startScreen.innerHTML = "<h2>Preparado(a)?</h2><h3>O simulado começa em <span id='countdown'>5</span></h3>";
    let countdown = 5;
    const countdownTimer = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        
        if (countdown === 0) {
            clearInterval(countdownTimer);
            startScreen.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            displayQuestion();
            startTimer();
        }
    }, 1000);
});

// Função para iniciar o cronômetro
function startTimer() {
    const timerCount = document.getElementById('timer-count');
    startTime = totalTime;
    
    timerInterval = setInterval(() => {
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        timerCount.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        totalTime--;

        if (totalTime < 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// Função para exibir a pergunta atual
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    imageContainer.innerHTML = question.image ? `<img src="${question.image}" alt="Imagem da pergunta">` : '';
    questionText.textContent = question.text;

    optionsContainer.forEach((option, index) => {
        option.textContent = `${String.fromCharCode(65 + index)}) ${question.options[index]}`;
    });
}

// Função para avançar para a próxima pergunta
// Função para avançar para a próxima pergunta
function nextQuestion() {
    if (!answeredQuestions.includes(currentQuestionIndex) && !skippedQuestions.includes(currentQuestionIndex)) {
        skippedQuestions.push(currentQuestionIndex); // Marca a pergunta atual como avançada
    }

    let foundNextUnanswered = false;
    for (let i = currentQuestionIndex + 1; i < questions.length; i++) {
        if (!answeredQuestions.includes(i)) {
            currentQuestionIndex = i;
            foundNextUnanswered = true;
            break;
        }
    }

    // Se não encontrar mais perguntas não respondidas, mostra uma mensagem
    if (!foundNextUnanswered) {
        alert("Você ainda não respondeu todas as perguntas.");
        return; // Não encerra o quiz, apenas retorna
    } else {
        displayQuestion();
    }
}

// Função para encerrar o quiz e exibir o resultado
function endQuiz() {
    // Verifica se todas as perguntas foram respondidas
    if (answeredQuestions.length < questions.length) {
        alert("Você precisa responder todas as perguntas antes de encerrar.");
        return; // Não encerra o quiz
    }
}
// Função para voltar para a pergunta anterior não respondida e não deixada em branco
document.getElementById('prev-btn').addEventListener('click', () => {
    let foundPreviousSkipped = false;

    for (let i = currentQuestionIndex - 1; i >= 0; i--) {
        if (skippedQuestions.includes(i) && !answeredQuestions.includes(i)) {
            currentQuestionIndex = i;
            foundPreviousSkipped = true;
            break;
        }
    }

    if (!foundPreviousSkipped) {
        alert("Todas as questões anteriores foram respondidas ou deixadas em branco.");
    } else {
        displayQuestion();
    }
});

// Função para selecionar uma resposta e verificar se está correta
function selectAnswer(answer) {
    const question = questions[currentQuestionIndex];
    if (answer === question.answer) {
        alert("Resposta Correta");
        score++;
    } else {
        alert("Resposta Incorreta");
    }
    if (!answeredQuestions.includes(currentQuestionIndex)) {
        answeredQuestions.push(currentQuestionIndex); // Marca a pergunta atual como respondida
    }
    nextQuestion();
}

// Marca a questão como em branco e avança
document.getElementById('blank-btn').addEventListener('click', () => { 
    blankQuestions++; 
    if (!answeredQuestions.includes(currentQuestionIndex)) {
        answeredQuestions.push(currentQuestionIndex); // Marca como respondida em branco
    }
    nextQuestion();
});

// Função para encerrar o quiz e exibir o resultado
function endQuiz() {
    clearInterval(timerInterval);
    const totalQuestions = questions.length;
    const incorrectAnswers = totalQuestions - score - blankQuestions;
    const accuracy = (score / totalQuestions) * 100;
    const status = accuracy >= 70 ? "Aprovado" : "Reprovado";

    const timeSpent = startTime - totalTime;
    const minutesSpent = Math.floor(timeSpent / 60);
    const secondsSpent = timeSpent % 60;

    quizContainer.innerHTML = `
        <h2>Prova Finalizada!</h2>
        <p>Acertos: ${score}</p>
        <p>Erros: ${incorrectAnswers}</p>
        <p>Questões em Branco: ${blankQuestions}</p>
        <p>Aproveitamento: ${accuracy.toFixed(2)}%</p>
        <p>Status: ${status}</p>
        <p>Tempo Gasto: ${minutesSpent}m ${secondsSpent}s</p>
    `;
}


// Listener para o botão de encerrar
endButton.addEventListener('click', endQuiz); // Aqui está a linha para o botão de encerrar


// Listeners para as teclas do teclado virtual
document.getElementById('answer-a').addEventListener('click', () => selectAnswer("A"));
document.getElementById('answer-b').addEventListener('click', () => selectAnswer("B"));
document.getElementById('answer-c').addEventListener('click', () => selectAnswer("C"));
document.getElementById('answer-d').addEventListener('click', () => selectAnswer("D"));
document.getElementById('answer-e').addEventListener('click', () => selectAnswer("E"));
document.getElementById('next-btn').addEventListener('click', nextQuestion);
