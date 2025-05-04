from django.db import models
from children.models import Child
from django.utils import timezone
import math

class Activity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    TYPE_CHOICES = [('SPEECH', 'Speech'), ('BEHAVIOR', 'Behavior')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    difficulty_level = models.IntegerField()  # 1 (Easy), 2 (Medium), 3 (Hard)
    duration = models.IntegerField()  # in minutes

class SocialScenario(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    AGE_GROUP_CHOICES = [
        ('3-5', '3-5 years'),
        ('6-8', '6-8 years'),
        ('9-12', '9-12 years'),
    ]
    age_group = models.CharField(max_length=10, choices=AGE_GROUP_CHOICES)
    difficulty = models.IntegerField(choices=[(1, 'Easy'), (2, 'Medium'), (3, 'Hard')])
    
    # Characters' dialogues
    character1_name = models.CharField(max_length=100, default="Character 1")
    character2_name = models.CharField(max_length=100, default="Character 2") 
    
    # List of dialogues (stored as JSON)
    dialogues = models.JSONField(default=list)
    
    # Options for the child to choose from
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255, blank=True, null=True)  # Optional 4th choice
    
    # Correct option (1, 2, 3, or 4)
    correct_option = models.IntegerField()
    
    # Feedback for correct and incorrect answers
    correct_feedback = models.CharField(max_length=255, default="Great job! That was the right choice.")
    incorrect_feedback = models.CharField(max_length=255, default="Let's try again. Think about how the other person might feel.")
    
    def __str__(self):
        return f"{self.title} (Age: {self.age_group}, Difficulty: {self.difficulty})"

class GameType(models.Model):
    """Model to represent different types of games in the system"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    # Max difficulty level for this game type
    max_difficulty = models.IntegerField(default=3)
    
    # Required correct answers to progress to next difficulty level
    progression_threshold = models.IntegerField(default=10)
    
    GAME_CODES = [
        ('FACIAL', 'Facial Expressions'),
        ('MATCHSORT', 'Match and Sort'),
        ('SOCIAL', 'Social Scenarios'),
    ]
    code = models.CharField(max_length=20, choices=GAME_CODES, unique=True)
    
    def __str__(self):
        return self.name

class GameProgress(models.Model):
    """Model to track a child's progress in a specific game type"""
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='game_progress')
    game_type = models.ForeignKey(GameType, on_delete=models.CASCADE)
    
    # Current difficulty level the child is playing at
    current_difficulty = models.IntegerField(default=1)
    
    # Total correct answers at the current difficulty level
    correct_answers = models.IntegerField(default=0)
    
    # Total incorrect answers at the current difficulty level
    incorrect_answers = models.IntegerField(default=0)
    
    # Total games played of this type
    total_games_played = models.IntegerField(default=0)
    
    # Score percentage (0-100)
    score_percentage = models.FloatField(default=0)
    
    # Last played timestamp
    last_played = models.DateTimeField(auto_now=True)
    
    # Consecutive sessions below performance threshold for difficulty decrease
    consecutive_low_performance = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('child', 'game_type')
    
    def __str__(self):
        return f"{self.child.first_name}'s progress in {self.game_type.name}"
    
    def calculate_score_percentage(self):
        """Calculate the score percentage based on correct and total answers"""
        total = self.correct_answers + self.incorrect_answers
        if total > 0:
            self.score_percentage = (self.correct_answers / total) * 100
        else:
            self.score_percentage = 0
        return self.score_percentage
    
    def check_for_progression(self):
        """
        Check if child should progress to next difficulty level or decrease difficulty
        based on performance ratio.
        
        Returns:
            int: 1 if difficulty increased, -1 if decreased, 0 if unchanged
        """
        total_attempts = self.correct_answers + self.incorrect_answers
        
        # Only evaluate after a minimum number of attempts (at least 10)
        if total_attempts < 10:
            return 0
            
        # Calculate performance ratio (percentage of correct answers)
        performance_ratio = (self.correct_answers / total_attempts) * 100
        
        # Thresholds for difficulty changes
        increase_threshold = 75  # Minimum 75% correct to increase difficulty
        decrease_threshold = 40  # Below 40% correct to potentially decrease difficulty
        
        # Check for difficulty increase
        if (self.current_difficulty < self.game_type.max_difficulty and 
            performance_ratio >= increase_threshold and 
            self.correct_answers >= self.game_type.progression_threshold):
            
            # Increase difficulty level
            self.current_difficulty += 1
            self.correct_answers = 0
            self.incorrect_answers = 0
            self.consecutive_low_performance = 0
            return 1
            
        # Check for difficulty decrease
        elif self.current_difficulty > 1 and performance_ratio <= decrease_threshold:
            # Track consecutive low performance sessions
            self.consecutive_low_performance += 1
            
            # Only decrease difficulty after 2 consecutive low-performing sessions
            if self.consecutive_low_performance >= 2:
                self.current_difficulty -= 1
                self.correct_answers = 0
                self.incorrect_answers = 0
                self.consecutive_low_performance = 0
                return -1
                
        # Reset consecutive counter if performance is adequate
        elif performance_ratio > decrease_threshold:
            self.consecutive_low_performance = 0
            
        return 0
    
    def update_progress(self, is_correct):
        """Update progress with a new game result"""
        if is_correct:
            self.correct_answers += 1
        else:
            self.incorrect_answers += 1
        
        self.total_games_played += 1
        self.calculate_score_percentage()
        progression_result = self.check_for_progression()
        self.save()
        return progression_result

class GameSession(models.Model):
    """Model to track individual game sessions"""
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='game_sessions')
    game_type = models.ForeignKey(GameType, on_delete=models.CASCADE)
    
    # Difficulty level this session was played at
    difficulty_level = models.IntegerField()
    
    # Session statistics
    correct_answers = models.IntegerField(default=0)
    incorrect_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    score_percentage = models.FloatField(default=0)
    
    # Whether the session has been completed
    completed = models.BooleanField(default=False)
    
    # Game-specific data stored as JSON
    session_data = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.child.first_name}'s {self.game_type.name} session"
    
    def end_session(self, correct=0, incorrect=0, session_data=None):
        """End the current game session with results"""
        # Check if session is already completed
        if self.completed:
            return self
        
        self.correct_answers = correct
        self.incorrect_answers = incorrect
        self.total_questions = correct + incorrect
        self.completed = True
        
        if self.total_questions > 0:
            self.score_percentage = (correct / self.total_questions) * 100
        
        if session_data:
            self.session_data = session_data
        
        self.save()
        
        # Update the child's progress
        progress, created = GameProgress.objects.get_or_create(
            child=self.child,
            game_type=self.game_type,
            defaults={'current_difficulty': self.difficulty_level}
        )
        
        # Update progress with actual correct/incorrect answer counts
        progress.correct_answers += correct
        progress.incorrect_answers += incorrect
        progress.total_games_played += 1
        progress.calculate_score_percentage()
        difficulty_change = progress.check_for_progression()
        progress.save()
        
        return self, difficulty_change