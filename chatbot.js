document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbot = document.getElementById('chatbot');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // State management
    let reservationStep = 'initial';
    let reservationData = {};

    // --- Event Listeners ---

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', () => {
        chatbot.classList.toggle('active');
        if (chatbot.classList.contains('active') && reservationStep === 'initial') {
            // Greet the user on first open
            setTimeout(() => {
                addBotMessage("¡Hola! Soy tu asistente virtual. ¿Te gustaría reservar una prueba de conducción?");
            }, 500);
        }
    });

    // Open chatbot from CTA button on landing page
    const ctaButton = document.getElementById('cta-open-chatbot');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            chatbot.classList.add('active');
            // Ensure chat is visible before sending a message
            setTimeout(() => {
                if (reservationStep === 'initial') {
                    addBotMessage("¡Hola! Veo que quieres agendar una prueba.");
                    // Automatically start the reservation process
                    setTimeout(startReservation, 1000);
                }
            }, 300);
        });
    }

    // Send message on button click
    sendButton.addEventListener('click', handleUserInput);

    // Send message on Enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // --- Core Functions ---

    function handleUserInput() {
        const message = userInput.value.trim();
        if (message === '') return;

        addUserMessage(message);
        userInput.value = '';

        // Show typing indicator and process message
        showTypingIndicator();
        setTimeout(() => {
            processMessage(message);
        }, 1000);
    }

    function processMessage(message) {
        hideTypingIndicator();
        const lowerMessage = message.toLowerCase();

        // Handle conversation flow based on the current step
        switch (reservationStep) {
            case 'initial':
                handleInitialIntent(lowerMessage);
                break;
            case 'askName':
                reservationData.name = message;
                askForPhone();
                break;
            case 'askPhone':
                if (validatePhone(message)) {
                    reservationData.phone = message;
                    askForDate();
                } else {
                    addBotMessage("Por favor, ingresa un número de teléfono válido (ej. 123-456-7890).");
                }
                break;
            case 'askDate':
                reservationData.date = message;
                askForTime();
                break;
            case 'askTime':
                reservationData.time = message;
                confirmReservation();
                break;
            case 'confirmed':
                handleAfterConfirmation(lowerMessage);
                break;
            default:
                handleGeneralQueries(lowerMessage);
        }
    }

    // --- Conversation Flow ---

    function handleInitialIntent(lowerMessage) {
        if (lowerMessage.includes('si') || lowerMessage.includes('me gustaria') || lowerMessage.includes('ok')) {
            startReservation();
        } else if (lowerMessage.includes('hola') || lowerMessage.includes('buenos')) {
            addBotMessage("¡Hola! ¿Listo para agendar tu prueba de conducción?");
        } else if (lowerMessage.includes('adiós') || lowerMessage.includes('gracias')) {
            addBotMessage("¡De nada! Estoy aquí si me necesitas. ¡Que tengas un buen día!");
        } else {
            addBotMessage("Lo siento, mi única función es ayudarte a reservar una prueba de conducción. ¿Te gustaría hacerlo?");
        }
    }

    function startReservation() {
        addBotMessage("¡Excelente! Empecemos. Por favor, dime tu nombre completo.");
        reservationStep = 'askName';
    }

    function askForPhone() {
        addBotMessage(`Gracias, ${reservationData.name}. Ahora, ¿cuál es tu número de teléfono?`);
        reservationStep = 'askPhone';
    }

    function askForDate() {
        addBotMessage("Perfecto. ¿Qué día te gustaría venir? (ej. 'mañana', 'viernes', '25 de diciembre')");
        reservationStep = 'askDate';
    }

    function askForTime() {
        addBotMessage("¿Y a qué hora te viene bien?");
        reservationStep = 'askTime';
    }

    function confirmReservation() {
        // Crear el mensaje para WhatsApp
        const whatsappMessage = `¡Hola! Tengo una nueva reserva para prueba de conducción:

📋 *DETALLES DE LA RESERVA*
────────────────────
👤 *Nombre:* ${reservationData.name}
📞 *Teléfono:* ${reservationData.phone}
📅 *Fecha:* ${reservationData.date}
⏰ *Hora:* ${reservationData.time}
────────────────────
*Por favor confirmar la cita.*`;

        // Codificar el mensaje para la URL de WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Usar api.whatsapp.com para envío automático
        const whatsappUrl = `https://api.whatsapp.com/send?phone=59163871286&text=${encodedMessage}`;
        
        const confirmationHtml = `
            <div class="confirmation">
                <strong>Reserva completada:</strong><br>
                - <strong>Nombre:</strong> ${reservationData.name}<br>
                - <strong>Teléfono:</strong> ${reservationData.phone}<br>
                - <strong>Fecha:</strong> ${reservationData.date}<br>
                - <strong>Hora:</strong> ${reservationData.time}
            </div>
            <p>¡Perfecto! Tu reserva ha sido registrada. Para confirmarla, haz clic en el siguiente enlace:</p>
            <div class="whatsapp-link-container">
                <a href="${whatsappUrl}" target="_blank" class="whatsapp-link">
                    📱 Confirmar reserva por WhatsApp
                </a>
            </div>
            <p><em>Al hacer clic se abrirá WhatsApp con el mensaje listo para enviar. Solo debes presionar el botón de enviar.</em></p>
            <p>Un asesor confirmará tu cita por teléfono en breve. ¿Necesitas algo más?</p>
        `;
        addBotMessage(confirmationHtml);
        reservationStep = 'confirmed';

        // Enviar datos al servidor (simulado)
        console.log("Enviando reserva:", reservationData);
        // Aquí iría una llamada fetch() a un endpoint real.
        // fetch('/api/reservations', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(reservationData)
        // });
    }

    function handleAfterConfirmation(lowerMessage) {
        if (lowerMessage.includes('no') || lowerMessage.includes('eso es todo')) {
            addBotMessage("¡Perfecto! Ha sido un placer ayudarte. ¡Nos vemos pronto!");
            resetConversation();
        } else {
            addBotMessage("Puedes preguntar sobre otra reserva o despedirte. ¿Qué te gustaría hacer?");
        }
    }
    
    function handleGeneralQueries(lowerMessage) {
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos')) {
            addBotMessage("¡Hola de nuevo! ¿Necesitas ayuda con tu reserva?");
        } else if (lowerMessage.includes('adiós') || lowerMessage.includes('gracias')) {
            addBotMessage("¡De nada! Que tengas un excelente día.");
            resetConversation();
        } else {
            addBotMessage("Disculpa, solo puedo gestionar reservas. ¿Quieres agendar una prueba de conducción?");
            reservationStep = 'initial';
        }
    }

    function resetConversation() {
        reservationStep = 'initial';
        reservationData = {};
    }

    // --- UI Helpers ---

    function addMessage(content, type, isHtml = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${type}-message`);
        if (isHtml) {
            messageElement.innerHTML = content;
        } else {
            messageElement.textContent = content;
        }
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function addBotMessage(content) {
        addMessage(content, 'bot', content.includes('<div'));
    }

    function addUserMessage(content) {
        addMessage(content, 'user');
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = chatMessages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Validation ---

    function validatePhone(phone) {
        // Simple validation for phone numbers (allows digits, hyphens, spaces)
        const phoneRegex = /^[0-9\s-]{7,15}$/;
        return phoneRegex.test(phone);
    }
});