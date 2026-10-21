# Diamond Care - Мобилна автомивка и детайлинг

Уебсайт за Diamond Care (Professional Car Care): ценоразпис с калкулатор на поръчката, Diamond Care Pack, Viber съобщение с избраните услуги.

## Структура

```
├── index.html
├── CNAME
├── README.md
├── img/
│   ├── logo.webp
│   ├── og-image.png
│   └── favicon.svg
├── css/
│   ├── tokens.css       (цветове от логото, шрифтове)
│   ├── base.css         (reset, типография, .brush етикет)
│   ├── main.css         (обединени @import, по желание)
│   └── components/
│       ├── buttons.css
│       ├── lists.css
│       ├── header.css
│       ├── hero.css
│       ├── services.css
│       ├── pack.css
│       ├── steps.css
│       ├── calculator.css
│       ├── gallery.css
│       ├── reviews.css
│       └── footer.css
└── js/
    └── main.js          (калкулатор, Viber линк)
```

## Промяна на цени

Цените са в `index.html` като `data-price` на всеки ред. Промени го и показаната цена в същия ред.
