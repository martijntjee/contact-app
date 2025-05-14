document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get('id');

    if (!contactId) {
        alert('Geen contact ID gevonden!');
        window.location.href = 'view-contacts.html';
        return;
    }

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
        alert('Contact niet gevonden!');
        window.location.href = 'view-contacts.html';
        return;
    }

    renderContactForm(contact);

    const form = document.getElementById('editContactForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        saveContactChanges(contactId);
    });
});

function renderContactForm(contact) {
    document.getElementById('editName').value = contact.name || '';
    document.getElementById('editPhone').value = contact.phone || '';
    document.getElementById('editEmail').value = contact.email || '';
    document.getElementById('editBirthdate').value = contact.birthdate || '';
    document.getElementById('editAnniversary').value = contact.anniversary || '';
    document.getElementById('editCompany').value = contact.company || '';
    document.getElementById('editJobTitle').value = contact.jobTitle || '';
    document.getElementById('editStreet').value = contact.address?.street || '';
    document.getElementById('editCity').value = contact.address?.city || '';
    document.getElementById('editPostalCode').value = contact.address?.postalCode || '';
    document.getElementById('editCountry').value = contact.address?.country || '';

    if (contact.pronouns) {
        contact.pronouns.forEach(p => addPronounField(p));
    }

    if (contact.socialMedia) {
        contact.socialMedia.forEach(sm => addSocialMediaField(sm.platform, sm.username));
    }

    if (contact.customFields) {
        contact.customFields.forEach(f => addCustomField(f.key, f.value));
    }
}

function saveContactChanges(contactId) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const index = contacts.findIndex(c => c.id === contactId);

    if (index === -1) {
        alert('Contact niet gevonden!');
        return;
    }

    const updated = {
        ...contacts[index],
        name: document.getElementById('editName').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        birthdate: document.getElementById('editBirthdate').value,
        anniversary: document.getElementById('editAnniversary').value,
        company: document.getElementById('editCompany').value.trim(),
        jobTitle: document.getElementById('editJobTitle').value.trim(),
        address: {
            street: document.getElementById('editStreet').value.trim(),
            city: document.getElementById('editCity').value.trim(),
            postalCode: document.getElementById('editPostalCode').value.trim(),
            country: document.getElementById('editCountry').value.trim(),
        },
        pronouns: getSingleFieldValues('editPronouns'),
        socialMedia: getDynamicFields('editSocialMediaPlatform', 'editSocialMediaUsername'),
        customFields: getDynamicFields('editCustomKey', 'editCustomValue', true),
    };

    contacts[index] = updated;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    alert('Contact bijgewerkt!');
    window.location.href = 'view-contacts.html';
}

function addPronounField(value = '') {
    const container = document.getElementById('editPronounsFields');
    const field = document.createElement('div');
    field.innerHTML = `<input type="text" class="editPronouns" value="${value}" placeholder="Bijv. zij/haar" />`;
    container.appendChild(field);
}

function addSocialMediaField(platform = '', username = '') {
    const container = document.getElementById('editSocialMediaFields');
    const field = document.createElement('div');
    field.innerHTML = `
        <input type="text" class="editSocialMediaPlatform" value="${platform}" placeholder="Platform" />
        <input type="text" class="editSocialMediaUsername" value="${username}" placeholder="Gebruikersnaam" />
    `;
    container.appendChild(field);
}

function addCustomField(key = '', value = '') {
    const container = document.getElementById('editCustomFields');
    const field = document.createElement('div');
    field.innerHTML = `
        <input type="text" class="editCustomKey" value="${key}" placeholder="Naam veld" />
        <input type="text" class="editCustomValue" value="${value}" placeholder="Waarde" />
    `;
    container.appendChild(field);
}

function getSingleFieldValues(className) {
    return Array.from(document.getElementsByClassName(className))
        .map(el => el.value.trim())
        .filter(Boolean);
}

function getDynamicFields(keyClass, valueClass, isCustom = false) {
    const keys = document.getElementsByClassName(keyClass);
    const values = document.getElementsByClassName(valueClass);
    const result = [];

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i].value.trim();
        const value = values[i].value.trim();
        if (key && value) {
            result.push(isCustom ? { key, value } : { platform: key, username: value });
        }
    }

    return result;
}
