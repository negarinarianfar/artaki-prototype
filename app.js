/* =========================================================
   ARTAKI — APPLICATION LOGIC

   data.js  = اطلاعات قابل‌تغییر
   views.js = HTML صفحه‌ها
   app.js   = عملکرد دکمه‌ها، ویدئو و مسیریابی

   برای تغییر نام، قد، وزن یا Timeline به data.js برو.
========================================================= */

const data = window.ARTAKI_DATA;
const views = window.ARTAKI_VIEWS;

const appElement = document.querySelector("#app");
const pageTitleElement = document.querySelector("#page-title");
const toastElement = document.querySelector("#toast");

/* =========================================================
   وضعیت موقت برنامه

   این اطلاعات فقط تا زمانی که صفحه مرورگر باز است نگه داشته
   می‌شوند؛ چون Prototype هنوز Database ندارد.
========================================================= */

const state = {
  selectedVideoUrl: null,
  selectedVideoName: "artaki-demo.mp4",
  pendingSeekTime: null,
  reviewQueueCount: data.summary.reviewQueueCount,
  patternStatus: "Coach Verification Required",
  correction: {
    ...data.correctionDraft,
    corrected: false,
  },
};

/* =========================================================
   ابزارهای عمومی
========================================================= */

function parseTime(value) {
  const parts = String(value).trim().split(":").map(Number);

  if (parts.some(Number.isNaN)) {
    return null;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0];
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  window.setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2300);
}

function openModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);

  if (!modal) {
    return;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);

  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

/* =========================================================
   مسیریابی بین پنج صفحه

   مثال:
   #upload   → صفحه Upload
   #analysis → صفحه Analysis
========================================================= */

const routes = {
  overview: {
    title: "Overview",
    render: () => views.overview(),
  },
  upload: {
    title: "Upload Video",
    render: () => views.upload(state),
  },
  processing: {
    title: "Processing",
    render: () => views.processing(),
  },
  analysis: {
    title: "Fight Analysis",
    render: () => views.analysis(state),
  },
  report: {
    title: "PDF Report",
    render: () => views.report(state),
  },
};

function getCurrentRoute() {
  const routeName = window.location.hash.slice(1) || "overview";
  return routes[routeName] ? routeName : "overview";
}

function goToPage(routeName) {
  window.location.hash = routeName;
}

function renderCurrentPage() {
  const routeName = getCurrentRoute();
  const route = routes[routeName];

  pageTitleElement.textContent = route.title;
  appElement.innerHTML = route.render();

  document.querySelectorAll("[data-route]").forEach((navigationLink) => {
    navigationLink.classList.toggle(
      "active",
      navigationLink.dataset.route === routeName,
    );
  });

  bindPageInteractions(routeName);
}

/* =========================================================
   آپلود ویدئوی محلی
========================================================= */

function selectLocalVideo(videoFile) {
  const fileInformation = document.querySelector("#file-data");

  if (!videoFile || !videoFile.type.startsWith("video/")) {
    showToast("Please choose an MP4 or QuickTime video");
    return;
  }

  if (state.selectedVideoUrl) {
    URL.revokeObjectURL(state.selectedVideoUrl);
  }

  state.selectedVideoUrl = URL.createObjectURL(videoFile);
  state.selectedVideoName = videoFile.name;

  if (fileInformation) {
    fileInformation.querySelector("strong").textContent =
      state.selectedVideoName;
    fileInformation.querySelector("span").textContent =
      "Local video selected · ready for preview";
    fileInformation.classList.add("show");
  }
}

function bindUploadPage() {
  const fileInput = document.querySelector("#file");
  const dropZone = document.querySelector("#drop");
  const chooseButton = document.querySelector("#choose");
  const uploadForm = document.querySelector("#upload-form");

  chooseButton.addEventListener("click", (event) => {
    event.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    selectLocalVideo(fileInput.files[0]);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("drag");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("drag");

      if (event.dataTransfer?.files[0]) {
        selectLocalVideo(event.dataTransfer.files[0]);
      }
    });
  });

  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToPage("processing");
  });
}

/* =========================================================
   Video Player و Timestampها
========================================================= */

