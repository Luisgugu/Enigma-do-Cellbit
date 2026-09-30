/**
 * Encryption Methods Library
 */
class EncryptionEngine {
    static caesarCipher(text, shift = 3) {
        const steps = [];
        let result = '';

        steps.push({
            title: 'Informações',
            description: `Usando Caesar Cipher com deslocamento de ${shift} posições`,
            details: `Cada letra será deslocada ${shift} casas para a frente no alfabeto.`
        });

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let charTable = 'Mapeamento de caracteres: ';
        for (let i = 0; i < Math.min(5, alphabet.length); i++) {
            const original = alphabet[i];
            const shifted = alphabet[(i + shift) % 26];
            charTable += `${original} → ${shifted}, `;
        }
        charTable += '...';

        steps.push({
            title: 'Tabela de Conversão',
            description: charTable,
            details: 'Este é o padrão que será aplicado a cada letra'
        });

        result = text.split('').map((char, index) => {
            if (/[a-z]/.test(char)) {
                const charCode = char.charCodeAt(0) - 97;
                return String.fromCharCode(((charCode + shift) % 26) + 97);
            } else if (/[A-Z]/.test(char)) {
                const charCode = char.charCodeAt(0) - 65;
                return String.fromCharCode(((charCode + shift) % 26) + 65);
            } else if (/[0-9]/.test(char)) {
                const charCode = char.charCodeAt(0) - 48;
                return String.fromCharCode(((charCode + shift) % 10) + 48);
            }
            return char;
        }).join('');

        steps.push({
            title: 'Resultado Final',
            description: `Senha original: ${text}`,
            details: `Senha criptografada: ${result}`
        });

        return { encrypted: result, steps };
    }

    static reverseCipher(text) {
        const steps = [];

        steps.push({
            title: 'Método: Reverso',
            description: 'A senha será invertida completamente',
            details: 'Cada caractere será lido de trás para frente'
        });

        const reversed = text.split('').reverse().join('');

        steps.push({
            title: 'Resultado Final',
            description: `Senha original: ${text}`,
            details: `Senha criptografada: ${reversed}`
        });

        return { encrypted: reversed, steps };
    }

    static base64Encrypt(text) {
        const steps = [];
        const encoded = btoa(text);

        steps.push({
            title: 'Método: Base64',
            description: 'Convertendo a senha para Base64',
            details: 'Base64 usa 64 caracteres para representar os dados'
        });

        steps.push({
            title: 'Resultado Final',
            description: `Senha original: ${text}`,
            details: `Senha codificada: ${encoded}`
        });

        return { encrypted: encoded, steps };
    }

    static base64Decrypt(text) {
        try {
            return atob(text);
        } catch (e) {
            return 'Erro: String Base64 inválida';
        }
    }

    static xorCipher(text, key) {
        const steps = [];
        const safeKey = key || 'SECRET';

        steps.push({
            title: 'Método: XOR',
            description: `Usando chave: "${safeKey}"`,
            details: 'Operação XOR bit-a-bit entre cada caractere e a chave'
        });

        let expandedKey = '';
        for (let i = 0; i < text.length; i++) {
            expandedKey += safeKey[i % safeKey.length];
        }

        const encrypted = text.split('').map((char, i) => {
            const charCode = char.charCodeAt(0);
            const keyCode = expandedKey.charCodeAt(i);
            return String.fromCharCode(charCode ^ keyCode);
        }).join('');

        const encoded = btoa(encrypted);

        steps.push({
            title: 'Resultado Final',
            description: `Senha original: ${text}`,
            details: `Senha criptografada (Base64): ${encoded}`
        });

        return { encrypted: encoded, steps, key: safeKey };
    }

    static xorDecrypt(text, key) {
        try {
            const safeKey = key || 'SECRET';
            const encrypted = atob(text);
            let expandedKey = '';

            for (let i = 0; i < encrypted.length; i++) {
                expandedKey += safeKey[i % safeKey.length];
            }

            return encrypted.split('').map((char, i) => {
                const charCode = char.charCodeAt(0);
                const keyCode = expandedKey.charCodeAt(i);
                return String.fromCharCode(charCode ^ keyCode);
            }).join('');
        } catch (e) {
            return 'Erro ao descriptografar';
        }
    }

    static reverseDecrypt(text) {
        return text.split('').reverse().join('');
    }

    static caesarDecipher(text, shift = 3) {
        return this.caesarCipher(text, 26 - shift);
    }
}
