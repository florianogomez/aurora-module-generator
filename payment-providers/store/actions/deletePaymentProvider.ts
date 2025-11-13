import ApiError from "@/api/errors/ApiError";
import { PaymentProviderDeleteRoute } from "../../apis/payment_provider_delete_route";
import { PaymentProviderInterface } from "../../interfaces/payment_provider_interface";
import { PaymentProviderModel } from "../../models/payment_provider_model";
import { PaymentProviderStore } from "../index";

/**
 * Action deletePaymentProvider
 * Supprime un paymentprovider
 * 
 * @param PaymentProviderStore} store - Instance du store Pinia
 * @param  elementId }} - ID de l'élément à supprimer
 * @returns {Promise<PaymentProviderModel | ApiError>}
 */
export async function deletePaymentProvider(
  store: PaymentProviderStore,
  { elementId }: { elementId: PaymentProviderInterface["id"] }
): Promise<PaymentProviderModel | ApiError> {
  const apiRoute = new PaymentProviderDeleteRoute(elementId);
  const result = await apiRoute.request();
  if (result instanceof ApiError) return result;
  return result;
}


