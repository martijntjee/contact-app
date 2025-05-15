document.addEventListener('DOMContentLoaded', function () {
    // Verwijzing naar het formulier
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validatie
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            let isValid = true;

            if (!name.value.trim()) {
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('nameError').style.display = 'none';
            }

            if (!phone.value.trim()) {
                document.getElementById('phoneError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('phoneError').style.display = 'none';
            }

            if (!isValid) return;

            // Verzamel alle formuliervelden
            const contact = {
                id: crypto.randomUUID(), // ✅ Unieke ID toevoegen
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: document.getElementById('email').value.trim(),
                socialMedia: getDynamicFields('socialMediaPlatform', 'socialMediaUsername'),
                birthdate: document.getElementById('birthdate').value,
                anniversary: document.getElementById('anniversary').value,
                pronouns: getSingleFieldValues('pronouns'),
                company: document.getElementById('company').value.trim(),
                jobTitle: document.getElementById('jobTitle').value.trim(),
                address: {
                    street: document.getElementById('street').value.trim(),
                    city: document.getElementById('city').value.trim(),
                    postalCode: document.getElementById('postalCode').value.trim(),
                    country: document.getElementById('country').value.trim()
                },
                customFields: getDynamicFields('customKey', 'customValue')
            };

            // Opslaan in localStorage
            const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            // Formulier resetten en velden leeg maken
            form.reset();
            document.getElementById('socialMediaFields').innerHTML = '';
            document.getElementById('pronounsFields').innerHTML = '';
            document.getElementById('customFields').innerHTML = '';
            alert('Contact succesvol opgeslagen!');
        });
    }

    // Laad contacten wanneer de pagina wordt geladen
    const contactsContainer = document.getElementById('contactsContainer');
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (contacts.length === 0) {
        if (contactsContainer) {
            contactsContainer.innerHTML = '<p>Nog geen contacten toegevoegd.</p>';
        }
        return;
    }

    // Contacten tonen
    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
            window.location.href = `../us-06/edit-contact.html?id=${contact.id}`;
        });

        card.innerHTML = `
            <h3>${contact.id}</h3>
            <p><strong>📞 Telefoon:</strong> ${contact.phone}</p>
            ${contact.email ? `<p><strong>📧 E-mail:</strong> ${contact.email}</p>` : ''}
            ${contact.socialMedia && contact.socialMedia.length > 0 ? contact.socialMedia.map(sm => `
                <p><strong>🌐 ${sm.platform}:</strong> ${sm.username}</p>
            `).join('') : ''}
            ${contact.birthdate ? `<p><strong>🎂 Geboortedatum:</strong> ${contact.birthdate}</p>` : ''}
            ${contact.anniversary ? `<p><strong>🎉 Jubileum:</strong> ${contact.anniversary}</p>` : ''}
            ${contact.pronouns && contact.pronouns.length > 0 ? `
                <p><strong>👤 Voornaamwoorden:</strong> ${contact.pronouns.join(', ')}</p>
            ` : ''}
            ${contact.company ? `<p><strong>🏢 Bedrijf:</strong> ${contact.company}</p>` : ''}
            ${contact.jobTitle ? `<p><strong>💼 Functie:</strong> ${contact.jobTitle}</p>` : ''}
            ${contact.address && (contact.address.street || contact.address.city ||
                contact.address.postalCode || contact.address.country) ? `
                <p><strong>🏠 Adres:</strong> ${contact.address.street}, ${contact.address.city}, 
                ${contact.address.postalCode}, ${contact.address.country}</p>
            ` : ''}
            ${contact.customFields && contact.customFields.length > 0 ? '<h4>Aangepaste velden:</h4>' : ''}
            ${contact.customFields && contact.customFields.map(f => `<p><strong>${f.key}:</strong> 
                ${f.value}</p>`).join('')}
        `;
        if (contactsContainer) {
            contactsContainer.appendChild(card);
        }
    });
});

// Hulpfuncties

function addSocialMediaField() {
    const container = document.getElementById('socialMediaFields');
    const field = document.createElement('div');
    field.classList.add('form-group');
    field.innerHTML = `
        <input type="text" class="socialMediaPlatform" placeholder="Platform (bijv. Instagram)" />
        <input type="text" class="socialMediaUsername" placeholder="Gebruikersnaam" />
    `;
    container.appendChild(field);
}

function addPronounsField() {
    const container = document.getElementById('pronounsFields');
    const field = document.createElement('div');
    field.classList.add('form-group');
    field.innerHTML = `
        <input type="text" class="pronouns" placeholder="Bijv. hij/hem, zij/haar" />
    `;
    container.appendChild(field);
}

function addCustomField() {
    const container = document.getElementById('customFields');
    const field = document.createElement('div');
    field.classList.add('form-group');
    field.innerHTML = `
        <input type="text" class="customKey" placeholder="Naam veld (bijv. Hobby)" />
        <input type="text" class="customValue" placeholder="Waarde (bijv. Fietsen)" />
    `;
    container.appendChild(field);
}

function getDynamicFields(keyClass, valueClass) {
    const keys = document.getElementsByClassName(keyClass);
    const values = document.getElementsByClassName(valueClass);
    const result = [];

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i].value.trim();
        const value = values[i].value.trim();
        if (key && value) {
            result.push({ platform: key, username: value }); // voor socialMedia
        }
    }

    if (keyClass === 'customKey') {
        return result.map(item => ({
            key: item.platform,
            value: item.username
        }));
    }

    return result;
}

function getSingleFieldValues(className) {
    const fields = document.getElementsByClassName(className);
    const result = [];
    for (let field of fields) {
        const val = field.value.trim();
        if (val) result.push(val);
    }
    return result;
}
