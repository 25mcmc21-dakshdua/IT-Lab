$(document).ready(function() {
    // Country and state data
    const countryStates = {
        "USA": ["California", "Texas", "New York", "Florida", "Illinois", "Ohio"],
        "India": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal", "Telangana"],
        "UK": ["England", "Scotland", "Wales", "Northern Ireland"],
        "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
        "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
        "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
        "Singapore": ["Central", "North East", "North West", "South East", "South West"],
        "Malaysia": ["Selangor", "Johor", "Penang", "Perak", "Sabah", "Sarawak"]
    };

    // Form configuration with country first, then state
    const formConfig = [
        { 
            id: "fullName", 
            label: "Full Name", 
            type: "text", 
            placeholder: "Priya Patel", 
            validation: /^[a-zA-Z ]{3,50}$/, 
            error: "Name must be 3-50 letters",
            required: true,
            icon: "fa-user"
        },
        { 
            id: "email", 
            label: "Email Address", 
            type: "email", 
            placeholder: "priya@example.com", 
            validation: /^\S+@\S+\.\S+$/, 
            error: "Enter valid email",
            required: true,
            icon: "fa-envelope"
        },
        { 
            id: "mobile", 
            label: "Mobile Number", 
            type: "tel", 
            placeholder: "+91 98765 43210", 
            validation: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 
            error: "Enter valid mobile with country code",
            required: true,
            icon: "fa-phone"
        },
        { 
            id: "country", 
            label: "Country", 
            type: "select", 
            options: ["Select Country", "India", "USA", "UK", "Canada", "Australia", "UAE", "Singapore", "Malaysia"],
            error: "Select your country",
            required: true,
            icon: "fa-globe"
        },
        { 
            id: "state", 
            label: "State/Province", 
            type: "select", 
            options: [], // Will be populated based on country
            dependsOn: "country", // This field depends on country selection
            error: "Select your state",
            required: true,
            icon: "fa-map-marker-alt"
        },
        { 
            id: "city", 
            label: "City", 
            type: "text", 
            placeholder: "Enter your city", 
            validation: /^[a-zA-Z ]{2,50}$/, 
            error: "Enter valid city name",
            required: true,
            icon: "fa-city"
        },
        { 
            id: "pincode", 
            label: "Postal Code", 
            type: "text", 
            placeholder: "400001 or 10001", 
            validation: /^[a-zA-Z0-9\s-]{3,10}$/, 
            error: "Enter valid postal code",
            required: true,
            icon: "fa-location-dot"
        },
        { 
            id: "updates", 
            label: "Receive updates about Indian community events", 
            type: "checkbox",
            defaultChecked: true
        }
    ];

    const $form = $('#dynamicForm');

    // Build form
    formConfig.forEach(field => {
        const isHidden = field.dependsOn ? 'style="display:none;"' : '';
        
        if (field.type === 'checkbox') {
            $form.append(`
                <div class="mb-3" id="wrapper-${field.id}">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${field.id}" ${field.defaultChecked ? 'checked' : ''}>
                        <label class="form-check-label small" for="${field.id}">${field.label}</label>
                    </div>
                </div>
            `);
        } else {
            let options = '';
            if (field.type === 'select') {
                if (field.id === 'state' && field.options.length === 0) {
                    options = '<option value="">Select country first</option>';
                } else {
                    options = field.options.map(opt => 
                        `<option value="${opt}">${opt}</option>`
                    ).join('');
                    if (field.options.length > 0) {
                        options = '<option value="">Select ' + field.label + '</option>' + options;
                    }
                }
            }

            $form.append(`
                <div class="mb-3" id="wrapper-${field.id}" ${isHidden}>
                    <label class="form-label">${field.label} ${field.required ? '<span class="text-danger">*</span>' : ''}</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="fas ${field.icon} text-warning"></i>
                        </span>
                        ${field.type === 'select' 
                            ? `<select class="form-control" id="${field.id}">${options}</select>`
                            : `<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}">`
                        }
                    </div>
                    <div class="error-text" id="error-${field.id}">${field.error || ''}</div>
                </div>
            `);
        }
    });

    // Add register button
    $form.append('<button type="submit" class="btn-register mt-4">Register Now</button>');

    // Handle country change - populate states
    $('#country').on('change', function() {
        const selectedCountry = $(this).val();
        const $stateSelect = $('#state');
        const $stateWrapper = $('#wrapper-state');
        
        if (selectedCountry && countryStates[selectedCountry]) {
            // Populate state options
            let options = '<option value="">Select State</option>';
            countryStates[selectedCountry].forEach(state => {
                options += `<option value="${state}">${state}</option>`;
            });
            $stateSelect.html(options);
            $stateWrapper.slideDown(200);
        } else {
            // Hide state if no country or country without states
            $stateSelect.html('<option value="">Select country first</option>');
            $stateWrapper.slideUp(200);
        }
    });

    // Mobile number formatting (keep it simple)
    $('#mobile').on('input', function() {
        // Just remove special chars for validation, but keep display as typed
        let val = $(this).val();
        // Don't auto-format, just store as-is
    });

    // Form submission
    $form.on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        formConfig.forEach(field => {
            if (field.type === 'checkbox') return;
            
            // Skip hidden fields
            if ($(`#wrapper-${field.id}`).is(':hidden')) return;

            const $input = $(`#${field.id}`);
            const value = $input.val();

            // Check if required and empty
            if (field.required && (!value || value === '')) {
                $input.addClass('is-invalid');
                $(`#error-${field.id}`).show();
                isValid = false;
                return;
            }

            // Check validation pattern if exists
            if (field.validation && value) {
                const fieldValid = field.validation.test(value);
                if (!fieldValid) {
                    $input.addClass('is-invalid');
                    $(`#error-${field.id}`).show();
                    isValid = false;
                } else {
                    $input.removeClass('is-invalid').addClass('is-valid');
                    $(`#error-${field.id}`).hide();
                }
            } else if (value) {
                $input.removeClass('is-invalid').addClass('is-valid');
                $(`#error-${field.id}`).hide();
            }
        });

        if (isValid) {
            $('#successMessage').removeClass('d-none').fadeIn();
            
            // Collect form data
            const formData = {};
            formConfig.forEach(field => {
                if (field.type === 'checkbox') {
                    formData[field.id] = $(`#${field.id}`).is(':checked');
                } else {
                    formData[field.id] = $(`#${field.id}`).val();
                }
            });
            
            console.log('Global Indian Registration:', formData);
            
            // Show success and reset
            setTimeout(() => {
                $form[0].reset();
                $('.form-control, .form-select').removeClass('is-valid is-invalid');
                $('#successMessage').fadeOut();
                $('#wrapper-state').hide();
                $('#state').html('<option value="">Select country first</option>');
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = $('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 100
                }, 500);
            }
        }
    });

    // Clear errors on input
    $('input, select').on('input change', function() {
        $(this).removeClass('is-invalid');
        $(`#error-${$(this).attr('id')}`).hide();
    });
});