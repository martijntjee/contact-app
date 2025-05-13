// Social media veld dynamisch updaten
document.getElementById('socialType').addEventListener('change', function() {
    const socialInput = document.getElementById('social');
    if (this.value === 'instagram') {
        socialInput.placeholder = "@gebruikersnaam";
    } else if (this.value === 'twitter') {
        socialInput.placeholder = "@handle";
    } else {
        socialInput.placeholder = "Gebruikersnaam";
    }
});

// Aangepaste velden toevoegen
function addCustomField() {
    const container = document.getElementById('customFields');
    const fieldId = Date.now();
    
    const fieldHTML = `
        <div class="form-group custom-field" id="field-${fieldId}">
            <div style="display: flex; gap: 10px;">
                <input type="text" class="custom-key" placeholder="Veldnaam (bijv. Allergieën)" style="flex: 1;">
                <input type="text" class="custom-value" placeholder="Waarde" style="flex: 2;">
                <button type="button" class="btn btn-danger" 
                        onclick="document.getElementById('field-${fieldId}').remove()">
                    ❌
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', fieldHTML);
}

// Formulier verwerking
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Verplichte velden validatie
    if (!validateRequiredFields(['name', 'phone'])) {
        showToast('Vul alle verplichte velden in!', 'error');
        return;
    }

    // Contact object samenstellen
    const contact = {
        // Basis (verplicht)
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        
        // Contactinfo
        email: document.getElementById('email').value,
        social: {
            platform: document.getElementById('socialType').value,
            username: document.getElementById('social').value
        },
        
        // Persoonlijk
        birthdate: document.getElementById('birthdate').value,
        anniversary: document.getElementById('anniversary').value,
        pronouns: document.getElementById('pronouns').value,
        
        // Werk
        company: document.getElementById('company').value,
        jobTitle: document.getElementById('jobTitle').value,
        
        // Geavanceerd
        priority: document.getElementById('priority').value,
        isFavorite: document.getElementById('favorite').checked,
        
        // Dynamische velden
        customFields: []
    };

    // Aangepaste velden toevoegen
    const customFields = document.querySelectorAll('.custom-field');
    customFields.forEach(field => {
        const key = field.querySelector('.custom-key').value.trim();
        const value = field.querySelector('.custom-value').value.trim();
        if (key && value) {
            if (contact.customFields.some(f => f.key === key)) {
                alert(`Het veld "${key}" bestaat al.`);
            } else {
                contact.customFields.push({ key, value });
            }
        }
    });

    // Opslaan en reset
    saveContact(contact);
    showToast('Contact opgeslagen!', 'success');
    this.reset();
    renderContacts();
});

function saveContact(contact) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function renderContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '<h2>Mijn Contacten</h2>';

    if (contacts.length === 0) {
        contactList.innerHTML += '<p>Nog geen contacten toegevoegd.</p>';
        return;
    }

    contacts.forEach((contact, index) => {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        contactCard.innerHTML = `
            <h3>${contact.name}</h3>
            <p>Telefoon: ${contact.phone}</p>
            ${contact.email ? `<p>E-mail: ${contact.email}</p>` : ''}
            ${contact.birthdate ? `<p>Geboortedatum: ${contact.birthdate}</p>` : ''}
            ${contact.relationship ? `<p>Relatie: ${contact.relationship}</p>` : ''}
            ${contact.customFields.map(field => `
                <p>${field.key}: ${field.value}</p>
            `).join('')}
            <button class="btn btn-danger delete-contact" data-index="${index}">Verwijderen</button>
        `;
        contactList.appendChild(contactCard);
    });

    // Voeg eventlisteners toe aan de verwijderknoppen
    document.querySelectorAll('.delete-contact').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteContact(index);
        });
    });
}

function deleteContact(index) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.splice(index, 1); // Verwijder het contact op de gegeven index
    localStorage.setItem('contacts', JSON.stringify(contacts)); // Sla de bijgewerkte lijst op
    renderContacts(); // Render de bijgewerkte lijst
}

// Laad contacten bij opstart
document.addEventListener('DOMContentLoaded', renderContacts);

// Prioriteit slider live update
document.getElementById('priority').addEventListener('input', function() {
    document.getElementById('priorityValue').textContent = this.value;
});

function validateRequiredFields(fields) {
    for (const field of fields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            alert(`Het veld "${element.placeholder || field}" is verplicht.`);
            element.focus();
            return false;
        }
    }
    return true;
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}