from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserCreateView, CustomTokenObtainPairView
from children.views import (
    ChildViewSet, SessionViewSet, 
    facial_expressions_for_child, serve_facial_expression,
    match_and_sort_game, serve_game_asset,
    start_app_session, end_app_session, get_child_app_sessions,
    check_active_session, update_app_session_duration
)
from activities.views import (
    social_scenario_game, social_scenario_batch,
    get_game_progress, start_game_session, end_game_session,
    get_child_sessions, get_all_progress
)
from reports.views import (
    get_game_analysis, get_all_game_analysis, get_improvement_trends
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

    # App Usage Tracking endpoints
    path('api/children/<int:child_id>/app-usage/start/', start_app_session, name='start_app_session'),
    path('api/children/<int:child_id>/app-usage/check/', check_active_session, name='check_active_session'),
    path('api/app-usage/<int:session_id>/end/', end_app_session, name='end_app_session'),
    path('api/app-usage/<int:session_id>/update-duration/', update_app_session_duration, name='update_app_session_duration'),
    path('api/children/<int:child_id>/app-usage/', get_child_app_sessions, name='get_child_app_sessions'),

    # Facial Expressions Game endpoints
    path('api/children/<int:child_id>/facial-expressions/', facial_expressions_for_child, name='facial_expressions'),
    path('api/children/<int:child_id>/facial-expressions/<int:difficulty>/', facial_expressions_for_child, name='facial_expressions_with_difficulty'),
    path('api/children/<int:child_id>/facial-expressions/session/<int:session_id>/', facial_expressions_for_child, name='facial_expressions_with_session'),
    path('api/facial-expressions/<str:expression_type>/<str:filename>', serve_facial_expression, name='serve_facial_expression'),
    
    # Match and Sort Game endpoints
    path('api/children/<int:child_id>/match-and-sort/', match_and_sort_game, name='match_and_sort_game'),
    path('api/children/<int:child_id>/match-and-sort/<int:difficulty>/', match_and_sort_game, name='match_and_sort_game_with_difficulty'),
    path('api/children/<int:child_id>/match-and-sort/session/<int:session_id>/', match_and_sort_game, name='match_and_sort_game_with_session'),
    path('api/game-assets/<str:game_type>/<str:asset_type>/<str:shape_type>/<str:filename>', serve_game_asset, name='serve_game_asset'),
    
    # Social Scenario Game endpoints
    path('api/children/<int:child_id>/social-scenario/', social_scenario_game, name='social_scenario_game'),
    path('api/children/<int:child_id>/social-scenario/<int:difficulty>/', social_scenario_game, name='social_scenario_game_with_difficulty'),
    path('api/children/<int:child_id>/social-scenario/session/<int:session_id>/', social_scenario_game, name='social_scenario_game_with_session'),
    path('api/children/<int:child_id>/social-scenario-batch/', social_scenario_batch, name='social_scenario_batch'),
    path('api/children/<int:child_id>/social-scenario-batch/<int:difficulty>/', social_scenario_batch, name='social_scenario_batch_with_difficulty'),
    path('api/children/<int:child_id>/social-scenario-batch/session/<int:session_id>/', social_scenario_batch, name='social_scenario_batch_with_session'),
    path('api/children/<int:child_id>/social-scenario-batch/<int:difficulty>/<int:count>/', social_scenario_batch, name='social_scenario_batch_with_count'),
    
    # Game Progress endpoints
    path('api/children/<int:child_id>/progress/<str:game_code>/', get_game_progress, name='get_game_progress'),
    path('api/children/<int:child_id>/progress/', get_all_progress, name='get_all_progress'),
    
    # Game Session endpoints
    path('api/children/<int:child_id>/start-session/<str:game_code>/', start_game_session, name='start_game_session'),
    path('api/sessions/<int:session_id>/end/', end_game_session, name='end_game_session'),
    path('api/children/<int:child_id>/sessions/', get_child_sessions, name='get_child_sessions'),
    
    # Game Analysis endpoints
    path('api/children/<int:child_id>/analysis/<str:game_code>/', get_game_analysis, name='get_game_analysis'),
    path('api/children/<int:child_id>/analysis/', get_all_game_analysis, name='get_all_game_analysis'),
    path('api/children/<int:child_id>/trends/', get_improvement_trends, name='get_improvement_trends'),
]

# Add URL patterns for serving media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)