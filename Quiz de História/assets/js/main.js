// Selecionar elementos do DOM
const quizContainer = document.getElementById('quiz-container');
const quizHeader = document.getElementById('quiz-header');
const quizStep = document.getElementById('quiz-step');
const quizScore = document.getElementById('quiz-score');
const quizTimer = document.getElementById('quiz-timer');
const quizBody = document.getElementById('quiz-body');
const quizQuestionTitle = document.getElementById('quiz-question-title');
const quizQuestionOptions = document.getElementById('quiz-question-options');
const quizActionButton = document.getElementById('quiz-action');

// Variáveis de estado
let score = 0;
let timerInterval;
let timeRemaining = 60;
let currentQuestionIndex = 0;

// Dados do quiz
const questions = [
    {
        question: "Em que ano Angola alcançou sua independência?",
        options: ["1975", "1961", "1980", "1970"],
        correctAnswer: 0
    },
    {
        question: "Quem foi o primeiro presidente de Angola?",
        options: ["Agostinho Neto", "Jonas Savimbi", "José Eduardo dos Santos", "Holden Roberto"],
        correctAnswer: 0
    },
    {
        question: "Qual era o nome do movimento que lutou pela independência de Angola?",
        options: ["UNITA", "MPLA", "FNLA", "Todos os anteriores"],
        correctAnswer: 3
    },
    {
        question: "Que país colonizou Angola antes da independência?",
        options: ["Espanha", "França", "Portugal", "Reino Unido"],
        correctAnswer: 2
    },
    {
        question: "Qual foi o principal recurso natural explorado em Angola durante o período colonial?",
        options: ["Ouro", "Petróleo", "Diamantes", "Café"],
        correctAnswer: 3
    },
    {
        question: "Qual foi o tratado que definiu as fronteiras de Angola durante o período colonial?",
        options: ["Tratado de Versalhes", "Tratado de Simulambuco", "Tratado de Tordesilhas", "Tratado de Alvor"],
        correctAnswer: 1
    },
    {
        question: "Qual foi o principal movimento de resistência durante a colonização portuguesa?",
        options: ["MPLA", "Kwata-Kwata", "FNLA", "UNITA"],
        correctAnswer: 0
    },
    {
        question: "Qual evento marcou o início da luta armada pela independência de Angola?",
        options: ["Revolta da Baixa de Kassanje", "Golpe de Estado de 1974", "Massacre de Mueda", "Início da Guerra Civil"],
        correctAnswer: 0
    },
    {
        question: "Quem foi a figura central na luta do MPLA pela independência?",
        options: ["Jonas Savimbi", "Agostinho Neto", "Holden Roberto", "José Eduardo dos Santos"],
        correctAnswer: 1
    },
    {
        question: "Em que ano começou a Guerra Civil em Angola?",
        options: ["1975", "1961", "1990", "1985"],
        correctAnswer: 0
    },
    {
        question: "Que conferência resultou no Tratado de Alvor, que visava definir o futuro de Angola após a independência?",
        options: ["Conferência de Berlim", "Conferência de Alvor", "Conferência de Bandung", "Conferência de Potsdam"],
        correctAnswer: 1
    },
    {
        question: "Que movimento político angolano foi apoiado pela África do Sul durante a Guerra Civil?",
        options: ["MPLA", "FNLA", "UNITA", "Nenhum dos anteriores"],
        correctAnswer: 2
    },
    {
        question: "Qual país ofereceu forte apoio militar e financeiro ao MPLA durante a Guerra Civil?",
        options: ["Estados Unidos", "União Soviética", "China", "Reino Unido"],
        correctAnswer: 1
    },
    {
        question: "Qual era o nome do líder da UNITA durante a Guerra Civil em Angola?",
        options: ["Agostinho Neto", "Jonas Savimbi", "Holden Roberto", "José Eduardo dos Santos"],
        correctAnswer: 1
    },
    {
        question: "Qual recurso natural desempenhou um papel central no financiamento dos conflitos durante a Guerra Civil em Angola?",
        options: ["Ouro", "Petróleo", "Café", "Diamantes"],
        correctAnswer: 3
    }
];

