document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
    // Contact Person Toggle Logic
    const toggleBtn = document.getElementById('toggleContactPersonBtn');
    const detailsSection = document.getElementById('contactPersonDetails');
    
    if(toggleBtn && detailsSection) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = !detailsSection.classList.contains('show');
            if (isHidden) {
                detailsSection.classList.add('show');
                toggleBtn.innerHTML = '&minus; Hide Contact Person Details';
                toggleBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                toggleBtn.style.color = '#ffffff';
                toggleBtn.style.borderColor = '#ffffff';
            } else {
                detailsSection.classList.remove('show');
                toggleBtn.innerHTML = '+ Add Contact Person Details';
                toggleBtn.style.background = '';
                toggleBtn.style.color = '';
                toggleBtn.style.borderColor = '';
            }
        });
    }

    // Other Option Logic for Dropdowns
    const designationSelect = document.getElementById('designation');
    const otherDesignationInput = document.getElementById('otherDesignation');
    if (designationSelect && otherDesignationInput) {
        designationSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                otherDesignationInput.style.display = 'block';
                otherDesignationInput.required = true;
            } else {
                otherDesignationInput.style.display = 'none';
                otherDesignationInput.required = false;
                otherDesignationInput.value = '';
            }
        });
    }

    const specialtySelect = document.getElementById('specialty');
    const otherSpecialtyInput = document.getElementById('otherSpecialty');
    if (specialtySelect && otherSpecialtyInput) {
        specialtySelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                otherSpecialtyInput.style.display = 'block';
                otherSpecialtyInput.required = true;
            } else {
                otherSpecialtyInput.style.display = 'none';
                otherSpecialtyInput.required = false;
                otherSpecialtyInput.value = '';
            }
        });
    }

    // Add micro-interactions to inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            const group = e.target.closest('.form-group');
            if (group) {
                group.style.transform = 'translateY(-2px)';
                group.style.transition = 'transform 0.3s ease';
            }
        });
        
        input.addEventListener('blur', (e) => {
            const group = e.target.closest('.form-group');
            if (group) {
                group.style.transform = 'translateY(0)';
            }
        });
    });

    // Consent Read More Toggle
    const readMoreBtn = document.getElementById('readMoreConsent');
    const readLessBtn = document.getElementById('readLessConsent');
    const consentSummary = document.querySelector('.consent-summary');
    const consentFull = document.querySelector('.consent-full');

    if (readMoreBtn && readLessBtn) {
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            consentSummary.style.display = 'none';
            consentFull.style.display = 'inline';
        });

        readLessBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            consentFull.style.display = 'none';
            consentSummary.style.display = 'inline';
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation check
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim() && field.type !== 'checkbox') {
                isValid = false;
                field.classList.add('shake');
                field.style.borderColor = 'var(--error-color)';
                setTimeout(() => field.classList.remove('shake'), 500);
            } else if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                const container = field.closest('.checkbox-container');
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 500);
            } else {
                field.style.borderColor = 'var(--input-border)';
            }
        });

        if (isValid) {
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.querySelector('span').innerText;
            
            btn.querySelector('span').innerText = 'Submitting...';
            btn.style.pointerEvents = 'none';
            
            // Prepare form data
            const formData = new FormData(form);
            
            // Override 'Other' selections with the custom text input values
            if (formData.get('designation') === 'Other' && formData.get('otherDesignation')) {
                formData.set('designation', formData.get('otherDesignation'));
            }
            if (formData.get('specialty') === 'Other' && formData.get('otherSpecialty')) {
                formData.set('specialty', formData.get('otherSpecialty'));
            }
            
            // Your deployed Google Apps Script URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoWDlKNuAUFn8eYu5s9bj1KsBUtYxkAjy_urtL6yFYCwc2CMYNlaZxt4BB7ZKjLUPh9Q/exec';
            
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
                // Simulation if URL is not configured
                setTimeout(() => {
                    form.reset();
                    btn.querySelector('span').innerText = 'Request Submitted!';
                    btn.style.background = '#10b981'; // Success green
                    
                    setTimeout(() => {
                        btn.querySelector('span').innerText = originalText;
                        btn.style.background = ''; // Reset
                        btn.style.pointerEvents = 'auto';
                    }, 3000);
                }, 1500);
                console.warn('Please update the GOOGLE_SCRIPT_URL in script.js to connect to Google Sheets.');
                return;
            }

            // Actual Google Sheets Submission (Optimistic fast UI update)
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(error => console.error('Error in background submission:', error));
            
            // Instantly show success without waiting for Google Apps Script to finish
            form.reset();
            btn.querySelector('span').innerText = 'Request Submitted!';
            btn.style.background = '#10b981'; // Success green
            
            setTimeout(() => {
                btn.querySelector('span').innerText = originalText;
                btn.style.background = ''; // Reset
                btn.style.pointerEvents = 'auto';
            }, 3000);
        }
    });
});
