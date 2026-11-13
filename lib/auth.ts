/** Delivery token helpers — wired in D2 */
export function createDeliveryToken(orderId: string): string {
  void orderId;
  throw new Error("auth not configured (D2)");
}
