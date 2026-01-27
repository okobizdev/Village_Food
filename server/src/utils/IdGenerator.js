const otpGenerator = require("otp-generator");

const idGenerate = async (prefix, identifyer, model,) => {


  let findItem = await model.findOneByIdentifyer(identifyer);


  const newNumber = findItem ? (Number(findItem.slice(prefix.length + 6)) + 1) : 1001;



  const date = new Date();
  const year = date.toLocaleString('en', { year: '2-digit' });
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dateString = `${year}${month}${day}`;
  const orderId = `${prefix}${dateString}${newNumber}`;

  return orderId;
};

// CommonJS export
module.exports = { idGenerate };
