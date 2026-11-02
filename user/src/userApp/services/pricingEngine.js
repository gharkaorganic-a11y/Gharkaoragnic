export const calculatePricing = (items = []) => {
  let subtotal = 0;
  let originalTotalPrice = 0;

  for (const item of items) {
    const quantity = Math.max(
      1,
      Number(item.quantity ?? item.selectedQuantity) || 1,
    );
    const price = Math.max(0, Number(item.price) || 0);
    const mrp = Math.max(
      price,
      Number(item.mrp ?? item.originalPrice ?? price) || 0,
    );

    subtotal += price * quantity;
    originalTotalPrice += mrp * quantity;
  }

  subtotal = Math.round(subtotal * 100) / 100;
  originalTotalPrice = Math.round(originalTotalPrice * 100) / 100;
  const totalPayable = subtotal;

  return {
    subtotal,
    originalTotalPrice,
    totalPayable,
  };
};