/* =====================================================
   PARATRIKE - MAIN SCRIPT
   مدیریت رزرو + پنل مدیر + قیمت‌ها
   ===================================================== */

"use strict";

/* =========================
   DEFAULT PRICES
========================= */

const DEFAULT_PRICES = {
    normal: 2600000,
    vip: 4000000,
    cip: 5000000,
    tourist: 3000000,
    camera: 700000
};


/* =========================
   STORAGE KEYS
========================= */

const PRICE_KEY = "paratrike_prices";
const RESERVATION_KEY = "paratrike_reservations";


/* =========================
   LOAD PRICES
========================= */

let prices = loadPrices();

function loadPrices() {

    try {

        const saved = localStorage.getItem(PRICE_KEY);

        if (!saved) {
            localStorage.setItem(
                PRICE_KEY,
                JSON.stringify(DEFAULT_PRICES)
            );

            return { ...DEFAULT_PRICES };
        }

        const parsed = JSON.parse(saved);

        return {
            ...DEFAULT_PRICES,
            ...parsed
        };

    } catch (error) {

        console.error("خطا در خواندن قیمت‌ها:", error);

        return { ...DEFAULT_PRICES };
    }
}


/* =========================
   SAVE PRICES
========================= */

function savePrices() {

    localStorage.setItem(
        PRICE_KEY,
        JSON.stringify(prices)
    );
}


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(number) {

    number = Number(number) || 0;

    return number.toLocaleString("fa-IR");
}


/* =========================
   UPDATE SITE PRICES
========================= */

function updateSitePrices() {

    const normal = document.getElementById("normalPrice");
    const vip = document.getElementById("vipPrice");
    const cip = document.getElementById("cipPrice");
    const tourist = document.getElementById("touristPrice");
    const camera = document.getElementById("cameraPrice");

    if (normal)
        normal.textContent = formatPrice(prices.normal);

    if (vip)
        vip.textContent = formatPrice(prices.vip);

    if (cip)
        cip.textContent = formatPrice(prices.cip);

    if (tourist)
        tourist.textContent = formatPrice(prices.tourist);

    if (camera)
        camera.textContent = formatPrice(prices.camera);
}


/* =========================
   GET RESERVATIONS
========================= */

function getReservations() {

    try {

        const saved =
            localStorage.getItem(RESERVATION_KEY);

        if (!saved)
            return [];

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "خطا در خواندن رزروها:",
            error
        );

        return [];
    }
}


/* =========================
   SAVE RESERVATIONS
========================= */

function saveReservations(reservations) {

    localStorage.setItem(
        RESERVATION_KEY,
        JSON.stringify(reservations)
    );
}


/* =========================
   FLIGHT SELECTION
========================= */

