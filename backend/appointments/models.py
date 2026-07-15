from django.db import models
from django.contrib.auth.models import User


class Appointment(models.Model):
    """
    Core appointment scheduling model.
    Each appointment belongs to a single authenticated user.
    """
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    PROVIDER_CHOICES = (
        ('general', 'General Physician'),
        ('cardiologist', 'Cardiologist'),
        ('dermatologist', 'Dermatologist'),
        ('orthopedic', 'Orthopedic Surgeon'),
        ('pediatrician', 'Pediatrician'),
        ('neurologist', 'Neurologist'),
        ('psychiatrist', 'Psychiatrist'),
        ('dentist', 'Dentist'),
        ('ophthalmologist', 'Ophthalmologist'),
        ('ent', 'ENT Specialist'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    provider_type = models.CharField(
        max_length=30,
        choices=PROVIDER_CHOICES,
        default='general'
    )
    provider_name = models.CharField(
        max_length=150,
        default='HealthX Provider'
    )
    scheduled_at = models.DateTimeField()
    reason = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default='scheduled'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ── Placeholder fields for future email reminder integration ──
    reminder_email = models.EmailField(blank=True, default='')
    email_reminder_sent = models.BooleanField(default=False)
    email_reminder_sent_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-scheduled_at']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'

    def __str__(self):
        return (
            f"Appointment #{self.id} — {self.get_provider_type_display()} "
            f"for {self.user.username} at {self.scheduled_at.isoformat()}"
        )
