from django.contrib import admin
from .models import Activity, SocialScenario, GameType, GameProgress, GameSession

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'difficulty_level', 'duration')
    list_filter = ('type', 'difficulty_level')
    search_fields = ('name', 'description')

@admin.register(SocialScenario)
class SocialScenarioAdmin(admin.ModelAdmin):
    list_display = ('title', 'age_group', 'difficulty')
    list_filter = ('age_group', 'difficulty')
    search_fields = ('title', 'description')
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'age_group', 'difficulty')
        }),
        ('Characters', {
            'fields': ('character1_name', 'character2_name')
        }),
        ('Dialogues', {
            'fields': ('dialogues',)
        }),
        ('Response Options', {
            'fields': ('option1', 'option2', 'option3', 'option4', 'correct_option')
        }),
        ('Feedback', {
            'fields': ('correct_feedback', 'incorrect_feedback')
        }),
    )

@admin.register(GameType)
class GameTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'max_difficulty', 'progression_threshold')
    list_filter = ('max_difficulty',)
    search_fields = ('name', 'description')

@admin.register(GameProgress)
class GameProgressAdmin(admin.ModelAdmin):
    list_display = ('child', 'game_type', 'current_difficulty', 'correct_answers', 
                    'incorrect_answers', 'total_games_played', 'score_percentage', 
                    'consecutive_low_performance', 'last_played')
    list_filter = ('game_type', 'current_difficulty')
    search_fields = ('child__first_name', 'child__last_name')
    readonly_fields = ('score_percentage', 'last_played')

@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ('child', 'game_type', 'difficulty_level', 'score_percentage')
    list_filter = ('game_type', 'difficulty_level')
    search_fields = ('child__first_name', 'child__last_name')
    readonly_fields = ('score_percentage', 'total_questions')
