import { PaymentProviderInterface } from "../interfaces";
import { ApiResourceModel } from "@/models/ApiResourceModel";

export class PaymentProviderModel extends ApiResourceModel implements PaymentProviderInterface {
	name: PaymentProviderInterface["name"];
	type: PaymentProviderInterface["type"];
	is_active: PaymentProviderInterface["is_active"];
	logo_base64: PaymentProviderInterface["logo_base64"];
	primary_color: PaymentProviderInterface["primary_color"];
	secondary_color: PaymentProviderInterface["secondary_color"];
	secret_key: PaymentProviderInterface["secret_key"];

	constructor(data: PaymentProviderInterface) {
		super(data);
		this.name = data.name;
		this.type = data.type;
		this.is_active = data.is_active ?? true;
		this.logo_base64 = data.logo_base64;
		this.primary_color = data.primary_color ?? &quot;#1976D2&quot;;
		this.secondary_color = data.secondary_color ?? &quot;#424242&quot;;
		this.secret_key = data.secret_key;
	}

	get interface(): PaymentProviderInterface {
		return {
			...super.interface,
			name: this.name,
			type: this.type,
			is_active: this.is_active,
			logo_base64: this.logo_base64,
			primary_color: this.primary_color,
			secondary_color: this.secondary_color,
			secret_key: this.secret_key,
		};
	}

	get json(): string {
		return JSON.stringify(this.interface);
	}
}
