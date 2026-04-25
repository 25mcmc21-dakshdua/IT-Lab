const form = document.getElementById('regForm');
const fields = ['name', 'email', 'password', 'dob', 'phone'];

// 1. Validation Rules
const validate = {
    name: (val) => /^[A-Za-z\s]+$/.test(val) || "Only alphabets allowed",
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Enter a valid email",
    password: (val) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(val) || "Need 8+ chars, Uppercase, Lowercase, Num & Special";
    },
    dob: (val) => {
        if (!val) return "Date is required";
        const birthDate = new Date(val);
        const age = Math.floor((new Date() - birthDate) / (31557600000)); // Math object used for age
        return age >= 18 || "Must be 18+ years old";
    },
    phone: (val) => /^\d{10}$/.test(val) || "Must be exactly 10 digits"
};

// 2. Math-based Strength Indicator
function updateStrength(pass) {
    let score = 0;
    if (pass.length > 0) score += Math.min(20, pass.length * 2);
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[!@#$%^&*]/.test(pass)) score += 20;
    if (/[a-z]/.test(pass)) score += 20;

    const bar = document.getElementById('strengthBar');
    bar.style.width = score + "%";
    
    // Color change logic
    if (score < 40) bar.style.backgroundColor = "#e74c3c"; // Red
    else if (score < 70) bar.style.backgroundColor = "#f39c12"; // Orange
    else bar.style.backgroundColor = "#2ecc71"; // Green
}

// 3. Apply Real-time Listeners
fields.forEach(id => {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(id + 'Err');

    input.addEventListener('input', () => {
        const result = validate[id](input.value);
        
        if (id === 'password') updateStrength(input.value);

        if (result === true) {
            errorDiv.textContent = "";
            input.className = "valid-border";
        } else {
            errorDiv.textContent = result;
            input.className = "invalid-border";
        }
    });
});

// 4. Form Submission Handling
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isAllValid = true;

    fields.forEach(id => {
        if (validate[id](document.getElementById(id).value) !== true) {
            isAllValid = false;
        }
    });

    if (isAllValid) {
        alert("Success! Form is valid.");
        form.reset();
        document.getElementById('strengthBar').style.width = "0%";
    } else {
        alert("Please correct the errors in the form.");
    }
});