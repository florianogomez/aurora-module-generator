import ApiHttpMethod from "@/api/enums/api_http_method_enum";
import ApiError from "@/api/errors/ApiError";
import { PaymentProviderInterface } from "../interfaces/payment-provider_interface";
import { PaymentProviderCreateInterface } from "../interfaces/payment-provider_create_interface";
import { PaymentProviderModel } from "../models/payment-provider_model";
import { PaymentProviderRoute } from "./_payment-provider_route";
import { faker } from "@faker-js/faker";
import { PaymentProviderStore } from "../store";
/** * Route de création
PaymentProvider
*/ export class PaymentProviderCreateRoute extends PaymentProviderRoute {
	constructor(public data: PaymentProviderCreateInterface) {
		super(`/PaymentProviderRoute.name}`, ApiHttpMethod.POST, data);
	}
	async request() {
		if (this.isMock) {
			return this.mock();
		}
		const response = await super.request();
		if (response instanceof ApiError) return response;
		return new PaymentProviderModel(response as PaymentProviderInterface);
	}
	async mock() {
		const store: PaymentProviderStore = await this.store;
		const model = new PaymentProviderModel({
			...this.data,
			id: faker.string.uuid(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		store.add(model.interface);
		return;
		model;
	}
}
