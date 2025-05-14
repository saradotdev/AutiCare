from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from children.models import Child
from activities.models import GameType, GameSession
from .models import GameAnalysis
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class GameAnalysisSerializer:
    @staticmethod
    def to_representation(instance):
        """Convert a GameAnalysis instance to a dictionary"""
        return {
            'id': instance.id,
            'child_id': instance.child.id,
            'child_name': f"{instance.child.first_name} {instance.child.last_name}".strip(),
            'game_type': {
                'id': instance.game_type.id,
                'name': instance.game_type.name,
                'code': instance.game_type.code
            },
            'period': instance.period,
            'start_date': instance.start_date.isoformat(),
            'end_date': instance.end_date.isoformat(),
            'performance': {
                'total_sessions': instance.total_sessions,
                'correct_answers': instance.correct_answers,
                'incorrect_answers': instance.incorrect_answers,
                'average_score': round(instance.average_score, 2),
                'total_time_spent': instance.total_time_spent,
                'average_time_per_session': round(instance.average_time_per_session, 2)
            },
            'improvement': {
                'score_change': round(instance.score_change, 2),
                'time_change': round(instance.time_change, 2)
            },
            'strengths': instance.strengths,
            'weaknesses': instance.weaknesses,
            'improvements': instance.improvements,
            'created_at': instance.created_at.isoformat()
        }

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_game_analysis(request, child_id, game_code):
    """
    Get analysis for a specific game for a child
    
    Parameters:
        child_id: ID of the child
        game_code: Code of the game type
        
    Query Parameters:
        period: 'day', 'week', or 'month' (default: 'day')
        force_refresh: Whether to regenerate the analysis (default: false)
        
    Returns:
        Analysis data for the specified game
    """
    try:
        # Validate child belongs to user
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Validate game type
        try:
            game_type = GameType.objects.get(code=game_code)
        except GameType.DoesNotExist:
            return Response(
                {"error": f"Game type with code '{game_code}' not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get period parameter
        period = request.query_params.get('period', 'day')
        if period not in ['day', 'week', 'month']:
            return Response(
                {"error": "Period must be 'day', 'week', or 'month'"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if we should refresh the analysis
        force_refresh = request.query_params.get('force_refresh', 'false').lower() == 'true'
        
        # Find existing analysis or generate new one
        if force_refresh:
            # Force regeneration of analysis
            analysis = GameAnalysis.generate_analysis(child, game_type, period)
        else:
            # Try to find existing recent analysis first
            today = timezone.now().date()
            
            analysis = GameAnalysis.objects.filter(
                child=child,
                game_type=game_type,
                period=period,
                end_date=today
            ).first()
            
            # If no analysis exists or it's outdated, generate a new one
            if not analysis:
                analysis = GameAnalysis.generate_analysis(child, game_type, period)
        
        if not analysis:
            return Response(
                {"message": f"No data available for the specified period"}, 
                status=status.HTTP_200_OK
            )
        
        # Return serialized data
        return Response(GameAnalysisSerializer.to_representation(analysis))
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error generating game analysis: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_game_analysis(request, child_id):
    """
    Get analysis for all games for a child
    
    Parameters:
        child_id: ID of the child
        
    Query Parameters:
        period: 'day', 'week', or 'month' (default: 'day')
        force_refresh: Whether to regenerate the analysis (default: false)
        
    Returns:
        Analysis data for all games the child has played
    """
    try:
        # Validate child belongs to user
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get period parameter
        period = request.query_params.get('period', 'day')
        if period not in ['day', 'week', 'month']:
            return Response(
                {"error": "Period must be 'day', 'week', or 'month'"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if we should refresh the analysis
        force_refresh = request.query_params.get('force_refresh', 'false').lower() == 'true'
        
        # Get all game types the child has played
        game_sessions = GameSession.objects.filter(
            child=child,
            completed=True
        ).values_list('game_type', flat=True).distinct()
        
        game_types = GameType.objects.filter(id__in=game_sessions)
        
        # Collect analysis for each game type
        analyses = []
        today = timezone.now().date()
        
        for game_type in game_types:
            analysis = None
            
            if not force_refresh:
                # Try to find existing recent analysis first
                analysis = GameAnalysis.objects.filter(
                    child=child,
                    game_type=game_type,
                    period=period,
                    end_date=today
                ).first()
            
            # If no analysis exists or force refresh is requested, generate a new one
            if not analysis or force_refresh:
                analysis = GameAnalysis.generate_analysis(child, game_type, period)
            
            if analysis:
                analyses.append(GameAnalysisSerializer.to_representation(analysis))
        
        if not analyses:
            return Response(
                {"message": "No game data available for analysis"}, 
                status=status.HTTP_200_OK
            )
        
        # Return all analyses
        return Response(analyses)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error generating game analysis: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_improvement_trends(request, child_id):
    """
    Get improvement trends for a child across all games and time periods
    
    Parameters:
        child_id: ID of the child
        
    Returns:
        Improvement trends for all games across different time periods
    """
    try:
        # Validate child belongs to user
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get all game types the child has played
        game_sessions = GameSession.objects.filter(
            child=child,
            completed=True
        ).values_list('game_type', flat=True).distinct()
        
        game_types = GameType.objects.filter(id__in=game_sessions)
        
        # Generate analyses for all periods if they don't exist
        periods = ['day', 'week', 'month']
        today = timezone.now().date()
        
        trends = {}
        
        for game_type in game_types:
            game_trends = {
                'name': game_type.name,
                'code': game_type.code,
                'periods': {}
            }
            
            for period in periods:
                # Try to find existing analysis
                analysis = GameAnalysis.objects.filter(
                    child=child,
                    game_type=game_type,
                    period=period,
                    end_date=today
                ).first()
                
                # If no analysis exists, generate a new one
                if not analysis:
                    analysis = GameAnalysis.generate_analysis(child, game_type, period)
                
                if analysis:
                    period_data = {
                        'average_score': round(analysis.average_score, 2),
                        'score_change': round(analysis.score_change, 2),
                        'total_sessions': analysis.total_sessions,
                        'strengths': analysis.strengths,
                        'weaknesses': analysis.weaknesses,
                        'improvements': analysis.improvements,
                    }
                    
                    game_trends['periods'][period] = period_data
            
            if game_trends['periods']:
                trends[game_type.code] = game_trends
        
        if not trends:
            return Response(
                {"message": "No game data available for improvement tracking"}, 
                status=status.HTTP_200_OK
            )
        
        # Return trends data
        return Response({
            'child_id': child.id,
            'child_name': f"{child.first_name} {child.last_name}".strip(),
            'trends': trends
        })
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error generating improvement trends: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
