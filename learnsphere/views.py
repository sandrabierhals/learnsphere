from collections import OrderedDict
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.shortcuts import render
from django.views.generic import TemplateView
from .base import AuthenticatedAPIView, PublicAPIView
from .models import Language, Module, Payment
from .payment_processors import get_payment_processor
from rest_framework import status, permissions, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserProfileSerializer, ChangePasswordSerializer, LanguageSerializer, EnrollLanguageSerializer
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

class RegisterView(PublicAPIView):
    # Viwe to create a new User instance if the provided data is valid.
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    # Specifies the serializer used to generate JWT tokens
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]

class LogoutView(AuthenticatedAPIView):

    def post(self, request):
        try:
            # Extract the refresh token from the request
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            # Add the token to the blacklist so it can't be used again
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(AuthenticatedAPIView):
    # View to retrieve, update, or delete the authenticated user's profile
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        # Partially update the current user's profile with provided data
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        request.user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class ChangePasswordView(AuthenticatedAPIView):
    
    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            
            # Check if the provided old password matches the user's current password
            if not user.check_password(old_password):
                return Response({"old_password": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)

            # Set the new password and save the user object
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LanguageListCreateView(PublicAPIView, generics.ListCreateAPIView):
    # Allows anyone (authenticated or not) to view the list of languages or add a new one
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    
class EnrollLanguageView(AuthenticatedAPIView):

    def post(self, request):
        # Validates and saves the enrollment request for a language
        serializer = EnrollLanguageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            language = serializer.save()
            return Response({"message": f"Enrolled in {language.name}"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnrolledLanguagesView(AuthenticatedAPIView):

    def get(self, request):
        # Returns a list of languages the user is currently enrolled in
        enrolled_languages = request.user.enrolled_languages.all()
        serializer = LanguageSerializer(enrolled_languages, many=True)
        return Response(serializer.data)

class LanguageDetailView(AuthenticatedAPIView):

    def get(self, request, language_id):
        user = request.user
        
        # Checks if the user is enrolled in the requested language
        if not user.enrolled_languages.filter(id=language_id).exists():
            return Response({"error": "Language not found for this user"}, status=404)

        try:
            language = Language.objects.get(id=language_id)
        except Language.DoesNotExist:
            return Response({"error": "Language not found"}, status=404)
        
        # Retrieves modules for this user and language
        modules = Module.objects.filter(language_id=language_id, user=user)
        
        response = OrderedDict()
        response["id"] = language.id
        response["name"] = language.name
        response["code"] = language.code
        response["price"] = str(language.price)
        response["schedule"] = language.schedule
        response["description"] = language.description
        response["modules"] = [
            {
                "id": module.id,
                "name": module.name,
                "progress": module.progress,
                "grade": module.grade
            }
            for module in modules
        ]

        return Response(response, status=200)

class UnenrollLanguageView(AuthenticatedAPIView):

    def delete(self, request, pk):
        user = request.user

        # Tries to get the language object
        try:
            language = Language.objects.get(pk=pk)
        except Language.DoesNotExist:
            return Response({"error": "Language not found"}, status=status.HTTP_404_NOT_FOUND)

        # Verifies if the user is enrolled in the language
        if language not in user.enrolled_languages.all():
            return Response({"error": "User is not enrolled in this language"}, status=status.HTTP_400_BAD_REQUEST)

        user.enrolled_languages.remove(language)
        return Response({"message": f"Unenrolled from {language.name}"}, status=status.HTTP_200_OK)

class CreatePaymentIntentView(AuthenticatedAPIView):

    def post(self, request):
        provider = request.data.get("provider", "stripe")
        language_ids = request.data.get("language_ids", [])
        if not language_ids:
            return Response({"error": "No languages provided"}, status=400)

        processor = get_payment_processor(provider)
        client_secret = processor.create_intent(request.user, language_ids)
        return Response({"client_secret": client_secret})

class ConfirmPaymentView(AuthenticatedAPIView):

    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id')
        if not payment_intent_id:
            return Response({"error": "Payment intent ID is required"}, status=400)

        provider = request.data.get("provider", "stripe")
        processor = get_payment_processor(provider)

        try:
            success, message = processor.confirm_payment(payment_intent_id, request.user)
            return Response({"message": message}, status=200)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=500)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

class FrontendView(TemplateView):
    def get(self, request, page="index"):
        # Dynamically loads HTML pages from the frontend
        return render(request, f"{page}.html")