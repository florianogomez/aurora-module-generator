import ApiError from "@/api/errors/ApiError";
import { PaymentProviderUpdateRoute } from "../../apis/payment_provider_update_route";
import { PaymentProviderUpdateInterface } from "../../interfaces/payment_provider_update_interface";
import { PaymentProviderInterface } from "../../interfaces/payment_provider_interface";
import { PaymentProviderModel } from "../../models/payment_provider_model";
import { PaymentProviderStore } from "../index";

/**
 * Action updatePaymentProvider
 * Met à jour un paymentprovider existant
 * 
 * @param PaymentProviderStore} store - Instance du store Pinia
 * @param  elementId, data }} - ID et données de mise à jour
 * @returns {Promise<PaymentProviderModel | ApiError>}
 */
export async function updatePaymentProvider(
  store: PaymentProviderStore,
  { elementId, data }: { elementId: PaymentProviderInterface["id"], data: PaymentProviderUpdateInterface }
): Promise<PaymentProviderModel | ApiError> {
  const apiRoute = new PaymentProviderUpdateRoute(elementId, data);
  const result = await apiRoute.request();
  if (result instanceof ApiError) return result;
  return result;
}


