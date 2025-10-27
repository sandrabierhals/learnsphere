from django.contrib import admin
from django.urls import path, include
from learnsphere.views import FrontendView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('learnsphere.urls')),
    path('<str:page>.html', FrontendView.as_view(), name='frontend'),
]
