/* =========================================================
   ARTAKI — EDITABLE DEMO DATA

   این فایل محل اصلی تغییر اطلاعات Prototype است.
   برای تغییر نام مبارزان، قد، وزن، زمان Eventها و متن
   Reaction DNA فقط همین فایل را ویرایش کن.

   نکته: این اطلاعات شبیه‌سازی‌شده‌اند و خروجی AI واقعی نیستند.
========================================================= */

window.ARTAKI_DATA = {
  /* ---------- اطلاعات کلی جلسه ---------- */
  session: {
    sport: "Kickboxing",
    ruleset: "WAKO K1 Style",
    videoType: "Sparring",
    round: 1,
    sessionDate: "28 Aug 2026",
    videoDuration: 28,
    demoVideoPath: "assets/artaki-demo.mp4",
    recognizedTechniques: ["Jab", "Cross", "Roundhouse Kick"],
  },

  /* ---------- اطلاعات Fighter A ---------- */
  fighterA: {
    id: "A",
    name: "Lena Hoffmann",
    heightCm: 178,
    heightErrorCm: 5,
    weightKg: 63.5,
    reachCm: 181,
    reachErrorCm: 6,
    stance: "Orthodox",
    dataSource: "Official / Manually Entered",
  },

  /* ---------- اطلاعات Fighter B ---------- */
  fighterB: {
    id: "B",
    name: "Maya Costa",
    heightCm: 170,
    heightErrorCm: 5,
    weightKg: 62.8,
    reachCm: 173,
    reachErrorCm: 6,
    stance: "Southpaw",
    dataSource: "Official / Manually Entered",
  },

  /* ---------- آمار خلاصه راند ---------- */
  summary: {
    fighterATotal: 18,
    fighterBTotal: 14,
    reactionPatternCount: 3,
    coachVerifiedPatternCount: 1,
    reviewQueueCount: 4,
    unclassifiedCount: 2,
    techniqueCounts: [
      { technique: "Jab", fighterA: 6, fighterB: 6 },
      { technique: "Cross", fighterA: 5, fighterB: 4 },
      { technique: "Roundhouse Kick", fighterA: 7, fighterB: 4 },
    ],
  },

  /* ---------- Eventهای Timeline ----------
     time برحسب ثانیه است؛ مثلاً 6.35 یعنی ثانیه 6.35 ویدئو.
  ------------------------------------------------------ */
  events: [
    {
      id: "a-jab-1",
      fighter: "A",
      technique: "Jab",
      time: 2.35,
      confidence: 91,
    },
    {
      id: "a-jab-2",
      fighter: "A",
      technique: "Jab",
      time: 6.35,
      confidence: 92,
    },
    {
      id: "a-jab-3",
      fighter: "A",
      technique: "Jab",
      time: 10.35,
      confidence: 84,
    },
    {
      id: "a-jab-4",
      fighter: "A",
      technique: "Jab",
      time: 14.35,
      confidence: 79,
    },
    {
      id: "a-kick-1",
      fighter: "A",
      technique: "Roundhouse Kick",
      time: 15.9,
      confidence: 83,
    },
    {
      id: "b-cross-1",
      fighter: "B",
      technique: "Cross",
      time: 18.55,
      confidence: 86,
    },
    {
      id: "b-unknown-1",
      fighter: "B",
      technique: "Other / Unclassified",
      time: 22.2,
      confidence: 64,
    },
  ],

  /* ---------- ویژگی اصلی: Reaction DNA ---------- */
  reactionPattern: {
    initialContext: "Center ring · Long range",
    attack: "Lead jab",
    attacker: "Fighter A",
    response: "Step back",
    responder: "Fighter B",
    followUp: "Low kick",
    outcome: "1 landed · 2 attempts",
    matchingSequences: 4,
    confidence: 82,
    reactionDelaySeconds: 0.42,
    evidenceEventIds: ["a-jab-1", "a-jab-2", "a-jab-3", "a-jab-4"],
    insight:
      "Fighter B stepped straight back after 4 of Fighter A's 6 lead jabs. In 3 sequences the lead leg remained exposed; Fighter A followed with a low kick twice and landed once.",
  },

  /* ---------- سؤال‌ها و جواب‌های Ask the Fight ---------- */
  questions: [
    {
      id: "jab",
      question: "How does Fighter B respond after a jab?",
      title: "4 matching sequences found",
      statistic: "3 Step Backs · 1 High Guard",
      answer:
        "Fighter B stepped straight back in 3 of 4 matched sequences. This response appeared most often while the pair remained at long range.",
      confidence: 78,
    },
    {
      id: "ropes",
      question: "Does Fighter B react differently near the ropes?",
      title: "3 matching sequences found",
      statistic: "2 Lateral exits · 1 High Guard",
      answer:
        "Near the ropes, Fighter B used a lateral exit twice instead of the straight retreat seen at center ring.",
      confidence: 74,
    },
    {
      id: "follow",
      question: "Which follow-up produced the best outcome?",
      title: "3 follow-ups compared",
      statistic: "Low kick · Best observed outcome",
      answer:
        "The low kick produced one landed outcome from two follow-up attempts. The sample is too small for a firm conclusion.",
      confidence: 71,
    },
    {
      id: "speed",
      question: "Did response speed change later in the round?",
      title: "Round halves compared",
      statistic: "Response time +0.16 sec",
      answer:
        "Simulated response time was slightly slower in the second half. Coach review is required before interpreting fatigue.",
      confidence: 68,
    },
  ],

  /* ---------- تمرین پیشنهادی مربی ---------- */
  trainingDrill: {
    steps: [
      "Jab to trigger the response",
      "Opponent steps straight back",
      "Maintain effective kicking distance",
      "Follow with a low kick",
      "Exit at an angle and return to guard",
    ],
    coachInstruction:
      "Start at controlled speed. Increase tempo only after distance is consistent.",
  },

  /* ---------- Event اولیه برای Coach Correction ---------- */
  correctionDraft: {
    fighter: "B",
    technique: "Other / Unclassified",
    startTime: "00:22.20",
    endTime: "00:23.80",
    startSeconds: 22.2,
    endSeconds: 23.8,
    ringPosition: "Near ropes",
    confidence: 64,
  },

  /* ---------- مراحل نمایشی Processing ---------- */
  processingSteps: [
    { label: "Video uploaded", status: "done" },
    { label: "Video standardization", status: "done" },
    { label: "Fighter detection and tracking", status: "done" },
    { label: "Pose and physical profile estimation", status: "done" },
    { label: "Technique recognition", status: "done" },
    { label: "Opponent response detection", status: "active" },
    { label: "Reaction pattern generation", status: "waiting" },
    { label: "Report preparation", status: "waiting" },
  ],
};
