from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from .models import Appointment
from .serializers import AppointmentSerializer
from .emails import send_appointment_confirmation_email, send_appointment_cancellation_email

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations for user appointments.
    Only the owner of the appointments can access or modify them.
    Sends structured emails on booking and cancellation.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        # Only return appointments of the logged-in user
        return Appointment.objects.filter(user=self.request.user).order_by('-scheduled_at')

    def perform_create(self, serializer):
        # Default the reminder email to the user's email if not provided
        reminder_email = self.request.data.get('reminder_email', '')
        if not reminder_email:
            reminder_email = self.request.user.email

        # Save the appointment and associate it with the current user
        appointment = serializer.save(user=self.request.user, reminder_email=reminder_email)

        # Send appointment confirmation email
        send_appointment_confirmation_email(appointment)

    def perform_update(self, serializer):
        # Check if status is being changed to 'cancelled'
        old_status = serializer.instance.status
        appointment = serializer.save()
        new_status = appointment.status

        # If the appointment was just cancelled, send a cancellation email
        if old_status != 'cancelled' and new_status == 'cancelled':
            send_appointment_cancellation_email(appointment)
