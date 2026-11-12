from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from corrections.views import RegisterView, UserProfileView, CorrectTextView, HistoryListView, HistoryDetailView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/profile/", UserProfileView.as_view(), name="profile"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/correct/", CorrectTextView.as_view(), name="correct"),
    path("api/history/", HistoryListView.as_view(), name="history"),
    path("api/history/<int:pk>/", HistoryDetailView.as_view(), name="history-detail"),
]
