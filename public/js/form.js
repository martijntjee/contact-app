document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const contactList = document.getElementById("contactList");

  renderContacts();

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();

      if (!name || !phone) {
        alert("Naam en telefoonnummer zijn verplicht!");
        return;
      }
      const contact = {
        id: Date.now().toString(), // Unieke ID gebaseerd op de huidige tijd
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: {
          street: document.getElementById("street").value.trim(),
          city: document.getElementById("city").value.trim(),
          postalCode: document.getElementById("postalCode").value.trim(),
          country: document.getElementById("country").value.trim(),
        },
      };

      const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
      contacts.push(contact);
      localStorage.setItem("contacts", JSON.stringify(contacts));

      alert("Contact succesvol opgeslagen!");
      window.location.href = "view-contacts.html";
    });

  saveContact(contact);
  form.reset();
  document.getElementById("socialMediaFields").innerHTML = "";
  document.getElementById("pronounsFields").innerHTML = "";
  document.getElementById("customFields").innerHTML = "";
  renderContacts();
  showToast("Contact succesvol opgeslagen!", "success");
});

function collectSocialMedia() {
  const fields = document.querySelectorAll("#socialMediaFields .form-group");
  return Array.from(fields)
    .map((field) => {
      const platform = field.querySelector(".socialType").value.trim();
      const username = field.querySelector(".social").value.trim();
      return platform && username ? { platform, username } : null;
    })
    .filter(Boolean);
}

function collectPronouns() {
  const fields = document.querySelectorAll(
    "#pronounsFields .form-group .pronouns"
  );
  return Array.from(fields)
    .map((field) => field.value.trim())
    .filter(Boolean);
}

function collectCustomFields() {
  const fields = document.querySelectorAll("#customFields .form-group");
  return Array.from(fields)
    .map((field) => {
      const key = field.querySelector(".custom-key").value.trim();
      const value = field.querySelector(".custom-value").value.trim();
      return key && value ? { key, value } : null;
    })
    .filter(Boolean);
}

