import { getQuestionsFromAPI } from './api.js'

// 1. Elementos del DOM
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainer = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

let currentQuestionIndex = 0
let questions = []
let score = 0 // 🧠 Puntaje total

// 2. Iniciar el juego
startButton.addEventListener('click', async () => {
  startButton.classList.add('hide')
  currentQuestionIndex = 0
  score = 0
  questionContainer.classList.remove('hide')

  questions = await getQuestionsFromAPI()
  console.log('Preguntas cargadas:', questions)

  if (questions.length === 0) {
    alert("No se pudieron cargar preguntas.")
    startButton.classList.remove('hide')
    return
  }

  setNextQuestion()
})

nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

// 3. Mostrar siguiente pregunta
function setNextQuestion() {
  resetState()
  showQuestion(questions[currentQuestionIndex])
}

// 4. Mostrar pregunta actual
function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = true
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

// 5. Reiniciar botones
function resetState() {
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

// 6. Seleccionar respuesta
function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct === 'true'

  // 🧠 Sumar punto si es correcto
  if (correct) {
    score++
  }

  setStatusClass(selectedButton, correct)

  // Mostrar todas las respuestas como correctas o incorrectas
  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true
    setStatusClass(button, button.dataset.correct === 'true')
  })

  // ¿Hay más preguntas?
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    // 🧠 Guardar puntuación y redirigir a resultados
    localStorage.setItem('lastScore', score)
    setTimeout(() => {
      window.location.href = 'results.html'
    }, 1000)
  }
}

// 7. Estilo visual para correctas / incorrectas
function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}
