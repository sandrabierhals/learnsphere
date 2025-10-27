from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

class AuthenticatedAPIView(APIView):
    # Base view requiring authentication
    permission_classes = [IsAuthenticated]

class PublicAPIView(APIView):
    # Base view open to everyone
    permission_classes = [AllowAny]
