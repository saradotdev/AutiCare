from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from children.models import Child
import random
import logging
from .serializers import SocialScenarioGameSerializer, DialogueSerializer, SocialScenarioOptionSerializer, GameProgressSerializer, GameSessionSerializer, GameTypeSerializer
from .models import SocialScenario, GameType, GameProgress, GameSession
from django.utils import timezone

logger = logging.getLogger(__name__)

# Sample social scenarios for different age groups and difficulty levels
SOCIAL_SCENARIOS = {
    '3-5': {
        1: [
            {
                'title': 'Sharing Toys',
                'dialogues': [
                    {'character': 'character1', 'text': 'Can I play with your toy?'},
                    {'character': 'character2', 'text': 'Let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Yes, let\'s play together"', 'is_correct': True},
                    {'id': 2, 'text': 'Say "No" and leave', 'is_correct': False},
                    {'id': 3, 'text': 'Say nothing', 'is_correct': False},
                    {'id': 4, 'text': 'Look confused', 'is_correct': False},
                ],
                'character1_name': 'Friend',
                'character2_name': 'You',
            },
            {
                'title': 'Saying Hello',
                'dialogues': [
                    {'character': 'character1', 'text': 'Hi there!'},
                    {'character': 'character2', 'text': '...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Hi" and smile', 'is_correct': True},
                    {'id': 2, 'text': 'Stay quiet', 'is_correct': False},
                    {'id': 3, 'text': 'Run away', 'is_correct': False},
                    {'id': 4, 'text': 'Make a silly face', 'is_correct': False},
                ],
                'character1_name': 'New Friend',
                'character2_name': 'You',
            },
        ],
        2: [
            {
                'title': 'Taking Turns',
                'dialogues': [
                    {'character': 'character1', 'text': 'I want to use the slide now.'},
                    {'character': 'character2', 'text': 'But I just got here.'},
                    {'character': 'character1', 'text': 'I want a turn too.'},
                    {'character': 'character2', 'text': 'Oh, let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Let\'s take turns"', 'is_correct': True},
                    {'id': 2, 'text': 'Push them and go first', 'is_correct': False},
                    {'id': 3, 'text': 'Cry loudly', 'is_correct': False},
                    {'id': 4, 'text': 'Slide without asking', 'is_correct': False},
                ],
                'character1_name': 'Friend',
                'character2_name': 'You',
            }
        ],
        3: [
            {
                'title': 'Asking for Help',
                'dialogues': [
                    {'character': 'character1', 'text': 'What\'s wrong?'},
                    {'character': 'character2', 'text': 'I can\'t reach my toy.'},
                    {'character': 'character1', 'text': 'Oh, I see.'},
                    {'character': 'character2', 'text': '...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Ask your friend for help', 'is_correct': True},
                    {'id': 2, 'text': 'Climb the shelf', 'is_correct': False},
                    {'id': 3, 'text': 'Cry for help', 'is_correct': False},
                    {'id': 4, 'text': 'Walk away', 'is_correct': False},
                ],
                'character1_name': 'Parent',
                'character2_name': 'You',
            }
        ]
    },
    '6-8': {
        1: [
            {
                'title': 'Making Friends',
                'dialogues': [
                    {'character': 'character1', 'text': 'Those kids look like they\'re having fun.'},
                    {'character': 'character2', 'text': 'I want to join them.'},
                    {'character': 'character1', 'text': 'But they don\'t know us.'},
                    {'character': 'character2', 'text': 'Oh, let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Hi, can I join?"', 'is_correct': True},
                    {'id': 2, 'text': 'Start playing without asking', 'is_correct': False},
                    {'id': 3, 'text': 'Wait for invite', 'is_correct': False},
                    {'id': 4, 'text': 'Play alone', 'is_correct': False},
                ],
                'character1_name': 'Friend',
                'character2_name': 'You',
            }
        ],
        2: [
            {
                'title': 'Borrowing Things',
                'dialogues': [
                    {'character': 'character1', 'text': 'I like your book.'},
                    {'character': 'character2', 'text': 'Thanks! Just got it.'},
                    {'character': 'character1', 'text': 'Can I borrow it later?'},
                    {'character': 'character2', 'text': 'Let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Sure, when I\'m done"', 'is_correct': True},
                    {'id': 2, 'text': 'Say "No, I won\'t share"', 'is_correct': False},
                    {'id': 3, 'text': 'Say "Only if you trade"', 'is_correct': False},
                    {'id': 4, 'text': 'Say "Buy your own"', 'is_correct': False},
                ],
                'character1_name': 'Classmate',
                'character2_name': 'You',
            }
        ],
        3: [
            {
                'title': 'Resolving Conflicts',
                'dialogues': [
                    {'character': 'character1', 'text': 'You took my toy!'},
                    {'character': 'character2', 'text': 'I didn\'t know you were using it.'},
                    {'character': 'character1', 'text': 'I was! Give it back!'},
                    {'character': 'character2', 'text': 'Oh, let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Sorry! Let\'s take turns?"', 'is_correct': True},
                    {'id': 2, 'text': 'Say "It\'s mine now"', 'is_correct': False},
                    {'id': 3, 'text': 'Keep playing', 'is_correct': False},
                    {'id': 4, 'text': 'Start crying', 'is_correct': False},
                ],
                'character1_name': 'Friend',
                'character2_name': 'You',
            }
        ]
    },
    '9-12': {
        1: [
            {
                'title': 'Group Project',
                'dialogues': [
                    {'character': 'character1', 'text': 'We need a science project idea.'},
                    {'character': 'character2', 'text': 'I thought of solar energy.'},
                    {'character': 'character1', 'text': 'But I was thinking of animals.'},
                    {'character': 'character2', 'text': 'Oh, let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "Let\'s compare both ideas"', 'is_correct': True},
                    {'id': 2, 'text': 'Say "Mine\'s better! do mine"', 'is_correct': False},
                    {'id': 3, 'text': 'Say "Whatever"', 'is_correct': False},
                    {'id': 4, 'text': 'Work on your own', 'is_correct': False},
                ],
                'character1_name': 'Classmate',
                'character2_name': 'You',
            }
        ],
        2: [
            {
                'title': 'Online Communication',
                'dialogues': [
                    {'character': 'character1', 'text': 'Someone said mean stuff about you.'},
                    {'character': 'character2', 'text': 'What did they say?'},
                    {'character': 'character1', 'text': 'They said you cheated.'},
                    {'character': 'character2', 'text': 'Oh, let me think...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "That\'s not true. I\'ll talk to them"', 'is_correct': True},
                    {'id': 2, 'text': 'Be mean back', 'is_correct': False},
                    {'id': 3, 'text': 'Send an angry message', 'is_correct': False},
                    {'id': 4, 'text': 'Ignore it', 'is_correct': False},
                ],
                'character1_name': 'Friend',
                'character2_name': 'You',
            }
        ],
        3: [
            {
                'title': 'Being Excluded',
                'dialogues': [
                    {'character': 'character1', 'text': 'We\'re having a party.'},
                    {'character': 'character2', 'text': 'Sounds fun!'},
                    {'character': 'character1', 'text': 'But only a few can come...'},
                    {'character': 'character2', 'text': 'Am I invited?'},
                    {'character': 'character1', 'text': 'Sorry, not this time.'},
                    {'character': 'character2', 'text': '...'},
                ],
                'options': [
                    {'id': 1, 'text': 'Say "That\'s okay. Have fun!"', 'is_correct': True},
                    {'id': 2, 'text': 'Say "Didn\'t want to come anyway!"', 'is_correct': False},
                    {'id': 3, 'text': 'Start crying', 'is_correct': False},
                    {'id': 4, 'text': 'Tell others not to go', 'is_correct': False},
                ],
                'character1_name': 'Classmate',
                'character2_name': 'You',
            }
        ]
    }
}

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def social_scenario_game(request, child_id, session_id=None, difficulty=None):
    """
    API endpoint for the social scenario game providing dialogues and response options
    
    Parameters:
        child_id: ID of the child
        session_id: Optional session ID (if not provided, a new session will be created)
        difficulty: Optional difficulty level override (1, 2, or 3)
        
    Returns:
        Response: JSON with dialogues and options
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Determine difficulty level and session
        difficulty_level = 1  # Default
        created_session = False
        
        if session_id:
            # Use existing session
            try:
                session = GameSession.objects.get(id=session_id)
                # Verify the session belongs to this child
                if session.child.id != child.id:
                    return Response(
                        {"error": "Session does not belong to this child"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                difficulty_level = session.difficulty_level
            except GameSession.DoesNotExist:
                return Response(
                    {"error": "Session not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        elif difficulty:
            # Use provided difficulty
            difficulty_level = difficulty
            
            # Validate difficulty
            if difficulty_level not in [1, 2, 3]:
                return Response(
                    {"error": "Invalid difficulty level. Must be 1, 2, or 3."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Use difficulty from progress
            try:
                game_type = GameType.objects.get(code="SOCIAL")
                progress, created = GameProgress.objects.get_or_create(
                    child=child, 
                    game_type=game_type,
                    defaults={'current_difficulty': 1}
                )
                difficulty_level = progress.current_difficulty
            except GameType.DoesNotExist:
                # Fallback to default difficulty
                pass
        
        # If no session was provided, create a new one automatically
        if not session_id:
            try:
                game_type = GameType.objects.get(code="SOCIAL")
                
                # Create a new session
                session = GameSession.objects.create(
                    child=child,
                    game_type=game_type,
                    difficulty_level=difficulty_level
                )
                session_id = session.id
                created_session = True
                logger.info(f"Automatically created new social scenario game session {session_id} for child {child_id}")
            except Exception as e:
                logger.error(f"Error creating session: {str(e)}")
        
        # Verify age group
        age_group = _validate_age_for_social_scenario(child.age)
        if not age_group:
            return Response(
                {"error": "Social scenario game is currently only available for children aged 3-5, 6-8, or 9-12"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get game data based on age group and difficulty
        game_data = _get_social_scenario_game_data(request, age_group, difficulty_level)
        
        # Convert the data to our response format
        response_data = {
            'id': random.randint(1000, 9999),  # Just for the frontend to have a unique identifier
            'title': game_data['title'],
            'age_group': age_group,
            'difficulty': difficulty_level,
            'character1_name': game_data['character1_name'],
            'character2_name': game_data['character2_name'],
            'dialogues': game_data['dialogues'],
            'options': game_data['options'],
            'session_id': session_id,  # Include session ID
            'session_created': created_session  # Include whether session was created
        }
        
        # Return the response data
        return Response(response_data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error generating social scenario game: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def social_scenario_batch(request, child_id, session_id=None, difficulty=None, count=5):
    """
    Get a batch of social scenarios for a child
    
    Parameters:
        child_id: ID of the child
        session_id: Optional session ID (if not provided, a new session will be created)
        difficulty: Optional difficulty level override (1, 2, or 3)
        count: Number of scenarios to return (max 10)
        
    Returns:
        Response: JSON with list of scenarios
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Determine difficulty level and session
        difficulty_level = 1  # Default
        created_session = False
        
        if session_id:
            # Use existing session
            try:
                session = GameSession.objects.get(id=session_id)
                # Verify the session belongs to this child
                if session.child.id != child.id:
                    return Response(
                        {"error": "Session does not belong to this child"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                difficulty_level = session.difficulty_level
            except GameSession.DoesNotExist:
                return Response(
                    {"error": "Session not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        elif difficulty:
            # Use provided difficulty
            difficulty_level = difficulty
            
            # Validate difficulty
            if difficulty_level not in [1, 2, 3]:
                return Response(
                    {"error": "Invalid difficulty level. Must be 1, 2, or 3."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Use difficulty from progress
            try:
                game_type = GameType.objects.get(code="SOCIAL")
                progress, created = GameProgress.objects.get_or_create(
                    child=child, 
                    game_type=game_type,
                    defaults={'current_difficulty': 1}
                )
                difficulty_level = progress.current_difficulty
            except GameType.DoesNotExist:
                # Fallback to default difficulty
                pass
        
        # If no session was provided, create a new one automatically
        if not session_id:
            try:
                game_type = GameType.objects.get(code="SOCIAL")
                
                # Create a new session
                session = GameSession.objects.create(
                    child=child,
                    game_type=game_type,
                    difficulty_level=difficulty_level
                )
                session_id = session.id
                created_session = True
                logger.info(f"Automatically created new social scenario batch session {session_id} for child {child_id}")
            except Exception as e:
                logger.error(f"Error creating session: {str(e)}")
        
        # Validate count
        if count <= 0 or count > 10:
            return Response(
                {"error": "Count must be between 1 and 10."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify age group
        age_group = _validate_age_for_social_scenario(child.age)
        if not age_group:
            return Response(
                {"error": "Social scenario game is currently only available for children aged 3-5, 6-8, or 9-12"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get multiple scenarios based on age group and difficulty
        scenarios = []
        available_scenarios = SOCIAL_SCENARIOS.get(age_group, {}).get(difficulty_level, [])
        
        if not available_scenarios:
            return Response(
                {"error": f"No social scenarios available for age group {age_group} and difficulty {difficulty_level}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # If we don't have enough scenarios, duplicate them
        if len(available_scenarios) < count:
            # Repeat the scenarios until we have enough
            scenarios_to_use = available_scenarios * (count // len(available_scenarios) + 1)
        else:
            scenarios_to_use = available_scenarios.copy()
        
        # Shuffle to randomize order
        random.shuffle(scenarios_to_use)
        
        # Take the requested number of scenarios
        for i in range(min(count, len(scenarios_to_use))):
            scenario = scenarios_to_use[i]
            scenarios.append({
                'id': i + 1,  # Just a sequential ID for the frontend
                'title': scenario['title'],
                'age_group': age_group,
                'difficulty': difficulty_level,
                'character1_name': scenario['character1_name'],
                'character2_name': scenario['character2_name'],
                'dialogues': scenario['dialogues'],
                'options': scenario['options'],
                'session_id': session_id  # Include session ID
            })
        
        response_data = {"scenarios": scenarios}
        
        # Add if session was created
        if created_session:
            response_data['session_created'] = True
            
        return Response(response_data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving social scenario batch: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _validate_age_for_social_scenario(age):
    """
    Validate if the child's age is supported for the social scenario game
    
    Args:
        age: Child's age (string or integer)
        
    Returns:
        str: Age group if valid, None if not supported
    """
    # Check string age ranges
    if age in ["3-5", "6-8", "9-12"]:
        return age
    
    # Check if age is numeric
    try:
        numeric_age = int(age)
        if 3 <= numeric_age <= 5:
            return "3-5"
        elif 6 <= numeric_age <= 8:
            return "6-8"
        elif 9 <= numeric_age <= 12:
            return "9-12"
    except (ValueError, TypeError):
        pass
    
    # Not a supported age
    return None

def _get_social_scenario_game_data(request, age_group, difficulty):
    """
    Get random social scenario game data for the specified age group and difficulty
    
    Args:
        request: The HTTP request
        age_group: Age group (3-5, 6-8, or 9-12)
        difficulty: Difficulty level (1, 2, or 3)
        
    Returns:
        dict: Social scenario game data
    """
    # In a production system, we would fetch from the database:
    # scenarios = SocialScenario.objects.filter(age_group=age_group, difficulty=difficulty)
    
    # Using our in-memory data for now
    available_scenarios = SOCIAL_SCENARIOS.get(age_group, {}).get(difficulty, [])
    
    if not available_scenarios:
        logger.warning(f"No social scenarios available for age group {age_group} and difficulty {difficulty}")
        
        # Fallback to the first available age group and difficulty if none available
        for ag in SOCIAL_SCENARIOS:
            for diff in SOCIAL_SCENARIOS[ag]:
                if SOCIAL_SCENARIOS[ag][diff]:
                    available_scenarios = SOCIAL_SCENARIOS[ag][diff]
                    break
            if available_scenarios:
                break
    
    # Select a random scenario from the available ones
    scenario = random.choice(available_scenarios)
    
    return scenario

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_game_progress(request, child_id, game_code):
    """
    Retrieve a child's progress for a specific game type
    
    Parameters:
        child_id: ID of the child
        game_code: Game type code (FACIAL, MATCHSORT, SOCIAL)
        
    Returns:
        Response: JSON with progress data
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get the game type
        game_type = GameType.objects.get(code=game_code)
        
        # Get or create progress
        progress, created = GameProgress.objects.get_or_create(
            child=child,
            game_type=game_type,
            defaults={'current_difficulty': 1}
        )
        
        serializer = GameProgressSerializer(progress)
        return Response(serializer.data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except GameType.DoesNotExist:
        logger.warning(f"Game type with code {game_code} not found")
        return Response(
            {"error": "Game type not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving game progress: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def start_game_session(request, child_id, game_code):
    """
    Start a new game session for a child
    
    An active app session is required to start a game session.
    
    Parameters:
        child_id: ID of the child
        game_code: Game type code (FACIAL, MATCHSORT, SOCIAL)
        
    Returns:
        Response: JSON with session data
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Check if there's an active app session
        from children.models import Session as AppSession
        active_app_session = AppSession.get_active_session(child)
        
        if not active_app_session:
            return Response(
                {"error": "No active app session found. Start an app session first."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the game type
        game_type = GameType.objects.get(code=game_code)
        
        # Get or create progress to determine difficulty level
        progress, created = GameProgress.objects.get_or_create(
            child=child,
            game_type=game_type,
            defaults={'current_difficulty': 1}
        )
        
        # Create the session
        session = GameSession.objects.create(
            child=child,
            game_type=game_type,
            difficulty_level=progress.current_difficulty
        )
        
        # Return the session data including the difficulty level to use
        response_data = {
            'session_id': session.id,
            'difficulty_level': progress.current_difficulty,
            'game_type': game_type.name,
            'game_code': game_type.code
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except GameType.DoesNotExist:
        logger.warning(f"Game type with code {game_code} not found")
        return Response(
            {"error": "Game type not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error starting game session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def end_game_session(request, session_id):
    """
    End a game session and update progress
    
    Parameters:
        session_id: ID of the game session
        
    Request Data:
        correct_answers: Number of correct answers
        incorrect_answers: Number of incorrect answers
        session_data: Optional JSON data with game-specific details
        
    Returns:
        Response: JSON with updated session and progress data
    """
    try:
        # Get the session
        session = GameSession.objects.get(id=session_id)
        
        # Verify the session belongs to the user's child
        if not Child.objects.filter(id=session.child.id, user=request.user).exists():
            return Response(
                {"error": "You do not have permission to update this session"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if session is already completed
        if session.completed:
            return Response(
                {"error": "This session has already been completed", 
                 "session": GameSessionSerializer(session).data}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the session with results
        correct = request.data.get('correct_answers', 0)
        incorrect = request.data.get('incorrect_answers', 0)
        session_data = request.data.get('session_data', {})
        
        # End the session and get difficulty change result
        session_result, difficulty_change = session.end_session(correct=correct, incorrect=incorrect, session_data=session_data)
        
        # Get the updated progress
        progress = GameProgress.objects.get(child=session.child, game_type=session.game_type)
        
        # Get or create the daily app session for this child
        from children.models import Session as AppSession
        today = timezone.now().date()
        
        try:
            # First try to get the active session
            app_session = AppSession.objects.get(child=session.child, active=True)
            
            # If the session date is not today, end it and create a new one
            if app_session.session_date != today:
                app_session.active = False
                app_session.save()
                
                # Ensure no other active sessions exist
                AppSession.objects.filter(child=session.child, active=True).update(active=False)
                
                # Create a new session
                app_session = AppSession.objects.create(
                    child=session.child,
                    session_date=today,
                    active=True,
                    duration=0,
                    limit_crossed=False
                )
        except AppSession.DoesNotExist:
            # Ensure no active sessions exist
            AppSession.objects.filter(child=session.child, active=True).update(active=False)
            
            # Create new session
            app_session = AppSession.objects.create(
                child=session.child,
                session_date=today,
                active=True,
                duration=0, 
                limit_crossed=False
            )
        except AppSession.MultipleObjectsReturned:
            # Handle case where multiple active sessions exist
            logger.warning(f"Multiple active sessions found for child {session.child.id}")
            
            # Keep only the most recent active session
            active_sessions = AppSession.objects.filter(
                child=session.child, 
                active=True
            ).order_by('-session_date')
            
            if active_sessions.exists():
                app_session = active_sessions.first()
                
                # Deactivate all other sessions
                active_sessions.exclude(id=app_session.id).update(active=False)
                
                # If this session is not for today, create a new session
                if app_session.session_date != today:
                    app_session.active = False
                    app_session.save()
                    app_session = AppSession.objects.create(
                        child=session.child,
                        session_date=today,
                        active=True,
                        duration=0,
                        limit_crossed=False
                    )
            else:
                app_session = AppSession.objects.create(
                    child=session.child,
                    session_date=today,
                    active=True,
                    duration=0,
                    limit_crossed=False
                )
                
#        app_sessions = AppSession.objects.filter(child=session.child, session_date=today)
#
#        if app_sessions.exists():
#            # Just pick the last one to update instead of erroring out
#            app_session = app_sessions.last()
#            created = False
#        else:
#            # Safe to create
#            app_session = AppSession.objects.create(
#                child=session.child,
#                session_date=today,
#                duration=0,
#                limit_crossed=False
#            )
#            created = True
        
        # Associate this game session with the app session
        app_session.add_game_session(session_id)
        
        # Update game usage statistics in the app session
        app_session.update_game_usage(
            session.game_type.code,
            correct=correct,
            incorrect=incorrect
        )
        
        # Get all progress for the child and update the daily progress snapshot
        all_progress = GameProgress.objects.filter(child=session.child)
        progress_snapshot = {}
        
        # Build a snapshot of all game progress
        for game_progress in all_progress:
            progress_snapshot[game_progress.game_type.code] = {
                'current_difficulty': game_progress.current_difficulty,
                'correct_answers': game_progress.correct_answers,
                'incorrect_answers': game_progress.incorrect_answers,
                'total_games_played': game_progress.total_games_played,
                'score_percentage': game_progress.score_percentage
            }
            
        # Update the daily progress snapshot
        app_session.update_daily_progress(progress_snapshot)
        
        # Return the updated data
        response_data = {
            'session': GameSessionSerializer(session).data,
            'progress': GameProgressSerializer(progress).data,
            'difficulty_changed': difficulty_change != 0,
            'difficulty_increased': difficulty_change > 0,
            'difficulty_decreased': difficulty_change < 0,
            'app_session': {
                'id': app_session.id,
                'game_sessions': app_session.game_sessions,
                'game_usage': app_session.game_usage,
                'daily_progress': app_session.daily_progress
            }
        }
        
        return Response(response_data)
    
    except GameSession.DoesNotExist:
        logger.warning(f"Game session with ID {session_id} not found")
        return Response(
            {"error": "Game session not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error ending game session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_child_sessions(request, child_id):
    """
    Get all game sessions for a child
    
    Parameters:
        child_id: ID of the child
        
    Query Parameters:
        game_code: Optional filter by game type
        limit: Optional limit on number of sessions (default 10)
        
    Returns:
        Response: JSON with session list
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get optional filters
        game_code = request.query_params.get('game_code', None)
        limit = int(request.query_params.get('limit', 10))
        
        # Apply filters
        sessions = GameSession.objects.filter(child=child).order_by('-start_time')
        
        if game_code:
            try:
                game_type = GameType.objects.get(code=game_code)
                sessions = sessions.filter(game_type=game_type)
            except GameType.DoesNotExist:
                pass
        
        sessions = sessions[:limit]
        
        serializer = GameSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving child sessions: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_progress(request, child_id):
    """
    Get progress for all game types for a child
    
    Parameters:
        child_id: ID of the child
        
    Returns:
        Response: JSON with progress data for all games
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get all game types
        game_types = GameType.objects.all()
        
        # Get or create progress for each game type
        progress_data = []
        
        for game_type in game_types:
            progress, created = GameProgress.objects.get_or_create(
                child=child,
                game_type=game_type,
                defaults={'current_difficulty': 1}
            )
            
            progress_data.append({
                'game_type': GameTypeSerializer(game_type).data,
                'progress': GameProgressSerializer(progress).data
            })
        
        return Response(progress_data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving all progress: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
