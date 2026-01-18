declare module '@paystack/inline-js' {
    export interface PaystackTransaction {
        reference: string;
        status: string;
        trans: string;
        transaction: string;
        message: string;
        trxref: string;
    }

    export interface PaystackPopupOptions {
        key?: string;
        onSuccess?: (transaction: PaystackTransaction) => void;
        onClose?: () => void;
    }

    export default class PaystackPop {
        constructor(options?: { key?: string });
        resumeTransaction(accessCode: string, options?: PaystackPopupOptions): void;
        newTransaction(options: any): void;
    }
}
