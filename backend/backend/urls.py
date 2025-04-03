from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserCreateView, CustomTokenObtainPairView
from children.views import (
    ChildViewSet, SessionViewSet, 
    facial_expressions_for_child, serve_facial_expression,
    match_and_sort_game, serve_game_asset
)
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
    
    # Match and Sort Game endpoints
    path('api/children/<int:child_id>/match-and-sort/', match_and_sort_game, name='match_and_sort_game'),
    path('api/children/<int:child_id>/match-and-sort/<int:difficulty>/', match_and_sort_game, name='match_and_sort_game_with_difficulty'),
    path('api/game-assets/<str:game_type>/<str:asset_type>/<str:shape_type>/<str:filename>', serve_game_asset, name='serve_game_asset'),
]

# Add URL patterns for serving media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)