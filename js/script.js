// ============================
// Assignment 4 - Portfolio Functionality
// ============================

document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  themeManager();
  visitorManager();
  siteTimer();
  projectManager();
  projectVideoModal();
  githubRepoManager();
  handleContactForm();
  revealOnScroll();

  if (window.lucide) {
    lucide.createIcons();
  }
});

// 1) Greeting message by time of day
function setGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let message = "Welcome!";

  if (hour >= 5 && hour < 12) message = "Good morning";
  else if (hour >= 12 && hour < 17) message = "Good afternoon";
  else if (hour >= 17 && hour < 22) message = "Good evening";
  else message = "Hope you’re having a calm night 🌌";

  greetingEl.textContent = message;
}

// 2) Dark / Light theme with localStorage
function themeManager() {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");

  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("theme");
  body.classList.toggle("light-theme", savedTheme === "light");

  updateThemeUI();

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");

    const isLight = body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");

    updateThemeUI();
  });

  function updateThemeUI() {
    const isLight = body.classList.contains("light-theme");
    const themeStatusText = document.getElementById("themeStatusText");

    toggleBtn.innerHTML = isLight
      ? '<i data-lucide="sun"></i><span id="themeLabel">Light Mode</span>'
      : '<i data-lucide="moon"></i><span id="themeLabel">Dark Mode</span>';

    if (themeStatusText) {
      themeStatusText.textContent = isLight ? "Light" : "Dark";
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }
}

// 3) Visitor name state management
function visitorManager() {
  const visitorInput = document.getElementById("visitorName");
  const saveBtn = document.getElementById("saveVisitorBtn");
  const clearBtn = document.getElementById("clearVisitorBtn");
  const visitorMessage = document.getElementById("visitorMessage");

  if (!visitorInput || !saveBtn || !clearBtn || !visitorMessage) return;

  const savedVisitorName = localStorage.getItem("visitorName");

  if (savedVisitorName) {
    visitorInput.value = savedVisitorName;
    visitorMessage.textContent = `Welcome back, ${savedVisitorName}! Your name was remembered.`;
  }

  saveBtn.addEventListener("click", () => {
    const name = visitorInput.value.trim();

    if (name.length < 2) {
      visitorMessage.textContent =
        "Please enter a valid name with at least 2 characters.";
      return;
    }

    localStorage.setItem("visitorName", name);
    visitorMessage.textContent = `Nice to meet you, ${name}! Your name has been saved.`;
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("visitorName");
    visitorInput.value = "";
    visitorMessage.textContent = "Saved name cleared successfully.";
  });
}

// 4) Time on site counter
function siteTimer() {
  const timeCounter = document.getElementById("timeCounter");
  if (!timeCounter) return;

  let secondsOnSite = 0;

  setInterval(() => {
    secondsOnSite += 1;
    timeCounter.textContent = formatTime(secondsOnSite);
  }, 1000);

  function formatTime(totalSeconds) {
    if (totalSeconds < 60) return `${totalSeconds}s`;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 60) return `${minutes}m ${seconds}s`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m ${seconds}s`;
  }
}

// 5) Project filter + sort + level logic
function projectManager() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectsGrid = document.getElementById("projectsGrid");
  const sortSelect = document.getElementById("sortProjects");
  const levelSelect = document.getElementById("skillLevel");
  const filterStatus = document.getElementById("filterStatus");
  const emptyState = document.getElementById("emptyState");

  if (
    !filterButtons.length ||
    !projectsGrid ||
    !sortSelect ||
    !levelSelect ||
    !filterStatus ||
    !emptyState
  ) {
    return;
  }

  let currentFilter = localStorage.getItem("projectFilter") || "all";
  let currentSort = localStorage.getItem("projectSort") || "default";
  let currentLevel = localStorage.getItem("projectLevel") || "all";

  sortSelect.value = currentSort;
  levelSelect.value = currentLevel;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);

    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      localStorage.setItem("projectFilter", currentFilter);

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      applyProjectLogic();
    });
  });

  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    localStorage.setItem("projectSort", currentSort);
    applyProjectLogic();
  });

  levelSelect.addEventListener("change", () => {
    currentLevel = levelSelect.value;
    localStorage.setItem("projectLevel", currentLevel);
    applyProjectLogic();
  });

  applyProjectLogic();

  function applyProjectLogic() {
    const projectCards = Array.from(
      projectsGrid.querySelectorAll(".project-card"),
    );

    const sortedCards = [...projectCards];

    if (currentSort === "title-asc") {
      sortedCards.sort((a, b) =>
        a.dataset.title.localeCompare(b.dataset.title),
      );
    } else if (currentSort === "title-desc") {
      sortedCards.sort((a, b) =>
        b.dataset.title.localeCompare(a.dataset.title),
      );
    }

    sortedCards.forEach((card) => projectsGrid.appendChild(card));

    let visibleCount = 0;

    sortedCards.forEach((card) => {
      const matchesCategory =
        currentFilter === "all" || card.dataset.category === currentFilter;

      const matchesLevel =
        currentLevel === "all" || card.dataset.level === currentLevel;

      if (matchesCategory && matchesLevel) {
        card.classList.remove("hide-card");
        visibleCount += 1;
      } else {
        card.classList.add("hide-card");
      }
    });

    emptyState.classList.toggle("hidden", visibleCount !== 0);

    const categoryText =
      currentFilter === "all"
        ? "all categories"
        : `"${getCategoryLabel(currentFilter)}"`;

    const levelText =
      currentLevel === "all"
        ? "all difficulty levels"
        : `"${getLevelLabel(currentLevel)}"`;

    const sortText =
      currentSort === "default"
        ? "default order"
        : currentSort === "title-asc"
          ? "title A-Z"
          : "title Z-A";

    filterStatus.textContent = `Showing ${visibleCount} project(s) for ${categoryText}, ${levelText}, sorted by ${sortText}.`;
  }

  function getCategoryLabel(category) {
    if (category === "ui") return "UI";
    if (category === "web") return "Web App";
    if (category === "mobile") return "Mobile";
    return category;
  }

  function getLevelLabel(level) {
    if (level === "beginner") return "Beginner Friendly";
    if (level === "advanced") return "Advanced Focus";
    return level;
  }
}

// 6) Project video modal
function projectVideoModal() {
  const modal = document.getElementById("projectVideoModal");
  const modalTitle = document.getElementById("modalTitle");
  const video = document.getElementById("projectVideo");
  const closeBtn = document.getElementById("closeVideoModal");
  const overlay = document.querySelector("[data-close-modal]");
  const projectCards = document.querySelectorAll(".project-card");

  if (!modal || !modalTitle || !video || !closeBtn || !overlay) return;

  projectCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const clickedLink = event.target.closest("a");
      if (clickedLink) return;

      const videoPath = card.dataset.video;
      const title =
        card.dataset.modalTitle || card.dataset.title || "Project Demo";

      if (!videoPath) return;

      openModal(title, videoPath);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  function openModal(title, videoPath) {
    modalTitle.textContent = title;
    video.src = videoPath;
    video.load();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function closeModal() {
    video.pause();
    video.removeAttribute("src");
    video.load();

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// 7) GitHub API integration
function githubRepoManager() {
  const repoList = document.getElementById("repoList");
  const repoStatus = document.getElementById("repoStatus");
  const reloadReposBtn = document.getElementById("reloadReposBtn");

  if (!repoList || !repoStatus || !reloadReposBtn) return;

  const githubUsername = "mohammedDev11";

  const blockedRepos = ["alpha-queue", "alpha-queue_KFUPM"];

  async function loadRepositories() {
    repoStatus.textContent = "Loading repositories...";
    repoList.innerHTML = "";

    try {
      const response = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`,
      );

      if (!response.ok) {
        throw new Error("GitHub API request failed.");
      }

      const repositories = await response.json();

      if (!Array.isArray(repositories) || repositories.length === 0) {
        repoStatus.textContent = "No repositories were found.";
        return;
      }

      const safeRepositories = repositories
        .filter((repo) => !blockedRepos.includes(repo.name))
        .slice(0, 6);

      if (safeRepositories.length === 0) {
        repoStatus.textContent =
          "No public portfolio repositories are available to show.";
        return;
      }

      repoStatus.textContent =
        "Live data loaded successfully from selected public GitHub repositories.";

      safeRepositories.forEach((repo) => {
        const repoCard = document.createElement("article");
        repoCard.className = "repo-card";

        const description = repo.description
          ? repo.description
          : "No description provided for this repository.";

        const language = repo.language ? repo.language : "Not specified";

        repoCard.innerHTML = `
          <div class="repo-card-header">
            <h3 class="repo-name">
              <a href="${repo.html_url}" target="_blank" rel="noopener">
                ${repo.name}
              </a>
            </h3>
            <span class="repo-visibility">${repo.visibility}</span>
          </div>

          <p class="repo-desc">${description}</p>

          <div class="repo-meta">
            <span>
              <i data-lucide="code-2"></i>
              ${language}
            </span>
            <span>
              <i data-lucide="star"></i>
              ${repo.stargazers_count}
            </span>
            <span>
              <i data-lucide="git-fork"></i>
              ${repo.forks_count}
            </span>
          </div>
        `;

        repoList.appendChild(repoCard);
      });

      if (window.lucide) {
        lucide.createIcons();
      }
    } catch (error) {
      repoStatus.textContent =
        "Unable to load GitHub repositories right now. Please try again later.";
      repoList.innerHTML = "";
    }
  }

  reloadReposBtn.addEventListener("click", loadRepositories);
  loadRepositories();
}