function saveContact(contact) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts() {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contactList.innerHTML = "";
  contacts.forEach((contact, index) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
        <h3>${contact.id}</h3>
        <p><strong>📞</strong> ${contact.phone}</p>
        ${contact.socialMedia
        .map(
          (sm) => `<p><strong>🌐</strong> ${sm.platform}: ${sm.username}</p>`
        )
        .join("")}
        ${contact.birthdate
        ? `<p><strong>🎂</strong> ${contact.birthdate}</p>`
        : ""
      }
        ${contact.anniversary
        ? `<p><strong>🎉</strong> ${contact.anniversary}</p>`
        : ""
      }
        ${contact.pronouns.length
        ? `<p><strong>👤</strong> ${contact.pronouns.join(", ")}</p>`
        : ""
      }
        ${contact.company ? `<p><strong>🏢</strong> ${contact.company}</p>` : ""
      }
        ${contact.jobTitle
        ? `<p><strong>💼</strong> ${contact.jobTitle}</p>`
        : ""
      }
        ${contact.address.street || contact.address.city
        ? `<p><strong>🏠</strong> ${contact.address.street}, 
        ${contact.address.city}, ${contact.address.postalCode}, ${contact.address.country}</p>`
        : ""
      }
        ${contact.customFields.length ? "<h4>Aangepaste velden:</h4>" : ""}
        ${contact.customFields
        .map((f) => `<p><strong>${f.key}</strong>: ${f.value}</p>`)
        .join("")}
        <button class="btn btn-danger" onclick="deleteContact(${index})">Verwijderen</button>
      `;
    contactList.appendChild(card);
  });
}

window.deleteContact = function (index) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
  showToast("Contact verwijderd!", "error");
};

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function addSocialMediaField() {
  const container = document.getElementById("socialMediaFields");
  const field = document.createElement("div");
  field.className = "form-group";
  field.innerHTML = `
    <label>Social Media</label>
    <select class="socialType">
      <option value="">Kies platform...</option>
      <option value="Instagram">Instagram</option>
      <option value="Twitter">Twitter</option>
      <option value="LinkedIn">LinkedIn</option>
    </select>
    <input type="text" class="social" placeholder="Gebruikersnaam">
    <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
  `;
  container.appendChild(field);
}

function addPronounsField() {
  const container = document.getElementById("pronounsFields");
  const field = document.createElement("div");
  field.className = "form-group";
  field.innerHTML = `
    <label>Voornaamwoorden</label>
    <select class="pronouns">
      <option value="">-</option>
      <option value="hij/hem">hij/hem</option>
      <option value="zij/haar">zij/haar</option>
      <option value="die/hen">die/hen</option>
    </select>
    <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
  `;
  container.appendChild(field);
}

function addCustomField() {
  const container = document.getElementById("customFields");
  const field = document.createElement("div");
  field.className = "form-group custom-field";
  field.innerHTML = `
    <input type="text" class="custom-key" placeholder="Veldnaam">
    <input type="text" class="custom-value" placeholder="Waarde">
    <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
  `;
  container.appendChild(field);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  // Formulier submit-event
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Verplichte velden validatie
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
      alert("Naam en telefoonnummer zijn verplicht!");
      return;
    }

    // Verzamel contactgegevens
    const contact = {
      id: Date.now(),
      name,
      phone,
      email: document.getElementById("email")?.value.trim() || "",
      socialMedia: collectSocialMedia(),
      birthdate: document.getElementById("birthdate")?.value || "",
      anniversary: document.getElementById("anniversary")?.value || "",
      pronouns: collectPronouns(),
      company: document.getElementById("company")?.value.trim() || "",
      jobTitle: document.getElementById("jobTitle")?.value.trim() || "",
      address: {
        street: document.getElementById("street")?.value.trim() || "",
        city: document.getElementById("city")?.value.trim() || "",
        postalCode: document.getElementById("postalCode")?.value.trim() || "",
        country: document.getElementById("country")?.value.trim() || "",
      },
      customFields: collectCustomFields(),
    };

    // Sla contact op in localStorage
    saveContact(contact);

    // Reset formulier
    form.reset();
    document.getElementById("socialMediaFields").innerHTML = "";
    document.getElementById("pronounsFields").innerHTML = "";
    document.getElementById("customFields").innerHTML = "";

    alert("Contact succesvol opgeslagen!");
  });

  // Verzamel social media gegevens
  function collectSocialMedia() {
    const socialMediaFields = document.querySelectorAll(
      "#socialMediaFields .form-group"
    );
    return Array.from(socialMediaFields)
      .map((field) => {
        const platform = field.querySelector(".socialType").value.trim();
        const username = field.querySelector(".social").value.trim();
        return platform && username ? { platform, username } : null;
      })
      .filter(Boolean);
  }

  // Verzamel voornaamwoorden
  function collectPronouns() {
    const pronounsFields = document.querySelectorAll(
      "#pronounsFields .form-group .pronouns"
    );
    return Array.from(pronounsFields)
      .map((field) => field.value.trim())
      .filter(Boolean);
  }

  // Verzamel aangepaste velden
  function collectCustomFields() {
    const customFields = document.querySelectorAll("#customFields .form-group");
    return Array.from(customFields)
      .map((field) => {
        const key = field.querySelector(".custom-key").value.trim();
        const value = field.querySelector(".custom-value").value.trim();
        return key && value ? { key, value } : null;
      })
      .filter(Boolean);
  }

  // Sla contact op in localStorage
  function saveContact(contact) {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push(contact);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const contact = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      birthdate: document.getElementById("birthdate").value,
      anniversary: document.getElementById("anniversary").value,
      company: document.getElementById("company").value.trim(),
      jobTitle: document.getElementById("jobTitle").value.trim(),
      address: {
        street: document.getElementById("street").value.trim(),
        city: document.getElementById("city").value.trim(),
        postalCode: document.getElementById("postalCode").value.trim(),
        country: document.getElementById("country").value.trim(),
      },
      socialMedia: collectSocialMedia(),
      pronouns: collectPronouns(),
      customFields: collectCustomFields(),
    };

    if (!contact.id || !contact.phone) {
      alert("Naam en telefoonnummer zijn verplicht!");
      return;
    }

    saveContact(contact);

    form.reset();
    document.getElementById("socialMediaFields").innerHTML = "";
    document.getElementById("pronounsFields").innerHTML = "";
    document.getElementById("customFields").innerHTML = "";

    alert("Contact succesvol opgeslagen!");
  });

  function collectSocialMedia() {
    const fields = document.querySelectorAll("#socialMediaFields .form-group");
    return Array.from(fields)
      .map((field) => {
        const platform = field.querySelector(".socialType").value.trim();
        const username = field.querySelector(".social").value.trim();
        return platform && username ? { platform, username } : null;
      })
      .filter(Boolean);
  }

  function collectPronouns() {
    const fields = document.querySelectorAll(
      "#pronounsFields .form-group .pronouns"
    );
    return Array.from(fields)
      .map((field) => field.value.trim())
      .filter(Boolean);
  }

  function collectCustomFields() {
    const fields = document.querySelectorAll("#customFields .form-group");
    return Array.from(fields)
      .map((field) => {
        const key = field.querySelector(".customKey").value.trim();
        const value = field.querySelector(".customValue").value.trim();
        return key && value ? { key, value } : null;
      })
      .filter(Boolean);
  }

  function saveContact(contact) {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push(contact);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
});
