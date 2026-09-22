const API = "/api";

// ── Mobile navigation ─────────────────────────────────
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

// ── Continuous typewriter role ─────────────────────────
const typedRole = document.getElementById("typed-role");
const roles = [
  "Full-Stack Engineer",
  "Backend Engineer",
  "Software Engineer",
  "Systems Engineer",
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  if (!typedRole) return;

  const role = roles[roleIndex];

  if (!deleting) {
    charIndex += 1;
    typedRole.textContent = role.substring(0, charIndex);

    if (charIndex >= role.length) {
      deleting = true;
      setTimeout(typeRole, 650);
      return;
    }

    setTimeout(typeRole, 65);
    return;
  }

  charIndex -= 1;
  typedRole.textContent = role.substring(0, charIndex);

  if (charIndex <= 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 180);
    return;
  }

  setTimeout(typeRole, 35);
}

typeRole();

// ── Scroll reveal ──────────────────────────────────────
const revealItems = document.querySelectorAll(".reveal, .reveal-section");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// ── Cursor-following project glow ──────────────────────
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  });
});

// ── Contact form ───────────────────────────────────────
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submit = document.getElementById("form-submit");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  submit.disabled = true;
  submit.textContent = "Sending…";
  status.textContent = "";
  status.className = "form-status";

  try {
    const res = await fetch(`${API}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (res.ok) {
      status.textContent = "Message sent — I'll get back to you soon.";
      status.className = "form-status success";
      form.reset();
    } else {
      status.textContent = json.error || "Something went wrong.";
      status.className = "form-status error";
    }
  } catch (_) {
    status.textContent = "Could not reach the server. Try emailing directly.";
    status.className = "form-status error";
  } finally {
    submit.disabled = false;
    submit.textContent = "Send message ↗";
  }
});
