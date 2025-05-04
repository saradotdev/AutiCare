from django.core.management.base import BaseCommand
from activities.models import GameType
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize default game types'

    def handle(self, *args, **kwargs):
        self.stdout.write('Initializing default game types...')
        
        # Define default game types
        default_game_types = [
            {
                'name': 'Facial Expressions',
                'code': 'FACIAL',
                'description': 'A game to help children recognize and match different facial expressions.',
                'max_difficulty': 3,
                'progression_threshold': 10,
            },
            {
                'name': 'Match and Sort',
                'code': 'MATCHSORT',
                'description': 'A game to help children practice matching and sorting different shapes and colors.',
                'max_difficulty': 3,
                'progression_threshold': 10,
            },
            {
                'name': 'Social Scenarios',
                'code': 'SOCIAL',
                'description': 'A game to help children learn appropriate responses in social situations.',
                'max_difficulty': 3,
                'progression_threshold': 5,
            },
        ]
        
        # Create game types if they don't exist
        for game_data in default_game_types:
            game_type, created = GameType.objects.get_or_create(
                code=game_data['code'],
                defaults={
                    'name': game_data['name'],
                    'description': game_data['description'],
                    'max_difficulty': game_data['max_difficulty'],
                    'progression_threshold': game_data['progression_threshold'],
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created game type: {game_type.name}'))
            else:
                self.stdout.write(f'Game type already exists: {game_type.name}')
        
        self.stdout.write(self.style.SUCCESS('Game types initialization completed!')) 