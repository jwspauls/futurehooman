// script.js - FUTUREHOOMAN.COM - Iron Giant Eyes Mk I - Revision 2
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const eyeLeft = document.getElementById('eyeLeft');
    const eyeRight = document.getElementById('eyeRight');
    const eyes = [eyeLeft, eyeRight];
    const logoPartsToDim = [
        document.querySelector('.logo-future'),
        document.querySelector('.logo-h'),
        document.querySelector('.logo-man')
    ];

    const statusFeed = document.getElementById('statusFeed');
    const intakeForm = document.getElementById('intakeForm');
    const designationInput = document.getElementById('designationInput');
    const stylizedWhisper = document.getElementById('stylizedWhisper');
    const submitButton = document.getElementById('submitButton');
    const postSubmissionFeed = document.getElementById('postSubmissionFeed');
    const loreRevealSection = document.getElementById('loreRevealSection');

    let currentSystemColor = getComputedStyle(root).getPropertyValue('--color-text-megrim').trim();
    let isScanningOrEvaluating = false;

    document.addEventListener('mousemove', (e) => {
        if (isScanningOrEvaluating || eyes.some(eye => eye.classList.contains('focused-on-input'))) return; // Don't track if scanning/evaluating or eyes are focused on input

        eyes.forEach(eye => {
            if (!eye) return;
            const pupil = eye.querySelector('.eye-pupil');
            const rect = eye.getBoundingClientRect();
            // Adjust calculations if pupil is not perfectly centered initially by CSS
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;
            const deltaX = e.pageX - eyeCenterX;
            const deltaY = e.pageY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const maxOffsetHorizontal = (rect.width / 2) - (pupil.offsetWidth / 2) - (eye.clientLeft * 2); // Factor in border
            const maxOffsetVertical = (rect.height / 2) - (pupil.offsetHeight / 2) - (eye.clientTop * 2); // Factor in border
            
            // Apply a limit to prevent pupil from leaving the eye
            const moveX = Math.max(-maxOffsetHorizontal, Math.min(maxOffsetHorizontal, Math.cos(angle) * rect.width * 0.20)); // Reduced factor
            const moveY = Math.max(-maxOffsetVertical, Math.min(maxOffsetVertical, Math.sin(angle) * rect.height * 0.20)); // Reduced factor

            pupil.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        });
    });

    const preEvaluationPhases = [ /* (Same as previous version) */
        { msg: "INITIATING SUBJECT INTERFACE...", color: 'var(--color-text-megrim)', eyeState: 'default', delay: 1200, speed: 70 },
        { msg: "COMMENCING RESONANCE SCAN...", color: 'var(--color-megrim-scanning)', eyeState: 'scanning', delay: 2200, speed: 65 },
        { msg: "ANALYZING TEMPORAL SIGNATURE...", color: 'var(--color-megrim-scanning)', eyeState: 'scanning', delay: 2000, speed: 60 },
        { msg: "EVALUATING PSYCHIC IMPRINT...", color: 'var(--color-megrim-evaluating)', eyeState: 'evaluating', delay: 2500, speed: 55 },
        { msg: "CANDIDATE PROFILE: RESONANCE CONFIRMED.", color: 'var(--color-megrim-accepted)', eyeState: 'default', delay: 1000, speed: 70 },
        { msg: "RESONANCE KEY REQUIRED. AWAITING INPUT.", color: 'var(--color-megrim-accepted)', eyeState: 'default', delay: 800, speed: 70 }
    ];
    const whispers = [ /* (Same as previous version) */
        "...signal integrity nominal...", "...pattern acquisition in progress...",
        "...cross-referencing designation syntax...", "...memetic filters active...",
        "...resonance harmonics stabilizing...", "...awaiting full sequence..."
    ];
    const loreSnippets = [ /* (Same as previous version) */
        "//:PHX_DATASTREAM_INTERCEPT_7.3 // SOURCE: UNKNOWN // USER_CLEARED_FOR_LVL_GAMMA_ACCESS",
        "//:FHEELS_NETWORK_PING_DETECTED // CORRELATION: [RESONANCE_KEY] // STATUS: MONITORING",
        "//:iFLU_MEMETIC_HAZARD_ADVISORY // PROTOCOL_3B_ENGAGED // THREAT_LEVEL: NOMINAL_FOR_ACCEPTED_CANDIDATES",
        "//:USER_SIGNATURE_ARCHIVED // FURTHER_DIRECTIVES_PENDING_NEXT_CONTACT_WINDOW"
    ];

    let currentPhaseIndex = 0;
    let whisperTimeout;

    function typeMessage(element, text, targetColor, callback, speed = 70) { /* (Same as before) */
        element.innerHTML = ''; let i = 0; currentSystemColor = targetColor; element.style.color = targetColor;
        function type() {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + `<span class="typing-underscore" style="color:${currentSystemColor};">_</span>`;
                i++; setTimeout(type, speed);
            } else { element.innerHTML = text; if (callback) callback(); }
        } type();
    }
    const underscoreStyle = document.createElement('style'); /* (Same as before) */
    underscoreStyle.innerHTML = `@keyframes blinkUnderscore { 50% { opacity: 0; } } .typing-underscore { display: inline-block; animation: blinkUnderscore 0.7s infinite step-end; }`;
    document.head.appendChild(underscoreStyle);

    function updateEyeState(state) {
        isScanningOrEvaluating = (state === 'scanning' || state === 'evaluating');
        eyes.forEach(eye => {
            if (!eye) return;
            const pupil = eye.querySelector('.eye-pupil');
            // Reset pupil transform if not actively being controlled by mousemove for specific states
            if (isScanningOrEvaluating || state === 'focused-on-input' || state === 'power-down' || state === 'standby') {
                 if (pupil) pupil.style.transform = 'translate(-50%, -50%) scale(1)'; // Re-center if state takes over
            } else if (pupil) {
                // For default state, ensure it's ready for mouse tracking (may need initial centering depending on CSS)
                 pupil.style.transform = 'none'; // Or 'translate(-50%, -50%)' if CSS doesn't center it
            }


            eye.classList.remove('scanning', 'evaluating', 'focused-on-input', 'power-down', 'standby', 'default');
             // Add 'default' class for explicit default styling if needed, or just remove others
            if (state !== 'default') { // 'default' could be the absence of other classes
                eye.classList.add(state);
            } else {
                 eye.classList.add('default'); // Add if you have specific .default styles
            }
        });
        logoPartsToDim.forEach(part => {
            if (!part) return;
            if (isScanningOrEvaluating) {
                part.classList.add('logo-dimmed');
            } else {
                part.classList.remove('logo-dimmed');
            }
        });
    }

    async function processPreEvaluationSequence() {
        if (currentPhaseIndex < preEvaluationPhases.length) {
            const phase = preEvaluationPhases[currentPhaseIndex];
            updateEyeState(phase.eyeState);
            typeMessage(statusFeed, phase.msg, phase.color, async () => {
                await new Promise(resolve => setTimeout(resolve, phase.delay));
                currentPhaseIndex++;
                processPreEvaluationSequence();
            }, phase.speed);
        } else {
            updateEyeState('default');
            intakeForm.style.display = 'flex'; // Make sure display is flex
            setTimeout(() => { // Delay opacity for transition
                intakeForm.classList.add('visible');
                designationInput.focus();
            }, 50);
        }
    }

    designationInput.addEventListener('focus', () => {
        if (!isScanningOrEvaluating) updateEyeState('focused-on-input');
    });
    designationInput.addEventListener('blur', () => {
        if (!isScanningOrEvaluating && !intakeForm.contains(document.activeElement)) { // Only blur if focus is truly outside form
            updateEyeState('default');
        }
    });
    designationInput.addEventListener('input', () => { /* (Same whisper logic as before) */
        clearTimeout(whisperTimeout); stylizedWhisper.classList.remove('active'); stylizedWhisper.style.opacity = '0';
        if (designationInput.value.length > 2) {
            stylizedWhisper.textContent = whispers[Math.floor(Math.random() * whispers.length)];
            stylizedWhisper.style.color = 'var(--color-megrim-whisper)';
            stylizedWhisper.style.opacity = '1'; void stylizedWhisper.offsetWidth;
            stylizedWhisper.classList.add('active');
            whisperTimeout = setTimeout(() => {
                stylizedWhisper.style.opacity = '0'; stylizedWhisper.classList.remove('active');
            }, 2500);
        }
    });

    intakeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userResonanceKey = designationInput.value;
        submitButton.disabled = true; submitButton.textContent = 'VERIFYING...';
        stylizedWhisper.style.opacity = '0';
        updateEyeState('evaluating'); // Eyes show processing as "OO"s

        intakeForm.classList.remove('visible');
        await new Promise(resolve => setTimeout(resolve, parseFloat(getComputedStyle(intakeForm).transitionDuration) * 1000 + 50)); // Wait for opacity transition
        intakeForm.style.display = 'none'; // Then set display to none
        
        postSubmissionFeed.style.display = 'block';

        typeMessage(postSubmissionFeed, "RESONANCE KEY SUBMITTED. VALIDATING ECHO INTEGRITY...", 'var(--color-megrim-evaluating)', async () => {
            await new Promise(resolve => setTimeout(resolve, 2800));
            const simulatedSuccess = true;

            if (simulatedSuccess) {
                typeMessage(postSubmissionFeed, "ECHO VALIDATED. CONNECTION ESTABLISHED. DECRYPTING ARCHIVE FRAGMENTS...", 'var(--color-megrim-accepted)', async () => {
                    updateEyeState('power-down');
                    await new Promise(resolve => setTimeout(resolve, 1200));
                    postSubmissionFeed.style.display = 'none';
                    loreRevealSection.style.display = 'block';
                    setTimeout(() => loreRevealSection.classList.add('visible'), 50);

                    loreRevealSection.innerHTML = `<h2 class="lore-header sr-only">[Decrypted Archive Fragments]</h2>`;
                    for (let i = 0; i < loreSnippets.length; i++) {
                        const snippetText = loreSnippets[i].replace('[RESONANCE_KEY]', userResonanceKey);
                        const p = document.createElement('p');
                        p.className = 'lore-item';
                        p.textContent = snippetText;
                        loreRevealSection.appendChild(p);
                        console.log('Appending lore item:', p);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        p.classList.add('visible');
                        console.log('Making lore item visible:', p);
                        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
                    }
                });
            } else { /* (Same error handling as before) */
                typeMessage(postSubmissionFeed, "TRANSMISSION ERROR. ECHO CORRUPTED. RE-INITIATE.", 'var(--color-megrim-error)', () => {
                    updateEyeState('default'); submitButton.disabled = false; submitButton.textContent = 'INITIATE_ECHO';
                    setTimeout(() => {
                        postSubmissionFeed.style.display = 'none'; statusFeed.innerHTML = '';
                        currentPhaseIndex = 0; processPreEvaluationSequence();
                    }, 3000);
                });
            }
        });
    });
    
    // Initial call
    processPreEvaluationSequence();
});