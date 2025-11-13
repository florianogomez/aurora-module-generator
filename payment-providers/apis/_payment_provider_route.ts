import { ApiRoute } from "@/api/routes/api_route";
import { useInitializedPaymentProviderStore } from "../store";
import { PaymentProviderStore } from "../store";

/**
 * Route de base pour PaymentProvider
 */
export class PaymentProviderRoute extends ApiRoute {
  static name = "payment-providers";

  get store(): Promise<PaymentProviderStore> {
    return useInitializedPaymentProviderStore();
  }

  async request() {
    const store = await this.store;
    store.setLoading(true);
    const result = await super.request();
    store.setLoading(false);
    return result;
  }
}
