document.addEventListener('DOMContentLoaded', () => {
    // Select essential DOM elements
    const form = document.getElementById('regForm');
    const cardsContainer = document.getElementById('cards');
    const tableBody = document.querySelector('#summaryTable tbody');

    // --- FORM SUBMISSION HANDLER 
    form.addEventListener('submit', (event) => {
        // Prevent the default browser action of reloading the page
        event.preventDefault(); 
        
        // --- 1. VALIDATION ---
        const isValid = validateForm();

        // If the form is not valid, stop the function here
        if (!isValid) {
            document.getElementById('live-feedback').textContent = "Please fix the errors before submitting.";
            return;
        }
        document.getElementById('live-feedback').textContent = "";

        // --- 2. DATA COLLECTION ---
        // Gather all the form data into an object
        const formData = {
            id: 'student-' + Date.now(), // Create a unique ID for linking card and row
            firstName: form.elements.firstName.value.trim(),
            lastName: form.elements.lastName.value.trim(),
            email: form.elements.email.value.trim(),
            programme: form.elements.programme.value.trim(),
            year: form.elements.year.value,
            interests: form.elements.interests.value.trim().split(',').map(item => item.trim()),
            photoUrl: form.elements.photoUrl.value.trim() || 'https://placehold.co/100', // Default image
        };

        // --- 3. DYNAMIC ELEMENT CREATION ---
        addStudent(formData);

        // --- 4. RESET FORM ---
        form.reset();
    });

    // --- VALIDATION LOGIC ---
    function validateForm() {
        let allValid = true;
        // Validate required text fields
        allValid = validateRequired('firstName') && allValid;
        allValid = validateRequired('lastName') && allValid;
        allValid = validateRequired('programme') && allValid;
        // Validate email format
        allValid = validateEmail('email') && allValid;
        // Validate radio button selection
        allValid = validateRadio('year') && allValid;

        return allValid;
    }

    // Helper function for required text fields
    function validateRequired(fieldId) {
        const input = form.elements[fieldId];
        const errorEl = document.getElementById(`err-${fieldId}`);
        if (input.value.trim() === '') {
            errorEl.textContent = 'This field is required.';
            return false;
        }
        errorEl.textContent = '';
        return true;
    }

    // Helper function for email validation using a simple regex
    function validateEmail(fieldId) {
        const input = form.elements[fieldId];
        const errorEl = document.getElementById(`err-${fieldId}`);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
            errorEl.textContent = 'Please enter a valid email address.';
            return false;
        }
        errorEl.textContent = '';
        return true;
    }
    
    // Helper function for radio button group validation
    function validateRadio(groupName) {
        const radioGroup = form.elements[groupName];
        const errorEl = document.getElementById(`err-${groupName}`);
        if (!radioGroup.value) {
            errorEl.textContent = 'Please select a year.';
            return false;
        }
        errorEl.textContent = '';
        return true;
    }


    // --- FUNCTION TO ADD STUDENT TO CARD AND TABLE ---
    function addStudent(data) {
        // --- Create Profile Card ---
        const card = document.createElement('div');
        card.className = 'card';
        card.id = data.id; // Assign the unique ID

        card.innerHTML = `
            <button class="remove-btn" title="Remove Student">X</button>
            <img src="${data.photoUrl}" alt="Profile picture of ${data.firstName}">
            <h3>${data.firstName} ${data.lastName}</h3>
            <p>${data.email}</p>
            <p><span class="badge">${data.programme}</span> <span class="badge">Year ${data.year}</span></p>
            ${data.interests[0] !== '' ? `<p>Interests: ${data.interests.join(', ')}</p>` : ''}
        `;
        cardsContainer.prepend(card);

        // --- Create Table Row ---
        const row = document.createElement('tr');
        row.id = `row-${data.id}`; // Assign a related unique ID

        row.innerHTML = `
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.email}</td>
            <td>${data.programme}</td>
            <td>${data.year}</td>
            <td><button class="remove-btn-table">Remove</button></td>
        `;
        tableBody.prepend(row);
    }
    
    // --- EVENT DELEGATION FOR REMOVE BUTTONS ---
    // Listen for clicks on the containers instead of individual buttons
    cardsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            const card = event.target.closest('.card');
            removeStudent(card.id);
        }
    });

    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn-table')) {
            const row = event.target.closest('tr');
            // Extract the original ID from the row's ID
            const studentId = row.id.replace('row-', '');
            removeStudent(studentId);
        }
    });

    // --- FUNCTION TO REMOVE STUDENT FROM CARD AND TABLE ---
    function removeStudent(studentId) {
        // Find and remove the card
        const cardToRemove = document.getElementById(studentId);
        if (cardToRemove) {
            cardToRemove.remove();
        }

        // Find and remove the table row
        const rowToRemove = document.getElementById(`row-${studentId}`);
        if (rowToRemove) {
            rowToRemove.remove();
        }
    }
});