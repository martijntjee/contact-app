document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
      alert("Naam en telefoonnummer zijn verplicht!");
      return;
    }

    const contact = {
      name,
      phone,
      email: document.getElementById("email")?.value.trim() || "",
      birthdate: document.getElementById("birthdate")?.value || "",
      anniversary: document.getElementById("anniversary")?.value || "",
      company: document.getElementById("company")?.value.trim() || "",
      jobTitle: document.getElementById("jobTitle")?.value.trim() || "",
      address: {
        street: document.getElementById("street")?.value.trim() || "",
        city: document.getElementById("city")?.value.trim() || "",
        postalCode: document.getElementById("postalCode")?.value.trim() || "",
        country: document.getElementById("country")?.value.trim() || "",
      },
      socialMedia: collectSocialMedia(),
      pronouns: collectPronouns(),
      customFields: collectCustomFields(),
    };

    try {
      const response = await fetch("http://127.0.0.1:6789/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok)
        throw new Error("Serverfout bij het opslaan van contact");

      showToast("Contact succesvol opgeslagen!", "success");

      form.reset();
      document.getElementById("socialMediaFields").innerHTML = "";
      document.getElementById("pronounsFields").innerHTML = "";
      document.getElementById("customFields").innerHTML = "";
    } catch (error) {
      console.error("Fout tijdens opslaan:", error);
      showToast("Fout bij het opslaan van het contact", "error");
    }
  });

  function collectSocialMedia() {
    const fields = document.querySelectorAll("#socialMediaFields .form-group");
    return Array.from(fields)
      .map((field) => {
        const platform = field.querySelector(".socialType")?.value.trim();
        const username = field.querySelector(".social")?.value.trim();
        return platform && username ? { platform, username } : null;
      })
      .filter(Boolean);
  }

  function collectPronouns() {
    const fields = document.querySelectorAll("#pronounsFields .pronouns");
    return Array.from(fields)
      .map((field) => field.value.trim())
      .filter(Boolean);
  }

  function collectCustomFields() {
    const fields = document.querySelectorAll("#customFields .form-group");
    return Array.from(fields)
      .map((field) => {
        const key = field.querySelector(".custom-key")?.value.trim();
        const value = field.querySelector(".custom-value")?.value.trim();
        return key && value ? { key, value } : null;
      })
      .filter(Boolean);
  }

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});
