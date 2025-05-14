// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');

    // Laad contacten bij het opstarten
    renderContacts();

    // Formulier submit-event
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Verplichte velden validatie
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !phone) {
            alert('Naam en telefoonnummer zijn verplicht!');
            return;
        }

        // Verzamel contactgegevens
        const contact = {
            id: Date.now(), // Unieke ID voor elk contact
            name,
            phone,
            email: document.getElementById('email')?.value.trim() || '',
            socialMedia: collectSocialMedia(),
            birthdate: document.getElementById('birthdate')?.value || '',
            anniversary: document.getElementById('anniversary')?.value || '',
            pronouns: collectPronouns(),
            company: document.getElementById('company')?.value.trim() || '',
            jobTitle: document.getElementById('jobTitle')?.value.trim() || '',
            address: {
                street: document.getElementById('street')?.value.trim() || '',
                city: document.getElementById('city')?.value.trim() || '',
                postalCode: document.getElementById('postalCode')?.value.trim() || '',
                country: document.getElementById('country')?.value.trim() || ''
            },
            customFields: collectCustomFields()
        };

        // Sla contact op in localStorage
        saveContact(contact);

        // Reset formulier
        form.reset();
        document.getElementById('socialMediaFields').innerHTML = '';
        document.getElementById('pronounsFields').innerHTML = '';
        document.getElementById('customFields').innerHTML = '';

        // Render bijgewerkte contactenlijst
        renderContacts();

        showToast('Contact succesvol opgeslagen!', 'success');
    });

    // Verzamel social media gegevens
    function collectSocialMedia() {
        const socialMediaFields = document.querySelectorAll('#socialMediaFields .form-group');
        return Array.from(socialMediaFields).map(field => {
            const platform = field.querySelector('.socialType').value.trim();
            const username = field.querySelector('.social').value.trim();
            return platform && username ? { platform, username } : null;
        }).filter(Boolean); // Filter lege velden
    }

    // Verzamel voornaamwoorden
    function collectPronouns() {
        const pronounsFields = document.querySelectorAll('#pronounsFields .form-group .pronouns');
        return Array.from(pronounsFields).map(field => field.value.trim()).filter(Boolean);
    }

    // Verzamel aangepaste velden
    function collectCustomFields() {
        const customFields = document.querySelectorAll('#customFields .form-group');
        return Array.from(customFields).map(field => {
            const key = field.querySelector('.custom-key').value.trim();
            const value = field.querySelector('.custom-value').value.trim();
            return key && value ? { key, value } : null;
        }).filter(Boolean); // Filter lege velden
    }

    // Sla contact op in localStorage
    function saveContact(contact) {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // Render contactenlijst
    function renderContacts() {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contactList.innerHTML = '<h2>Contacten</h2>';

        if (contacts.length === 0) {
            contactList.innerHTML += '<p>Nog geen contacten toegevoegd.</p>';
            return;
        }

        contacts.forEach((contact, index) => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <h3>${contact.name}</h3>
                <p><strong>📞</strong> ${contact.phone}</p>
                ${contact.email ? `<p><strong>📧</strong> ${contact.email}</p>` : ''}
                ${contact.socialMedia.length > 0 ? contact.socialMedia.map(sm => `
                    <p><strong>🌐</strong> ${sm.platform}: ${sm.username}</p>
                `).join('') : ''}
                ${contact.birthdate ? `<p><strong>🎂</strong> ${contact.birthdate}</p>` : ''}
                ${contact.anniversary ? `<p><strong>🎉</strong> ${contact.anniversary}</p>` : ''}
                ${contact.pronouns.length > 0 ? `<p><strong>👤</strong> ${contact.pronouns.join(', ')}</p>` : ''}
                ${contact.company ? `<p><strong>🏢</strong> ${contact.company}</p>` : ''}
                ${contact.jobTitle ? `<p><strong>💼</strong> ${contact.jobTitle}</p>` : ''}
                ${contact.address.street || contact.address.city || contact.address.postalCode 
                    || contact.address.country ? `
                    <p><strong>🏠 Adres:</strong> ${contact.address.street}, 
                    ${contact.address.city}, ${contact.address.postalCode}, ${contact.address.country}</p>
                ` : ''}
                ${contact.customFields.length > 0 ? '<h4>Aangepaste velden:</h4>' : ''}
                ${contact.customFields.map(f => `<p><strong>${f.key}</strong>: ${f.value}</p>`).join('')}
                <button class="btn btn-danger" onclick="deleteContact(${index})">Verwijderen</button>
            `;
            contactList.appendChild(card);
        });
    }

    // Toon toastmelding
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});

// Functies voor dynamische velden
function addSocialMediaField() {
    const container = document.getElementById('socialMediaFields');
    const newField = document.createElement('div');
    newField.className = 'form-group';
    newField.innerHTML = `
        <label for="socialType">Social Media</label>
        <select class="socialType">
            <option value="">Kies platform...</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
        </select>
        <input type="text" class="social" placeholder="Gebruikersnaam">
        <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
    `;
    container.appendChild(newField);
}

function addPronounsField() {
    const container = document.getElementById('pronounsFields');
    const newField = document.createElement('div');
    newField.className = 'form-group';
    newField.innerHTML = `
        <label for="pronouns">Voornaamwoorden</label>
        <select class="pronouns">
            <option value="">-</option>
            <option value="hij/hem">hij/hem</option>
            <option value="zij/haar">zij/haar</option>
            <option value="die/hen">die/hen</option>
        </select>
        <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
    `;
    container.appendChild(newField);
}

function addCustomField() {
    const container = document.getElementById('customFields');
    const newField = document.createElement('div');
    newField.className = 'form-group custom-field';
    newField.innerHTML = `
        <input type="text" class="custom-key" placeholder="Veldnaam">
        <input type="text" class="custom-value" placeholder="Waarde">
        <button type="button" class="btn btn-small btn-danger" onclick="this.parentNode.remove()">Verwijderen</button>
    `;
    container.appendChild(newField);
}

// Verwijder contact
function deleteContact(index) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    document.getElementById('contactList').innerHTML = '';
    document.querySelector('script').dispatchEvent(new Event('DOMContentLoaded'));
}