function selectFlight(type) {

    const flightSelect =
        document.getElementById("flight");

    if (!flightSelect)
        return;

    flightSelect.value = type;

    updatePricePreview();

    const booking =
        document.getElementById("booking");

    if (booking) {

        booking.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* =========================
   CALCULATE PRICE
========================= */

function calculatePrice() {

    const flight =
        document.getElementById("flight")?.value;

    const weight =
        Number(
            document.getElementById("weight")?.value
        ) || 0;

    const passengers =
        Number(
            document.getElementById("passengers")?.value
        ) || 1;

    const camera =
        document.getElementById("camera")?.value;

    if (!flight) {

        return {
            total: 0,
            needsCheck: false
        };

    }


    let basePrice =
        Number(prices[flight]) || 0;


    /*
       اگر وزن بیشتر از ۸۰ باشد،
       قیمت نهایی باید در محل مشخص شود.
    */

    if (weight > 80) {

        return {
            total: 0,
            needsCheck: true
        };

    }


    let total =
        basePrice * passengers;


    if (camera === "yes") {

        total += Number(prices.camera) || 0;

    }


    return {
        total,
        needsCheck: false
    };
}


/* =========================
   UPDATE PRICE PREVIEW
========================= */

function updatePricePreview() {

    const preview =
        document.getElementById("pricePreview");

    const warning =
        document.getElementById("priceWarning");

    const weightWarning =
        document.getElementById("weightWarning");


    if (!preview)
        return;


    const result =
        calculatePrice();


    if (result.needsCheck) {

        preview.textContent =
            "تعیین قیمت در محل";

        if (warning) {

            warning.textContent =
                "وزن بالای ۸۰ کیلوگرم است؛ قیمت پس از بررسی در محل تعیین می‌شود.";

        }

        if (weightWarning) {

            weightWarning.textContent =
                "برای وزن بالای ۸۰ کیلوگرم، لطفاً جهت بررسی به محل مراجعه کنید.";

        }

        return;

    }


    if (warning)
        warning.textContent = "";


    if (weightWarning)
        weightWarning.textContent = "";


    preview.textContent =
        formatPrice(result.total) + " تومان";
}


/* =========================
   ADMIN OPEN
========================= */

function openAdmin() {

    const password =
        prompt("رمز ورود مدیر را وارد کنید:");

    if (password === null)
        return;


    if (password !== "1234") {

        alert("❌ رمز عبور اشتباه است.");

        return;
    }


    const panel =
        document.getElementById("adminPanel");

    if (!panel)
        return;


    panel.style.display = "block";


    loadAdminPrices();

    renderReservations();
}


/* =========================
   ADMIN CLOSE
========================= */

function closeAdmin() {

    const panel =
        document.getElementById("adminPanel");

    if (panel)
        panel.style.display = "none";
}


/* =========================
   LOAD ADMIN PRICES
========================= */

function loadAdminPrices() {

    const normal =
        document.getElementById("adminNormalPrice");

    const vip =
        document.getElementById("adminVipPrice");

    const cip =
        document.getElementById("adminCipPrice");

    const tourist =
        document.getElementById("adminTouristPrice");

    const camera =
        document.getElementById("adminCameraPrice");


    if (normal)
        normal.value = prices.normal;

    if (vip)
        vip.value = prices.vip;

    if (cip)
        cip.value = prices.cip;

    if (tourist)
        tourist.value = prices.tourist;

    if (camera)
        camera.value = prices.camera;
}


/* =========================
   SAVE ADMIN PRICES
========================= */

function saveAdminPrices() {

    const normal =
        document.getElementById("adminNormalPrice");

    const vip =
        document.getElementById("adminVipPrice");

    const cip =
        document.getElementById("adminCipPrice");

    const tourist =
        document.getElementById("adminTouristPrice");

    const camera =
        document.getElementById("adminCameraPrice");


    const newPrices = {

        normal:
            Number(normal?.value) ||
            prices.normal,

        vip:
            Number(vip?.value) ||
            prices.vip,

        cip:
            Number(cip?.value) ||
            prices.cip,

        tourist:
            Number(tourist?.value) ||
            prices.tourist,

        camera:
            Number(camera?.value) ||
            prices.camera
    };


    prices = newPrices;


    savePrices();

    updateSitePrices();

    updatePricePreview();


    alert("✅ قیمت‌ها با موفقیت ذخیره شدند.");
}


/* =========================
   BOOKING FORM
========================= */

const bookingForm =
    document.getElementById("bookingForm");


if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name")
                ?.value
                .trim();


            const phone =
                document.getElementById("phone")
                ?.value
                .trim();


            const flight =
                document.getElementById("flight")
                ?.value;


            const passengerType =
                document.getElementById(
                    "passengerType"
                )?.value;


            const weight =
                Number(
                    document.getElementById("weight")
                    ?.value
                ) || 0;


            const passengers =
                Number(
                    document.getElementById(
                        "passengers"
                    )?.value
                ) || 1;


            const date =
                document.getElementById("date")
                ?.value;


            const time =
                document.getElementById("time")
                ?.value;


            const camera =
                document.getElementById("camera")
                ?.value;


            /* =====================
               VALIDATION
            ===================== */

            if (!name) {

                alert("لطفاً نام و نام خانوادگی را وارد کنید.");

                return;
            }


            if (!/^09\d{9}$/.test(phone)) {

                alert(
                    "لطفاً شماره موبایل معتبر وارد کنید."
                );

                return;
            }


            if (!flight) {

                alert(
                    "لطفاً نوع پرواز را انتخاب کنید."
                );

                return;
            }


            if (!weight || weight <= 0) {

                alert(
                    "لطفاً وزن مسافر را وارد کنید."
                );

                return;
            }


            if (!date) {

                alert(
                    "لطفاً تاریخ پرواز را انتخاب کنید."
                );

                return;
            }


            if (!time) {

                alert(
                    "لطفاً ساعت پرواز را انتخاب کنید."
                );

                return;
            }


            /* =====================
               PRICE
            ===================== */

            const result =
                calculatePrice();


            let price = result.total;


            let priceText =
                formatPrice(price) + " تومان";


            if (result.needsCheck) {

                price = null;

                priceText =
                    "تعیین قیمت در محل";
            }


            /* =====================
               FLIGHT NAME
            ===================== */

            const flightNames = {

                normal: "پرواز عادی",

                vip: "پرواز VIP",

                cip: "پرواز CIP",

                tourist: "پرواز توریستی"
            };


            /* =====================
               RESERVATION OBJECT
            ===================== */

            const reservation = {

                id:
                    Date.now()
                    .toString(),

                name,

                phone,

                flight,

                flightName:
                    flightNames[flight] ||
                    flight,

                passengerType,

                weight,

                passengers,

                date,

                time,

                camera:
                    camera === "yes",

                price,

                priceText,

                status:
                    "pending",

                createdAt:
                    new Date()
                    .toISOString()
            };


            /* =====================
               SAVE
            ===================== */

            const reservations =
                getReservations();


            reservations.unshift(
                reservation
            );


            saveReservations(
                reservations
            );


            /* =====================
               REFRESH ADMIN
            ===================== */

            renderReservations();


            /* =====================
               SUCCESS
            ===================== */

            alert(
                "✅ درخواست رزرو شما با موفقیت ثبت شد.\n\n" +
                "وضعیت درخواست: در انتظار تأیید"
            );


            /* =====================
               RESET FORM
            ===================== */

            bookingForm.reset();


            const preview =
                document.getElementById(
                    "pricePreview"
                );

            if (preview) {

                preview.textContent =
                    "۰ تومان";
            }


            const warning =
                document.getElementById(
                    "priceWarning"
                );

            if (warning)
                warning.textContent = "";


            const weightWarning =
                document.getElementById(
                    "weightWarning"
                );

            if (weightWarning)
                weightWarning.textContent = "";

        }
    );
}


