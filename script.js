// --- Year ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Mobile Nav Toggle ---
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelectorAll(".nav a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  });
});

// --- Certificate Modal Logic ---
const modal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-image');
const closeModalBtn = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

document.querySelectorAll('.cert-thumb').forEach(thumb => {
  thumb.addEventListener('click', function () {
    const src = this.querySelector('img').src;
    if (modal && modalImg) {
      modalImg.src = src;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeCertModal() {
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeCertModal);

// --- Contact Form — JSON Submission ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop any default page reload

    // Collect form field values
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormStatus('error', 'Please fill in all fields before submitting.');
      return;
    }

    // Build the JSON entry
    const entry = {
      id:        Date.now(),
      timestamp: new Date().toISOString(),
      name,
      email,
      message
    };

    // Read existing submissions from localStorage (acts as our JSON store)
    let submissions = [];
    try {
      const stored = localStorage.getItem('contact_submissions');
      if (stored) submissions = JSON.parse(stored);
    } catch (_) {
      submissions = [];
    }

    // Append new entry and save back
    submissions.push(entry);
    localStorage.setItem('contact_submissions', JSON.stringify(submissions, null, 2));

    // Also log to console so the JSON payload is visible during development
    console.log('📬 New contact submission (JSON):', entry);
    console.log('📂 All submissions:', submissions);

    // Reset form and show success message
    contactForm.reset();
    showFormStatus('success', 'Thank you! Your message has been saved. I will get back to you soon.');
  });
}

// Helper: display an inline status message below the form
function showFormStatus(type, message) {
  // Remove any existing status
  const existing = document.getElementById('form-status');
  if (existing) existing.remove();

  const statusEl = document.createElement('p');
  statusEl.id = 'form-status';
  statusEl.textContent = message;
  statusEl.style.cssText = `
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    background: ${type === 'success' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 69, 58, 0.15)'};
    color: ${type === 'success' ? '#34c759' : '#ff453a'};
    border: 1px solid ${type === 'success' ? 'rgba(52, 199, 89, 0.35)' : 'rgba(255, 69, 58, 0.35)'};
  `;
  contactForm.insertAdjacentElement('afterend', statusEl);

  // Auto-dismiss after 5 seconds
  setTimeout(() => statusEl.remove(), 5000);
}