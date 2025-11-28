const dayjs = require("dayjs");
const db = require("../database/db.config");

/**
 * Ambil atau buat counter baru untuk tanggal hari ini
 */
const getOrCreateToday = async () => {
  const today = dayjs().format("YYYY-MM-DD");

  const existing = await db("trx_counter").where({ trxDate: today }).first();

  if (existing) {
    const newCount = existing.counter + 1;
    await db("trx_counter")
      .where({ trxDate: today })
      .update({
        counter: newCount,
        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
    return newCount;
  } else {
    await db("trx_counter").insert({
      trxDate: today,
      counter: 1,
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    return 1;
  }
};

/**
 * Utility untuk generate invoiceCode format AWLN-YYMMDD-COUNTER
 */
const generateInvoiceCode = async () => {
  const counter = await getOrCreateToday();
  const today = dayjs().format("YYMMDD");
  const formattedCounter = String(counter).padStart(4, "0"); // jadi 0001, 0002, ...
  return `AWLN-${today}-${formattedCounter}`;
};

module.exports = {
  getOrCreateToday,
  generateInvoiceCode,
};
