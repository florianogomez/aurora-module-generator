import { paymentProviderStoreDefinition } from "../definition";
import { createBaseStoreActions } from "@/stores/utils/create_base_store_actions";
import { add } from "./add";
import { find } from "./find";
import { update } from "./update";
import { remove } from "./remove";
import { getPaymentProviders } from "./getPaymentProviders";
import { findPaymentProvider } from "./findPaymentProvider";
import { createPaymentProvider } from "./createPaymentProvider";
import { updatePaymentProvider } from "./updatePaymentProvider";
import { deletePaymentProvider } from "./deletePaymentProvider";
import { setPaymentProviders } from "./setPaymentProviders";

export const paymentProviderStoreActions = {
	setPaymentProviders,
	...createBaseStoreActions(paymentProviderStoreDefinition.service),
	add,
	find,
	update,
	remove,
	getPaymentProviders,
	findPaymentProvider,
	createPaymentProvider,
	updatePaymentProvider,
	deletePaymentProvider,
};
