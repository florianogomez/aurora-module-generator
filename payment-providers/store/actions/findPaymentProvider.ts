import ApiError from "@/api/errors/ApiError";
import { PaymentProviderFindRoute } from "../../apis/payment_provider_find_route";
import { PaymentProviderModel } from "../../models/payment_provider_model";
import { PaymentProviderInterface } from "../../interfaces/payment_provider_interface";
import { PaymentProviderStore } from "../index";

/**
 * Action findPaymentProvider
 * Recherche un paymentprovider par ID via l'API
 * 
 * @param PaymentProviderStore} store - Instance du store Pinia
 * @param  elementId }} - ID de l'élément à rechercher
 * @returns {Promise<PaymentProviderModel | ApiError>}
 */
export async function findPaymentProvider(
  store: PaymentProviderStore,
  { elementId }: { elementId: PaymentProviderInterface["id"] }
): Promise<PaymentProviderModel | ApiError> {
  const apiRoute = new PaymentProviderFindRoute(elementId);
  const result = await apiRoute.request();
  if (result instanceof ApiError) return result;
  return result;
}


