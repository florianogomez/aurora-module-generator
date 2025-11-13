import ApiHttpMethod from "@/api/enums/api_http_method_enum"; import ApiError from
"@/api/errors/ApiError"; import {
PaymentProviderInterface } from "../interfaces/payment-provider_interface"; import {
PaymentProviderUpdateInterface } from "../interfaces/payment-provider_update_interface";
import {
PaymentProviderModel } from "../models/payment-provider_model"; import {
PaymentProviderRoute } from "./_payment-provider_route"; import {
PaymentProviderStore } from "../store"; import NotFoundApiError from
"@/api/errors/NotFoundApiError"; /** * Route de mise à jour
PaymentProvider
*/ export class
PaymentProviderUpdateRoute extends
PaymentProviderRoute { constructor( private elementId:
PaymentProviderInterface["id"], public data:
PaymentProviderUpdateInterface ) { super(`/PaymentProviderRoute.name}/${elementId}`,
ApiHttpMethod.PUT, data); } async request() { if (this.isMock) { return this.mock(); } const
response = await super.request(); if (response instanceof ApiError) return response; return new
PaymentProviderModel(response as
PaymentProviderInterface); } async mock() { const store:
PaymentProviderStore = await this.store; const
paymentProviderToUpdate = store.find(this.elementId); if (!paymentProviderToUpdate) {
return new NotFoundApiError({ message: `Aucun
paymentprovider
trouvé avec l'ID ${this.elementId}.`, }); } const
paymentProviderUpdated = new
PaymentProviderModel({ ...paymentProviderToUpdate, ...this.data, updated_at: new
Date().toISOString(), }); store.update(this.elementId,
paymentProviderUpdated.interface); return
paymentProviderUpdated; } }