/* =========================================================
   ARTAKI — PAGE TEMPLATES

   این فایل فقط HTML صفحه‌ها را می‌سازد.
   اطلاعات از data.js خوانده می‌شوند.
   عملکرد دکمه‌ها در app.js قرار دارد.
========================================================= */

window.ARTAKI_VIEWS = (() => {
  const data = window.ARTAKI_DATA;

  /* =======================================================
     ابزارهای کوچک نمایشی
  ======================================================= */

  function formatTime(seconds, precise = false) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    const secondText = precise
      ? remainingSeconds.toFixed(1).padStart(4, "0")
      : String(Math.floor(remainingSeconds)).padStart(2, "0");

    return `${String(minutes).padStart(2, "0")}:${secondText}`;
  }

  function simulatedBadge() {
    return '<span class="simulation">◆ Simulated AI Data</span>';
  }

  function verificationBadge() {
    return '<span class="verify-badge">Coach Verification Required</span>';
  }

  function pageHeader(title, description, action = "") {
    return `
      <div class="page-head">
        <div>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        ${action}
      </div>
    `;
  }

  function fighterDot(fighterId) {
    return `<i class="fighter-dot ${fighterId.toLowerCase()}"></i>`;
  }

  function skeleton(fighterId) {
    const cssClass = fighterId.toLowerCase();

    return `
      <svg
        class="skeleton ${cssClass}"
        viewBox="0 0 100 190"
        role="img"
        aria-label="Simulated pose outline"
      >
        <circle cx="50" cy="22" r="12" />
        <path d="M50 35 L50 88 M50 48 L25 77 M50 48 L78 72 M50 88 L28 137 M50 88 L71 139 M28 137 L20 177 M71 139 L81 178" />
        <circle cx="25" cy="77" r="4" />
        <circle cx="78" cy="72" r="4" />
        <circle cx="28" cy="137" r="4" />
        <circle cx="71" cy="139" r="4" />
      </svg>
    `;
  }

  function profileRow(label, value, source, status = "") {
    return `
      <div class="profile-row">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${source}</small>
        ${status ? `<i>${status}</i>` : ""}
      </div>
    `;
  }

  function eventCssClass(technique) {
    const classes = {
      Jab: "jab",
      Cross: "cross",
      "Roundhouse Kick": "kick",
      "Low Kick": "kick",
    };

    return classes[technique] || "unknown";
  }

  function getEvent(eventId) {
    return data.events.find((event) => event.id === eventId);
  }

  /* =======================================================
     صفحه ۱: Overview
  ======================================================= */

  function overview() {
    const { session, fighterA, fighterB, summary } = data;

    return `
      <section class="page overview-page">
        ${pageHeader(
          "Coach intelligence workspace",
          "One fight. Verified evidence. Repeatable tactical patterns.",
          '<button class="btn primary" data-go="upload">+ New analysis</button>',
        )}

        <div class="scope-banner">
          <div>
            <span class="eyebrow">CURRENT MVP SCOPE</span>
            <h3>${session.sport} · ${session.ruleset}</h3>
          </div>
          <p>
            Automated recognition currently covers
            <strong>${session.recognizedTechniques.join(", ")}.</strong>
            Other events enter coach review.
          </p>
          ${simulatedBadge()}
        </div>

        <div class="overview-grid">
          <article class="card metric">
            <span>Detected events</span>
            <strong>${summary.fighterATotal + summary.fighterBTotal}</strong>
            <small>Across one simulated round</small>
          </article>

          <article class="card metric">
            <span>Reaction patterns</span>
            <strong>${String(summary.reactionPatternCount).padStart(2, "0")}</strong>
            <small class="verified">${summary.coachVerifiedPatternCount} coach verified</small>
          </article>

          <article class="card metric">
            <span>Review queue</span>
            <strong>${String(summary.reviewQueueCount).padStart(2, "0")}</strong>
            <small>${summary.unclassifiedCount} unclassified techniques</small>
          </article>

          <article class="card card-pad feature-card">
            <div class="feature-number">01</div>
            <span class="eyebrow">SIGNATURE FEATURE</span>
            <h3>Artaki Reaction DNA</h3>
            <p>
              Connects the first context, attack, opponent response, follow-up and
              outcome—then links the insight to synchronized video evidence.
            </p>
            <div class="dna-flow compact">
              <span>Context</span><b>→</b>
              <span>Attack</span><b>→</b>
              <span>Response</span><b>→</b>
              <span>Follow-up</span><b>→</b>
              <span>Outcome</span>
            </div>
            <button class="btn dark" data-go="analysis">Explore analysis →</button>
          </article>

          <article class="card card-pad latest-card">
            <div class="stat-head">
              <div>
                <span class="eyebrow">LATEST ANALYSIS</span>
                <h3>${session.videoType} · Round ${session.round}</h3>
              </div>
              <span class="tag amber">Coach review</span>
            </div>

            <div class="fight-pair">
              <div>
                ${fighterDot("A")}
                <strong>${fighterA.name}</strong>
                <small>${fighterA.stance}</small>
              </div>
              <b>VS</b>
              <div>
                ${fighterDot("B")}
                <strong>${fighterB.name}</strong>
                <small>${fighterB.stance}</small>
              </div>
            </div>

            <div class="status-line">
              <span></span>
              <strong>AI draft ready</strong>
              <small>${summary.reviewQueueCount} events need verification</small>
            </div>

            <button class="btn secondary" data-go="analysis">Open coach review</button>
          </article>
        </div>
      </section>
    `;
  }

  /* =======================================================
     صفحه ۲: Upload Video
  ======================================================= */

  function fighterInputCard(fighter, cssClass) {
    const alternativeStance =
      fighter.stance === "Orthodox" ? "Southpaw" : "Orthodox";

    return `
      <div class="fighter-form ${cssClass}-form">
        <strong>
          ${fighterDot(fighter.id)}
          Fighter ${fighter.id} · ${fighter.name}
        </strong>

        <div class="form-grid four">
          <label>
            Height
            <input value="${fighter.heightCm} cm">
          </label>
          <label>
            Weight
            <input value="${fighter.weightKg} kg">
          </label>
          <label>
            Reach
            <input value="${fighter.reachCm} cm">
          </label>
          <label>
            Stance
            <select>
              <option>${fighter.stance}</option>
              <option>${alternativeStance}</option>
              <option>Switch</option>
            </select>
          </label>
        </div>

        <label>
          Data source
          <select>
            <option>${fighter.dataSource}</option>
            <option>Athlete Profile</option>
            <option>Unknown</option>
          </select>
        </label>
      </div>
    `;
  }

  function upload(state) {
    const { session, fighterA, fighterB } = data;
    const videoDescription = state.selectedVideoUrl
      ? "Local video selected"
      : `Included demo · MP4 · 00:${session.videoDuration}`;

    return `
      <section class="page">
        ${pageHeader(
          "Upload fight video",
          `Create a coach-reviewed ${session.ruleset} analysis session.`,
          simulatedBadge(),
        )}

        <div class="notice">
          <strong>${session.ruleset} rules apply.</strong>
          MVP automated recognition currently covers selected techniques.
          Unclassified events require coach review.
        </div>

        <div class="grid-2 upload-layout">
          <div class="stack">
            <div class="card card-pad">
              <div class="upload-zone" id="drop">
                <input
                  id="file"
                  type="file"
                  accept="video/mp4,video/quicktime"
                  hidden
                >

                <div>
                  <div class="upload-icon">⇧</div>
                  <h3>Drop your fight video here</h3>
                  <p>or use the included ${session.videoDuration}-second Artaki demo</p>
                  <button class="btn secondary" id="choose">Choose video</button>

                  <div class="file-data show" id="file-data">
                    <strong>${state.selectedVideoName}</strong>
                    <span>${videoDescription}</span>
                  </div>
                </div>
              </div>

              <div class="status-strip">
                <span>●</span>
                Prototype upload simulation · No video leaves your device
              </div>
            </div>

            <div class="card card-pad data-policy">
              <span class="eyebrow">MEASUREMENT POLICY</span>
              <h3>Weight is never estimated from appearance.</h3>
              <p>
                Weight must come from official weigh-in data, an athlete profile or
                coach input. Height and reach estimates remain experimental and
                require confirmation.
              </p>
            </div>
          </div>

          <form class="card card-pad session-form" id="upload-form">
            <div class="form-section">
              <span class="step-label">01</span>
              <div>
                <h3>Session setup</h3>
                <p>Competition context is fixed for this concept.</p>
              </div>
            </div>

            <div class="form-grid">
              <label>Sport <input value="${session.sport}" readonly></label>
              <label>Competition rules <input value="${session.ruleset}" readonly></label>
              <label>
                Video type
                <select>
                  <option>${session.videoType}</option>
                  <option>Fight</option>
                  <option>Padwork</option>
                </select>
              </label>
              <label>
                Round
                <select>
                  <option>Round ${session.round}</option>
                  <option>Round 2</option>
                  <option>Round 3</option>
                </select>
              </label>
            </div>

            <div class="form-section">
              <span class="step-label">02</span>
              <div>
                <h3>Fighter profiles</h3>
                <p>Optional values improve physical context.</p>
              </div>
            </div>

            ${fighterInputCard(fighterA, "a")}
            ${fighterInputCard(fighterB, "b")}

            <label class="consent">
              <input type="checkbox" required checked>
              <span>
                I confirm permission to process this video and understand that this
                prototype uses simulated outputs.
              </span>
            </label>

            <button class="btn primary full">Start simulated analysis →</button>
          </form>
        </div>
      </section>
    `;
  }

  /* =======================================================
     صفحه ۳: Processing
  ======================================================= */

  function processing() {
    const processingSteps = data.processingSteps
      .map((step, index) => {
        const displayStatus =
          step.status === "done"
            ? "Complete"
            : step.status === "active"
              ? "In progress"
              : "Waiting";

        const stepIcon = step.status === "done" ? "✓" : index + 1;

        return `
          <div class="step ${step.status}">
            <span class="step-dot">${stepIcon}</span>
            <strong>${step.label}</strong>
            <small>${displayStatus}</small>
          </div>
        `;
      })
      .join("");

    return `
      <section class="page processing-page">
        ${pageHeader(
          "Processing fight video",
          "Artaki is connecting two-fighter actions across time.",
          simulatedBadge(),
        )}

        <div class="card processing-card">
          <div class="processing-hero">
            <div class="process-visual"></div>
            <div>
              <span class="eyebrow">CURRENT STAGE</span>
              <h2>Detecting opponent responses</h2>
              <p>Matching attacks with movement, guard changes and follow-up actions.</p>
            </div>
            <strong>68%</strong>
          </div>

          <div class="progress"><span></span></div>

          <div class="time-row">
            <span>00:32 elapsed</span>
            <strong>Approx. 1 min 24 sec remaining</strong>
          </div>

          <div class="steps">${processingSteps}</div>

          <div class="processing-footer">
            <div>
              <strong>Prototype simulation</strong>
              <span>No real AI model is running in this version.</span>
            </div>
            <button class="btn primary" data-go="analysis">View completed demo →</button>
          </div>
        </div>
      </section>
    `;
  }

  /* =======================================================
     اجزای صفحه Analysis
  ======================================================= */

  function physicalProfiles() {
    const { fighterA, fighterB } = data;
    const heightDifference = fighterA.heightCm - fighterB.heightCm;
    const reachDifference = fighterA.reachCm - fighterB.reachCm;

    function fighterProfile(fighter, cssClass) {
      return `
        <div class="fighter-profile ${cssClass}-profile">
          <div class="body-view">${skeleton(fighter.id)}</div>
          <div>
            <span class="fighter-label ${cssClass}">Fighter ${fighter.id}</span>
            <h4>${fighter.name}</h4>
            ${profileRow(
              "Height",
              `${fighter.heightCm} cm ± ${fighter.heightErrorCm} cm`,
              "AI Estimated",
              "Confirm",
            )}
            ${profileRow("Weight", `${fighter.weightKg} kg`, "Official / Manual", "Verified")}
            ${profileRow(
              "Reach",
              `${fighter.reachCm} cm ± ${fighter.reachErrorCm} cm`,
              "AI Estimated",
              "Confirm",
            )}
            ${profileRow("Stance", fighter.stance, "Coach Verified")}
          </div>
        </div>
      `;
    }

    return `
      <article class="card card-pad profile-card">
        <div class="section-title">
          <div>
            <span class="eyebrow">PRE-FIGHT PHYSICAL PROFILE</span>
            <h3>Physical context</h3>
          </div>
          <span class="tag">Concept Prototype</span>
        </div>

        <div class="profile-disclaimer">
          Simulated body measurements · Not a medical or precise 3D scan
        </div>

        <div class="profile-comparison">
          ${fighterProfile(fighterA, "a")}

          <div class="difference-card">
            <span>HEIGHT</span>
            <strong>+${heightDifference} cm</strong>
            <small>Fighter A</small>
            <hr>
            <span>REACH</span>
            <strong>+${reachDifference} cm</strong>
            <small>Fighter A</small>
            <hr>
            <span>CONFIDENCE</span>
            <strong>72%</strong>
            <small>Experimental estimate</small>
          </div>

          ${fighterProfile(fighterB, "b")}
        </div>

        <p class="context-insight">
          <strong>Experimental physical-context insight:</strong>
          Fighter A has an estimated ${heightDifference} cm height and
          ${reachDifference} cm reach advantage. Despite this, Fighter B entered
          punching range in 5 of 9 attempts. Coach verification required.
        </p>
      </article>
    `;
  }

  function reactionDNA(state) {
    const pattern = data.reactionPattern;
    const statusClass =
      state.patternStatus === "Coach Verified"
        ? "verify-badge verified-status"
        : state.patternStatus === "Rejected"
          ? "verify-badge rejected-status"
          : "verify-badge";

    const statusText =
      state.patternStatus === "Coach Verified"
        ? "✓ Coach Verified"
        : state.patternStatus === "Rejected"
          ? "Rejected by coach"
          : "Coach Verification Required";

    const timestamps = pattern.evidenceEventIds
      .map((eventId) => getEvent(eventId))
      .filter(Boolean)
      .map(
        (event) => `
          <button class="timestamp-link" data-time="${event.time}">
            ${formatTime(event.time, true)}
          </button>
        `,
      )
      .join(" · ");

    return `
      <article class="card card-pad dna-card">
        <div class="section-title">
          <div>
            <span class="eyebrow teal">ARTAKI SIGNATURE ANALYSIS</span>
            <h3>Reaction DNA</h3>
          </div>
          <span id="pattern-status" class="${statusClass}">${statusText}</span>
        </div>

        <div class="dna-flow">
          <div>
            <small>INITIAL CONTEXT</small>
            <strong>${pattern.initialContext.split(" · ")[0]}</strong>
            <span>${pattern.initialContext.split(" · ")[1] || ""}</span>
          </div>
          <b>→</b>
          <div>
            <small>ATTACK</small>
            <strong>${pattern.attack}</strong>
            <span>${pattern.attacker}</span>
          </div>
          <b>→</b>
          <div class="active">
            <small>OPPONENT RESPONSE</small>
            <strong>${pattern.response}</strong>
            <span>${pattern.responder}</span>
          </div>
          <b>→</b>
          <div>
            <small>FOLLOW-UP</small>
            <strong>${pattern.followUp}</strong>
            <span>${pattern.attacker}</span>
          </div>
          <b>→</b>
          <div>
            <small>OUTCOME</small>
            <strong>${pattern.outcome.split(" · ")[0]}</strong>
            <span>${pattern.outcome.split(" · ")[1] || ""}</span>
          </div>
        </div>

        <p class="pattern-copy">
          <strong>Repeated retreat response detected.</strong>
          ${pattern.insight}
        </p>

        <div class="evidence-meta">
          <span>${pattern.matchingSequences} matching sequences</span>
          <span>AI Confidence ${pattern.confidence}%</span>
          <span class="timestamp-group">${timestamps}</span>
        </div>

        <div class="dna-actions">
          <button class="btn secondary" data-open="pattern-modal">▶ View Pattern Replay</button>
          <button class="btn primary" data-open="drill-modal">＋ Create Training Drill</button>
        </div>
      </article>
    `;
  }

  function askFight() {
    const questionButtons = data.questions
      .map(
        (item) => `
          <button data-question="${item.id}">${item.question}</button>
        `,
      )
      .join("");

    return `
      <article class="card card-pad ask-card">
        <div class="section-title">
          <div>
            <span class="eyebrow">EVIDENCE-BASED QUESTION</span>
            <h3>Ask the Fight</h3>
          </div>
          <span class="tag">Structured Beta</span>
        </div>

        <p>
          Select a tactical question. Every answer remains linked to timestamps and
          coach review.
        </p>

        <div class="question-list">${questionButtons}</div>

        <div id="ask-result" class="ask-result">
          <div>
            <span class="eyebrow">SELECT A QUESTION</span>
            <h4>Choose one of the structured prompts above.</h4>
            <p>Artaki will return a simulated answer with supporting evidence.</p>
          </div>
        </div>
      </article>
    `;
  }

  function timeline(state) {
    const { session } = data;

    function marker(event) {
      const isCorrectableEvent = event.id === "b-unknown-1";
      const technique =
        isCorrectableEvent && state.correction.corrected
          ? state.correction.technique
          : event.technique;
      const time =
        isCorrectableEvent && state.correction.corrected
          ? state.correction.startSeconds
          : event.time;
      const leftPosition = Math.min(96, (time / session.videoDuration) * 100);
      const markerId = isCorrectableEvent ? 'id="corrected-marker"' : "";

      return `
        <button
          ${markerId}
          class="event ${eventCssClass(technique)}"
          data-time="${time}"
          style="left: ${leftPosition}%"
          aria-label="${formatTime(time, true)} Fighter ${event.fighter} ${technique}"
        ></button>
      `;
    }

    const fighterAEvents = data.events
      .filter((event) => event.fighter === "A")
      .map(marker)
      .join("");

    const fighterBEvents = data.events
      .filter((event) => event.fighter === "B")
      .map(marker)
      .join("");

    return `
      <div class="timelines">
        <div class="timeline-head">
          <span>Detected events · click a marker to seek</span>
          <span>
            <i class="event jab"></i> Jab
            <i class="event cross"></i> Cross
            <i class="event kick"></i> Roundhouse
            <i class="event unknown"></i> Unclassified
          </span>
        </div>

        <div class="timeline-row">
          <span class="a-text">Fighter A</span>
          <div class="track">${fighterAEvents}</div>
        </div>

        <div class="timeline-row">
          <span class="b-text">Fighter B</span>
          <div class="track">${fighterBEvents}</div>
        </div>
      </div>
    `;
  }

  function roundSummary() {
    const summary = data.summary;
    const rows = summary.techniqueCounts
      .map(
        (item) => `
          <span>${item.technique}</span>
          <span>${item.fighterA}</span>
          <span>${item.fighterB}</span>
        `,
      )
      .join("");

    return `
      <article class="card card-pad round-card">
        <div class="section-title">
          <div>
            <span class="eyebrow">ROUND SUMMARY</span>
            <h3>Selected techniques</h3>
          </div>
          <span class="tag">AI draft</span>
        </div>

        <div class="score-row">
          <div><span>Fighter A</span><strong>${summary.fighterATotal}</strong></div>
          <b>${summary.fighterATotal + summary.fighterBTotal} total</b>
          <div><span>Fighter B</span><strong>${summary.fighterBTotal}</strong></div>
        </div>

        <div class="moves">
          <strong>Technique</strong>
          <strong class="a-text">A</strong>
          <strong class="b-text">B</strong>
          ${rows}
        </div>

        <small class="scope-note">
          Counts exclude unclassified events until coach review.
        </small>
      </article>
    `;
  }

  function reviewQueue(state) {
    const correction = state.correction;

    const correctableEvent = correction.corrected
      ? `
        <div class="review-item" id="unclassified-event">
          <span class="verified">✓ Coach Verified</span>
          <strong>
            <button class="timestamp-link" data-time="${correction.startSeconds}">
              ${formatTime(correction.startSeconds, true)}
            </button>
            · ${correction.technique} · Fighter ${correction.fighter}
          </strong>
          <small>
            Corrected from Other / Unclassified · ${correction.ringPosition} ·
            ${correction.startTime}–${correction.endTime}
          </small>
        </div>
      `
      : `
        <div class="review-item alert" id="unclassified-event">
          <div class="review-top">
            <div>
              <small>
                <button class="timestamp-link" data-time="${correction.startSeconds}">
                  ${formatTime(correction.startSeconds, true)}
                </button>
              </small>
              <strong>Other / Unclassified</strong>
              <span>Fighter ${correction.fighter} · ${correction.ringPosition}</span>
            </div>
            <b>${correction.confidence}%</b>
          </div>
          <div class="review-actions">
            <button class="btn secondary edit">✎ Label event</button>
            <button class="btn ghost reject-event">Reject</button>
          </div>
        </div>
      `;

    return `
      <article class="card card-pad review-card">
        <div class="section-title">
          <div>
            <span class="eyebrow">HUMAN-IN-THE-LOOP</span>
            <h3>Coach Review Queue</h3>
          </div>
          <span id="queue-count" class="count-badge">${state.reviewQueueCount}</span>
        </div>

        <div id="reviews" class="review-list">
          ${correctableEvent}

          <div class="review-item">
            <div class="review-top">
              <div>
                <small><button class="timestamp-link" data-time="6.35">00:06.4</button></small>
                <strong>Jab → Step back</strong>
                <span>Pattern evidence</span>
              </div>
              <b>92%</b>
            </div>
            <button class="text-button confirm-event">✓ Confirm event</button>
          </div>

          <div class="review-item">
            <div class="review-top">
              <div>
                <small><button class="timestamp-link" data-time="18.55">00:18.6</button></small>
                <strong>Cross → High guard</strong>
                <span>Fighter B</span>
              </div>
              <b>86%</b>
            </div>
          </div>

          <div class="review-item">
            <div class="review-top">
              <div>
                <small><button class="timestamp-link" data-time="14.35">00:14.4</button></small>
                <strong>Jab → Step back</strong>
                <span>Pattern evidence</span>
              </div>
              <b>79%</b>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  /* =======================================================
     صفحه ۴: Fight Analysis
  ======================================================= */

  function analysis(state) {
    const { session, fighterA, fighterB } = data;

    return `
      <section class="page analysis-page">
        ${pageHeader(
          "Fight analysis",
          `${session.ruleset} ${session.videoType} · Round ${session.round} · ${fighterA.name} vs. ${fighterB.name}`,
          '<button class="btn primary" data-go="report">↓ Open PDF report</button>',
        )}

        <div class="analysis-notice">
          <span>Concept Prototype</span>
          <p>
            Counts, body estimates and tactical patterns below are simulated to
            validate the coach workflow.
          </p>
          <strong>Coach-centered · Evidence linked</strong>
        </div>

        <div class="analysis-grid">
          <div class="stack">
            <article class="card video-card">
              <div class="video-toolbar">
                <span>
                  <strong>Round ${session.round}</strong> ·
                  00:${session.videoDuration} demo
                </span>
                <div>${simulatedBadge()} ${verificationBadge()}</div>
              </div>

              <div class="video-stage">
                <video
                  id="fight-video"
                  src="${state.selectedVideoUrl || session.demoVideoPath}"
                  preload="metadata"
                  playsinline
                  aria-label="Artaki simulated kickboxing analysis video"
                ></video>
                <div class="frame-data video-overlay">
                  <span id="frame-label">Click a timestamp to open its evidence</span>
                  <span>Simulated AI evidence</span>
                </div>
              </div>

              <div class="video-controls">
                <button class="play" id="play" aria-label="Play video">▶</button>
                <input
                  id="video-seek"
                  class="seek-input"
                  type="range"
                  min="0"
                  max="${session.videoDuration}"
                  step="0.01"
                  value="0"
                  aria-label="Video position"
                >
                <strong id="time-readout">00:00 / 00:${session.videoDuration}</strong>
              </div>

              ${timeline(state)}
            </article>

            ${physicalProfiles()}
            ${reactionDNA(state)}
            ${askFight()}
          </div>

          <aside class="stack analysis-sidebar">
            ${roundSummary()}
            ${reviewQueue(state)}

            <article class="card card-pad guardrail">
              <span class="eyebrow">PRODUCT GUARDRAIL</span>
              <h3>Coach decision, not AI verdict.</h3>
              <p>
                Artaki supports video review. It does not provide official judging,
                medical diagnosis or guaranteed injury prevention.
              </p>
            </article>
          </aside>
        </div>
      </section>
    `;
  }

  /* =======================================================
     صفحه ۵: PDF Report Preview
  ======================================================= */

  function report(state) {
    const { session, fighterA, fighterB, summary, reactionPattern } = data;
    const heightDifference = fighterA.heightCm - fighterB.heightCm;

    const evidenceClips = reactionPattern.evidenceEventIds
      .map((eventId) => getEvent(eventId))
      .filter(Boolean)
      .map(
        (event) => `
          <button class="clip" data-go-time="${event.time}">
            <span>${formatTime(event.time, true)}</span>
            <small>${reactionPattern.attack} → ${reactionPattern.response}</small>
            <b>${event.confidence}% · Open evidence</b>
          </button>
        `,
      )
      .join("");

    const drillSteps = data.trainingDrill.steps
      .map((step) => `<li>${step}</li>`)
      .join("");

    const correctionTitle = state.correction.corrected
      ? "Coach-corrected event"
      : "Unclassified events";

    const correctionDescription = state.correction.corrected
      ? `${state.correction.technique} · ${state.correction.startTime}–${state.correction.endTime}`
      : "Possible low kick near ropes.";

    return `
      <section class="page report-page">
        ${pageHeader(
          "PDF report preview",
          "A shareable coach-verified evidence report.",
          simulatedBadge(),
        )}

        <div class="report-wrap">
          <div class="report-actions">
            <button class="btn secondary" data-go="analysis">← Back to analysis</button>
            <button class="btn primary" id="print">↓ Download / Print PDF</button>
          </div>

          <article class="report-paper">
            <div class="report-brand">
              <div><h2>ARTAKI</h2><span>COACH INTELLIGENCE</span></div>
              <strong>${session.ruleset.replace(" Style", "")}</strong>
            </div>

            <div class="report-title">
              <span class="eyebrow">FIGHT ANALYSIS · ROUND ${session.round}</span>
              <h1>Reaction Intelligence Report</h1>
              <p>${session.sessionDate} · ${fighterA.name} vs. ${fighterB.name}</p>
            </div>

            <div class="report-alert">
              <strong>AI-assisted analysis – verified by coach</strong>
              <span>Concept Prototype · Simulated data</span>
            </div>

            <div class="report-section">
              <h3>01 · Fighter physical profile</h3>
              <div class="report-profile">
                <div>
                  <span class="fighter-label a">Fighter A</span>
                  <h4>${fighterA.name}</h4>
                  <p>
                    ${fighterA.heightCm} cm ± ${fighterA.heightErrorCm} ·
                    Reach ${fighterA.reachCm} cm ± ${fighterA.reachErrorCm}<br>
                    ${fighterA.weightKg} kg · ${fighterA.stance}
                  </p>
                  <small>Weight: official/manual · Height/reach: AI estimated</small>
                </div>

                <div class="report-difference">
                  <span>Estimated advantage</span>
                  <strong>+${heightDifference} cm</strong>
                  <small>Height · Fighter A</small>
                </div>

                <div>
                  <span class="fighter-label b">Fighter B</span>
                  <h4>${fighterB.name}</h4>
                  <p>
                    ${fighterB.heightCm} cm ± ${fighterB.heightErrorCm} ·
                    Reach ${fighterB.reachCm} cm ± ${fighterB.reachErrorCm}<br>
                    ${fighterB.weightKg} kg · ${fighterB.stance}
                  </p>
                  <small>Weight: official/manual · Height/reach: AI estimated</small>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h3>02 · Round summary</h3>
              <div class="report-grid">
                <div class="report-box"><small>Fighter A events</small><strong>${summary.fighterATotal}</strong></div>
                <div class="report-box"><small>Fighter B events</small><strong>${summary.fighterBTotal}</strong></div>
                <div class="report-box"><small>Matching sequences</small><strong>${String(reactionPattern.matchingSequences).padStart(2, "0")}</strong></div>
                <div class="report-box"><small>Needs review</small><strong>${String(state.reviewQueueCount).padStart(2, "0")}</strong></div>
              </div>
            </div>

            <div class="report-section">
              <h3>03 · Reaction DNA summary</h3>
              <div class="report-pattern">
                <div class="dna-flow compact">
                  <span>${reactionPattern.initialContext}</span><b>→</b>
                  <span>${reactionPattern.attack}</span><b>→</b>
                  <span>${reactionPattern.response}</span><b>→</b>
                  <span>${reactionPattern.followUp}</span><b>→</b>
                  <span>${reactionPattern.outcome}</span>
                </div>
                <p>${reactionPattern.insight}</p>
                <div>
                  <span class="verify-badge">Coach Verification Required</span>
                  <strong>AI Confidence ${reactionPattern.confidence}%</strong>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h3>04 · Pattern evidence clips</h3>
              <div class="evidence-list">${evidenceClips}</div>
            </div>

            <div class="report-section split-report">
              <div>
                <h3>05 · Coach-created training drill</h3>
                <ol>${drillSteps}</ol>
              </div>

              <div>
                <h3>06 · ${correctionTitle}</h3>
                <p>
                  <strong>
                    ${formatTime(state.correction.startSeconds, true)} ·
                    Fighter ${state.correction.fighter}
                  </strong><br>
                  ${correctionDescription}
                </p>
                <span class="verify-badge ${state.correction.corrected ? "verified-status" : ""}">
                  ${state.correction.corrected ? "✓ Coach Verified" : "Review required"}
                </span>
              </div>
            </div>

            <p class="disclaimer">
              <strong>Important:</strong> This concept report uses simulated AI outputs.
              Artaki is designed as a coach-support tool and does not replace official
              judging, medical assessment or qualified professional coaching.
              Experimental measurements and tactical interpretations require verification
              in the original video context.
            </p>
          </article>
        </div>
      </section>
    `;
  }

  /* =======================================================
     Modalها
  ======================================================= */

  function modals() {
    const { correctionDraft, reactionPattern, trainingDrill } = data;

    const replayClips = reactionPattern.evidenceEventIds
      .map((eventId, index) => getEvent(eventId))
      .filter(Boolean)
      .map(
        (event, index) => `
          <button
            class="replay-clip ${index === 1 ? "active" : ""}"
            data-replay-time="${event.time}"
          >
            <span>${formatTime(event.time, true)}</span>
            <div class="mini-ring">
              <i class="dot-a"></i>
              <i class="dot-b"></i>
              <b>→</b>
            </div>
            <small>${reactionPattern.attack} → ${reactionPattern.response}</small>
            <strong>${event.confidence}% · Play evidence</strong>
          </button>
        `,
      )
      .join("");

    const drillSteps = trainingDrill.steps
      .map((step) => `<li contenteditable="true">${step}</li>`)
      .join("");

    return `
      <div id="edit-modal" class="modal-wrap" aria-hidden="true">
        <div class="modal-backdrop" data-close="edit-modal"></div>
        <section class="modal drawer" role="dialog" aria-modal="true" aria-labelledby="edit-title">
          <div class="modal-head">
            <div>
              <span class="eyebrow">COACH CORRECTION</span>
              <h2 id="edit-title">Edit AI result</h2>
            </div>
            <button class="close" data-close="edit-modal" aria-label="Close">×</button>
          </div>

          <div class="ai-original">
            <span>Original classification</span>
            <strong>${correctionDraft.confidence}%</strong>
            <small id="original-event-time">
              Other / Unclassified Technique · Fighter ${correctionDraft.fighter} ·
              ${formatTime(correctionDraft.startSeconds, true)}
            </small>
          </div>

          <form id="edit-form">
            <div class="form-grid">
              <label>
                Fighter
                <select name="fighter">
                  <option value="B">Fighter B</option>
                  <option value="A">Fighter A</option>
                </select>
              </label>
              <label>
                Technique
                <select name="technique">
                  <option>Low Kick</option>
                  <option>Hook</option>
                  <option>Knee</option>
                  <option>Front Kick</option>
                  <option>Other / Unclassified</option>
                </select>
              </label>
              <label>
                Ring position
                <select name="ringPosition">
                  <option>Near ropes</option>
                  <option>Center</option>
                  <option>Corner</option>
                </select>
              </label>
              <label>
                Distance
                <select>
                  <option>Kick range</option>
                  <option>Punching range</option>
                  <option>Clinch range</option>
                </select>
              </label>
              <label>
                Initial context
                <select>
                  <option>After blocking jab</option>
                  <option>Neutral exchange</option>
                  <option>Forward entry</option>
                </select>
              </label>
              <label>
                Follow-up technique
                <select>
                  <option>None</option>
                  <option>Jab</option>
                  <option>Cross</option>
                  <option>Roundhouse Kick</option>
                </select>
              </label>
              <label>
                Outcome
                <select>
                  <option>Landed</option>
                  <option>Blocked</option>
                  <option>Missed</option>
                  <option>Uncertain</option>
                </select>
              </label>
              <label>
                Start time
                <input name="startTime" value="${correctionDraft.startTime}" inputmode="decimal">
              </label>
              <label>
                End time
                <input name="endTime" value="${correctionDraft.endTime}" inputmode="decimal">
              </label>
              <label>
                Pattern association
                <select>
                  <option>Retreat after lead jab</option>
                  <option>No pattern</option>
                  <option>Create new pattern</option>
                </select>
              </label>
            </div>

            <p class="timestamp-help">
              Timestamp format: MM:SS.ss · Start and end define the evidence clip
              shown in the report.
            </p>

            <label>
              Coach pattern note
              <textarea>Possible low kick after Fighter A entered with a jab. Confirm from alternate angle if available.</textarea>
            </label>

            <div class="modal-actions">
              <button type="button" class="btn secondary" data-close="edit-modal">Cancel</button>
              <button class="btn primary">Save as Coach Verified</button>
            </div>
          </form>
        </section>
      </div>

      <div id="pattern-modal" class="modal-wrap" aria-hidden="true">
        <div class="modal-backdrop" data-close="pattern-modal"></div>
        <section class="modal replay-modal" role="dialog" aria-modal="true" aria-labelledby="replay-title">
          <div class="modal-head">
            <div>
              <span class="eyebrow">SYNCHRONIZED VIDEO EVIDENCE</span>
              <h2 id="replay-title">Pattern Replay</h2>
            </div>
            <button class="close" data-close="pattern-modal" aria-label="Close">×</button>
          </div>

          <p class="modal-intro">
            Four matching sequences aligned to the first frame of Fighter A's jab.
          </p>

          <div class="replay-grid">${replayClips}</div>

          <div class="sync-bar">
            <span></span><i></i>
            <strong>
              Opponent reaction aligned at +${reactionPattern.reactionDelaySeconds} sec
            </strong>
          </div>

          <div class="modal-actions split-actions">
            <button class="btn danger" data-pattern-action="Rejected">Reject pattern</button>
            <button class="btn secondary" data-close="pattern-modal">Edit pattern</button>
            <button class="btn primary" data-pattern-action="Coach Verified">✓ Confirm pattern</button>
          </div>
        </section>
      </div>

      <div id="drill-modal" class="modal-wrap" aria-hidden="true">
        <div class="modal-backdrop" data-close="drill-modal"></div>
        <section class="modal drill-modal" role="dialog" aria-modal="true" aria-labelledby="drill-title">
          <div class="modal-head">
            <div>
              <span class="eyebrow">PATTERN-TO-DRILL</span>
              <h2 id="drill-title">Create Training Drill</h2>
            </div>
            <button class="close" data-close="drill-modal" aria-label="Close">×</button>
          </div>

          <div class="draft-callout">
            <strong>AI-generated draft</strong>
            <span>Coach review and editing required before use.</span>
          </div>

          <ol class="drill-steps">${drillSteps}</ol>

          <label>
            Coach instruction
            <textarea>${trainingDrill.coachInstruction}</textarea>
          </label>

          <div class="modal-actions">
            <button class="btn secondary" data-close="drill-modal">Cancel</button>
            <button class="btn primary" id="save-drill">Save Coach Drill</button>
          </div>
        </section>
      </div>
    `;
  }

  return {
    formatTime,
    eventCssClass,
    overview,
    upload,
    processing,
    analysis,
    report,
    modals,
  };
})();
