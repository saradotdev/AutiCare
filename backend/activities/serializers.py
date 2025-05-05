from rest_framework import serializers
from .models import Activity, SocialScenario, GameType, GameProgress, GameSession

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class SocialScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialScenario
        fields = '__all__'

class SocialScenarioOptionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    text = serializers.CharField(read_only=True)
    is_correct = serializers.BooleanField(read_only=True)

class DialogueSerializer(serializers.Serializer):
    character = serializers.CharField(read_only=True)  # Character who's speaking
    text = serializers.CharField(read_only=True)  # Text of the dialogue

class SocialScenarioGameSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    age_group = serializers.CharField(read_only=True)
    difficulty = serializers.IntegerField(read_only=True)
    character1_name = serializers.CharField(read_only=True)
    character2_name = serializers.CharField(read_only=True)
    dialogues = DialogueSerializer(many=True, read_only=True)
    options = SocialScenarioOptionSerializer(many=True, read_only=True)

class GameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameType
        fields = '__all__'

class GameProgressSerializer(serializers.ModelSerializer):
    game_type_name = serializers.ReadOnlyField(source='game_type.name')
    
    class Meta:
        model = GameProgress
        fields = [
            'id', 'child', 'game_type', 'game_type_name', 
            'current_difficulty', 'correct_answers', 
            'incorrect_answers', 'total_games_played',
            'score_percentage'
        ]

class GameSessionSerializer(serializers.ModelSerializer):
    game_type_name = serializers.ReadOnlyField(source='game_type.name')
    
    class Meta:
        model = GameSession
        fields = [
            'id', 'child', 'game_type', 'game_type_name',
            'difficulty_level', 'correct_answers', 
            'incorrect_answers', 'total_questions',
            'score_percentage', 'completed', 'session_data'
        ]

class GameSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new game session"""
    
    class Meta:
        model = GameSession
        fields = ['child', 'game_type', 'difficulty_level']

class GameSessionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a game session with results"""
    
    class Meta:
        model = GameSession
        fields = ['correct_answers', 'incorrect_answers', 'session_data'] 