// Exibir a questão atual
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    // Limpar opções e preparar animações
    quizQuestionTitle.innerHTML = "";
    quizQuestionOptions.innerHTML = "";

    // Adicionar animação ao título da pergunta
    quizQuestionTitle.classList.add('animate__animated', 'animate__fadeInDown');
    quizQuestionTitle.innerHTML = `
        <h4 class="question__title">Questão ${currentQuestionIndex + 1}</h4>
        <p class="question__text">${currentQuestion.question}</p>
    `;

    // Adicionar opções com animações de entrada
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('quiz__question-option', 'animate__animated', `animate__fadeIn${index % 2 === 0 ? 'Left' : 'Right'}`);
        optionElement.style.animationDelay = `${index * 0.2}s`; // Atraso para cada opção

        optionElement.innerHTML = `
            <label>
                ${String.fromCharCode(65 + index)}) ${option}
            </label>
            <input type="radio" name="quiz-option" id="quiz-option-${index}" value="${index}">
        `;

        // Selecionar o input ao clicar
        optionElement.addEventListener('click', () => {
            const radioButton = optionElement.querySelector('input');
            radioButton.checked = true;
        });

        quizQuestionOptions.appendChild(optionElement);
    });

    // Atualizar progresso
    quizStep.value = currentQuestionIndex + 1;
    quizStep.max = questions.length;

    // Remover classes de animação após conclusão
    setTimeout(() => {
        quizQuestionTitle.classList.remove('animate__animated', 'animate__fadeInDown');
        currentQuestion.options.forEach((_, index) => {
            const option = document.querySelector(`.quiz__question-option:nth-child(${index + 1})`);
            option.classList.remove('animate__animated', `animate__fadeIn${index % 2 === 0 ? 'Left' : 'Right'}`);
        });
    }, 1000);
}


// Verificar a resposta
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz-option"]:checked');

    if (!selectedOption) {
        alert('Por favor, selecione uma opção.');
        return;
    }

    const answerIndex = parseInt(selectedOption.value, 10);
    const options = document.querySelectorAll('.quiz__question-option');

    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
        score++;
        quizScore.textContent = score;
        options[answerIndex].classList.add('correct'); // Adicionar classe para resposta correta
        // Adicionar 5 segundos ao tempo restante
        timeRemaining += 5;
    } else {
        options[answerIndex].classList.add('incorrect'); // Adicionar classe para resposta incorreta
        options[questions[currentQuestionIndex].correctAnswer].classList.add('correct'); // Marcar a resposta correta
    }

    // Desabilitar outras opções após a resposta
    options.forEach(option => {
        option.querySelector('input').disabled = true;
    });

    // Passar para a próxima questão após um pequeno atraso
    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

// Iniciar o temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        quizTimer.textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// Formatar o tempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Encerrar o quiz
function endQuiz() {
    clearInterval(timerInterval);

    quizBody.innerHTML = `
        <div class="quiz__body">
            <h2>Quiz Finalizado!</h2>
            <p>Sua pontuação final foi: ${score} de ${questions.length}</p>
        </div>
    `;
}

// Encerrar o quiz
function endQuiz() {
    clearInterval(timerInterval);

    // Exibir a mensagem final
    quizBody.innerHTML = `
        <div class="quiz__body">
            <h2>Quiz Finalizado!</h2>
            <p>Sua pontuação final foi: ${score} de ${questions.length}</p>
            <p>${getResultMessage()}</p> <!-- Mensagem interativa -->
            <button id="restart-btn">Reiniciar o Quiz</button>
        </div>
    `;

    // Adicionar evento de reiniciar quiz
    document.getElementById('restart-btn').addEventListener('click', initQuiz);
}

// Mensagem personalizada com base na pontuação
function getResultMessage() {
    if (score === questions.length) {
        return "Parabéns! Você acertou todas as perguntas!";
    } else if (score >= questions.length * 0.75) {
        return "Ótimo trabalho! Você teve um excelente desempenho!";
    } else if (score >= questions.length * 0.5) {
        return "Bom trabalho, mas ainda há espaço para melhorar!";
    } else {
        return "Você pode fazer melhor! Tente novamente!";
    }
}

// Inicializar o quiz
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeRemaining = 60;
    quizScore.textContent = score;
    quizTimer.textContent = formatTime(timeRemaining);
    displayQuestion();
    startTimer();
}


// Eventos
quizActionButton.addEventListener('click', checkAnswer);

initQuiz();

