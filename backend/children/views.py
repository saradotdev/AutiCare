from rest_framework import viewsets, status
from .models import Child, Session
from .serializers import (
    ChildSerializer, SessionSerializer, 
    FacialExpressionSerializer, FacialExpressionListSerializer,
    ExpressionGroupSerializer, ExpressionGroupListSerializer,
    BucketSerializer, FallingObjectSerializer, MatchAndSortGameSerializer
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
import os
import random
import logging
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponse
from django.utils import timezone

# Set up logging
logger = logging.getLogger(__name__)

class ChildViewSet(viewsets.ModelViewSet):
    serializer_class = ChildSerializer
    queryset = Child.objects.all()
    authentication_classes = [JWTAuthentication]  # Use your preferred authentication
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    # Add this method to filter children by the logged-in user
    def get_queryset(self):
        return Child.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate child with logged-in user
        serializer.save(user=self.request.user)

class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    queryset = Session.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only show sessions for children belonging to the requesting user
        return Session.objects.filter(child__user=self.request.user)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def facial_expressions_for_child(request, child_id, session_id=None, difficulty=None):
    """
    API endpoint that returns facial expression images appropriate for a child's age.
    
    - For children aged "3-5" (string or integers 3-5): Returns 10 random images from happy/sad folders
    - For children aged "6-8": Returns 5 random images from all expression folders
    - For children aged "9-12": Returns images grouped by expression type with correct/incorrect images to identify
    
    Parameters:
        child_id: ID of the child
        session_id: Optional session ID (if not provided, a new session will be created)
        difficulty: Optional difficulty level override (1, 2, or 3)
    
    Returns:
        Response: JSON containing list of images with their ID, type, and URL
    """
    try:
        # Get the child, ensuring it belongs to the requesting user
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Determine difficulty level and session
        difficulty_level = 1  # Default
        created_session = False
        
        if session_id:
            # Use existing session
            try:
                from activities.models import GameSession
                session = GameSession.objects.get(id=session_id)
                # Verify the session belongs to this child
                if session.child.id != child.id:
                    return Response(
                        {"error": "Session does not belong to this child"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                difficulty_level = session.difficulty_level
            except (ImportError, GameSession.DoesNotExist):
                return Response(
                    {"error": "Session not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        elif difficulty is not None:
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
                from activities.models import GameType, GameProgress
                game_type = GameType.objects.get(code="FACIAL")
                progress, created = GameProgress.objects.get_or_create(
                    child=child, 
                    game_type=game_type,
                    defaults={'current_difficulty': 1}
                )
                difficulty_level = progress.current_difficulty
            except (ImportError, GameType.DoesNotExist):
                # Fallback to default difficulty
                pass
        
        # If no session was provided, create a new one automatically
        if not session_id:
            try:
                from activities.models import GameType, GameSession
                game_type = GameType.objects.get(code="FACIAL")
                
                # Create a new session
                session = GameSession.objects.create(
                    child=child,
                    game_type=game_type,
                    difficulty_level=difficulty_level
                )
                session_id = session.id
                created_session = True
                logger.info(f"Automatically created new facial expressions game session {session_id} for child {child_id}")
            except ImportError:
                logger.error("Could not import required models to create a session")
            except Exception as e:
                logger.error(f"Error creating session: {str(e)}")
        
        # Define valid expressions and default settings
        VALID_EXPRESSIONS = {
            'happy': True,
            'sad': True,
            'angry': True,
            'fear': True,
            'disgust': True,
            'neutral': True,
            'surprise': True
        }
        
        # Configure settings based on age, considering difficulty level
        config = _get_expression_config_for_age(child.age, difficulty_level)
        if not config:
            return Response(
                {"error": "Facial expressions are only available for children aged 3-5, 6-8, or 9-12"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Collect and return images
        if config.get('special_handling'):
            # For age group 9-12 with special handling
            response_data = _get_special_images_response(request, config, VALID_EXPRESSIONS)
            
            # Convert response data to a mutable dictionary if it's not already
            if not isinstance(response_data.data, dict):
                response_dict = dict(response_data.data)
            else:
                response_dict = response_data.data
                
            # Add session information
            response_dict['session_id'] = session_id
            if created_session:
                response_dict['session_created'] = True
            response_dict['difficulty'] = difficulty_level
            
            # Create new response with updated data
            return Response(response_dict)
        else:
            # For age groups 3-5 and 6-8
            response_data = _get_images_response(request, config, VALID_EXPRESSIONS)
            
            # Convert response data to a mutable dictionary if it's not already
            if not isinstance(response_data.data, dict):
                response_dict = dict(response_data.data)
            else:
                response_dict = response_data.data
            
            # Add session information
            response_dict['session_id'] = session_id
            if created_session:
                response_dict['session_created'] = True
            response_dict['difficulty'] = difficulty_level
            
            # Create new response with updated data
            return Response(response_dict)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error processing facial expressions: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _get_expression_config_for_age(age, difficulty=1):
    """
    Helper function to determine expression configuration based on child's age and difficulty
    
    Args:
        age: The age of the child (string value)
        difficulty: The difficulty level (1, 2, or 3)
        
    Returns:
        dict: Configuration with expression_types, num_images, age_group, and special handling flags
    """
    # All possible expressions
    all_expressions = ['happy', 'sad', 'angry', 'fear', 'disgust', 'neutral', 'surprise']
    default_expressions = ['happy', 'sad']
    
    # Handle different age groups with their difficulty variations
    if age == "3-5":
        if difficulty == 1:
            # Easiest level: Only happy and sad
            return {
                'expression_types': default_expressions,
                'num_images': 4,
                'age_group': "3-5",
                'special_handling': False,
                'difficulty': 1
            }
        elif difficulty == 2:
            # Medium level: Add surprise
            return {
                'expression_types': default_expressions + ['surprise'],
                'num_images': 5,
                'age_group': "3-5",
                'special_handling': False,
                'difficulty': 2
            }
        else:  # difficulty == 3
            # Hardest level: Add angry
            return {
                'expression_types': default_expressions + ['surprise', 'angry'],
                'num_images': 6,
                'age_group': "3-5",
                'special_handling': False,
                'difficulty': 3
            }
            
    elif age == "6-8":
        if difficulty == 1:
            # Easiest level: 5 basic expressions
            return {
                'expression_types': ['happy', 'sad', 'angry', 'surprise', 'neutral'],
                'num_images': 5,
                'age_group': "6-8",
                'special_handling': False,
                'difficulty': 1
            }
        elif difficulty == 2:
            # Medium level: Add fear
            return {
                'expression_types': ['happy', 'sad', 'angry', 'surprise', 'neutral', 'fear'],
                'num_images': 6,
                'age_group': "6-8",
                'special_handling': False,
                'difficulty': 2
            }
        else:  # difficulty == 3
            # Hardest level: All expressions
            return {
                'expression_types': all_expressions,
                'num_images': 7,
                'age_group': "6-8",
                'special_handling': False,
                'difficulty': 3
            }
            
    elif age == "9-12":
        if difficulty == 1:
            # Easiest level: Only 3 expressions to identify
            return {
                'expression_types': ['happy', 'sad', 'angry'],
                'num_images': 5,
                'age_group': "9-12",
                'special_handling': True,
                'correct_expressions': 1,  # Number of correct expressions to mark
                'different_expressions': 2,  # Number of different expressions to include
                'difficulty': 1
            }
        elif difficulty == 2:
            # Medium level: 5 expressions to identify
            return {
                'expression_types': ['happy', 'sad', 'angry', 'surprise', 'neutral'],
                'num_images': 5,
                'age_group': "9-12",
                'special_handling': True,
                'correct_expressions': 1,  # Number of correct expressions to mark
                'different_expressions': 3,  # Number of different expressions to include
                'difficulty': 2
            }
        else:  # difficulty == 3
            # Hardest level: All expressions to identify
            return {
                'expression_types': all_expressions,
                'num_images': 5,
                'age_group': "9-12",
                'special_handling': True,
                'correct_expressions': 1,  # Number of correct expressions to mark
                'different_expressions': 3,  # Number of different expressions to include
                'difficulty': 3
            }
    
    # Age doesn't match any valid criteria
    return None

def _get_images_response(request, config, valid_expressions):
    """
    Generate and return the appropriate images response for age groups 3-5 and 6-8
    
    Args:
        request: The HTTP request
        config: Configuration settings for the age group
        valid_expressions: Dictionary of valid expression types
        
    Returns:
        Response: Serialized JSON response with images
    """
    num_images = config.get('num_images', 5)
    age_group = config.get('age_group')
    expressions = config.get('expressions', ['happy', 'sad'])
    
    # Get a list of available expression images
    all_images = []
    
    # We're combining all required expression types together
    for expression_type in expressions:
        if not valid_expressions.get(expression_type, False):
            continue
            
        # Define the path to the expression folder
        expression_dir = os.path.join(
            settings.BASE_DIR, 
            'facial_expression_images',
            expression_type
        )
        
        # Check if directory exists
        if not os.path.exists(expression_dir):
            logger.warning(f"Expression directory not found: {expression_dir}")
            continue
            
        # Read all images in this expression directory
        try:
            image_files = os.listdir(expression_dir)
            for image_file in image_files:
                if image_file.endswith(('.jpg', '.png', '.jpeg', '.svg')):
                    all_images.append((image_file, expression_type))
        except FileNotFoundError:
            logger.warning(f"Could not read expression directory: {expression_dir}")
    
    if not all_images:
        return Response(
            {"error": "No facial expression images found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Shuffle and select random images
    random.shuffle(all_images)
    selected_images = all_images[:min(num_images, len(all_images))]
    
    # Process selected images
    images_data = []
    for filename, expression_type in selected_images:
        image_id = os.path.splitext(filename)[0]
        
        # Construct the image URL
        image_url = request.build_absolute_uri(
            reverse('serve_facial_expression', kwargs={
                'expression_type': expression_type,
                'filename': filename
            })
        )
        
        # Add the image data
        images_data.append({
            'id': image_id,
            'type': expression_type,
            'image_url': image_url,
            'is_correct': False  # Default is not correct for standard cases
        })
    
    # Return the serialized response
    data = {
        'age_group': age_group,
        'images': images_data
    }
    serializer = FacialExpressionListSerializer(data)
    
    return Response(serializer.data)

def _get_special_images_response(request, config, valid_expressions):
    """
    Special handling for 9-12 age group with correct/incorrect expressions
    
    For age 9-12, returns EXACTLY 5 expression types with 3 images each
    For each expression type, only ONE image actually matches that expression type
    The other 2 images are from different expressions to test identification skills
    
    Args:
        request: The HTTP request object
        config: Dictionary with special handling configuration
        valid_expressions: Dictionary of valid expression types
        
    Returns:
        Response: JSON response with grouped expressions and images
    """
    all_expressions = [exp for exp in valid_expressions.keys()]
    age_group = config['age_group']
    
    # Get available expressions with at least 1 image
    expression_images = {}
    
    for expression_type in all_expressions:
        expression_dir = os.path.join(settings.BASE_DIR, 'facial_expression_images', expression_type)
        
        # Skip directories that don't exist
        if not os.path.exists(expression_dir):
            continue
        
        # Get list of image files in the directory
        try:
            image_files = [
                f for f in os.listdir(expression_dir) 
                if os.path.isfile(os.path.join(expression_dir, f))
            ]
            
            # Only keep expressions with at least 1 image
            if len(image_files) >= 1:
                expression_images[expression_type] = image_files
        except (FileNotFoundError, PermissionError) as e:
            logger.error(f"Error accessing directory {expression_dir}: {str(e)}")
    
    # Make sure we have at least 3 different expression types
    available_expressions = list(expression_images.keys())
    if len(available_expressions) < 3:
        return Response(
            {"error": "At least 3 different facial expression types needed"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Always select EXACTLY 5 expression types to test (with replacement if necessary)
    selected_expressions = random.choices(available_expressions, k=5)
    
    # Build the response data
    expressions_data = []
    
    # For each selected expression type
    for target_expression in selected_expressions:
        # Get all images for the target expression type
        target_images = expression_images[target_expression]
        
        # Select 1 correct image from the target expression
        correct_image_filename = random.choice(target_images)
        correct_image_id = os.path.splitext(correct_image_filename)[0]
        
        # Construct the correct image URL
        correct_image_url = request.build_absolute_uri(
            reverse('serve_facial_expression', kwargs={
                'expression_type': target_expression,
                'filename': correct_image_filename
            })
        )
        
        # Create a list of 3 images (1 correct, 2 incorrect) for this expression type
        images_data = [
            {
                'id': correct_image_id,
                'image_url': correct_image_url,
                'is_correct': True
            }
        ]
        
        # Get other expression types to use as incorrect options
        other_expressions = [exp for exp in available_expressions if exp != target_expression]
        
        # Make sure we have at least 2 other expressions
        if len(other_expressions) < 2:
            other_expressions = other_expressions * 2  # Duplicate if needed
        
        # Choose 2 different expressions for incorrect options
        incorrect_expressions = random.sample(other_expressions, 2)
        
        # Add 2 incorrect images from different expression types
        for incorrect_exp in incorrect_expressions:
            # Choose a random image from this incorrect expression
            incorrect_filename = random.choice(expression_images[incorrect_exp])
            incorrect_id = os.path.splitext(incorrect_filename)[0]
            
            # Construct the URL for the incorrect image
            incorrect_url = request.build_absolute_uri(
                reverse('serve_facial_expression', kwargs={
                    'expression_type': incorrect_exp,
                    'filename': incorrect_filename
                })
            )
            
            # Add this incorrect image
            images_data.append({
                'id': incorrect_id,
                'image_url': incorrect_url,
                'is_correct': False
            })
        
        # Shuffle the images so the correct one isn't always first
        random.shuffle(images_data)
        
        # Add this expression group to the response
        expressions_data.append({
            'type': target_expression,
            'images': images_data
        })
    
    # Return the serialized response
    data = {
        'age_group': age_group,
        'expressions': expressions_data
    }
    serializer = ExpressionGroupListSerializer(data)
    
    return Response(serializer.data)

@api_view(['GET'])
def serve_facial_expression(request, expression_type, filename):
    """
    Serve a facial expression image directly from the file system
    
    Args:
        request: The HTTP request
        expression_type: The type of expression (happy, sad, etc.)
        filename: The name of the image file
        
    Returns:
        Response: The image file content with appropriate content type
    """
    # Define valid expression types
    valid_expression_types = [
        'happy', 'sad', 'angry', 'fear', 
        'disgust', 'neutral', 'surprise'
    ]
    
    if expression_type not in valid_expression_types:
        return Response(
            {"error": "Invalid expression type"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Construct the file path
    file_path = os.path.join(
        settings.BASE_DIR, 
        'facial_expression_images', 
        expression_type, 
        filename
    )
    
    # Check if the file exists
    if not os.path.exists(file_path):
        logger.warning(f"Image file not found: {file_path}")
        return Response(
            {"error": "Image not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Read and serve the file
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        # Determine the content type based on the file extension
        content_type = 'image/svg+xml' if filename.lower().endswith('.svg') else 'image/jpeg'
        
        return HttpResponse(file_content, content_type=content_type)
    except Exception as e:
        logger.error(f"Error serving image {file_path}: {str(e)}")
        return Response(
            {"error": "Error serving image"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def match_and_sort_game(request, child_id, session_id=None, difficulty=None):
    """
    API endpoint for match and sort game providing buckets and falling objects to sort
    
    For age group 3-5:
    - Returns color buckets from general_buckets folder
    - Falling objects are triangle shapes with colors matching buckets
    - Matching is based on color only
    
    For age group 6-8:
    - Returns buckets of different shapes (all from general_buckets folder)
    - Falling objects are shapes of different colors
    - Matching is based on shape type only
    
    For age group 9-12:
    - Returns buckets with different shapes AND colors
    - Falling objects have different shapes and colors
    - Matching requires both shape AND color to match
    
    Parameters:
        child_id: ID of the child
        session_id: Optional session ID (if not provided, a new session will be created)
        difficulty: Optional difficulty level override (1, 2, or 3)
        
    Returns:
        Response: JSON with buckets and falling objects
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
                from activities.models import GameSession
                session = GameSession.objects.get(id=session_id)
                # Verify the session belongs to this child
                if session.child.id != child.id:
                    return Response(
                        {"error": "Session does not belong to this child"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                difficulty_level = session.difficulty_level
            except (ImportError, GameSession.DoesNotExist):
                return Response(
                    {"error": "Session not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        elif difficulty is not None:
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
                from activities.models import GameType, GameProgress
                game_type = GameType.objects.get(code="MATCHSORT")
                progress, created = GameProgress.objects.get_or_create(
                    child=child, 
                    game_type=game_type,
                    defaults={'current_difficulty': 1}
                )
                difficulty_level = progress.current_difficulty
            except (ImportError, GameType.DoesNotExist):
                # Fallback to default difficulty
                pass
        
        # If no session was provided, create a new one automatically
        if not session_id:
            try:
                from activities.models import GameType, GameSession
                game_type = GameType.objects.get(code="MATCHSORT")
                
                # Create a new session
                session = GameSession.objects.create(
                    child=child,
                    game_type=game_type,
                    difficulty_level=difficulty_level
                )
                session_id = session.id
                created_session = True
                logger.info(f"Automatically created new match and sort game session {session_id} for child {child_id}")
            except ImportError:
                logger.error("Could not import required models to create a session")
            except Exception as e:
                logger.error(f"Error creating session: {str(e)}")
        
        # Verify age group
        age_group = _validate_age_for_match_and_sort(child.age)
        if not age_group:
            return Response(
                {"error": "Match and sort game is currently only available for children aged 3-5, 6-8, or 9-12"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get game data based on age group and difficulty
        if age_group == "3-5":
            # For age group 3-5, color matching with general buckets
            game_data = _get_match_and_sort_game_data_3_5(request, age_group, difficulty_level)
        elif age_group == "6-8":
            # For age group 6-8, matching by shape, all from general_buckets
            game_data = _get_match_and_sort_game_data_6_8(request, age_group, difficulty_level)
        else:  # age_group == "9-12"
            # For age group 9-12, matching by both shape AND color
            game_data = _get_match_and_sort_game_data_9_12(request, age_group, difficulty_level)
        
        # Add session_id to the response
        game_data['session_id'] = session_id
        
        # Add info whether session was created
        if created_session:
            game_data['session_created'] = True
        
        # Return the serialized game data
        serializer = MatchAndSortGameSerializer(game_data)
        return Response(serializer.data)
    
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error generating match and sort game: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _validate_age_for_match_and_sort(age):
    """
    Validate if the child's age is supported for the match and sort game
    
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

def _get_match_and_sort_game_data_3_5(request, age_group, difficulty):
    """
    Generate game data for match and sort game for age group 3-5 (color matching)
    - Buckets are from the general_buckets folder with different colors
    - Falling objects can be any shape but must match the bucket color
    
    Args:
        request: The HTTP request
        age_group: The age group of the child
        difficulty: Game difficulty level (1-3)
        
    Returns:
        dict: Game data with buckets and falling objects
    """
    # Get available colors from general buckets
    general_bucket_dir = os.path.join(settings.BASE_DIR, 'matchandsort_images', 'buckets', 'general_buckets')
    
    # Get available bucket colors
    available_bucket_colors = []
    try:
        bucket_files = os.listdir(general_bucket_dir)
        for file in bucket_files:
            if file.endswith('.svg') and file not in ["pentagon.svg", "semicircle.svg", "sunburst.svg", "triangle.svg"]:
                color = os.path.splitext(file)[0]
                available_bucket_colors.append(color)
    except Exception as e:
        logger.error(f"Error reading general bucket directory: {str(e)}")
        available_bucket_colors = ["blue", "green", "pink", "light_blue", "yellow"]
    
    # Available shape types for falling objects
    available_shape_types = ["triangle", "pentagon", "semicircle", "sunburst"]
    
    # Determine number of buckets based on difficulty
    num_buckets = 2
    if difficulty == 2:
        num_buckets = 3
    elif difficulty == 3:
        num_buckets = 4
    
    # Ensure we have enough bucket colors available
    if len(available_bucket_colors) < num_buckets:
        logger.warning(f"Not enough bucket colors available. Needed {num_buckets}, found {len(available_bucket_colors)}")
        # Use what we have with duplicates if necessary
        while len(available_bucket_colors) < num_buckets:
            available_bucket_colors.append(random.choice(available_bucket_colors))
    
    # Select random bucket colors
    random.shuffle(available_bucket_colors)
    selected_bucket_colors = available_bucket_colors[:num_buckets]
    
    # Create bucket data
    buckets = []
    for i, color in enumerate(selected_bucket_colors):
        bucket_id = f"bucket_{i+1}"
        
        # Bucket image URL - using general bucket with color
        bucket_url = request.build_absolute_uri(
            f"/api/game-assets/matchandsort/buckets/general_buckets/{color}.svg"
        )
        
        buckets.append({
            'id': bucket_id,
            'color': color,
            'image_url': bucket_url
        })
    
    # Create falling objects (8 objects as specified)
    falling_objects = []
    num_objects = 8
    
    # Make a list of colors that match our buckets
    matching_colors = []
    for bucket in buckets:
        matching_colors.extend([bucket['color']] * (num_objects // len(buckets)))
    
    # Add extras if needed
    while len(matching_colors) < num_objects:
        matching_colors.append(random.choice([b['color'] for b in buckets]))
    
    # Shuffle the colors
    random.shuffle(matching_colors)
    
    # Create the falling objects with random shapes
    for i in range(num_objects):
        color = matching_colors[i]
        object_id = f"object_{i+1}"
        
        # Find the matching bucket
        target_bucket = next(b for b in buckets if b['color'] == color)
        
        # Choose a random shape for this object
        shape_type = random.choice(available_shape_types)
        
        # Verify the file exists for this shape and color combination
        file_path = os.path.join(
            settings.BASE_DIR,
            'matchandsort_images',
            'shapes',
            shape_type,
            f"{color}.svg"
        )
        
        # If file doesn't exist, try another shape
        if not os.path.exists(file_path):
            # Try each shape type until we find one that has this color
            found_shape = False
            for alt_shape in available_shape_types:
                alt_path = os.path.join(
                    settings.BASE_DIR,
                    'matchandsort_images',
                    'shapes',
                    alt_shape,
                    f"{color}.svg"
                )
                if os.path.exists(alt_path):
                    shape_type = alt_shape
                    found_shape = True
                    break
            
            # If no shape found with this color, default to triangle
            if not found_shape:
                shape_type = "triangle"  # Default to triangle if no other shape has this color
        
        # Object image URL
        object_url = request.build_absolute_uri(
            reverse('serve_game_asset', kwargs={
                'game_type': 'matchandsort',
                'asset_type': 'shapes',
                'shape_type': shape_type,
                'filename': f"{color}.svg"
            })
        )
        
        falling_objects.append({
            'id': object_id,
            'color': color,
            'shape_type': shape_type,  # Include shape_type in the response
            'target_bucket_id': target_bucket['id'],
            'image_url': object_url
        })
    
    # Construct final game data
    game_data = {
        'age_group': age_group,
        'difficulty': difficulty,
        'shape_type': 'general',  # Using general buckets, not a specific shape
        'buckets': buckets,
        'falling_objects': falling_objects
    }
    
    return game_data

def _get_match_and_sort_game_data_6_8(request, age_group, difficulty):
    """
    Generate game data for match and sort game for age group 6-8 (shape matching)
    - Buckets are from general_buckets folder (no colors)
    - Falling objects are shapes of different colors
    - Matching is based on shape type only
    
    Args:
        request: The HTTP request
        age_group: The age group of the child
        difficulty: Game difficulty level (1-3)
        
    Returns:
        dict: Game data with buckets and falling objects
    """
    # Get available shape types
    available_shape_types = ["triangle", "pentagon", "semicircle", "sunburst"]
    
    # Available colors for falling objects
    available_colors = ["blue", "green", "pink", "light_blue", "yellow"]
    
    # Determine number of buckets based on difficulty
    num_buckets = 2
    if difficulty == 2:
        num_buckets = 3
    elif difficulty == 3:
        num_buckets = 4
    
    # Ensure we have enough shape types available
    if len(available_shape_types) < num_buckets:
        logger.warning(f"Not enough shape types available. Needed {num_buckets}, found {len(available_shape_types)}")
        # Use what we have with duplicates if necessary (this should not happen normally)
        while len(available_shape_types) < num_buckets:
            available_shape_types.append(random.choice(available_shape_types))
    
    # Select random shape types for buckets
    random.shuffle(available_shape_types)
    selected_shape_types = available_shape_types[:num_buckets]
    
    # Create bucket data using general buckets (no colors)
    buckets = []
    for i, shape_type in enumerate(selected_shape_types):
        bucket_id = f"bucket_{i+1}"
        
        # Use the shape type directly for the filename
        file_name = f"{shape_type}.svg"
        
        # Verify the file exists in the general_buckets folder
        file_path = os.path.join(
            settings.BASE_DIR,
            'matchandsort_images',
            'buckets',
            'general_buckets',
            file_name
        )
        
        # If file doesn't exist, try the specific folder with blue
        if not os.path.exists(file_path):
            logger.warning(f"General bucket not found for {shape_type}, using shaped bucket with blue color")
            bucket_url = request.build_absolute_uri(
                reverse('serve_game_asset', kwargs={
                    'game_type': 'matchandsort',
                    'asset_type': 'buckets',
                    'shape_type': shape_type,
                    'filename': "blue.svg"
                })
            )
        else:
            # Use the general bucket
            bucket_url = request.build_absolute_uri(
                f"/api/game-assets/matchandsort/buckets/general_buckets/{file_name}"
            )
        
        buckets.append({
            'id': bucket_id,
            'shape_type': shape_type,
            'image_url': bucket_url
        })
    
    # Create falling objects (8 objects as specified)
    falling_objects = []
    num_objects = 8
    
    # Make a list of shapes that match our buckets
    matching_shapes = []
    for bucket in buckets:
        matching_shapes.extend([bucket['shape_type']] * (num_objects // len(buckets)))
    
    # Add extras if needed
    while len(matching_shapes) < num_objects:
        matching_shapes.append(random.choice([b['shape_type'] for b in buckets]))
    
    # Shuffle the shapes
    random.shuffle(matching_shapes)
    
    # Create the falling objects with random colors
    for i in range(num_objects):
        shape_type = matching_shapes[i]
        object_id = f"object_{i+1}"
        
        # Find the matching bucket (match by shape only)
        target_bucket = next(b for b in buckets if b['shape_type'] == shape_type)
        
        # Randomly select a color for this object
        color = random.choice(available_colors)
        
        # Verify the file exists for this shape and color combination
        file_path = os.path.join(
            settings.BASE_DIR,
            'matchandsort_images',
            'shapes',
            shape_type,
            f"{color}.svg"
        )
        
        # If file doesn't exist, default to blue
        if not os.path.exists(file_path):
            color = "blue"
        
        # Object image URL
        object_url = request.build_absolute_uri(
            reverse('serve_game_asset', kwargs={
                'game_type': 'matchandsort',
                'asset_type': 'shapes',
                'shape_type': shape_type,
                'filename': f"{color}.svg"
            })
        )
        
        falling_objects.append({
            'id': object_id,
            'color': color,
            'shape_type': shape_type,
            'target_bucket_id': target_bucket['id'],
            'image_url': object_url
        })
    
    # Construct final game data
    game_data = {
        'age_group': age_group,
        'difficulty': difficulty,
        'shape_type': 'mixed',  # Multiple shape types
        'buckets': buckets,
        'falling_objects': falling_objects
    }
    
    return game_data

def _get_match_and_sort_game_data_9_12(request, age_group, difficulty):
    """
    Generate game data for match and sort game for age group 9-12 (matching by both shape AND color)
    
    For each difficulty level:
    - Always generates 4 sets with 2 falling objects per set (8 total objects)
    - Difficulty 1: 2 buckets per set (8 total buckets)
    - Difficulty 2: 3 buckets per set (12 total buckets)
    - Difficulty 3: 4 buckets per set (16 total buckets)
    
    Args:
        request: The HTTP request
        age_group: The age group of the child
        difficulty: Game difficulty level (1-3)
        
    Returns:
        dict: Game data with bucket sets, each containing its own buckets and falling objects
    """
    # Available shape types and colors
    available_shape_types = ["triangle", "pentagon", "semicircle", "sunburst"]
    available_colors = ["blue", "green", "pink", "light_blue", "yellow"]
    
    # Always 4 sets for all difficulty levels
    num_sets = 4
    
    # Number of buckets per set depends on difficulty
    buckets_per_set = difficulty + 1  # 2, 3, or 4 buckets
    
    # Objects per set is always 2
    objects_per_set = 2
    
    # Create bucket sets
    bucket_sets = []
    
    # Keep track of used shape-color combinations to ensure uniqueness across sets
    used_combinations = set()
    
    for set_idx in range(num_sets):
        set_id = f"set_{set_idx + 1}"
        
        # Get available combinations that haven't been used yet
        available_combinations = []
        for shape in available_shape_types:
            for color in available_colors:
                combo = (shape, color)
                if combo not in used_combinations:
                    available_combinations.append(combo)
        
        # Make sure we have enough combinations available
        if len(available_combinations) < buckets_per_set:
            # If we've used too many combinations, reset and reuse
            used_combinations = set()
            available_combinations = [(shape, color) for shape in available_shape_types for color in available_colors]
        
        # Randomly select combinations for this set
        selected_combinations = random.sample(available_combinations, buckets_per_set)
        
        # Mark these combinations as used
        for combo in selected_combinations:
            used_combinations.add(combo)
        
        # Create buckets for this set
        buckets = []
        for i in range(buckets_per_set):
            bucket_id = f"bucket_{set_idx * buckets_per_set + i + 1}"
            shape_type, color = selected_combinations[i]
            
            # Bucket image URL
            bucket_url = request.build_absolute_uri(
                reverse('serve_game_asset', kwargs={
                    'game_type': 'matchandsort',
                    'asset_type': 'buckets',
                    'shape_type': shape_type,
                    'filename': f"{color}.svg"
                })
            )
            
            buckets.append({
                'id': bucket_id,
                'color': color,
                'shape_type': shape_type,
                'image_url': bucket_url
            })
        
        # Create 2 falling objects for this set
        falling_objects = []
        object_counter = set_idx * objects_per_set  # Start count based on set index
        
        # Randomly select which buckets will have matching objects
        selected_bucket_indices = random.sample(range(buckets_per_set), objects_per_set)
        
        for i in range(objects_per_set):
            object_id = f"object_{object_counter + i + 1}"
            
            # Each object matches one of the randomly selected buckets
            bucket_index = selected_bucket_indices[i]
            bucket = buckets[bucket_index]
            
            # Object image URL - using the same shape and color as the target bucket
            object_url = request.build_absolute_uri(
                reverse('serve_game_asset', kwargs={
                    'game_type': 'matchandsort',
                    'asset_type': 'shapes',
                    'shape_type': bucket['shape_type'],
                    'filename': f"{bucket['color']}.svg"
                })
            )
            
            falling_objects.append({
                'id': object_id,
                'color': bucket['color'],
                'shape_type': bucket['shape_type'],
                'target_bucket_id': bucket['id'],
                'image_url': object_url
            })
        
        # Add the completed set
        bucket_sets.append({
            'set_id': set_id,
            'buckets': buckets,
            'falling_objects': falling_objects
        })
    
    # Construct final game data
    game_data = {
        'age_group': age_group,
        'difficulty': difficulty,
        'shape_type': 'mixed',  # Multiple shape types
        'bucket_sets': bucket_sets,
        'total_buckets': buckets_per_set * num_sets,  # Total number of buckets across all sets
        'total_objects': objects_per_set * num_sets    # Total number of falling objects (always 8)
    }
    
    return game_data

@api_view(['GET'])
def serve_game_asset(request, game_type, asset_type, shape_type, filename):
    """
    Serve game assets (buckets, shapes, etc.) directly from the file system
    
    Args:
        request: The HTTP request
        game_type: Type of game (matchandsort, etc.)
        asset_type: Type of asset (buckets, shapes)
        shape_type: Type of shape (triangle, etc.) or 'general_buckets' for non-colored buckets
        filename: The file to serve
        
    Returns:
        Response: The image file content with appropriate content type
    """
    # Validate parameters
    if game_type not in ['matchandsort']:
        return Response(
            {"error": "Invalid game type"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if asset_type not in ['buckets', 'shapes']:
        return Response(
            {"error": "Invalid asset type"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # For shape_type, we now also accept 'general_buckets'
    if shape_type not in ['triangle', 'pentagon', 'semicircle', 'sunburst', 'general_buckets']:
        return Response(
            {"error": "Invalid shape type"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Construct the file path
    if asset_type == 'buckets':
        file_path = os.path.join(
            settings.BASE_DIR, 
            'matchandsort_images', 
            'buckets',
            shape_type,
            filename
        )
    else:  # shapes
        file_path = os.path.join(
            settings.BASE_DIR, 
            'matchandsort_images', 
            'shapes',
            shape_type,
            filename
        )
    
    # Check if the file exists
    if not os.path.exists(file_path):
        logger.warning(f"Game asset not found: {file_path}")
        return Response(
            {"error": "Asset not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Read and serve the file
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        # Determine the content type based on the file extension
        content_type = 'image/svg+xml' if filename.lower().endswith('.svg') else 'image/jpeg'
        
        # Return HttpResponse instead of Response for image content
        return HttpResponse(file_content, content_type=content_type)
    except Exception as e:
        logger.error(f"Error serving game asset {file_path}: {str(e)}")
        return Response(
            {"error": "Error serving asset"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def check_daily_session(request, child_id):
    """
    Check if a session exists for the child for the current day
    
    Parameters:
        child_id: ID of the child
        
    Query Parameters:
        date: Optional date to check (format YYYY-MM-DD, defaults to today)
        
    Returns:
        Response: JSON with session data if exists, or empty object if not
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get date from query params (default to today)
        date_param = request.query_params.get('date', None)
        
        if date_param:
            try:
                from django.utils.dateparse import parse_date
                check_date = parse_date(date_param)
                if not check_date:
                    check_date = timezone.now().date()
            except Exception:
                check_date = timezone.now().date()
        else:
            check_date = timezone.now().date()
        
        # Check if a session exists for this date
        try:
            session = Session.objects.get(child=child, session_date=check_date)
            serializer = SessionSerializer(session)
            return Response(serializer.data)
        except Session.DoesNotExist:
            # No session exists for this date
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error checking daily session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def start_app_session(request, child_id):
    """
    Start a new app session for a child
    
    Only one active session per child is allowed. If an active session
    already exists for the same day, an error is returned.
    If an active session exists from a previous day, it will be ended
    and a new one will be created.
    
    Parameters:
        child_id: ID of the child
    
    Returns:
        Response: JSON with session data
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Check for existing active session and reset if needed
        session, was_reset = Session.check_and_reset_session(child)
        
        # Return appropriate response based on whether a reset occurred
        if was_reset:
            return Response(
                {"message": "Previous session was automatically ended. New session created.", 
                 "session": SessionSerializer(session).data}, 
                status=status.HTTP_201_CREATED
            )
        
        serializer = SessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error starting app session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def check_active_session(request, child_id):
    """
    Check if there is an active session for a child
    
    If an active session exists from a previous day, it will be automatically ended
    and a new one will be created for today.
    
    Parameters:
        child_id: ID of the child
    
    Returns:
        Response: JSON with active session data or empty object
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Check for active session and auto-reset if from previous day
        active_session, was_reset = Session.check_and_reset_session(child)
        
        if active_session:
            serializer = SessionSerializer(active_session)
            response_data = serializer.data
            
            # Add info about the reset if it occurred
            if was_reset:
                response_data['was_reset'] = True
                response_data['message'] = "Previous session was automatically ended. New session created."
                
            return Response(response_data)
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error checking active session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def end_app_session(request, session_id):
    """
    End an active app session
    
    Parameters:
        session_id: ID of the session to end
    
    Request Body:
        duration: Duration of the session in minutes (required)
        limit_crossed: Boolean indicating if usage limit was crossed (optional)
    
    Returns:
        Response: JSON with updated session data
    """
    try:
        # Get the session
        session = Session.objects.get(id=session_id)
        
        # Verify the session belongs to a child of the requesting user
        if not Child.objects.filter(id=session.child.id, user=request.user).exists():
            return Response(
                {"error": "You do not have permission to update this session"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verify session is active
        if not session.active:
            return Response(
                {"error": "This session is already ended"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get required duration from request
        duration = request.data.get('duration')
        if duration is None:
            return Response(
                {"error": "Duration is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Update limit_crossed if provided
        limit_crossed = request.data.get('limit_crossed', False)
        
        # Update session data
        session.duration = duration
        session.limit_crossed = limit_crossed
        
        # End the session
        session.end_session()
        
        serializer = SessionSerializer(session)
        return Response(serializer.data)
        
    except Session.DoesNotExist:
        logger.warning(f"Session with ID {session_id} not found")
        return Response(
            {"error": "Session not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error ending app session: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_child_app_sessions(request, child_id):
    """
    Get app usage sessions for a child
    
    Parameters:
        child_id: ID of the child
    
    Query Parameters:
        limit: Optional limit on number of sessions to return
        start_date: Optional start date for filtering (YYYY-MM-DD)
        end_date: Optional end date for filtering (YYYY-MM-DD)
        with_game_details: Include detailed game session info (default: false)
        include_active: Include active sessions (default: true)
    
    Returns:
        Response: JSON with list of session data
    """
    try:
        # Get the child
        child = Child.objects.get(id=child_id, user=request.user)
        
        # Get limit from query params (default to 30)
        limit = request.query_params.get('limit', 30)
        try:
            limit = int(limit)
        except (TypeError, ValueError):
            limit = 30
        
        # Filter sessions for this child
        sessions = Session.objects.filter(child=child)
        
        # Filter active/inactive sessions
        include_active = request.query_params.get('include_active', 'true').lower() == 'true'
        if not include_active:
            sessions = sessions.filter(active=False)
        
        # Apply date filters if provided
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        
        if start_date:
            try:
                from django.utils.dateparse import parse_date
                parsed_date = parse_date(start_date)
                if parsed_date:
                    sessions = sessions.filter(session_date__gte=parsed_date)
            except Exception:
                pass
                
        if end_date:
            try:
                from django.utils.dateparse import parse_date
                parsed_date = parse_date(end_date)
                if parsed_date:
                    sessions = sessions.filter(session_date__lte=parsed_date)
            except Exception:
                pass
        
        # Order by date (newest first)
        sessions = sessions.order_by('-session_date')[:limit]
        
        # Check if detailed game sessions are requested
        with_game_details = request.query_params.get('with_game_details', 'false').lower() == 'true'
        
        # Enhance response with game session details if requested
        if with_game_details:
            from activities.models import GameSession
            from activities.serializers import GameSessionSerializer
            
            enhanced_data = []
            
            for session in sessions:
                session_data = SessionSerializer(session).data
                
                # Add detailed game session data if any exist
                if session.game_sessions:
                    try:
                        game_session_ids = session.game_sessions
                        game_sessions = GameSession.objects.filter(id__in=game_session_ids)
                        session_data['detailed_game_sessions'] = GameSessionSerializer(game_sessions, many=True).data
                    except Exception as e:
                        logger.error(f"Error fetching game session details: {str(e)}")
                        session_data['detailed_game_sessions'] = []
                        
                enhanced_data.append(session_data)
                
            return Response(enhanced_data)
        else:
            serializer = SessionSerializer(sessions, many=True)
            return Response(serializer.data)
        
    except Child.DoesNotExist:
        logger.warning(f"Child with ID {child_id} not found for user {request.user.id}")
        return Response(
            {"error": "Child not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving app sessions: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_app_session_duration(request, session_id):
    """
    Update the duration of an active app session without ending it
    
    Parameters:
        session_id: ID of the session to update
    
    Request Body:
        duration: Duration of the session in minutes (required)
    
    Returns:
        Response: JSON with updated session data
    """
    try:
        # Get the session
        session = Session.objects.get(id=session_id)
        
        # Verify the session belongs to a child of the requesting user
        if not Child.objects.filter(id=session.child.id, user=request.user).exists():
            return Response(
                {"error": "You do not have permission to update this session"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get required duration from request
        duration = request.data.get('duration')
        if duration is None:
            return Response(
                {"error": "Duration is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Update session duration
        session.duration = duration
        session.save()
        
        serializer = SessionSerializer(session)
        return Response(serializer.data)
        
    except Session.DoesNotExist:
        logger.warning(f"Session with ID {session_id} not found")
        return Response(
            {"error": "Session not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error updating app session duration: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )