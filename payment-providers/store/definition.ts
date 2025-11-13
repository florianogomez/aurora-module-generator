import { defaultStoreState } from "@/constants";
import { StoreKeysEnum } from "@/enums";
import { GenericStoreService } from "@/services/generic_store_service";

export const paymentProviderStoreDefinition: AppStoreDefinition<PaymentProviderStoreInterface> = {
	key: StoreKeysEnum.PaymentProvider,
	service: new GenericStoreService<PaymentProviderStoreInterface>({
		name: StoreKeysEnum.PaymentProvider,
		defaults: {
			...defaultStoreState,
			elements: [],
		},
	}),
};
