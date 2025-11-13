import ApiError from "@/api/errors/ApiError";
import { PaymentProviderListRoute } from "../../apis/payment_provider_list_route";
import { PaymentProviderModel } from "../../models/payment_provider_model";
import { PaymentProviderStore } from "../index";
import { PaymentProviderListFilterInterface } from "../../interfaces/payment_provider_list_filter_interface";

/**
 * Action getPaymentProviders
 * Récupère la liste des paymentproviders
 * 
 * @param PaymentProviderStore} store - Instance du store Pinia
 * @param  args }} - Paramètres de filtrage optionnels
 * @returns {Promise<PaymentProviderModel[] | ApiError>}
 */
export async function getPaymentProviders(
  store: PaymentProviderStore, 
  { args }: { args?: PaymentProviderListFilterInterface } = {}
): Promise<PaymentProviderModel[] | ApiError> {
  const apiRoute = new PaymentProviderListRoute(args);
  const result = await apiRoute.request();

  if (result instanceof ApiError) return result;

  if (Object.values(args || {}).length === 0)
    store.elements = result.map((model) => model.interface);

  return result;
}