function seekVideo(time, autoplay = true) {
  const targetTime = Number(time);
  const video = document.querySelector("#fight-video");

  if (!video) {
    state.pendingSeekTime = targetTime;
    goToPage("analysis");
    return;
  }

  const duration = Number.isFinite(video.duration)
    ? video.duration
    : data.session.videoDuration;

  video.currentTime = Math.min(targetTime, duration);

  if (autoplay) {
    video.play().catch(() => {});
  }

  video.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getEvidenceEvents() {
  return data.events.map((event) => {
    const isCorrectedEvent =
      event.id === "b-unknown-1" && state.correction.corrected;

    return {
      time: isCorrectedEvent ? state.correction.startSeconds : event.time,
      text: isCorrectedEvent
        ? `Fighter ${state.correction.fighter}: ${state.correction.technique}`
        : `Fighter ${event.fighter}: ${event.technique}`,
    };
  });
}

function bindVideoPlayer() {
  const video = document.querySelector("#fight-video");
  const playButton = document.querySelector("#play");
  const seekInput = document.querySelector("#video-seek");
  const timeReadout = document.querySelector("#time-readout");
  const frameLabel = document.querySelector("#frame-label");

  function updateVideoInterface() {
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : data.session.videoDuration;

    seekInput.max = duration;
    seekInput.value = video.currentTime;
    timeReadout.textContent = `${views.formatTime(video.currentTime)} / ${views.formatTime(duration)}`;

    const matchingEvent = getEvidenceEvents().find(
      (event) => Math.abs(video.currentTime - event.time) < 0.85,
    );

    frameLabel.textContent = matchingEvent
      ? `${views.formatTime(matchingEvent.time, true)} · ${matchingEvent.text}`
      : "Click a timestamp to open its evidence";
  }

  video.addEventListener("loadedmetadata", () => {
    updateVideoInterface();

    if (state.pendingSeekTime !== null) {
      const targetTime = state.pendingSeekTime;
      state.pendingSeekTime = null;
      seekVideo(targetTime);
    }
  });

  video.addEventListener("timeupdate", updateVideoInterface);

  video.addEventListener("play", () => {
    playButton.textContent = "❚❚";
    playButton.setAttribute("aria-label", "Pause video");
  });

  video.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play video");
  });

  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  seekInput.addEventListener("input", () => {
    video.currentTime = Number(seekInput.value);
  });

  if (state.pendingSeekTime !== null && video.readyState >= 1) {
    const targetTime = state.pendingSeekTime;
    state.pendingSeekTime = null;
    seekVideo(targetTime);
  }
}

/* =========================================================
   Ask the Fight
========================================================= */

function showQuestionAnswer(questionButton) {
  const question = data.questions.find(
    (item) => item.id === questionButton.dataset.question,
  );

  if (!question) {
    return;
  }

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.classList.remove("active");
  });

  questionButton.classList.add("active");

  document.querySelector("#ask-result").innerHTML = `
    <div>
      <span class="eyebrow">SIMULATED ANSWER</span>
      <h4>${question.title}</h4>
      <strong>${question.statistic}</strong>
      <p>${question.answer}</p>
    </div>
    <aside>
      <b>${question.confidence}%</b>
      <span>AI confidence</span>
      <button class="text-button" data-open="pattern-modal">View evidence →</button>
    </aside>
  `;

  document
    .querySelector("#ask-result [data-open]")
    .addEventListener("click", () => openModal("pattern-modal"));
}

/* =========================================================
   Coach Review
========================================================= */

function decreaseReviewQueue() {
  state.reviewQueueCount = Math.max(0, state.reviewQueueCount - 1);

  const queueCount = document.querySelector("#queue-count");
  if (queueCount) {
    queueCount.textContent = state.reviewQueueCount;
  }
}

function verifyReviewItem(reviewItem) {
  reviewItem.innerHTML = `
    <span class="verified">✓ Coach Verified</span>
    <strong>
      <button class="timestamp-link" data-time="6.35">00:06.4</button>
      · Jab → Step back
    </strong>
    <small>Evidence retained in Reaction DNA</small>
  `;

  reviewItem.querySelector("[data-time]").addEventListener("click", (event) => {
    seekVideo(event.currentTarget.dataset.time);
  });

  decreaseReviewQueue();
  showToast("Event confirmed by coach");
}

function openCorrectionModal() {
  const form = document.querySelector("#edit-form");

  form.elements.fighter.value = state.correction.fighter;
  form.elements.technique.value = state.correction.corrected
    ? state.correction.technique
    : "Low Kick";
  form.elements.ringPosition.value = state.correction.ringPosition;
  form.elements.startTime.value = state.correction.startTime;
  form.elements.endTime.value = state.correction.endTime;

  document.querySelector("#original-event-time").textContent =
    `Other / Unclassified Technique · Fighter ${state.correction.fighter} · ` +
    views.formatTime(state.correction.startSeconds, true);

  openModal("edit-modal");
}

