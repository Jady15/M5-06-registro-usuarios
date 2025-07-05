const { z } = window.Zod;

const registerSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }).nonempty({ message: "El nombre es obligatorio." }),
    email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido." }).nonempty({ message: "El correo es obligatorio." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }).nonempty({ message: "La contraseña es obligatoria." })
});

function validateField(field, value) {
    try {
        const partialSchema = z.object({ [field]: registerSchema.shape[field] });
        partialSchema.parse({ [field]: value });
        return null;
    } catch (error) {
        return error.errors[0].message;
    }
}

const inputs = document.querySelectorAll('#registerForm input');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        const field = input.id;
        const value = input.value.trim();
        const errorElement = document.getElementById(`${field}-error`);
        const errorMessage = validateField(field, value);
        errorElement.textContent = errorMessage || '';
    });
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formErrors = document.getElementById("form-errors");
    formErrors.textContent = '';

    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
    };

    try {
        registerSchema.parse(formData);
        alert("¡Registro exitoso!");
        document.getElementById("registerForm").reset();
        inputs.forEach(input => {
            document.getElementById(`${input.id}-error`).textContent = '';
        });
    } catch (error) {
        const errors = error.errors.map(e => e.message).join("<br>");
        formErrors.innerHTML = errors;
    }
});