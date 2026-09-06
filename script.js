// ========================================
// تنظیمات اولیه
// ========================================

const defaultPrices = {
    normal: 2600000,
    vip: 4000000,
    cip: 5000000,
    tourist: 3000000,
    camera: 700000
};

let prices = JSON.parse(localStorage.getItem("paratrikePrices"))
    || defaultPrices;

let reservations = JSON.parse(
    localStorage.getItem("paratrikeReservations")
) || [];


// ========================================
// ابزارها
// ========================================

function formatPrice(number) {
    return new Intl.NumberFormat("fa-IR").format(number);
}

function saveData() {
    localStorage.setItem(
        "paratrikePrices",
        JSON.stringify(prices)
    );

    localStorage.setItem(
        "paratrikeReservations",
        JSON.stringify(reservations)
    );
}


// ========================================
// نمایش قیمت‌ها در سایت
// ========================================

function updateSitePrices() {

    document.getElementById("normalPrice").textContent =
        formatPrice(prices.normal);

    document.getElementById("vipPrice").textContent =
        formatPrice(prices.vip);

    document.getElementById("cipPrice").textContent =
        formatPrice(prices.cip);

    document.getElementById("touristPrice").textContent =
        formatPrice(prices.tourist);

    document.getElementById("cameraPrice").textContent =
        formatPrice(prices.camera) + " تومان";

    document.querySelector(
        '#camera option[value="yes"]'
    ).textContent =
        "بله - " + formatPrice(prices.camera) + " تومان";
}


// ========================================
// انتخاب پرواز
// ========================================

function selectFlight(type) {

    const flightType =
        document.getElementById("flightType");

    flightType.value = type;

    document.getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });

    updatePricePreview();
}


// ========================================
// محاسبه مبلغ
// ========================================

function calculatePrice() {

    const flightType =
        document.getElementById("flightType").value;

    const passengerType =
        document.getElementById("passengerType").value;

    const weight =
        Number(document.getElementById("weight").value);

    const passengers =
        Number(document.getElementById("passengers").value) || 1;

    const camera =
        document.getElementById("camera").value;


    // وزن بالای ۸۰
    if (weight > 80) {

        return {
            needsCheck: true,
            total: 0
        };
    }


    let singlePrice;


    // توریست
    if (passengerType === "tourist") {

        singlePrice = prices.tourist;

    } else {

        singlePrice = prices[flightType];

    }


    let total = singlePrice * passengers;


    // دوربین
    if (camera === "yes") {

        total += prices.camera;

    }


    return {
        needsCheck: false,
        total: total
    };
}


// ========================================
// نمایش مبلغ
// ========================================

function updatePricePreview() {

    const result = calculatePrice();

    const box =
        document.getElementById("pricePreview");


    if (result.needsCheck) {

        box.innerHTML = `
            ⚠️ وزن بالای ۸۰ کیلوگرم است.
            <br>
            <strong>
                لطفاً برای وزن‌کشی و تعیین قیمت
                به مجموعه مراجعه کنید.
            </strong>
        `;

        return;
    }


    box.innerHTML = `
        مبلغ تقریبی:
        <strong>
            ${formatPrice(result.total)}
            تومان
        </strong>
    `;
}


// ========================================
// اتصال تغییرات فرم
// ========================================

[
    "flightType",
    "passengerType",
    "weight",
    "passengers",
    "camera"
].forEach(id => {

    document.getElementById(id)
        .addEventListener("input", updatePricePreview);

    document.getElementById(id)
        .addEventListener("change", updatePricePreview);

});


// ========================================
// ثبت رزرو
// ========================================

document
    .getElementById("bookingForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("fullName").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const flightType =
            document.getElementById("flightType").value;

        const passengerType =
            document.getElementById("passengerType").value;

        const weight =
            Number(document.getElementById("weight").value);

        const passengers =
            Number(document.getElementById("passengers").value);

        const date =
            document.getElementById("flightDate").value;

        const time =
            document.getElementById("flightTime").value;

        const camera =
            document.getElementById("camera").value;


        // بررسی شماره موبایل
        if (!/^09\d{9}$/.test(phone)) {

            alert(
                "لطفاً شماره موبایل را به شکل صحیح وارد کنید."
            );

            return;
        }


        // بررسی وزن
        if (!weight || weight <= 0) {

            alert("لطفاً وزن مسافر را وارد کنید.");

            return;
        }


        // وزن بالای ۸۰
        if (weight > 80) {

            alert(
                "وزن شما بالای ۸۰ کیلوگرم است.\n\n" +
                "لطفاً برای وزن‌کشی و تعیین قیمت " +
                "به مجموعه مراجعه کنید."
            );

            return;
        }


        const result = calculatePrice();


        const flightNames = {
            normal: "پرواز عادی",
            vip: "VIP",
            cip: "CIP"
        };


        const reservation = {

            id: Date.now(),

            name: name,

            phone: phone,

            flight:
                flightNames[flightType],

            passengerType:
                passengerType === "tourist"
                    ? "توریست"
                    : "مسافر عادی",

            weight: weight,

            passengers: passengers,

            date: date,

            time: time,

            camera:
                camera === "yes"
                    ? "دارد"
                    : "ندارد",

            price: result.total,

            status: "در انتظار بررسی",

            createdAt:
                new Date().toLocaleString("fa-IR")

        };


        reservations.unshift(reservation);

        saveData();

        renderReservations();


        alert(
            "✅ درخواست رزرو شما ثبت شد.\n\n" +
            "کد پیگیری: " +
            reservation.id
        );


        this.reset();

        document.getElementById("passengers").value = 1;

        updatePricePreview();

    });


