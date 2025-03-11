from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserCreateView, CustomTokenObtainPairView
from children.views import ChildViewSet, SessionViewSet, facial_expressions_for_child, serve_facial_expression
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'children', ChildViewSet)
router.register(r'sessions', SessionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/register/', UserCreateView.as_view(), name='register'),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/children/<int:child_id>/facial-expressions/', facial_expressions_for_child, name='facial_expressions'),
    path('api/facial-expressions/<str:expression_type>/<str:filename>', serve_facial_expression, name='serve_facial_expression'),
]

# Add URL patterns for serving media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)