let currentFocusedElement = null

function openModal(speciesId) {
  currentFocusedElement = document.activeElement
  const modal = document.getElementById('modal-' + speciesId)
  modal.style.display = 'block'
  document.body.style.overflow = 'hidden'
  trapFocus(modal)

  setTimeout(() => {
    const closeButton = modal.querySelector('.modal-close')
    if (closeButton) closeButton.focus()
  }, 100)
}

function closeModal(speciesId) {
  const modal = document.getElementById('modal-' + speciesId)
  modal.style.display = 'none'
  document.body.style.overflow = 'auto'
  releaseTrap()

  if (currentFocusedElement) {
    currentFocusedElement.focus()
    currentFocusedElement = null
  }
}

function openTeamModal() {
  currentFocusedElement = document.activeElement
  const modal = document.getElementById('modal-team')
  modal.style.display = 'block'
  document.body.style.overflow = 'hidden'
  trapFocus(modal)

  setTimeout(() => {
    const closeButton = modal.querySelector('.modal-close')
    if (closeButton) closeButton.focus()
  }, 100)
}

window.onclick = function (event) {
  const modals = document.querySelectorAll('.modal')
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = 'none'
      document.body.style.overflow = 'auto'
      releaseTrap()
      releaseTrap()

      if (currentFocusedElement) {
        currentFocusedElement.focus()
        currentFocusedElement = null
      }
    }
  })
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal')
    modals.forEach((modal) => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none'
      }
    })
    document.body.style.overflow = 'auto'

    const imageModal = document.getElementById('image-fullscreen-modal')
    if (imageModal && imageModal.style.display === 'block') {
      imageModal.style.display = 'none'
    }

    if (currentFocusedElement) {
      currentFocusedElement.focus()
      currentFocusedElement = null
    }
  }
})

function openImageFullscreen(imageSrc) {
  let imageModal = document.getElementById('image-fullscreen-modal')
  const img = imageModal.querySelector('img')
  img.src = imageSrc
  imageModal.style.display = 'block'
}

function closeImageFullscreen() {
  const imageModal = document.getElementById('image-fullscreen-modal')
  if (imageModal) {
    imageModal.style.display = 'none'
  }
}

const imageFullscreenModal = document.getElementById('image-fullscreen-modal')
if (imageFullscreenModal) {
  imageFullscreenModal.onclick = function (e) {
    if (e.target === imageFullscreenModal) {
      closeImageFullscreen()
    }
  }
}

// Reveal on scroll (IntersectionObserver)
;(function initReveal() {
  const targets = document.querySelectorAll(
    '.intro-text, .species-card, .footer-section, .team-card'
  )
  targets.forEach((el) => el.classList.add('reveal'))

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )

  targets.forEach((el) => io.observe(el))
})()

// Accesibilidad: cards clicables con teclado
;(function initCardKeyboard() {
  const cards = document.querySelectorAll('.species-card')
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0')
    card.setAttribute('role', 'button')
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        card.click()
      }
    })
  })
})()

// Focus trap simple para modales
let activeTrap = null
function trapFocus(modalEl) {
  const focusables = modalEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  function onKeyDown(e) {
    if (e.key !== 'Tab') return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  modalEl.addEventListener('keydown', onKeyDown)
  activeTrap = { modalEl, onKeyDown }
}

function releaseTrap() {
  if (!activeTrap) return
  activeTrap.modalEl.removeEventListener('keydown', activeTrap.onKeyDown)
  activeTrap = null
}
