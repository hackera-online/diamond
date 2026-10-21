/* Калкулатор на поръчката */
(function () {
  "use strict";

  var PHONE = "+359876309783";
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
    viber.setAttribute("href", "viber://chat?number=" + encodeURIComponent(PHONE) + "&draft=" + encodeURIComponent(body));
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

  update();
})();