// 8) Contact form validation
function handleContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !status || !submitBtn) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const agreeTermsInput = document.getElementById("agreeTerms");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const agreeTermsError = document.getElementById("agreeTermsError");

  function setError(input, errorElement, message) {
    if (input) input.classList.add("input-error");
    errorElement.textContent = message;
  }

  function clearError(input, errorElement) {
    if (input) input.classList.remove("input-error");
    errorElement.textContent = "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(messageInput, messageError);
    clearError(agreeTermsInput, agreeTermsError);

    status.className = "form-status";
    status.textContent = "";

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();
    const wordsInMessage = messageValue.split(/\s+/).filter(Boolean).length;

    if (nameValue === "") {
      setError(nameInput, nameError, "Please enter your name.");
      isValid = false;
    } else if (nameValue.length < 2) {
      setError(nameInput, nameError, "Name must be at least 2 characters.");
      isValid = false;
    }

    if (emailValue === "") {
      setError(emailInput, emailError, "Please enter your email.");
      isValid = false;
    } else if (!isValidEmail(emailValue)) {
      setError(emailInput, emailError, "Please enter a valid email address.");
      isValid = false;
    }

    if (messageValue === "") {
      setError(messageInput, messageError, "Please enter your message.");
      isValid = false;
    } else if (messageValue.length < 15) {
      setError(
        messageInput,
        messageError,
        "Message should be at least 15 characters.",
      );
      isValid = false;
    } else if (wordsInMessage < 3) {
      setError(
        messageInput,
        messageError,
        "Message should contain at least 3 words.",
      );
      isValid = false;
    }

    if (!agreeTermsInput.checked) {
      setError(
        agreeTermsInput,
        agreeTermsError,
        "Please confirm the checkbox before submitting.",
      );
      isValid = false;
    }

    if (!isValid) {
      status.classList.add("error");
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    submitBtn.disabled = true;
    status.className = "form-status success";
    status.textContent = "Sending message...";

    setTimeout(() => {
      status.className = "form-status success";
      status.textContent =
        "Message sent successfully! This is a demo form, so no backend is connected.";
      form.reset();
      submitBtn.disabled = false;
    }, 1000);
  });
}

// 9) Scroll reveal animation
function revealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => observer.observe(element));
}
