import stripe
from .models import Payment, Language

stripe.api_key = "default_key"

# Base class for all payment processors
class PaymentProcessor:
    def create_intent(self, user, language_ids):
        raise NotImplementedError()

    def confirm_payment(self, payment_intent_id, user):
        raise NotImplementedError()


# Stripe implementation
class StripePaymentProcessor(PaymentProcessor):
    def create_intent(self, user, language_ids):
        languages = Language.objects.filter(id__in=language_ids)
        total = sum([language.price for language in languages])

        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency="eur",
            metadata={"user_id": user.id}
        )

        for language in languages:
            Payment.objects.create(
                user=user,
                language=language,
                amount=language.price,
                stripe_payment_intent_id=intent.id,
                status="pending"
            )

        return intent.client_secret

    def confirm_payment(self, payment_intent_id, user):
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)

        if intent.status == 'succeeded':
            payment.status = 'succeeded'
            payment.save()

            if payment.language not in user.enrolled_languages.all():
                user.enrolled_languages.add(payment.language)

            return True, "Payment confirmed and user enrolled."

        return False, f"Payment not successful yet. Current status: {intent.status}"

# Skeleton for PayPal (not implemented)
# class PayPalPaymentProcessor(PaymentProcessor): 
#     def create_intent(self, user, language_ids):
#         some logic...
#         return "paypal_client_secret_placeholder"

#     def confirm_payment(self, payment_intent_id, user):
#         some logic..
#         return True, "PayPal payment confirmed and user enrolled."

# Returns a payment processor instance based on the selected provider (factory)
def get_payment_processor(provider="stripe") -> PaymentProcessor:
        if provider == "stripe":
            return StripePaymentProcessor()
        # elif provider == "paypal":
        #   return PayPalPaymentProcessor()
        else:
            raise ValueError("Unsupported payment provider")

