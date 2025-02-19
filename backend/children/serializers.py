from rest_framework import serializers
from .models import Child, Session

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = [
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
    class Meta:
        model = Session
        fields = '__all__'