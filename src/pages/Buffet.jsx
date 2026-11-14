import { Link } from "react-router";
import logo from "./../assets/logo.png";
import Footer from "../components/Footer";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Buffet() {
  // สร้าง state ด้วย useState
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [drinkType, setDrinkType] = useState("refill"); 
  const [waterBottles, setWaterBottles] = useState("");
  const [sodaBottles, setSodaBottles] = useState("");
  const [discount, setDiscount] = useState("0");
  const [totalPrice, setTotalPrice] = useState("0.00");

  const handleDrinkTypeChange = (type) => {
    setDrinkType(type);
    if (type === "refill") {
      
      setWaterBottles("");
      setSodaBottles("");
    }
  };

  // ฟคำนวณค่าอาหารบุฟเฟต์
  const calculateBuffet = (e) => {
    e.preventDefault();

    const adultCount = adults === "" ? 0 : Number(adults);
    const childCount = children === "" ? 0 : Number(children);

    // 1. Validate ข้อมูลผู้ใหญ่และเด็ก
    if (
      (adults === "" && children === "") ||
      adultCount < 0 ||
      childCount < 0 ||
      (adultCount === 0 && childCount === 0)
    ) {
      Swal.fire({
        icon: "warning",
        title: "คำเตือน",
        text: "กรุณากรอกจำนวนผู้ใหญ่ หรือจำนวนเด็กให้ถูกต้อง (อย่างน้อย 1 คน และต้องไม่ติดลบ)",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 2. Validate จำนวนเครื่องดื่มแบบขวด (กรณีเลือกแบบขวด)
    const waterCount = waterBottles === "" ? 0 : Number(waterBottles);
    const sodaCount = sodaBottles === "" ? 0 : Number(sodaBottles);

    if (drinkType === "bottle" && (waterCount < 0 || sodaCount < 0)) {
      Swal.fire({
        icon: "warning",
        title: "คำเตือน",
        text: "จำนวนเครื่องดื่มต้องไม่ติดลบ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 3. คำนวณค่าอาหาร (ผู้ใหญ่ 299, เด็ก 89)
    const foodCost = adultCount * 299 + childCount * 89;

    // 4. คำนวณส่วนลด (ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม)
    const discountRate = Number(discount) / 100;
    const foodAfterDiscount = foodCost - foodCost * discountRate;

    // 5. คำนวณค่าเครื่องดื่ม
    let drinkCost = 0;
    if (drinkType === "refill") {
      // น้ำรีฟิล คนละ 29 บาท (ผู้ใหญ่และเด็ก)
      drinkCost = (adultCount + childCount) * 29;
    } else {
      // เครื่องดื่มแบบขวด (น้ำเปล่า 10, น้ำอัดลม 25)
      drinkCost = waterCount * 10 + sodaCount * 25;
    }

    // 6. รวมยอดชำระทั้งหมด
    const finalTotal = foodAfterDiscount + drinkCost;
    setTotalPrice(
      finalTotal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const handleReset = () => {
    setAdults("");
    setChildren("");
    setDrinkType("refill");
    setWaterBottles("");
    setSodaBottles("");
    setDiscount("0");
    setTotalPrice("0.00");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl
                   shadow-xl mx-auto flex flex-col items-center p-8"
      >
        {/* แสดงชื่อหน้าจอและรูปโลโก้ */}
        <p className="font-kanit font-bold text-2xl text-gray-800">
          Buffet Calculator
        </p>
        <p className="font-kanit text-sm text-gray-500 mt-1">
          คำนวณค่าอาหารบุฟเฟต์
        </p>
        <img src={logo} alt="Buffet Logo" className="w-20 my-5" />

        {/* ส่วนของฟอร์ม */}
        <form onSubmit={calculateBuffet} className="w-full flex flex-col">
          {/* จำนวนผู้ใหญ่ */}
          <label className="font-kanit text-sm text-gray-700 mb-1">
            จำนวนผู้ใหญ่ (คนละ 299 บาท)
          </label>
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg font-kanit
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* จำนวนเด็ก */}
          <label className="font-kanit text-sm text-gray-700 mt-4 mb-1">
            จำนวนเด็ก (คนละ 89 บาท)
          </label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg font-kanit
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* หมวดเครื่องดื่ม (ใช้ fieldset ตามม็อกอัพ) */}
          <fieldset className="border border-gray-200 rounded-xl p-4 mt-5">
            <legend className="font-kanit text-sm text-gray-600 px-2">
              เครื่องดื่ม
            </legend>

            {/* ตัวเลือกที่ 1: น้ำรีฟิล */}
            <label className="flex items-center gap-2 font-kanit text-sm text-gray-800 cursor-pointer">
              <input
                type="radio"
                name="drinkType"
                value="refill"
                checked={drinkType === "refill"}
                onChange={() => handleDrinkTypeChange("refill")}
                className="w-4 h-4 text-indigo-600 cursor-pointer"
              />
              <span>น้ำรีฟิล คนละ 29 บาท (ผู้ใหญ่และเด็ก)</span>
            </label>

            {/* ตัวเลือกที่ 2: เครื่องดื่มแบบขวด */}
            <label className="flex items-center gap-2 font-kanit text-sm text-gray-800 mt-3 cursor-pointer">
              <input
                type="radio"
                name="drinkType"
                value="bottle"
                checked={drinkType === "bottle"}
                onChange={() => handleDrinkTypeChange("bottle")}
                className="w-4 h-4 text-indigo-600 cursor-pointer"
              />
              <span>เครื่องดื่มแบบขวด</span>
            </label>

            {/* ช่องกรอกน้ำเปล่า */}
            <div className="mt-3">
              <label className="block font-kanit text-xs text-gray-600 mb-1">
                น้ำเปล่า (ขวดละ 10 บาท)
              </label>
              <input
                type="number"
                min="0"
                disabled={drinkType === "refill"}
                value={waterBottles}
                onChange={(e) => setWaterBottles(e.target.value)}
                className={`w-full border border-gray-300 p-2 rounded-lg font-kanit transition-colors ${
                  drinkType === "refill"
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>

            {/* ช่องกรอกน้ำอัดลม */}
            <div className="mt-3">
              <label className="block font-kanit text-xs text-gray-600 mb-1">
                น้ำอัดลม (ขวดละ 25 บาท)
              </label>
              <input
                type="number"
                min="0"
                disabled={drinkType === "refill"}
                value={sodaBottles}
                onChange={(e) => setSodaBottles(e.target.value)}
                className={`w-full border border-gray-300 p-2 rounded-lg font-kanit transition-colors ${
                  drinkType === "refill"
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
          </fieldset>

          {/* บัตรส่วนลด */}
          <label className="font-kanit text-sm text-gray-700 mt-5 mb-1">
            บัตรส่วนลด
          </label>
          <select
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 p-2.5 rounded-lg font-kanit bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">ไม่มีส่วนลด</option>
            <option value="10">ส่วนลด 10%</option>
            <option value="15">ส่วนลด 15%</option>
            <option value="20">ส่วนลด 20%</option>
          </select>
          <span className="font-kanit text-xs text-gray-500 mt-1">
            ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม
          </span>

          {/* ปุ่มคำนวณ และ รีเซ็ต*/}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 py-2.5 rounded-lg
                         text-white font-kanit font-bold cursor-pointer
                         hover:bg-indigo-700 transition-colors"
            >
              คำนวณ
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-red-600 py-2.5 rounded-lg
                         text-white font-kanit font-bold cursor-pointer
                         hover:bg-red-700 transition-colors"
            >
              รีเซ็ต
            </button>
          </div>
        </form>

        {/* ส่วนแสดงผลยอดชำระทั้งหมด */}
        <div className="w-full bg-indigo-50/70 rounded-xl p-4 mt-5 text-center">
          <p className="font-kanit text-base text-gray-800">
            ยอดชำระทั้งหมด:{" "}
            <span className="font-bold text-xl text-indigo-600">
              {totalPrice}
            </span>{" "}
            บาท
          </p>
        </div>

        {/* แสดงส่วน Footer */}
        <Footer />
      </div>
    </div>
  );
}
