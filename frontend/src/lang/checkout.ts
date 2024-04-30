import LocalizedStrings from 'react-localization'
import * as langHelper from '../common/langHelper'

const strings = new LocalizedStrings({
  fr: {
    BOOKING_HEADING: 'Réserver Maintenant',
    BOOKING_OPTIONS: 'Vos options de réservation',
    BOOKING_DETAILS: 'Vos données de réservation',
    DAYS: 'Jours',
    CAR: 'Voiture',
    SUPPLIER: 'Fournisseur',
    COST: 'Total',
    DRIVER_DETAILS: 'Informations du conducteur principal',
    EMAIL_INFO: 'Vous recevrez une confirmation à cette adresse.',
    PHONE_INFO: "Si nous avons besoin de vous contacter d'urgence.",
    PAYMENT: 'Paiement sécurisé',
    CARD_NUMBER: 'Numéro de carte',
    CARD_NUMBER_NOT_VALID: 'Numéro de carte non valide',
    CARD_EXPIRY_NOT_VALID: "Date d'expiration non valide",
    CVV_NOT_VALID: 'Code de sécurité non valide',
    BOOK: 'Réserver',
    SIGN_IN: 'Se connecter ?',
    SECURE_PAYMENT_INFO: 'Vos données sont protégées par le paiement sécurisé SSL.',
    SUCCESS: 'Votre paiement a été effectué avec succès. Nous vous avons envoyé un e-mail de confirmation.',
    PAY_LATER_SUCCESS: 'Votre réservation a été effectué avec succès. Nous vous avons envoyé un e-mail de confirmation.',
    PAYMENT_OPTIONS: 'Options de paiement',
    PAY_LATER: 'Payer plus tard',
    PAY_LATER_INFO: 'Modification et annulation gratuites',
    PAY_ONLINE: 'Payer en ligne',
    PAY_ONLINE_INFO: 'Modification et annulation sous conditions',
    PAYMENT_FAILED: 'Paiement échoué.',
    CHECKING: 'Vérification en cours...',
  },
  en: {
    BOOKING_HEADING: 'Book now',
    BOOKING_OPTIONS: 'Your booking options',
    BOOKING_DETAILS: 'Your booking details',
    DAYS: 'Days',
    CAR: 'Car',
    SUPPLIER: 'Supplier',
    COST: 'COST',
    DRIVER_DETAILS: 'Driver details',
    EMAIL_INFO: 'You will receive a confirmation email at this address.',
    PHONE_INFO: 'If we need to contact you urgently.',
    PAYMENT: 'Secure payment',
    CARD_NUMBER: 'Card Number',
    CARD_NUMBER_NOT_VALID: 'Invalid card number',
    CARD_EXPIRY_NOT_VALID: 'Invalid expiry date',
    CVV_NOT_VALID: 'Invalid Card Validation Code',
    BOOK: 'Book now',
    SIGN_IN: 'Sign in?',
    SECURE_PAYMENT_INFO: 'Your data is protected by SSL secure payment.',
    SUCCESS: 'Your payment was successfully done. We sent you a confirmation email.',
    PAY_LATER_SUCCESS: 'Your booking was successfully done. We sent you a confirmation email.',
    PAYMENT_OPTIONS: 'Payment options',
    PAY_LATER: 'Paye later',
    PAY_LATER_INFO: 'Free amendments and cancellation',
    PAY_ONLINE: 'Pay online',
    PAY_ONLINE_INFO: 'Amendments and cancellation under conditions',
    PAYMENT_FAILED: 'Payment failed.',
    CHECKING: 'Checking in progress...',
  },
})

langHelper.setLanguage(strings)
export { strings }
