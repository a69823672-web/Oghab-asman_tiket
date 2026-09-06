// ===============================
// قیمت‌های اولیه
// ===============================

const prices = {
    normal: 2600000,
    vip: 4000000,
    cip: 5000000,
    tourist: 3000000,
    camera: 700000
};


// ===============================
// عناصر فرم
// ===============================

const bookingForm = document.querySelector(".booking-form");

const flightType = bookingForm.querySelectorAll("select")[0];
const passengerType = bookingForm.querySelectorAll("select")[1];
const weightInput = bookingForm.querySelector("input[type='number']");
const cameraSelect = bookingForm.querySelectorAll("select")[2];

const submitButton = document.querySelector(".submit-btn");


// ===============================
// تغییر نوع پرواز
// ===============================

flightType.addEventListener("change", updatePrice);
passengerType.addEventListener("change", updatePrice);
weightInput.addEventListener("input", updatePrice);
cameraSelect.addEventListener("change", updatePrice);


// ===============================
// محاسبه قیمت
// ===============================

function calculatePrice() {

    const type = flightType.value;
    const passenger = passengerType.value;
    const weight = Number(weightInput.value);

    let total = 0;

    // اگر توریست باشد
    if (passenger.includes("توریست")) {
        total = prices.tourist;
    } else {

        // قیمت بر اساس نوع پرواز
        if (type === "پرواز عادی") {
            total = prices.normal;
        }

        else if (type === "VIP") {
            total = prices.vip;
        }

        else if (type === "CIP") {
            total = prices.cip;
        }

    }


    // وزن بالای ۸۰ کیلو
    if (weight > 80) {

        return {
            needsWeightCheck: true,
            total: null
        };

    }


    // اجاره دوربین
    if (cameraSelect.value.includes("بله")) {
        total += prices.camera;
    }


    return {
        needsWeightCheck: false,
        total: total
    };
}


// ===============================
// نمایش قیمت
// ===============================

function updatePrice() {

    const result = calculatePrice();

    let priceBox = document.querySelector(".live-price");

    if (!priceBox) {

        priceBox = document.createElement("div");

        priceBox.className = "live-price";

        bookingForm.appendChild(priceBox);
    }


    if (result.needsWeightCheck) {

        priceBox.innerHTML = `
            <div>
                ⚖️ وزن شما بالای ۸۰ کیلوگرم است.
                <br>
                برای تعیین قیمت باید در مجموعه وزن‌کشی شوید.
            </div>
        `;

        return;
    }


    priceBox.innerHTML = `
        <div>
            مبلغ تقریبی:
            <strong>
                ${formatPrice(result.total)}
            </strong>
            تومان
        </div>
    `;
}


// ===============================
// فرمت قیمت
// ===============================

function formatPrice(price) {

    return new Intl.NumberFormat("fa-IR").format(price);

}


// ===============================
// کلیک روی ادامه رزرو
// ===============================

submitButton.addEventListener("click", function () {

    const result = calculatePrice();

    const weight = Number(weightInput.value);


    if (!weight) {

        alert("لطفاً وزن مسافر را وارد کنید.");

        weightInput.focus();

        return;
    }


    if (weight > 80) {

        alert(
            "وزن شما بالای ۸۰ کیلوگرم است.\n\n" +
            "لطفاً برای وزن‌کشی و تعیین قیمت به مجموعه مراجعه کنید."
        );

        return;
    }


    alert(
        "رزرو اولیه با موفقیت ثبت شد.\n\n" +
        "مبلغ: " +
        formatPrice(result.total) +
        " تومان"
    );

});
