import { ApiResourceInterface } from "@/interfaces/ApiResourceInterface";

export interface PaymentProviderInterface extends ApiResourceInterface {
	name: string;
	type: string;
	is_active: boolean;
	logo_base64?: string;
	primary_color?: string;
	secondary_color?: string;
	secret_key: string;
}
