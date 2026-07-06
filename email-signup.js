(function () {
  const $ = (selector) => document.querySelector(selector);

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.setTimeout(() => node.classList.remove("show"), 2600);
  }

  function getJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Private browsing or strict settings can block storage.
    }
  }

  function pregnancyContext() {
    const text = $("#report")?.textContent || "";
    const week = text.match(/Week\s+(\d+)/i)?.[1] || "unknown";
    const dueDate = text.match(/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/)?.[0] || "unknown";
    return { week, dueDate };
  }

  function hydrateEmailConfig() {
    const config = getJson("pregnancyEmailConfig", {});
    if ($("#emailPublicKey") && config.publicKey) $("#emailPublicKey").value = config.publicKey;
    if ($("#emailServiceId") && config.serviceId) $("#emailServiceId").value = config.serviceId;
    if ($("#emailTemplateId") && config.templateId) $("#emailTemplateId").value = config.templateId;
  }

  function saveEmailConfig() {
    const config = {
      publicKey: $("#emailPublicKey")?.value.trim() || "",
      serviceId: $("#emailServiceId")?.value.trim() || "",
      templateId: $("#emailTemplateId")?.value.trim() || ""
    };
    setJson("pregnancyEmailConfig", config);
    const status = $("#weeklyStatus");
    if (status) {
      status.textContent = config.publicKey && config.serviceId && config.templateId
        ? "EmailJS is configured. New signups will attempt real email delivery."
        : "Email settings saved, but all three fields are required for real sending.";
    }
    toast("Email settings saved.");
  }

  async function submitWeeklySignup(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const email = $("#weeklyEmail");
    const status = $("#weeklyStatus");
    if (!email || !status) return;

    const value = email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      status.textContent = "Please enter a valid email address.";
      return;
    }

    const context = pregnancyContext();
    setJson("pregnancyWeeklySignup", {
      email: value,
      week: context.week,
      dueDate: context.dueDate,
      joinedAt: new Date().toISOString()
    });

    const config = getJson("pregnancyEmailConfig", {});
    if (config.publicKey && config.serviceId && config.templateId && window.emailjs) {
      status.textContent = "Sending confirmation email...";
      try {
        emailjs.init({ publicKey: config.publicKey });
        await emailjs.send(config.serviceId, config.templateId, {
          to_email: value,
          subject: "Your weekly pregnancy updates",
          message: `You are signed up for weekly pregnancy updates. Current week: ${context.week}. Estimated due date: ${context.dueDate}.`,
          pregnancy_week: context.week,
          due_date: context.dueDate
        });
        status.textContent = `Signup confirmed. A confirmation email was sent to ${value}.`;
        toast("Email sent.");
        return;
      } catch (error) {
        status.textContent = `EmailJS could not send: ${error.message}. Opening mail app fallback.`;
      }
    } else {
      status.textContent = "Email service is not configured yet. Opening mail app fallback.";
    }

    const subject = encodeURIComponent("Weekly pregnancy updates signup");
    const body = encodeURIComponent(
      `Please subscribe ${value} to weekly pregnancy updates.\n\n` +
      `Pregnancy week: ${context.week}\n` +
      `Due date: ${context.dueDate}\n\n` +
      `For automatic delivery, configure EmailJS or a backend email service.`
    );

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

    const mailtoUrl =
      `mailto:?subject=${subject}&body=${body}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = mailtoUrl;
    } else {
      window.open(gmailUrl, "_blank");
    }

  } // <-- submitWeeklySignup ends here

  hydrateEmailConfig();

  $("#saveEmailConfig")?.addEventListener("click", saveEmailConfig);

  $("#weeklyButton")?.addEventListener("click", submitWeeklySignup, true);

  $("#weeklyEmail")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitWeeklySignup(event);
    }
  }, true);

})();
