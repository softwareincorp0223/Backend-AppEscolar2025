export const encryptQRMiddleware = (req, res, next) => {
  res.encryptQR = (data, field = "codigo_qr") => {
    if (data && data[field]) {
      data[field] = encryptQR(data[field]);
    }
    return data;
  };

  next();
};