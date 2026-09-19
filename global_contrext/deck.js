/**
 * Paytm Merchant Growth Agent - Presentation Deck Engine
 * Handles 16:9 responsive viewport scaling, keyboard navigation,
 * overview modal, full-screen, and interactive slide demos.
 */

(function () {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  const deckContainer = document.getElementById('deck-container');
  const slideIndicator = document.getElementById('slide-indicator');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOverview = document.getElementById('btn-overview');
  const btnCloseOverview = document.getElementById('btn-close-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnPrint = document.getElementById('btn-print');
  const overviewModal = document.getElementById('overview-modal');
  const overviewGrid = document.getElementById('overview-grid');

  // 1. Precise 16:9 Viewport Scaling
  function updateScale() {
    const targetWidth = 1440;
    const targetHeight = 810;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY) * 0.96; // 4% breathing padding

    deckContainer.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', updateScale);
  updateScale();

  // 2. Slide Navigation Logic
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');

    // Update indicator (01 / 20)
    const formattedNum = String(currentSlideIndex + 1).padStart(2, '0');
    slideIndicator.textContent = `${formattedNum} / ${totalSlides}`;

    // Update hash for deep-linking
    window.location.hash = `#slide-${currentSlideIndex + 1}`;

    // Update active state in overview modal
    document.querySelectorAll('.overview-thumb').forEach((thumb, idx) => {
      thumb.classList.toggle('current', idx === currentSlideIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  // 3. Populate Overview Modal
  function populateOverview() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, idx) => {
      const slideTitle = slide.getAttribute('data-title') || `Slide ${idx + 1}`;
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${idx === currentSlideIndex ? 'current' : ''}`;
      thumb.innerHTML = `
        <div class="thumb-num">PAGE ${String(idx + 1).padStart(2, '0')}</div>
        <div class="thumb-title">${slideTitle}</div>
      `;
      thumb.addEventListener('click', () => {
        goToSlide(idx);
        overviewModal.classList.remove('active');
      });
      overviewGrid.appendChild(thumb);
    });
  }

  populateOverview();

  function toggleOverview() {
    overviewModal.classList.toggle('active');
  }

  // 4. Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // If overview is open, Escape closes it
    if (overviewModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        overviewModal.classList.remove('active');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
      case 'n':
      case 'N':
      case 'l':
      case 'L':
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'p':
      case 'P':
      case 'h':
      case 'H':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;

      case 'g':
      case 'G':
        e.preventDefault();
        toggleOverview();
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  });

  // 5. Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 6. Event Listeners
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnOverview.addEventListener('click', toggleOverview);
  btnCloseOverview.addEventListener('click', () => overviewModal.classList.remove('active'));
  btnFullscreen.addEventListener('click', toggleFullscreen);
  btnPrint.addEventListener('click', () => window.print());

  // 7. Initial Hash Check
  if (window.location.hash) {
    const match = window.location.hash.match(/#slide-(\d+)/);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10) - 1;
      if (parsed >= 0 && parsed < totalSlides) {
        goToSlide(parsed);
      }
    }
  }

  // 8. Interactive Demo on Slide 9 (WhatsApp Mockup)
  window.simulateApprove = function () {
    const btn = document.getElementById('wa-demo-btn');
    const responseBubble = document.getElementById('wa-response-bubble');
    if (!btn || !responseBubble) return;

    btn.textContent = '✓ Approved & Dispatched';
    btn.classList.add('approved');
    btn.disabled = true;

    setTimeout(() => {
      responseBubble.style.display = 'block';
      const container = document.getElementById('wa-chat-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 450);
  };

})();
