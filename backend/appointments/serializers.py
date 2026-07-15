from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    provider_type_display = serializers.CharField(source='get_provider_type_display', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'provider_type', 'provider_type_display', 
            'provider_name', 'scheduled_at', 'reason', 'notes', 
            'status', 'created_at', 'updated_at',
            'reminder_email', 'email_reminder_sent', 'email_reminder_sent_at'
        ]
        read_only_fields = [
            'id', 'user', 'created_at', 'updated_at', 
            'email_reminder_sent', 'email_reminder_sent_at'
        ]
