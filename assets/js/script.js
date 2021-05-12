//
//
//  Hide preloader after page loaded
//
//

var preloader = document.querySelector(".preloader");

window.addEventListener("load", function() {
  smoothHide(preloader);
});


//
//
//  Show cookie usage alert
//
//

var alertCookies = document.querySelector(".cookie-fixed");
var btnAcceptCookies = document.querySelector("#btn-cookie-accept");

var isCookieAccept = document.cookie.split(";").some(
  function(item) { return item.indexOf("is_cookie_accept=1") >= 0; }
);

btnAcceptCookies.addEventListener("click", function(e) {
  e.preventDefault();
  document.cookie = "is_cookie_accept=1;max-age=31536000";
  smoothHide(alertCookies);
});

if (isCookieAccept) hideElem(alertCookies);


//
//
//  Google ReCaptcha
//
//

var captchaValidated = false;

function googleRecaptchaOnLoad() {
  grecaptcha.render(
    "google-recaptcha-div",
    {
      sitekey: "6LcxRqMZAAAAAObbVmI9xVcIOmAWmqCs3mf8jdnY",
      callback: function() {
        captchaValidated = true;
        checkSendButton();
      }
    }
  );
}

function googleRecaptchaReset() {
  grecaptcha.reset();
  captchaValidated = false;
  checkSendButton();
}


//
//
//  Contact form validation
//
//

var contactForm = document.forms["contact-form"];

var privacyPolicyAgreementCheckbox = document.querySelector("#privacy-policy-agreement-checkbox");
var privacyPolicyAgreementAccepted = false;

var contactInputName = document.querySelector("#contact-form-input-name");
var contactInputEmail = document.querySelector("#contact-form-input-email");
var contactInputMessage = document.querySelector("#contact-form-input-message");

var canSendContactForm = false;

privacyPolicyAgreementCheckbox.addEventListener("change", function(e) {
  privacyPolicyAgreementAccepted = privacyPolicyAgreementCheckbox.checked;
  checkSendButton();
});

contactInputName.addEventListener("keydown", function(e) {
  e.stopPropagation();
  if (e.keyCode === 13) { e.returnValue = false; }
  checkSendButton();
});

contactInputEmail.addEventListener("keydown", function(e) {
  e.stopPropagation();
  if (e.keyCode === 13) { e.returnValue = false; }
  checkSendButton();
});

contactInputMessage.addEventListener("keydown", function(e) {
  e.stopPropagation();
  checkSendButton();
});

contactInputName.addEventListener("input", function(e) {
  checkSendButton();
});

contactInputEmail.addEventListener("input", function(e) {
  checkSendButton();
});

contactInputMessage.addEventListener("input", function(e) {
  checkSendButton();
});

function checkSendButton() {
  canSendContactForm =
    captchaValidated &&
    privacyPolicyAgreementAccepted &&
    contactInputName.value.trim() !== "" &&
    contactInputEmail.value.trim() !== "" &&
    contactInputMessage.value.trim() !== "";
  canSendContactForm
    ? contactFormSubmitButton.classList.remove("btn--inactive")
    : contactFormSubmitButton.classList.add("btn--inactive");
  return canSendContactForm;
}


//
//
//  Contact form submission
//
//

var contactFormSubmitButton = document.querySelector("#contact-form-submit-button");
var submittingContactForm = false;

var sectionSendAlert = document.querySelector(".section-send-alert");
var closeSendAlertBtn = document.querySelector("#close-send-alert-btn");
var closeSendAlertIcon = document.querySelector("#close-send-alert-icon");

// Closing alert window

closeSendAlertBtn.addEventListener("click", hideSendAlert);
closeSendAlertIcon.addEventListener("click", hideSendAlert);

function hideSendAlert(e) {
  e.preventDefault();
  smoothHide(sectionSendAlert);
}

// Changing "Send" button text

contactFormSubmitButton.setAttribute("data-send-text", contactFormSubmitButton.innerText);

function showSubmittingTextOnBtn() {
  var waitText = contactFormSubmitButton.getAttribute("data-wait-text");
  contactFormSubmitButton.innerText = waitText;
}

function hideSubmittingTextOnBtn() {
  var sendText = contactFormSubmitButton.getAttribute("data-send-text");
  contactFormSubmitButton.innerText = sendText;
}

// Submitting form

contactFormSubmitButton.addEventListener("click", function(e) {
  e.preventDefault();

  if (!canSendContactForm) return;
  if (submittingContactForm) return;

  submittingContactForm = true;
  showSubmittingTextOnBtn();

  var request = new XMLHttpRequest();

  var errMsg = "Contact form submission failed! Please, try again!";
  var errCaptcha = "Captcha validation failed! Please, try again!";

  request.addEventListener("load", function() {
    if (request.status == 200) {
      if (request.responseText == "SUCCESS") {
        smoothShow(sectionSendAlert, "flex");
      } else if (request.responseText == "RECAPTCHA_ERROR") {
        alert(errCaptcha);
      } else {
        alert(errMsg);
      }
    } else {
      alert(errMsg);
    }
    googleRecaptchaReset();
    submittingContactForm = false;
    hideSubmittingTextOnBtn();
  });

  request.addEventListener("error", function() {
    alert(errMsg);
    googleRecaptchaReset();
    submittingContactForm = false;
    hideSubmittingTextOnBtn();
  });

  request.open("POST", contactForm.action);
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  request.send(JSON.stringify({
    name: contactInputName.value.trim(),
    email: contactInputEmail.value.trim(),
    message: contactInputMessage.value.trim(),
    'g-recaptcha-response': grecaptcha.getResponse()
  }));
});


//
//
//  Utility functions
//
//

function hideElem(el) {
  el.style.opacity = "0";
  el.style.display = "none";
}

function showElem(el, showType) {
  el.style.opacity = "1";
  el.style.display = showType;
}

function smoothShow(el, showType) {
  el.style.display = showType;
  var op = 0;
  while (op <= 1) {
    (function (_op) {
      setTimeout(function () {
        el.style.opacity = _op;
      }, op * 100);
    })(op);
    op += 0.1;
  }
  setTimeout(function () {
    el.style.opacity = "1";
  }, 110);
}

function smoothHide(el) {
  var op = 1;
  while (op >= 0) {
    (function (_op) {
      setTimeout(function () {
        el.style.opacity = _op;
      }, (1 - op) * 100);
    })(op);
    op -= 0.1;
  }
  setTimeout(function () {
    el.style.opacity = "0";
    el.style.display = "none";
  }, 110);
}
