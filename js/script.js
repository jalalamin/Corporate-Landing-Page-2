//Preloader
function myFunction() {
	var preloader = document.getElementById("loading");
	preloader.style.display = "none";
}


// Navbar
const navSlide = () => {
	const burger = document.querySelector(".burger");
	const nav = document.querySelector(".nav-links");
	const navLinks = document.querySelectorAll(".nav-links li");

	burger.addEventListener("click", () => {
		nav.classList.toggle("nav-active");
		burger.classList.toggle("toggle");
	})
}
navSlide();


// Nav Nav Tabs
var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabPanel");

function showPanel(panelIndex, colorCode) {
	tabButtons.forEach(function(node) {
		node.style.backgroundColor = "";
		node.style.color = "";
	});
	tabButtons[panelIndex].style.backgroundColor = colorCode;
	tabButtons[panelIndex].style.color = "white";

	tabPanels.forEach(function(node) {
		node.style.display = "none";
	});
	tabPanels[panelIndex].style.display = "block";
	//tabPanels[panelIndex].style.backgroundColor = colorCode;
}
showPanel(0, '#84ba3f');




//Simple accordion created in pure Javascript.
(function(window) {

    'use strict';

    let uniqueId = 0;

    /**
     * Core
     * @param {string} selector = container in which the script will be initialized
     * @param {object} userOptions = options defined by user
     */
    const Accordion = function(selector, userOptions) {
        
        const ac = {
            /**
             * Init accordion
             */
            init() {
                // Defaults 
                const defaults = {
                    duration: 600, // animation duration in ms {number}
                    itemNumber: 0, // item number which will be shown {number}
                    aria: true, // add ARIA elements to the HTML structure {boolean}
                    closeOthers: true, // show only one element at the same time {boolean}
                    showItem: false, // always show element that has itemNumber number {boolean}
                    elementClass: 'ac', // element class {string}
                    questionClass: 'ac-q', // question class {string}
                    answerClass: 'ac-a', // answer class {string}
                    targetClass: 'ac-target', // target class {string}
                    callFunction: () => {} // calls when toggling item {function}
                };

                this.options = extendDefaults(defaults, userOptions);
                this.container = document.querySelector(selector);
                this.elements = this.container.querySelectorAll('.' + this.options.elementClass);
                const length = this.elements.length;

                // Set ARIA
                if (this.options.aria) {
                    this.container.setAttribute('role', 'tablist');
                }

                // For each element
                for (let i = 0; i < length; i++) {

                    const element = this.elements[i];

                    this.hideElement(element);
                    this.setTransition(element);
                    this.generateID(element);

                    // Set ARIA
                    if (this.options.aria) {
                        this.setARIA(element);
                    }

                    // On press Enter
                    element.addEventListener('keydown', (event) => {
                        if (event.keyCode == 13) {
                            this.callEvent(i, event);
                        }
                    });  

                    // On click
                    element.addEventListener('click', (event) => {
                        this.callEvent(i, event);
                    });
                }

                this.resize();
            },

            /**
             * Hide element
             * @param {object} element = list item
             */
            hideElement(element) {
                const answer = element.querySelector('.' + this.options.answerClass);
                answer.style.height = 0; 
            },

            /**
             * Set transition 
             * @param {object} element = current element
             */
            setTransition(element) {
                const el = element.querySelector('.' + this.options.answerClass);
                const transition = isWebkit('transition');

                el.style[transition] = this.options.duration + 'ms';
            },

            /**
             * Generate unique ID for each element
             * @param {object} element = list item
             */
            generateID(element) {
                element.setAttribute('id', `ac-${uniqueId}`);
                uniqueId++;
            },

            /**
             * Create ARIA
             * @param {object} element = list item
             */
            setARIA(element) {
                const question = element.querySelector('.' + this.options.questionClass);
                const answer = element.querySelector('.' + this.options.answerClass);

                question.setAttribute('role', 'tab');
                question.setAttribute('aria-expanded', 'false');
                answer.setAttribute('role', 'tabpanel'); 
            },

            /**
             * Update ARIA
             * @param {object} element = list item
             * @param {boolean} value = value of the attribute
             */
            updateARIA(element, value) {
                const question = element.querySelector('.' + this.options.questionClass);
                question.setAttribute('aria-expanded', value);       
            },

            /**
             * Call event
             * @param {number} index = item index
             * @param {object} event = event type
             */
            callEvent(index, event) {
                const target = event.target.className;

                // Check if target has one of the classes
                if (target.match(this.options.questionClass) || target.match(this.options.targetClass)) {

                    event.preventDefault();

                    if (this.options.closeOthers) {
                        this.closeAllElements(index);
                    }

                    this.toggleElement(this.elements[index]);
                }  
            },

            /** 
             * Toggle current element
             * @param {object} element = current element
             * @param {boolean} animation = turn on animation
             */
            toggleElement(element, animation = true) {
                const answer = element.querySelector('.' + this.options.answerClass);
                const height = answer.scrollHeight;
                let ariaValue;

                // Toggle class
                element.classList.toggle('active');

                // Open element without animation
                if (!animation) {
                    answer.style.height = 'auto';
                }

                // Set height
                if (parseInt(answer.style.height) > 0) {
                    ariaValue = false;

                    requestAnimationFrame(() => {
                        answer.style.height = 0;
                    });
                } else {
                    ariaValue = true;

                    requestAnimationFrame(() => {
                        answer.style.height = height + 'px';
                    });
                }
            },

            /**
             * Close all elements without the current element
             * @param {number} current = current element
             */
            closeAllElements(current) {
                const length = this.elements.length;

                for (let i = 0; i < length; i++) {
                    if (i != current) {
                        const element = this.elements[i];

                        // Remove active class
                        if (element.classList.contains('active')) {
                            element.classList.remove('active');
                        }

                        // Update ARIA
                        if (this.options.aria) {
                            this.updateARIA(element, false);
                        }

                        this.hideElement(element);
                    }
                }   
            },

            /**
             * Calculate the slider when changing the window size
             */
            resize() {
                window.addEventListener('resize', () => {
                    this.changeHeight();
                });
            }
        };

        /**
         * Get supported property and add webkit prefix if needed
         * @param {string} property = property name
         * @return {string} property = property with optional webkit prefix
         */
        function isWebkit(property) {
            if (typeof document.documentElement.style[property] === 'string') {
                return property;
            }

            property = capitalizeFirstLetter(property);
            property = `webkit${property}`;

            return property;
        }

        /** 
         * Extend defaults
         * @param {object} defaults = defaults options defined in script
         * @param {object} properties = options defined by user
         * @return {object} defaults = modified options
         */
        function extendDefaults(defaults, properties) {
            if (properties != null && properties != undefined && properties != 'undefined') {
                for (let property in properties) {
                    defaults[property] = properties[property];
                }
            }

            return defaults;
        }

        ac.init();
    }
    
    window.Accordion = Accordion;

})(window);

