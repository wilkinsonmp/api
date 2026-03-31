/**
 * NASA Space Explorer - Main Script
 * Integrated with NASAWDS Accessibility & Modal Logic
 */

// ELEMENTS
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.querySelector('button');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('imageModal');
const factText = document.getElementById("fact-text");

//  DATA
const extremeFacts = [
  "Saturn is the only planet in our solar system that is less dense than water. It could float in a bathtub!",
  "The gravity on Mars is only one-third that on Earth. You'd be able to dunk a basketball easily.",
  "Venus is 900°F (480°C)—hotter than a self-cleaning oven.",
  "Neptune's winds are the fastest in the solar system, reaching 1,600 miles per hour.",
  "Jupiter's moon Io is so volcanic its surface looks like a pepperoni pizza.",
  "More than 1,300 Earths could fit inside the vast sphere of Jupiter.",
  "A year on Mercury is only 88 Earth days long."
];

//   TRACKING
let lastFactIndex = -1; 

function updateSpaceFact() {
  if (!factText) return;

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * extremeFacts.length);
  } while (randomIndex === lastFactIndex);

  lastFactIndex = randomIndex;

  factText.style.transition = "opacity 0.3s ease";
  factText.style.opacity = 0;

  setTimeout(() => {
    factText.textContent = extremeFacts[randomIndex];
    factText.style.opacity = 1;
  }, 300);
}

//  DATE 
if (typeof setupDateInputs === 'function') {
  setupDateInputs(startInput, endInput);
}

fetchButton.addEventListener('click', async () => {

  updateSpaceFact(); 

  const start = startInput.value;
  const end = endInput.value;

  gallery.innerHTML = `
    <div class="placeholder">
      <div class="loader"></div>
      <p>Consulting the star charts...</p>
    </div>
  `;

  try {
    const apiKey = 'jdecVWFxMMsPSifDINxhZAhgMh9ZWSKNZTeFaUDY'; 
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Cosmic Interference (Error ${response.status})`);
    }

    const data = await response.json();
    renderGallery(data);

  } catch (error) {
    gallery.innerHTML = `
      <div class="placeholder">
        <span class="placeholder-icon">⚠️</span>
        <h2 style="color: #e74c3c;">Houston, we have a problem.</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
});

document.addEventListener("DOMContentLoaded", updateSpaceFact);

// 4. GALLERY RENDERING FUNCTION
function renderGallery(data) {
  gallery.innerHTML = '';
  const items = Array.isArray(data) ? data : [data];

  items.forEach(item => {
    if (item.media_type === 'image') {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.setAttribute('role', 'button'); 
      card.setAttribute('aria-label', `View details for ${item.title}`);
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}" loading="lazy">
        <div class="card-content">
          <p><strong>${item.title}</strong></p>
          <p style="color: #666; font-size: 0.9rem;">${item.date}</p>
        </div>
      `;

      card.addEventListener('click', () => openModal(item));
      gallery.appendChild(card);
    }
  });
}

// MODAL 
function openModal(item) {
  document.getElementById('modalImg').src = item.url;
  document.getElementById('modalTitle').innerText = item.title;
  document.getElementById('modalDate').innerText = item.date;
  document.getElementById('modalDescription').innerText = item.explanation;
  modal.style.display = "block";
}

document.querySelector('.close').onclick = () => { modal.style.display = "none"; };
window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } };


const exitBtn = document.getElementById('close-modal-btn');

if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });
}