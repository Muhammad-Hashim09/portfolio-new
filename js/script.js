const WHATSAPP_NUMBER = "923471349935";

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const hidePreloader = () => preloader?.classList.add("hidden");
  window.addEventListener("load", () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 1800);

  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  const updateScrollUI = () => {
    const y = window.scrollY;
    navbar?.classList.toggle("scrolled", y > 60);
    backToTop?.classList.toggle("visible", y > 500);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${height > 0 ? (y / height) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = () => {
    hamburger?.classList.remove("active");
    navLinks?.classList.remove("active");
    document.body.classList.remove("menu-open");
    hamburger?.setAttribute("aria-expanded", "false");
  };
  hamburger?.addEventListener("click", () => {
    const open = hamburger.classList.toggle("active");
    navLinks?.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", closeMenu));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navItems = [...document.querySelectorAll(".nav-link")];
  const updateActiveNav = () => {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    navItems.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal-up").forEach(element => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("visible");
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      projectCards.forEach(card => {
        const categories = card.dataset.category || "";
        card.classList.toggle("hide", filter !== "all" && !categories.split(" ").includes(filter));
      });
    });
  });

  document.querySelectorAll("[data-project]").forEach(link => {
    link.addEventListener("click", () => {
      const select = document.getElementById("projectType");
      if (select) select.value = link.dataset.project;
    });
  });

  const form = document.getElementById("projectForm");
  const status = document.getElementById("formStatus");

  const setFieldError = (field, message) => {
    const group = field.closest(".form-field");
    group?.classList.add("invalid");
    const error = group?.querySelector(".error-msg");
    if (error) error.textContent = message;
  };

  const clearFieldError = field => {
    const group = field.closest(".form-field");
    group?.classList.remove("invalid");
    const error = group?.querySelector(".error-msg");
    if (error) error.textContent = "";
  };

  form?.addEventListener("submit", event => {
    event.preventDefault();
    const fields = [...form.querySelectorAll("input, textarea, select")];
    fields.forEach(clearFieldError);
    let valid = true;

    const value = id => document.getElementById(id).value.trim();
    const name = value("clientName");
    const email = value("email");
    const whatsapp = value("whatsapp");
    const projectType = value("projectType");
    const description = value("description");

    if (name.length < 2) { setFieldError(document.getElementById("clientName"), "Please enter your name."); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError(document.getElementById("email"), "Please enter a valid email address."); valid = false; }
    if (whatsapp.replace(/\D/g, "").length < 7) { setFieldError(document.getElementById("whatsapp"), "Please enter a valid WhatsApp number."); valid = false; }
    if (!projectType) { setFieldError(document.getElementById("projectType"), "Please select a project type."); valid = false; }
    if (description.length < 15) { setFieldError(document.getElementById("description"), "Please describe the project in at least 15 characters."); valid = false; }

    if (!valid) {
      status.textContent = "Please review the highlighted fields.";
      status.className = "form-status error";
      form.querySelector(".invalid input, .invalid textarea, .invalid select")?.focus();
      return;
    }

    const budget = value("budget") || "Not specified";
    const timeline = value("timeline") || "Not specified";
    const message = [
      "*New Software Project Inquiry*",
      "",
      `*Client:* ${name}`,
      `*Email:* ${email}`,
      `*WhatsApp:* ${whatsapp}`,
      `*Project Type:* ${projectType}`,
      "",
      `*Project Description:* ${description}`,
      `*Estimated Budget:* ${budget}`,
      `*Expected Timeline:* ${timeline}`
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, "_blank");
    if (!opened) window.location.href = url;
    status.textContent = "Your inquiry is ready. WhatsApp should open so you can send it directly.";
    status.className = "form-status success";
  });
});