var accordion = new Accordion('.accordion-container');




// Valide Form
function formValidation() {

	// Make quick references to our fields
	fName = document.getElementById("fName");
	email = document.getElementById("email");
	phone = document.getElementById("phone");
	comment = document.getElementById("comment");

	//  to check empty form fields.
	if(fName.value.length == 0) {
		document.getElementById("formHead").innerText = "All fields are mandatory";
		fName.focus();
		return false;
	}

	// Check each input in the order that it appears in the form!
	if(inputAlphabet(fName, "For your name please use alphabets only")) {

		if(emailValidation(email, "Please enter a valid email address")) {

			if(textNumeric(phone, "Please enter a valid phone number")) {

				if(lengthDefine(comment, 20, 100)) {

					return true;

				}

			}

		}


	}

	return false;
}

function inputAlphabet(inputtext, alertmsg) {
	alphaExp = /^[a-zA-Z]+$/;
	if(inputtext.value.match(alphaExp)) {
		return true;
	} else {
		document.getElementById("form_p1").innerText = alertmsg;
		inputtext.focus();
		return false;
	}
}

function emailValidation(inputtext, alertmsg) {
	emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
	if(inputtext.value.match(emailExp)) {
		return true;
	} else {
		document.getElementById("form_p2").innerText = alertmsg;
		inputtext.focus();
		return false;
	}
}

function textNumeric(inputtext, alertmsg) {
	numericExpression = /^[0-9]+$/;
	if(inputtext.value.match(numericExpression)) {
		return true;
	} else {
		document.getElementById("form_p3").innerText = alertmsg;
		inputtext.focus();
		return false;
	}
}

function lengthDefine(inputtext, min, max) {
	var ipComment = inputtext.value;
	if(ipComment.length >= min && ipComment.length <= max) {
		return true;
	} else {
		document.getElementById("form_p4").innerText = 
		"Please enter between " +min+ " and " +max+ " characters";
		inputtext.focus();
		return false;
	}
}
