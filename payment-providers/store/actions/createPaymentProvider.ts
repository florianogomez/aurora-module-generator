import ApiError from "@/api/errors/ApiError";
import { PaymentProviderCreateRoute } from "../../apis/payment_provider_create_route";
import { PaymentProviderCreateInterface } from "../../interfaces/payment_provider_create_interface";
import { PaymentProviderModel } from "../../models/payment_provider_model";
import { PaymentProviderStore } from "../index";

/**
 * Action createPaymentProvider
 * Crée un nouveau paymentprovider
 * 
 * @param PaymentProviderStore} store - Instance du store Pinia
 * @param  data }} - Données de création
 * @returns {Promise<PaymentProviderModel | ApiError>}
 */
export async function createPaymentProvider(
  store: PaymentProviderStore,
  { data }: { data: PaymentProviderCreateInterface }
): Promise<PaymentProviderModel | ApiError> {
  const apiRoute = new PaymentProviderCreateRoute(data);
  const result = await apiRoute.request();
  if (result instanceof ApiError) return result;
  return result;
}


