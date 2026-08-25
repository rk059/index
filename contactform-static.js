/*
 * Static-hosting contact form handler.
 *
 * The site is served from GitHub Pages, which cannot execute PHP, so the old
 * contactform.php endpoint silently discarded every enquiry. This script keeps
 * the same form markup working by validating in the browser and handing the
 * message to the visitor's mail client, pre-addressed and pre-filled.
 *
 * To switch to a real form backend later (Formspree, Netlify Forms, Google
 * Forms, a CRM webhook), set ENDPOINT below to the POST URL. When ENDPOINT is
 * a non-empty string the script posts the form there instead and never opens a
 * mail client.
 */
(function () {
  "use strict";

  var ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"
  var MAILTO = "tirupatimoversbangalore@gmail.com";
  var PHONE = "+919812518027";

  function byId(id) { return document.getElementById(id); }

  function setStatus(form, text, ok) {
    var box = form.querySelector(".ttr-form-status");
    if (!box) {
      box = document.createElement("p");
      box.className = "ttr-form-status";
      box.setAttribute("role", "status");
      box.style.cssText = "clear:both;padding:12px 14px;margin:14px 0 0;border-radius:4px;";
      form.appendChild(box);
    }
    box.style.background = ok ? "#e8f4ea" : "#fdecea";
    box.style.color = ok ? "#1e4620" : "#7a1c14";
    box.innerHTML = text;
  }

  function value(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : "";
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function init() {
    var form = byId("ContactForm0");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = value(form, "name");
      var email = value(form, "email");
      var subject = value(form, "subject") || "Moving enquiry from tirupatipackers.com";
      var message = value(form, "message");

      if (!email || !validEmail(email)) {
        setStatus(form, "Please enter a valid email address so we can reply to you.", false);
        return;
      }
      if (!message) {
        setStatus(form, "Please tell us briefly what needs moving, and from where to where.", false);
        return;
      }

      var body = [
        "Name: " + (name || "(not given)"),
        "Email: " + email,
        "",
        message,
        "",
        "-- sent from tirupatipackers.com"
      ].join("\n");

      if (ENDPOINT) {
        var data = new FormData(form);
        setStatus(form, "Sending your enquiry...", true);
        fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("bad response");
            form.reset();
            setStatus(form, "Thank you. We have your enquiry and will reply shortly. " +
              'For anything urgent, call <a href="tel:' + PHONE + '">+91 98125-18027</a>.', true);
          })
          .catch(function () {
            setStatus(form, "We could not send that automatically. Please email " +
              '<a href="mailto:' + MAILTO + '">' + MAILTO + '</a> or call ' +
              '<a href="tel:' + PHONE + '">+91 98125-18027</a>.', false);
          });
        return;
      }

      window.location.href = "mailto:" + MAILTO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus(form,
        "Your email app should now open with the message ready to send. " +
        'If nothing happened, email <a href="mailto:' + MAILTO + '">' + MAILTO + "</a> " +
        'or call <a href="tel:' + PHONE + '">+91 98125-18027</a> (8 am to 9 pm, every day).', true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
