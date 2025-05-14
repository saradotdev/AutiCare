from django.db import models
from children.models import Child, Session
from activities.models import GameType, GameSession
from django.utils import timezone
import datetime

class ProgressReport(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    total_sessions = models.IntegerField()
    score = models.IntegerField()  # e.g., 0-100

class GameAnalysis(models.Model):
    """
    Model to store analysis of a child's performance in specific games,
    identifying strengths, weaknesses, and areas of improvement
    """
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='game_analysis')
    game_type = models.ForeignKey(GameType, on_delete=models.CASCADE)
    
    # Analysis period
    PERIOD_CHOICES = [
        ('day', 'Daily'),
        ('week', 'Weekly'),
        ('month', 'Monthly'),
    ]
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    
    # Start and end dates for this analysis
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Performance metrics
    total_sessions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    incorrect_answers = models.IntegerField(default=0)
    average_score = models.FloatField(default=0)
    
    # Time-based metrics
    total_time_spent = models.IntegerField(default=0)  # in seconds
    average_time_per_session = models.FloatField(default=0)  # in seconds
    
    # Improvement metrics compared to previous period
    score_change = models.FloatField(default=0)  # percentage points change
    time_change = models.FloatField(default=0)  # percentage change in time per session
    
    # Categorization of strengths and weaknesses
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    improvements = models.JSONField(default=list)
    
    # Record creation timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('child', 'game_type', 'period', 'start_date', 'end_date')
        
    def __str__(self):
        return f"{self.child.first_name}'s {self.period} analysis for {self.game_type.name}"
    
    @classmethod
    def generate_analysis(cls, child, game_type, period='day'):
        """
        Generate analysis for a specific child and game type over the specified period
        
        Args:
            child: Child model instance
            game_type: GameType model instance
            period: 'day', 'week', or 'month'
            
        Returns:
            GameAnalysis: The created or updated analysis
        """
        today = timezone.now().date()
        
        # Determine start and end dates based on period
        if period == 'day':
            start_date = today
            end_date = today
            prev_start_date = today - datetime.timedelta(days=1)
            prev_end_date = today - datetime.timedelta(days=1)
        elif period == 'week':
            # Start from previous Monday (or today if it's Monday)
            start_date = today - datetime.timedelta(days=today.weekday())
            end_date = today
            # Previous week
            prev_end_date = start_date - datetime.timedelta(days=1)
            prev_start_date = prev_end_date - datetime.timedelta(days=6)
        elif period == 'month':
            # Start from 1st of current month
            start_date = today.replace(day=1)
            end_date = today
            # Previous month
            if start_date.month == 1:
                prev_month = 12
                prev_year = start_date.year - 1
            else:
                prev_month = start_date.month - 1
                prev_year = start_date.year
            
            prev_start_date = datetime.date(prev_year, prev_month, 1)
            if prev_month == 12:
                next_month = 1
                next_year = prev_year + 1
            else:
                next_month = prev_month + 1
                next_year = prev_year
            
            prev_end_date = datetime.date(next_year, next_month, 1) - datetime.timedelta(days=1)
        
        # Get game sessions for the period
        current_sessions = GameSession.objects.filter(
            child=child,
            game_type=game_type,
            start_time__date__gte=start_date,
            start_time__date__lte=end_date,
            completed=True
        )
        
        # If no sessions for this period, return None
        if not current_sessions.exists():
            return None
        
        # Calculate metrics for current period
        total_sessions = current_sessions.count()
        correct_answers = sum(session.correct_answers for session in current_sessions)
        incorrect_answers = sum(session.incorrect_answers for session in current_sessions)
        total_answers = correct_answers + incorrect_answers
        average_score = (correct_answers / total_answers * 100) if total_answers > 0 else 0
        
        # Calculate time metrics
        total_time_spent = 0
        for session in current_sessions:
            if 'time_spent' in session.session_data:
                total_time_spent += session.session_data['time_spent']
            
        avg_time_per_session = total_time_spent / total_sessions if total_sessions > 0 else 0
        
        # Get previous period data for comparison
        prev_sessions = GameSession.objects.filter(
            child=child,
            game_type=game_type,
            start_time__date__gte=prev_start_date,
            start_time__date__lte=prev_end_date,
            completed=True
        )
        
        # Calculate improvement metrics
        score_change = 0
        time_change = 0
        
        if prev_sessions.exists():
            prev_correct = sum(session.correct_answers for session in prev_sessions)
            prev_incorrect = sum(session.incorrect_answers for session in prev_sessions)
            prev_total = prev_correct + prev_incorrect
            prev_score = (prev_correct / prev_total * 100) if prev_total > 0 else 0
            
            score_change = average_score - prev_score
            
            prev_time_spent = 0
            for session in prev_sessions:
                if 'time_spent' in session.session_data:
                    prev_time_spent += session.session_data['time_spent']
                    
            prev_avg_time = prev_time_spent / prev_sessions.count() if prev_sessions.count() > 0 else 0
            
            if prev_avg_time > 0:
                time_change = ((avg_time_per_session - prev_avg_time) / prev_avg_time) * 100
        
        # Identify strengths and weaknesses
        strengths = []
        weaknesses = []
        improvements = []
        
        # Analyze score
        if average_score >= 80:
            strengths.append({"area": "accuracy", "description": "High accuracy in answering questions", "score": average_score})
        elif average_score <= 40:
            weaknesses.append({"area": "accuracy", "description": "Difficulty answering questions correctly", "score": average_score})
        
        # Analyze time efficiency
        for session in current_sessions:
            if 'time_spent' in session.session_data and session.total_questions > 0:
                time_per_question = session.session_data['time_spent'] / session.total_questions
                if time_per_question < 5:  # Less than 5 seconds per question
                    strengths.append({"area": "speed", "description": "Fast response time", "score": time_per_question})
                elif time_per_question > 15:  # More than 15 seconds per question
                    weaknesses.append({"area": "speed", "description": "Takes more time to respond", "score": time_per_question})
        
        # Analyze improvement
        if score_change > 10:
            improvements.append({"area": "accuracy", "description": "Significant improvement in accuracy", "change": score_change})
        
        if time_change < -10:  # Negative time change means faster responses
            improvements.append({"area": "speed", "description": "Faster response time", "change": time_change})
        
        # Get or create the analysis record
        analysis, created = cls.objects.update_or_create(
            child=child,
            game_type=game_type,
            period=period,
            start_date=start_date,
            end_date=end_date,
            defaults={
                'total_sessions': total_sessions,
                'correct_answers': correct_answers,
                'incorrect_answers': incorrect_answers,
                'average_score': average_score,
                'total_time_spent': total_time_spent,
                'average_time_per_session': avg_time_per_session,
                'score_change': score_change,
                'time_change': time_change,
                'strengths': strengths,
                'weaknesses': weaknesses,
                'improvements': improvements,
            }
        )
        
        return analysis