from rest_framework import serializers
from .models import Child, Session

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = [
            'id',
            'first_name', 'last_name', 'age', 'gender',
            'speech_level', 'time_of_practice', 'profile_picture'
        ]
        extra_kwargs = {
            'user': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'time_of_practice': {'required': False},
            'gender' : {'required': False},
        }

    def create(self, validated_data):
        # Automatically set user from the authenticated request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class SessionSerializer(serializers.ModelSerializer):
    child_name = serializers.ReadOnlyField(source='child.first_name')
    
    class Meta:
        model = Session
        fields = [
            'id', 'child', 'child_name', 'duration', 'limit_crossed', 
            'session_date', 'active', 'game_sessions', 'daily_progress', 'game_usage'
        ]

class FacialExpressionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # The image filename
    type = serializers.CharField(read_only=True)  # happy, sad, etc.
    image_url = serializers.URLField(read_only=True)  # Full URL to the image
    is_correct = serializers.BooleanField(read_only=True, default=False)  # Whether this is the correct expression

class FacialExpressionListSerializer(serializers.Serializer):
    age_group = serializers.CharField(read_only=True)  # The age group (3-5, 6-8, 9-12)
    images = FacialExpressionSerializer(many=True, read_only=True)
    session_id = serializers.IntegerField(read_only=True, required=False)  # ID of the game session
    session_created = serializers.BooleanField(read_only=True, required=False)  # Whether a new session was created
    difficulty = serializers.IntegerField(read_only=True, required=False)  # Game difficulty level

class ExpressionImageSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # The image filename
    image_url = serializers.URLField(read_only=True)  # Full URL to the image
    is_correct = serializers.BooleanField(read_only=True)  # Whether this is the correct expression

class ExpressionGroupSerializer(serializers.Serializer):
    type = serializers.CharField(read_only=True)  # The expression type (happy, sad, etc.)
    images = ExpressionImageSerializer(many=True, read_only=True)

class ExpressionGroupListSerializer(serializers.Serializer):
    age_group = serializers.CharField(read_only=True)  # The age group (9-12)
    expressions = ExpressionGroupSerializer(many=True, read_only=True)
    session_id = serializers.IntegerField(read_only=True, required=False)  # ID of the game session
    session_created = serializers.BooleanField(read_only=True, required=False)  # Whether a new session was created
    difficulty = serializers.IntegerField(read_only=True, required=False)  # Game difficulty level

# Game 2: Match and Sort Game Serializers
class BucketSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # Unique identifier for the bucket
    color = serializers.CharField(read_only=True)  # Color of the bucket (blue, green, etc.)
    shape_type = serializers.CharField(read_only=True, required=False)  # Shape type for age group 6-8
    image_url = serializers.URLField(read_only=True)  # URL to the bucket image

class FallingObjectSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # Unique identifier for tracking
    color = serializers.CharField(read_only=True)  # Color of the object
    shape_type = serializers.CharField(read_only=True, required=False)  # Shape type for age group 6-8
    target_bucket_id = serializers.CharField(read_only=True)  # ID of the bucket this object should go to
    image_url = serializers.URLField(read_only=True)  # URL to the object image

class BucketSetSerializer(serializers.Serializer):
    set_id = serializers.CharField(read_only=True)  # Unique identifier for the set
    buckets = BucketSerializer(many=True, read_only=True)  # List of buckets in this set
    falling_objects = FallingObjectSerializer(many=True, read_only=True)  # List of objects for this set

class MatchAndSortGameSerializer(serializers.Serializer):
    age_group = serializers.CharField(read_only=True)  # The age group (3-5, 6-8, 9-12)
    difficulty = serializers.IntegerField(read_only=True)  # Game difficulty level (1, 2, 3)
    shape_type = serializers.CharField(read_only=True)  # The shape being used (triangle, circle, etc.)
    buckets = BucketSerializer(many=True, read_only=True, required=False)  # List of bucket containers (for age 3-8)
    falling_objects = FallingObjectSerializer(many=True, read_only=True, required=False)  # List of objects to sort (for age 3-8)
    bucket_sets = BucketSetSerializer(many=True, read_only=True, required=False)  # List of bucket sets (for age 9-12)
    total_buckets = serializers.IntegerField(read_only=True, required=False)  # Total number of buckets (for age 9-12)
    total_objects = serializers.IntegerField(read_only=True, required=False)  # Total number of objects (for age 9-12)
    session_id = serializers.IntegerField(read_only=True, required=False)  # ID of the game session
    session_created = serializers.BooleanField(read_only=True, required=False)  # Whether a new session was created