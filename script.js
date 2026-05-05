// Shared JavaScript for Programming Quiz App and Number System Converter

// Detect which application is running
const isQuizApp = document.getElementById('start-screen') !== null;
const isConverterApp = document.getElementById('input-number') !== null;

// Initialize the appropriate application
document.addEventListener('DOMContentLoaded', function() {
    if (isQuizApp) {
        initializeQuizApp();
    } else if (isConverterApp) {
        initializeConverterApp();
    }
});

// ==================== NUMBER SYSTEM CONVERTER ====================

function initializeConverterApp() {
    // DOM Elements
    const inputNumber = document.getElementById('input-number');
    const fromSystem = document.getElementById('from-system');
    const toSystem = document.getElementById('to-system');
    const swapButton = document.getElementById('swap-systems');
    const resultBox = document.getElementById('result-box');
    const convertedResult = document.getElementById('converted-result');
    const stepsContainer = document.getElementById('steps-container');
    const errorMessage = document.getElementById('error-message');
    const quickButtons = document.querySelectorAll('.quick-btn');

    // Number system configurations
    const numberSystems = {
        binary: {
            name: 'Binary',
            base: 2,
            radix: 2,
            digits: '01',
            placeholder: 'Enter binary number (e.g., 1010)',
            validate: (num) => /^[01]+$/.test(num)
        },
        decimal: {
            name: 'Decimal',
            base: 10,
            radix: 10,
            digits: '0123456789',
            placeholder: 'Enter decimal number (e.g., 42)',
            validate: (num) => /^\d+(\.\d+)?$/.test(num)
        },
        octal: {
            name: 'Octal',
            base: 8,
            radix: 8,
            digits: '01234567',
            placeholder: 'Enter octal number (e.g., 52)',
            validate: (num) => /^[0-7]+$/.test(num)
        },
        hexadecimal: {
            name: 'Hexadecimal',
            base: 16,
            radix: 16,
            digits: '0123456789ABCDEF',
            placeholder: 'Enter hexadecimal number (e.g., 2A)',
            validate: (num) => /^[0-9A-F]+$/i.test(num)
        }
    };

    // Event Listeners
    inputNumber.addEventListener('input', handleConversion);
    fromSystem.addEventListener('change', () => {
        updatePlaceholder();
        handleConversion();
    });
    toSystem.addEventListener('change', handleConversion);
    swapButton.addEventListener('click', swapSystems);

    // Quick conversion buttons
    quickButtons.forEach(button => {
        button.addEventListener('click', () => {
            const from = button.dataset.from;
            const to = button.dataset.to;
            setSystems(from, to);
            handleConversion();
        });
    });

    // Update input placeholder based on selected system
    function updatePlaceholder() {
        const system = fromSystem.value;
        inputNumber.placeholder = numberSystems[system].placeholder;
    }

    // Swap from and to systems
    function swapSystems() {
        const from = fromSystem.value;
        const to = toSystem.value;

        fromSystem.value = to;
        toSystem.value = from;

        updatePlaceholder();
        handleConversion();
    }

    // Set specific systems for quick conversion
    function setSystems(from, to) {
        fromSystem.value = from;
        toSystem.value = to;
        updatePlaceholder();
    }

    // Main conversion handler
    function handleConversion() {
        const input = inputNumber.value.trim();
        const from = fromSystem.value;
        const to = toSystem.value;

        // Clear previous error
        errorMessage.textContent = '';

        if (!input) {
            showPlaceholder();
            return;
        }

        // Validate input for the selected number system
        if (!numberSystems[from].validate(input)) {
            showError(`Invalid ${numberSystems[from].name} number: ${input}`);
            return;
        }

        try {
            // Convert to decimal first, then to target system
            let decimalValue;
            let conversionSteps = [];

            if (from === 'decimal') {
                decimalValue = parseFloat(input);
                conversionSteps = generateDecimalSteps(input, to);
            } else {
                decimalValue = convertToDecimal(input, from);
                conversionSteps = generateConversionSteps(input, from, decimalValue, to);
            }

            // Convert from decimal to target system
            const result = convertFromDecimal(decimalValue, to);
            displayResult(result, conversionSteps);

        } catch (error) {
            showError('Conversion error: ' + error.message);
        }
    }

    // Convert any number system to decimal
    function convertToDecimal(number, fromSystem) {
        const system = numberSystems[fromSystem];

        if (fromSystem === 'decimal') {
            return parseFloat(number);
        }

        if (fromSystem === 'binary') {
            return parseInt(number, 2);
        }

        if (fromSystem === 'octal') {
            return parseInt(number, 8);
        }

        if (fromSystem === 'hexadecimal') {
            return parseInt(number, 16);
        }

        throw new Error('Unsupported number system');
    }

    // Convert from decimal to any number system
    function convertFromDecimal(decimal, toSystem) {
        if (toSystem === 'decimal') {
            return decimal.toString();
        }

        if (toSystem === 'binary') {
            return Math.floor(decimal).toString(2);
        }

        if (toSystem === 'octal') {
            return Math.floor(decimal).toString(8);
        }

        if (toSystem === 'hexadecimal') {
            return Math.floor(decimal).toString(16).toUpperCase();
        }

        throw new Error('Unsupported number system');
    }

    // Generate conversion steps for decimal input
    function generateDecimalSteps(input, toSystem) {
        const decimalValue = parseFloat(input);
        const steps = [];

        if (toSystem === 'binary') {
            steps.push({
                title: 'Decimal to Binary Conversion',
                content: `Original decimal: ${decimalValue}`
            });

            if (decimalValue === Math.floor(decimalValue)) {
                // Integer conversion
                steps.push({
                    title: 'Step 1: Divide by 2 and track remainders',
                    content: generateBinaryConversionSteps(Math.floor(decimalValue))
                });
            } else {
                // Float conversion (simplified)
                steps.push({
                    title: 'Decimal to Binary (Float)',
                    content: `Binary representation: ${decimalValue.toString(2)}`
                });
            }
        }
        else if (toSystem === 'octal') {
            steps.push({
                title: 'Decimal to Octal Conversion',
                content: `Original decimal: ${decimalValue}`
            });

            if (decimalValue === Math.floor(decimalValue)) {
                steps.push({
                    title: 'Step 1: Divide by 8 and track remainders',
                    content: generateOctalConversionSteps(Math.floor(decimalValue))
                });
            } else {
                steps.push({
                    title: 'Decimal to Octal (Float)',
                    content: `Octal representation: ${decimalValue.toString(8)}`
                });
            }
        }
        else if (toSystem === 'hexadecimal') {
            steps.push({
                title: 'Decimal to Hexadecimal Conversion',
                content: `Original decimal: ${decimalValue}`
            });

            if (decimalValue === Math.floor(decimalValue)) {
                steps.push({
                    title: 'Step 1: Divide by 16 and track remainders',
                    content: generateHexConversionSteps(Math.floor(decimalValue))
                });
            } else {
                steps.push({
                    title: 'Decimal to Hexadecimal (Float)',
                    content: `Hex representation: ${decimalValue.toString(16).toUpperCase()}`
                });
            }
        }

        return steps;
    }

    // Generate conversion steps for non-decimal input
    function generateConversionSteps(input, fromSystem, decimalValue, toSystem) {
        const steps = [];

        // Step 1: Convert to decimal
        steps.push({
            title: `Step 1: Convert ${numberSystems[fromSystem].name} to Decimal`,
            content: `${numberSystems[fromSystem].name}: ${input}`
        });

        if (fromSystem === 'binary') {
            steps.push({
                title: 'Binary to Decimal Calculation',
                content: generateBinaryToDecimalSteps(input)
            });
        } else if (fromSystem === 'octal') {
            steps.push({
                title: 'Octal to Decimal Calculation',
                content: generateOctalToDecimalSteps(input)
            });
        } else if (fromSystem === 'hexadecimal') {
            steps.push({
                title: 'Hexadecimal to Decimal Calculation',
                content: generateHexToDecimalSteps(input)
            });
        }

        steps.push({
            title: 'Decimal Value',
            content: `Decimal: ${decimalValue}`
        });

        // Step 2: Convert from decimal to target
        if (toSystem !== 'decimal') {
            steps.push({
                title: `Step 2: Convert Decimal to ${numberSystems[toSystem].name}`,
                content: `Decimal: ${decimalValue}`
            });

            if (toSystem === 'binary') {
                steps.push({
                    title: 'Decimal to Binary',
                    content: generateBinaryConversionSteps(decimalValue)
                });
            } else if (toSystem === 'octal') {
                steps.push({
                    title: 'Decimal to Octal',
                    content: generateOctalConversionSteps(decimalValue)
                });
            } else if (toSystem === 'hexadecimal') {
                steps.push({
                    title: 'Decimal to Hexadecimal',
                    content: generateHexConversionSteps(decimalValue)
                });
            }
        }

        return steps;
    }

    // Generate binary conversion steps
    function generateBinaryConversionSteps(decimal) {
        let steps = '';
        let n = Math.floor(decimal);
        if (n === 0) return '0';

        while (n > 0) {
            steps += `${n} ÷ 2 = ${Math.floor(n / 2)} remainder ${n % 2}\n`;
            n = Math.floor(n / 2);
        }

        return steps.trim();
    }

    // Generate octal conversion steps
    function generateOctalConversionSteps(decimal) {
        let steps = '';
        let n = Math.floor(decimal);
        if (n === 0) return '0';

        while (n > 0) {
            steps += `${n} ÷ 8 = ${Math.floor(n / 8)} remainder ${n % 8}\n`;
            n = Math.floor(n / 8);
        }

        return steps.trim();
    }

    // Generate hexadecimal conversion steps
    function generateHexConversionSteps(decimal) {
        let steps = '';
        let n = Math.floor(decimal);
        if (n === 0) return '0';

        const hexDigits = '0123456789ABCDEF';
        while (n > 0) {
            const remainder = n % 16;
            steps += `${n} ÷ 16 = ${Math.floor(n / 16)} remainder ${remainder} (${hexDigits[remainder]})\n`;
            n = Math.floor(n / 16);
        }

        return steps.trim();
    }

    // Generate binary to decimal steps
    function generateBinaryToDecimalSteps(binary) {
        let steps = '';
        const digits = binary.split('').reverse();

        for (let i = 0; i < digits.length; i++) {
            const value = parseInt(digits[i]) * Math.pow(2, i);
            steps += `${digits[i]} × 2^${i} = ${value}\n`;
        }

        return steps.trim();
    }

    // Generate octal to decimal steps
    function generateOctalToDecimalSteps(octal) {
        let steps = '';
        const digits = octal.split('').reverse();

        for (let i = 0; i < digits.length; i++) {
            const value = parseInt(digits[i]) * Math.pow(8, i);
            steps += `${digits[i]} × 8^${i} = ${value}\n`;
        }

        return steps.trim();
    }

    // Generate hexadecimal to decimal steps
    function generateHexToDecimalSteps(hex) {
        let steps = '';
        const digits = hex.split('').reverse();

        for (let i = 0; i < digits.length; i++) {
            const digitValue = parseInt(digits[i], 16);
            const value = digitValue * Math.pow(16, i);
            steps += `${digits[i]} (=${digitValue}) × 16^${i} = ${value}\n`;
        }

        return steps.trim();
    }

    // Display conversion result
    function displayResult(result, steps) {
        convertedResult.textContent = result;
        resultBox.classList.add('highlight');

        // Remove highlight after animation
        setTimeout(() => {
            resultBox.classList.remove('highlight');
        }, 1000);

        // Display conversion steps
        displaySteps(steps);
    }

    // Display conversion steps
    function displaySteps(steps) {
        stepsContainer.innerHTML = '';

        if (steps.length === 0) {
            stepsContainer.innerHTML = '<p class="steps-placeholder">No conversion steps available</p>';
            return;
        }

        steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';

            stepElement.innerHTML = `
                <div class="step-title">${step.title}</div>
                <div class="step-content">${step.content.replace(/\n/g, '<br>')}</div>
            `;

            stepsContainer.appendChild(stepElement);
        });
    }

    // Show placeholder when no input
    function showPlaceholder() {
        convertedResult.textContent = '-';
        stepsContainer.innerHTML = '<p class="steps-placeholder">Enter a number and select systems to see conversion steps</p>';
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        convertedResult.textContent = 'Error';
        stepsContainer.innerHTML = '<p class="steps-placeholder">Please correct the input to see conversion steps</p>';
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + / to swap systems
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            swapSystems();
        }

        // Enter to trigger conversion
        if (e.key === 'Enter' && document.activeElement === inputNumber) {
            handleConversion();
        }
    });

    // Auto-focus on input when page loads
    window.addEventListener('load', function() {
        inputNumber.focus();
    });

    // Initialize placeholder
    updatePlaceholder();
}