function saveCoachCorrection(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const startSeconds = parseTime(form.elements.startTime.value);
  const endSeconds = parseTime(form.elements.endTime.value);

  if (
    startSeconds === null ||
    endSeconds === null ||
    endSeconds <= startSeconds
  ) {
    showToast("End time must be after start time");
    return;
  }

  state.correction = {
    ...state.correction,
    corrected: true,
    fighter: form.elements.fighter.value,
    technique: form.elements.technique.value,
    ringPosition: form.elements.ringPosition.value,
    startTime: form.elements.startTime.value.trim(),
    endTime: form.elements.endTime.value.trim(),
    startSeconds,
    endSeconds,
  };

  decreaseReviewQueue();
  closeModal("edit-modal");
  showToast("Correction saved as Coach Verified");

  if (getCurrentRoute() === "analysis") {
    renderCurrentPage();
  }
}

function rejectUnclassifiedEvent(reviewItem) {
  reviewItem.innerHTML = `
    <span class="rejected">× Rejected by coach</span>
    <strong>
      ${views.formatTime(state.correction.startSeconds, true)} ·
      Event removed from analysis
    </strong>
  `;

  decreaseReviewQueue();
  showToast("Unclassified event rejected");
}

/* =========================================================
   اتصال دکمه‌های صفحه انتخاب‌شده
========================================================= */

function bindCommonPageButtons() {
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => goToPage(button.dataset.go));
  });

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.open));
  });

  document.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => seekVideo(button.dataset.time));
  });

  document.querySelectorAll("[data-go-time]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pendingSeekTime = Number(button.dataset.goTime);
      goToPage("analysis");
    });
  });
}

function bindAnalysisPage() {
  bindVideoPlayer();

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => showQuestionAnswer(button));
  });

  const editButton = document.querySelector(".edit");
  if (editButton) {
    editButton.addEventListener("click", openCorrectionModal);
  }

  const confirmButton = document.querySelector(".confirm-event");
  if (confirmButton) {
    confirmButton.addEventListener("click", (event) => {
      verifyReviewItem(event.target.closest(".review-item"));
    });
  }

  const rejectButton = document.querySelector(".reject-event");
  if (rejectButton) {
    rejectButton.addEventListener("click", (event) => {
      rejectUnclassifiedEvent(event.target.closest(".review-item"));
    });
  }
}

function bindPageInteractions(routeName) {
  bindCommonPageButtons();

  if (routeName === "upload") {
    bindUploadPage();
  }

  if (routeName === "analysis") {
    bindAnalysisPage();
  }

  if (routeName === "report") {
    document
      .querySelector("#print")
      .addEventListener("click", () => window.print());
  }
}

/* =========================================================
   Modalها و دکمه‌های ثابت برنامه
========================================================= */

function initializeModals() {
  document.querySelector("#modal-root").innerHTML = views.modals();

  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", () => closeModal(element.dataset.close));
  });

  document
    .querySelector("#edit-form")
    .addEventListener("submit", saveCoachCorrection);

  document.querySelectorAll("[data-pattern-action]").forEach((button) => {
    button.addEventListener("click", () => {
      state.patternStatus = button.dataset.patternAction;
      closeModal("pattern-modal");
      showToast(`Pattern ${state.patternStatus.toLowerCase()}`);

      if (getCurrentRoute() === "analysis") {
        renderCurrentPage();
      }
    });
  });

  document.querySelectorAll("[data-replay-time]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal("pattern-modal");
      seekVideo(button.dataset.replayTime);
      showToast(
        `Evidence opened at ${button.querySelector("span").textContent}`,
      );
    });
  });

  document.querySelector("#save-drill").addEventListener("click", () => {
    closeModal("drill-modal");
    showToast("Training drill saved by coach");
  });
}

function initializeStaticInterface() {
  document.querySelector("#sidebar-techniques").textContent =
    data.session.recognizedTechniques.join(" · ");

  document.querySelector("#workspace-label").textContent =
    `ARTAKI / ${data.session.ruleset.toUpperCase()} WORKSPACE`;

  document.querySelector("#ruleset-label").textContent =
    `${data.session.sport} · ${data.session.ruleset}`;

  document.querySelector(".menu").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches("nav a")) {
      document.querySelector(".sidebar").classList.remove("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal-wrap.open").forEach((modal) => {
        closeModal(modal.id);
      });
    }
  });
}

/* =========================================================
   شروع برنامه
========================================================= */

initializeStaticInterface();
initializeModals();

window.addEventListener("hashchange", renderCurrentPage);
renderCurrentPage();
