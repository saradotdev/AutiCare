from django.db import models
from users.models import User
from django.utils import timezone
import pytz

class Child(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    age = models.CharField(max_length=10)  # Ensure you set a max_length for consistency
    GENDER_CHOICES = [('male', 'male'), ('female', 'female'), ('other', 'other')]
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    speech_level = models.CharField(max_length=50)  # e.g., "verbal", "non-verbal"
    time_of_practice = models.IntegerField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='child_profiles/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Session(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='sessions')
    duration = models.IntegerField(default=0)  # in minutes
    limit_crossed = models.BooleanField(default=False)
    session_date = models.DateField(default=timezone.now)  # The day this session belongs to
    active = models.BooleanField(default=True)  # Whether this session is currently active
    
    # Track game sessions for this day
    game_sessions = models.JSONField(default=list, blank=True, help_text="List of game session IDs played on this day")
    
    # Track daily progress snapshot
    daily_progress = models.JSONField(default=dict, blank=True, help_text="Snapshot of progress at the end of the day")
    
    # Track game usage statistics
    game_usage = models.JSONField(default=dict, blank=True, help_text="Time spent on each game type and performance metrics")
    
    class Meta:
        # Ensure only one active session per child
        constraints = [
            models.UniqueConstraint(
                fields=['child'],
                condition=models.Q(active=True),
                name='unique_active_session_per_child'
            )
        ]
    
    def add_game_session(self, game_session_id):
        """Add a game session ID to the list if it doesn't already exist"""
        if not self.game_sessions:
            self.game_sessions = []
            
        # Convert to list if it's not already (in case it was stored as string)
        if not isinstance(self.game_sessions, list):
            try:
                self.game_sessions = list(self.game_sessions)
            except Exception:
                self.game_sessions = []
                
        # Add the session ID if it's not already in the list
        if game_session_id not in self.game_sessions:
            self.game_sessions.append(game_session_id)
            self.save()
        
        return self.game_sessions
    
    def update_game_usage(self, game_code, correct=0, incorrect=0):
        """Update the usage statistics for a specific game"""
        if not self.game_usage:
            self.game_usage = {}
            
        # Initialize game entry if it doesn't exist
        if game_code not in self.game_usage:
            self.game_usage[game_code] = {
                'correct_answers': 0,
                'incorrect_answers': 0,
                'total_plays': 0
            }
        
        # Update with new values
        self.game_usage[game_code]['correct_answers'] += correct
        self.game_usage[game_code]['incorrect_answers'] += incorrect
        self.game_usage[game_code]['total_plays'] += 1
        
        self.save()
        return self.game_usage
    
    def update_daily_progress(self, progress_snapshot):
        """Update the daily progress snapshot"""
        self.daily_progress = progress_snapshot
        self.save()
        return self.daily_progress
    
    def end_session(self):
        """End the active session"""
        self.active = False
        self.save()
        return self
    
    @classmethod
    def get_active_session(cls, child):
        """Get the active session for a child if it exists"""
        try:
            # Use Pakistani timezone for date comparison
            pk_timezone = pytz.timezone('Asia/Karachi')
            today_pk = timezone.now().astimezone(pk_timezone).date()
            
            return cls.objects.get(child=child, active=True, session_date=today_pk)
        except cls.DoesNotExist:
            return None
    
    @classmethod
    def check_and_reset_session(cls, child):
        """
        Check if the child has an active session from a previous day and reset it if necessary
        Creates a new session for today if needed
        Uses Pakistani timezone (Asia/Karachi) for date comparison
        
        Args:
            child: Child model instance
            
        Returns:
            tuple: (active_session, was_reset)
                active_session: The current active session
                was_reset: Boolean indicating if a reset occurred
        """
        # Get Pakistan timezone
        pk_timezone = pytz.timezone('Asia/Karachi')
        today_pk = timezone.now().astimezone(pk_timezone).date()
        
        # Check for existing active session
        active_session = cls.get_active_session(child)
        
        # If no active session, create a new one for today
        if not active_session:
            new_session = cls.objects.create(
                child=child,
                active=True,
                session_date=today_pk
            )
            return new_session, False
        
        # Check if active session is from a different day
        session_date_pk = active_session.session_date
        
        # If the session date is not today in Pakistan time, end it and create a new one
        if session_date_pk != today_pk:
            # End the previous session
            active_session.end_session()
            
            # Create a new session for today
            new_session = cls.objects.create(
                child=child,
                active=True,
                session_date=today_pk
            )
            return new_session, True
        
        # Session is current, no need for reset
        return active_session, False