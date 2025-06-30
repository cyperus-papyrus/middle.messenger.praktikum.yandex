type Validator = (value: string) => string | null;

const patterns = {
    name: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
    login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]$/,
    password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    phone: /^\+?[0-9]{10,15}$/
};

export const validators: Record<string, Validator> = {
    first_name: (value) => validatePattern(value,
        patterns.name, "Латиница/кириллица, первая заглавная, можно дефис"),
    second_name: (value) => validatePattern(value,
        patterns.name, "Латиница/кириллица, первая заглавная, можно дефис"),
    login: (value) => {
        if (value.length < 3 || value.length > 20) return "Длина должна быть 3-20 символов";
        return validatePattern(value,
            patterns.login, "Латиница, цифры, дефис/подчёркивание");
    },
    email: (value) => validatePattern(value,
        patterns.email, "Некорректный email"),
    password: (value) => {
        if (value.length < 8 || value.length > 40) return "Длина 8-40 символов";
        return validatePattern(value, patterns.password,
            "Минимум одна заглавная буква, буква и цифры");
    },
    phone: (value) => validatePattern(value, patterns.phone, "Некорректный номер телефона"),
    message: (value) => value.trim() ? null : "Сообщение не может быть пустым"
};

function validatePattern(value: string, pattern: RegExp, errorMsg: string): string | null {
    return pattern.test(value) ? null : errorMsg;
}

export function validateField(fieldName: string, value: string): string | null {
    const validator = validators[fieldName];
    return validator ? validator(value) : null;
}

export function validateForm(formData: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key, value);
        if (error) errors[key] = error;
    });
    return errors;
}
