/**
 * Aplicação principal
 */
class PasswordEncryptor {
    constructor() {
        this.currentMethod = null;
        this.originalPassword = null;
        this.encryptedPassword = null;
        this.encryptionSteps = [];
        this.xorKey = null;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.passwordInput = document.getElementById('passwordInput');
        this.togglePasswordBtn = document.getElementById('togglePasswordBtn');
        this.encryptBtn = document.getElementById('encryptBtn');

        this.methodSection = document.getElementById('methodSection');
        this.methodButtons = document.querySelectorAll('.method-btn');

        this.shiftSection = document.getElementById('shiftSection');
        this.shiftValue = document.getElementById('shiftValue');
        this.shiftDisplay = document.getElementById('shiftDisplay');
        this.shiftValueText = document.getElementById('shiftValueText');

        this.keySection = document.getElementById('keySection');
        this.xorKeyInput = document.getElementById('xorKey');

        this.resultSection = document.getElementById('resultSection');
        this.originalPasswordDisplay = document.getElementById('originalPassword');
        this.encryptedPasswordDisplay = document.getElementById('encryptedPassword');
        this.decryptedPasswordDisplay = document.getElementById('decryptedPassword');
        this.stepsContainer = document.getElementById('stepsContainer');
        this.decryptionStepsContainer = document.getElementById('decryptionSteps');
        this.decryptionResult = document.getElementById('decryptionResult');

        this.decryptBtn = document.getElementById('decryptBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.copyButtons = document.querySelectorAll('.copy-btn');
    }

    attachEventListeners() {
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        this.encryptBtn.addEventListener('click', () => this.handleEncryptClick());

        this.methodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMethod(e.target.closest('.method-btn')));
        });

        this.shiftValue.addEventListener('input', (e) => {
            this.shiftDisplay.textContent = e.target.value;
            this.shiftValueText.textContent = e.target.value;
        });

        this.decryptBtn.addEventListener('click', () => this.handleDecrypt());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.copyToClipboard(e.target));
        });
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    }

    handleEncryptClick() {
        const password = this.passwordInput.value.trim();
        if (!password) {
            alert('Por favor, digite uma senha!');
            return;
        }

        this.originalPassword = password;
        this.methodSection.style.display = 'block';
        this.methodSection.scrollIntoView({ behavior: 'smooth' });
    }

    selectMethod(btn) {
        this.methodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMethod = btn.dataset.method;

        this.shiftSection.style.display = 'none';
        this.keySection.style.display = 'none';

        if (this.currentMethod === 'cipher') {
            this.shiftSection.style.display = 'block';
            setTimeout(() => this.shiftSection.scrollIntoView({ behavior: 'smooth' }), 100);
        } else if (this.currentMethod === 'xor') {
            this.keySection.style.display = 'block';
            setTimeout(() => this.keySection.scrollIntoView({ behavior: 'smooth' }), 100);
        } else {
            setTimeout(() => this.encrypt(), 100);
        }
    }

    encrypt() {
        let result;

        switch (this.currentMethod) {
            case 'cipher':
                result = EncryptionEngine.caesarCipher(this.originalPassword, parseInt(this.shiftValue.value));
                break;
            case 'reverse':
                result = EncryptionEngine.reverseCipher(this.originalPassword);
                break;
            case 'base64':
                result = EncryptionEngine.base64Encrypt(this.originalPassword);
                break;
            case 'xor':
                this.xorKey = this.xorKeyInput.value.trim() || 'SECRET';
                result = EncryptionEngine.xorCipher(this.originalPassword, this.xorKey);
                break;
            default:
                alert('Método não selecionado!');
                return;
        }

        this.encryptedPassword = result.encrypted;
        this.encryptionSteps = result.steps;
        this.displayResult();
        this.resultSection.style.display = 'block';
        setTimeout(() => this.resultSection.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    displayResult() {
        this.originalPasswordDisplay.textContent = this.originalPassword;
        this.encryptedPasswordDisplay.textContent = this.encryptedPassword;

        this.stepsContainer.innerHTML = '';
        this.encryptionSteps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = `
                <div class="step-number">📌 ${step.title}</div>
                <div class="step-description">${step.description}</div>
                <div class="step-code">${this.escapeHtml(step.details)}</div>
            `;
            this.stepsContainer.appendChild(stepElement);
        });

        this.displayDecryptionInstructions();
    }

    displayDecryptionInstructions() {
        this.decryptionStepsContainer.innerHTML = '';
        const instructions = this.getDecryptionInstructions();

        instructions.forEach(instruction => {
            const stepElement = document.createElement('div');
            stepElement.className = 'decryption-step';
            stepElement.innerHTML = instruction;
            this.decryptionStepsContainer.appendChild(stepElement);
        });
    }

    getDecryptionInstructions() {
        switch (this.currentMethod) {
            case 'cipher':
                const shift = parseInt(this.shiftValue.value);
                return [
                    `<strong>Passo 1:</strong> Pegue a senha criptografada: "${this.encryptedPassword}"`,
                    `<strong>Passo 2:</strong> Use o deslocamento inverso: ${26 - shift}`,
                    `<strong>Passo 3:</strong> Desloque cada letra para trás no alfabeto`,
                    `<strong>Passo 4:</strong> O resultado será a senha original: "${this.originalPassword}"`
                ];
            case 'reverse':
                return [
                    `<strong>Passo 1:</strong> Pegue a senha criptografada: "${this.encryptedPassword}"`,
                    `<strong>Passo 2:</strong> Inverta a ordem dos caracteres`,
                    `<strong>Passo 3:</strong> Leia de trás para frente`,
                    `<strong>Passo 4:</strong> O resultado será: "${this.originalPassword}"`
                ];
            case 'base64':
                return [
                    `<strong>Passo 1:</strong> Pegue o código Base64: "${this.encryptedPassword}"`,
                    `<strong>Passo 2:</strong> Decodifique com Base64`,
                    `<strong>Passo 3:</strong> Converta os bytes para texto`,
                    `<strong>Passo 4:</strong> O resultado será: "${this.originalPassword}"`
                ];
            case 'xor':
                return [
                    `<strong>Passo 1:</strong> Pegue o valor codificado: "${this.encryptedPassword}"`,
                    `<strong>Passo 2:</strong> Decodifique Base64 para obter os bytes`,
                    `<strong>Passo 3:</strong> Use a chave: "${this.xorKey}"`,
                    `<strong>Passo 4:</strong> Aplique XOR novamente com a mesma chave`,
                    `<strong>Passo 5:</strong> O resultado será: "${this.originalPassword}"`
                ];
            default:
                return [];
        }
    }

    handleDecrypt() {
        let decrypted;

        switch (this.currentMethod) {
            case 'cipher':
                decrypted = EncryptionEngine.caesarDecipher(this.encryptedPassword, parseInt(this.shiftValue.value)).encrypted;
                break;
            case 'reverse':
                decrypted = EncryptionEngine.reverseDecrypt(this.encryptedPassword);
                break;
            case 'base64':
                decrypted = EncryptionEngine.base64Decrypt(this.encryptedPassword);
                break;
            case 'xor':
                decrypted = EncryptionEngine.xorDecrypt(this.encryptedPassword, this.xorKey);
                break;
            default:
                decrypted = 'Erro';
        }

        this.decryptedPasswordDisplay.textContent = decrypted;
        this.decryptionResult.style.display = 'block';

        if (decrypted === this.originalPassword) {
            this.decryptedPasswordDisplay.style.color = '#10b981';
            alert('✅ Descriptografia bem-sucedida!');
        } else {
            this.decryptedPasswordDisplay.style.color = '#ef4444';
            alert('❌ Erro na descriptografia. Verifique a chave ou deslocamento.');
        }

        this.decryptionResult.scrollIntoView({ behavior: 'smooth' });
    }

    copyToClipboard(btn) {
        const targetId = btn.dataset.target;
        const text = document.getElementById(targetId).textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✅ Copiado!';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    }

    reset() {
        this.passwordInput.value = '';
        this.xorKeyInput.value = '';
        this.shiftValue.value = '3';
        this.shiftDisplay.textContent = '3';
        this.shiftValueText.textContent = '3';
        this.passwordInput.type = 'password';
        this.togglePasswordBtn.textContent = '👁️';

        this.currentMethod = null;
        this.originalPassword = null;
        this.encryptedPassword = null;
        this.encryptionSteps = [];
        this.xorKey = null;

        this.methodSection.style.display = 'none';
        this.shiftSection.style.display = 'none';
        this.keySection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.decryptionResult.style.display = 'none';

        this.methodButtons.forEach(btn => btn.classList.remove('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordEncryptor();
});
