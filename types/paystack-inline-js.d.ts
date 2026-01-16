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
        onSuccess?: (transaction: PaystackTransaction) => void;
        onClose?: () => void;
    }

    export default class PaystackPop {
        constructor();
        resumeTransaction(accessCode: string, options?: PaystackPopupOptions): void;
        newTransaction(options: any): void;
    }
}
