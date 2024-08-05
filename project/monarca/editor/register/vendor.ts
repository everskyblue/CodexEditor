import { IVendor } from "../contracts.d";

export class Vendor implements IVendor {
    constructor(
        public readonly packageID: string,
        public readonly title: string,
        public readonly description: string,
        public readonly author: string,
        public readonly repo?: string,
        public readonly aditionalInfo?: any
    ) {}
}
