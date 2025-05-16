document.addEventListener("DOMContentLoaded", function () {
  const contactsContainer = document.getElementById("contactsContainer");

  fetch("http://127.0.0.1:6789/api/contacts")
    .then((res) => {
      if (!res.ok) throw new Error("Serverfout bij het ophalen van contacten");
      return res.json();
    })
    .then((contacts) => {
      if (!contacts || contacts.length === 0) {
        if (contactsContainer) {
          contactsContainer.innerHTML = "<p>Nog geen contacten toegevoegd.</p>";
        }
        return;
      }

      contacts.forEach((contact) => {
        const card = document.createElement("div");
        card.className = "contact-card";
        card.style.cursor = "pointer";

        card.addEventListener("click", function () {
          window.location.href = `edit.html?id=${contact._id}`;
        });

        card.innerHTML = `
            <h3>${contact.name}</h3>
            <p><strong>📞 Telefoon:</strong> ${contact.phone}</p>
            ${
              contact.email
                ? `<p><strong>📧 E-mail:</strong> ${contact.email}</p>`
                : ""
            }
            ${
              contact.socialMedia && contact.socialMedia.length > 0
                ? contact.socialMedia
                    .map(
                      (sm) => `
              <p><strong>🌐 ${sm.platform}:</strong> ${sm.username}</p>
            `
                    )
                    .join("")
                : ""
            }
            ${
              contact.birthdate
                ? `<p><strong>🎂 Geboortedatum:</strong> ${contact.birthdate}</p>`
                : ""
            }
            ${
              contact.anniversary
                ? `<p><strong>🎉 Jubileum:</strong> ${contact.anniversary}</p>`
                : ""
            }
            ${
              contact.pronouns && contact.pronouns.length > 0
                ? `
              <p><strong>👤 Voornaamwoorden:</strong> ${contact.pronouns.join(
                ", "
              )}</p>
            `
                : ""
            }
            ${
              contact.company
                ? `<p><strong>🏢 Bedrijf:</strong> ${contact.company}</p>`
                : ""
            }
            ${
              contact.jobTitle
                ? `<p><strong>💼 Functie:</strong> ${contact.jobTitle}</p>`
                : ""
            }
            ${
              contact.address &&
              (contact.address.street ||
                contact.address.city ||
                contact.address.postalCode ||
                contact.address.country)
                ? `
              <p><strong>🏠 Adres:</strong> ${contact.address.street}, ${contact.address.city}, 
              ${contact.address.postalCode}, ${contact.address.country}</p>
            `
                : ""
            }
            ${
              contact.customFields && contact.customFields.length > 0
                ? "<h4>Aangepaste velden:</h4>"
                : ""
            }
            ${
              contact.customFields &&
              contact.customFields
                .map(
                  (f) => `<p><strong>${f.key}:</strong> 
              ${f.value}</p>`
                )
                .join("")
            }
          `;

        if (contactsContainer) {
          contactsContainer.appendChild(card);
        }
      });
    })
    .catch((err) => {
      console.error("Fout bij het ophalen van contacten:", err);
      if (contactsContainer) {
        contactsContainer.innerHTML =
          "<p>Er is iets misgegaan bij het laden van de contacten.</p>";
      }
    });

  // Optional: register your service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then((reg) => console.log("Service Worker geregistreerd"))
      .catch((err) => console.log("Registratie mislukt", err));
  }
});
