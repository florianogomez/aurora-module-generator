import ApiHttpMethod from "@/api/enums/api_http_method_enum"; import ApiError from
"@/api/errors/ApiError"; import {
PaymentProviderInterface } from "../interfaces/payment-provider_interface"; import {
PaymentProviderModel } from "../models/payment-provider_model"; import {
PaymentProviderRoute } from "./_payment-provider_route"; import {
PaymentProviderStore } from "../store"; import NotFoundApiError from
"@/api/errors/NotFoundApiError"; /** * Route de suppression
PaymentProvider
*/ export class
PaymentProviderDeleteRoute extends
PaymentProviderRoute { constructor(private elementId:
PaymentProviderInterface["id"]) { super(`/PaymentProviderRoute.name}/${elementId}`,
ApiHttpMethod.DELETE, { elementId }); } async request() { if (this.isMock) { return this.mock(); }
const response = await super.request(); if (response instanceof ApiError) return response; return
new
PaymentProviderModel(response as
PaymentProviderInterface); } async mock() { const store:
PaymentProviderStore = await this.store; const
paymentProviderToDelete = store.find(this.elementId); if (!paymentProviderToDelete) {
return new NotFoundApiError({ message: `Aucun
paymentprovider
trouvé avec l'ID ${this.elementId}.`, }); } store.remove(this.elementId); return new
PaymentProviderModel(paymentProviderToDelete); } }