// ========================================
// پنل مدیریت
// ========================================

function openAdmin() {

    const password =
        prompt("رمز ورود مدیریت را وارد کنید:");

    // رمز موقت
    if (password !== "1234") {

        alert("رمز ورود اشتباه است.");

        return;
    }


    document.getElementById("adminPanel")
        .style.display = "block";

    document.getElementById("adminPanel")
        .scrollIntoView({
            behavior: "smooth"
        });


    loadAdminPrices();

    renderReservations();
}


function closeAdmin() {

    document.getElementById("adminPanel")
        .style.display = "none";

}


// ========================================
// بارگذاری قیمت‌ها در پنل
// ========================================

function loadAdminPrices() {

    document.getElementById("adminNormal").value =
        prices.normal;

    document.getElementById("adminVip").value =
        prices.vip;

    document.getElementById("adminCip").value =
        prices.cip;

    document.getElementById("adminTourist").value =
        prices.tourist;

    document.getElementById("adminCamera").value =
        prices.camera;
}


// ========================================
// ذخیره قیمت‌ها
// ========================================

function savePrices() {

    prices.normal =
        Number(document.getElementById("adminNormal").value);

    prices.vip =
        Number(document.getElementById("adminVip").value);

    prices.cip =
        Number(document.getElementById("adminCip").value);

    prices.tourist =
        Number(document.getElementById("adminTourist").value);

    prices.camera =
        Number(document.getElementById("adminCamera").value);


    saveData();

    updateSitePrices();

    updatePricePreview();


    alert(
        "✅ قیمت‌ها با موفقیت ذخیره شدند."
    );
}


// ========================================
// نمایش رزروها
// ========================================

function renderReservations() {

    const list =
        document.getElementById("reservationsList");


    if (reservations.length === 0) {

        list.innerHTML = `
            <p class="empty-reservations">
                هنوز رزروی ثبت نشده است.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    reservations.forEach(reservation => {

        const item =
            document.createElement("div");

        item.className = "reservation-item";


        item.innerHTML = `

            <div class="reservation-main">

                <h4>
                    🎫 ${reservation.name}
                </h4>

                <p>
                    📞 ${reservation.phone}
                </p>

                <p>
                    🪂 ${reservation.flight}
                </p>

                <p>
                    👥 تعداد:
                    ${reservation.passengers}
                </p>

                <p>
                    ⚖️ وزن:
                    ${reservation.weight} کیلو
                </p>

                <p>
                    📅 ${reservation.date}
                    — 🕐 ${reservation.time}
                </p>

                <p>
                    📷 دوربین:
                    ${reservation.camera}
                </p>

                <p>
                    🌍 ${reservation.passengerType}
                </p>

                <strong>
                    💰 ${formatPrice(reservation.price)}
                    تومان
                </strong>

                <p>
                    وضعیت:
                    <b>${reservation.status}</b>
                </p>

            </div>


            <div class="reservation-actions">

                <button
                    onclick="confirmReservation(${reservation.id})">

                    ✅ تأیید

                </button>


                <button
                    onclick="cancelReservation(${reservation.id})">

                    ❌ لغو

                </button>


                <button
                    onclick="deleteReservation(${reservation.id})">

                    🗑️ حذف

                </button>

            </div>

        `;


        list.appendChild(item);

    });

}


// ========================================
// تأیید رزرو
// ========================================

function confirmReservation(id) {

    const reservation =
        reservations.find(item => item.id === id);

    if (!reservation) return;


    reservation.status = "تأیید شده";

    saveData();

    renderReservations();

}


// ========================================
// لغو رزرو
// ========================================

function cancelReservation(id) {

    const reservation =
        reservations.find(item => item.id === id);

    if (!reservation) return;


    reservation.status = "لغو شده";

    saveData();

    renderReservations();

}


// ========================================
// حذف رزرو
// ========================================

function deleteReservation(id) {

    if (!confirm("این رزرو حذف شود؟")) {
        return;
    }


    reservations =
        reservations.filter(
            item => item.id !== id
        );


    saveData();

    renderReservations();

}


// ========================================
// شروع سایت
// ========================================

updateSitePrices();

updatePricePreview();

renderReservations();
