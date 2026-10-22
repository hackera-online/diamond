/* Калкулатор на поръчката */
(function () {
  "use strict";

  var PHONE = "+359876309783";
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  var toastEl, toastTimer;

  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 6000);
  }

  function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
      }
    } catch (e) {}
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return Promise.resolve(ok);
    } catch (e) { return Promise.resolve(false); }
  }

  // Viber чат с номера на сайта: на телефон с +, на компютър само цифрите
  function viberLink() {
    var num = IS_MOBILE ? encodeURIComponent(PHONE) : PHONE.replace(/\D/g, "");
    return "viber://chat?number=" + num;
  }
  var lastMessage = "";
  var items = [].slice.call(document.querySelectorAll(".calc-item"));
  var basic = document.getElementById("pkg-basic");
  var pet = document.getElementById("opt-pet");
  var count = document.getElementById("calc-count");
  var total = document.getElementById("calc-total");
  var note = document.getElementById("calc-note");
  var viber = document.getElementById("calc-viber");
  var reset = document.getElementById("calc-reset");

  function fmt(n) {
    return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + "€";
  }

  function update() {
    // Опцията за косми и пясък е достъпна само с Basic Wash
    if (basic && pet) {
      pet.disabled = !basic.checked;
      if (pet.disabled) pet.checked = false;
    }

    var sum = 0, lines = [];
    items.forEach(function (el) {
      if (el.checked) {
        var p = parseFloat(el.getAttribute("data-price"));
        sum += p;
        lines.push("- " + el.getAttribute("data-name") + " (" + fmt(p) + ")");
      }
    });

    count.textContent = lines.length;
    total.textContent = fmt(sum);

    if (!lines.length) {
      note.textContent = "Отбележи услугите, които ти трябват";
      viber.classList.add("is-disabled");
      viber.setAttribute("aria-disabled", "true");
      viber.removeAttribute("href");
      return;
    }

    note.textContent = "Сума по ценоразписа";

    var body = "Здравейте! Искам да запазя час за:\n" + lines.join("\n") +
      "\nОбщо: " + fmt(sum);
    viber.classList.remove("is-disabled");
    viber.removeAttribute("aria-disabled");
    lastMessage = body;
    viber.setAttribute("href", viberLink());
  }

  // Viber не пренася надеждно готов текст, затова го копираме и отваряме чата с номера
  if (viber) {
    viber.addEventListener("click", function () {
      if (viber.classList.contains("is-disabled") || !lastMessage) return;
      var opened = true;
      function onHide() { if (document.hidden) opened = true; }
      document.addEventListener("visibilitychange", onHide);
      opened = false;
      copyText(lastMessage).then(function (copied) {
        toast(copied
          ? "Поръчката е копирана. Постави я в чата с Diamond Care във Viber."
          : "Ако Viber не се отвори, пиши ни на " + PHONE.replace(/^\+359/, "0").replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") + ".");
      });
      setTimeout(function () {
        document.removeEventListener("visibilitychange", onHide);
        if (!opened) toast("Viber не се отвори. Обади се или пиши на 0876 309 783 – поръчката е копирана.");
      }, 2200);
    });
  }

  items.forEach(function (el) {
    el.addEventListener("change", update);
  });

  if (reset) {
    reset.addEventListener("click", function () {
      items.forEach(function (el) { el.checked = false; });
      update();
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Първият ред на хийрото винаги на един ред на телефон
  var big = document.querySelector(".hero__big");
  function fitBig() {
    if (!big) return;
    big.style.fontSize = "";
    if (window.innerWidth >= 860) return;
    var fs = parseFloat(getComputedStyle(big).fontSize);
    var avail = document.documentElement.clientWidth - 40;
    while (big.getBoundingClientRect().width > avail && fs > 18) {
      fs -= 0.5;
      big.style.fontSize = fs + "px";
    }
  }
  fitBig();
  window.addEventListener("resize", fitBig);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBig);

  update();
})();