/* =========================
   RENDER RESERVATIONS
========================= */

function renderReservations() {

    const list =
        document.getElementById(
            "reservationList"
        );


    if (!list)
        return;


    const reservations =
        getReservations();


    if (reservations.length === 0) {

        list.innerHTML = `
            <p style="
                color:#8998a9;
                text-align:center;
                padding:30px;
            ">
                هنوز درخواست رزروی ثبت نشده است.
            </p>
        `;

        return;
    }


    list.innerHTML =
        reservations.map(
            reservation =>
                createReservationHTML(
                    reservation
                )
        ).join("");
}


/* =========================
   RESERVATION HTML
========================= */

function createReservationHTML(
    reservation
) {

    let statusText = "در انتظار تأیید";
    let statusClass = "pending";


    if (reservation.status === "confirmed") {

        statusText = "تأیید شده";
        statusClass = "confirmed";

    }


    if (reservation.status === "cancelled") {

        statusText = "لغو شده";
        statusClass = "cancelled";

    }


    const cameraText =
        reservation.camera
            ? "دارد"
            : "ندارد";


    const price =
        reservation.price === null
            ? "تعیین قیمت در محل"
            : reservation.priceText;


    return `

        <div class="reservation-item">

            <h4>
                👤 ${escapeHTML(reservation.name)}
            </h4>

            <p>
                📞 ${escapeHTML(reservation.phone)}
            </p>

            <p>
                🪂 ${escapeHTML(reservation.flightName)}
            </p>

            <p>
                ⚖️ وزن:
                ${reservation.weight}
                کیلوگرم
            </p>

            <p>
                👥 تعداد:
                ${reservation.passengers}
                نفر
            </p>

            <p>
                📅 تاریخ:
                ${escapeHTML(reservation.date)}
            </p>

            <p>
                ⏰ ساعت:
                ${escapeHTML(reservation.time)}
            </p>

            <p>
                📷 دوربین:
                ${cameraText}
            </p>

            <p>
                💰 مبلغ:
                ${price}
            </p>

            <span class="status ${statusClass}">
                ${statusText}
            </span>


            <div class="admin-actions">

                <button
                    onclick="changeReservationStatus(
                        '${reservation.id}',
                        'confirmed'
                    )">

                    ✅ تأیید

                </button>


                <button
                    onclick="changeReservationStatus(
                        '${reservation.id}',
                        'cancelled'
                    )">

                    ❌ لغو

                </button>


                <button
                    onclick="deleteReservation(
                        '${reservation.id}'
                    )">

                    🗑️ حذف

                </button>

            </div>

        </div>
    `;
}


/* =========================
   CHANGE STATUS
========================= */

function changeReservationStatus(
    id,
    status
) {

    const reservations =
        getReservations();


    const index =
        reservations.findIndex(
            reservation =>
                reservation.id === id
        );


    if (index === -1)
        return;


    reservations[index].status =
        status;


    saveReservations(
        reservations
    );


    renderReservations();
}


/* =========================
   DELETE RESERVATION
========================= */

function deleteReservation(id) {

    const confirmDelete =
        confirm(
            "آیا از حذف این درخواست مطمئن هستید؟"
        );


    if (!confirmDelete)
        return;


    let reservations =
        getReservations();


    reservations =
        reservations.filter(
            reservation =>
                reservation.id !== id
        );


    saveReservations(
        reservations
    );


    renderReservations();
}


/* =========================
   ESCAPE HTML
   جلوگیری از ورود کد HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   INPUT EVENTS
========================= */

[
    "flight",
    "weight",
    "passengers",
    "camera"
].forEach(id => {

    const element =
        document.getElementById(id);


    if (element) {

        element.addEventListener(
            "input",
            updatePricePreview
        );

        element.addEventListener(
            "change",
            updatePricePreview
        );
    }

});


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateSitePrices();

        updatePricePreview();

        renderReservations();

    }
);
