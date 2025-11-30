from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from .views import RegisterView, LoginView, LogoutView, UserProfileView, ChangePasswordView,LanguageListCreateView, EnrollLanguageView, EnrolledLanguagesView, LanguageDetailView,UnenrollLanguageView, CreatePaymentIntentView, ConfirmPaymentView, FrontendView

urlpatterns = [
    # API endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('languages/', LanguageListCreateView.as_view(), name='language-list-create'),
    path('languages/enroll/', EnrollLanguageView.as_view(), name='enroll-language'),
    path('languages/enrolled/', EnrolledLanguagesView.as_view(), name='enrolled-languages'),
    path("languages/<int:language_id>/", LanguageDetailView.as_view(), name="language-detail"),
    path("languages/<int:pk>/unenroll/", UnenrollLanguageView.as_view(), name="language-unenroll"),
    path('payments/create-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payments/confirm/', ConfirmPaymentView.as_view(), name='confirm_payment'),
    # Frontend (HTML templates)
    path('', FrontendView.as_view(), name='home'),
    path('<str:page>.html', FrontendView.as_view(), name='frontend'),
]
