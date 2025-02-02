from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserCreateView, CustomTokenObtainPairView
from children.views import ChildViewSet, SessionViewSet

router = DefaultRouter()
router.register(r'children', ChildViewSet)
router.register(r'sessions', SessionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/register/', UserCreateView.as_view(), name='register'),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]