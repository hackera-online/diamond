/* Order calculator for the price list */
(function () {
  "use strict";

  var PHONE = "+359876309783";
  var items = [].slice.call(document.querySelectorAll(".calc-item"));
  var techpark = document.getElementById("techpark");
  var count = document.getElementById("calc-count");
  var total = document.getElementById("calc-total");
  var note = document.getElementById("calc-note");
  var sms = document.getElementById("calc-sms");
  var reset = document.getElementById("calc-reset");

  function fmt(n) {
    return (n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",")) + "€";
  }

  function update() {
    var sum = 0, lines = [];
    items.forEach(function (el) {
      if (el.checked) {
        var p = parseFloat(el.getAttribute("data-price"));
        sum += p;
        lines.push("- " + el.getAttribute("data-name") + " (" + fmt(p) + ")");
      }
    });

    var discount = !!(techpark && techpark.checked && sum > 0);
    var final = discount ? sum * 0.9 : sum;

    count.textContent = lines.length;
    total.textContent = fmt(final);

    if (!lines.length) {
      note.textContent = "Отбележи услугите, които ти трябват";
      sms.classList.add("is-disabled");
      sms.setAttribute("aria-disabled", "true");
      sms.removeAttribute("href");
      return;
    }

    note.textContent = discount
      ? "С 10% отстъпка за София Тех Парк (без отстъпка: " + fmt(sum) + ")"
      : "Сума по ценоразписа";

    var body = "Здравейте! Искам да запазя час за:\n" + lines.join("\n") +
      "\nОбщо: " + fmt(final) + (discount ? " (с 10% отстъпка за София Тех Парк)" : "");
    sms.classList.remove("is-disabled");
    sms.removeAttribute("aria-disabled");
    sms.setAttribute("href", "sms:" + PHONE + "?&body=" + encodeURIComponent(body));
  }

  items.concat(techpark ? [techpark] : []).forEach(function (el) {
    el.addEventListener("change", update);
  });

  if (reset) {
    reset.addEventListener("click", function () {
      items.forEach(function (el) { el.checked = false; });
      if (techpark) techpark.checked = false;
      update();
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  update();
})();
