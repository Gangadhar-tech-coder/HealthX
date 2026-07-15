import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

logger = logging.getLogger(__name__)


def send_appointment_confirmation_email(appointment):
    """
    Send a structured confirmation email when a user books an appointment.
    """
    try:
        recipient = appointment.reminder_email or appointment.user.email
        if not recipient:
            logger.warning(f"No email address for appointment #{appointment.id}, skipping email.")
            return False

        scheduled_dt = appointment.scheduled_at
        date_str = scheduled_dt.strftime('%A, %B %d, %Y')
        time_str = scheduled_dt.strftime('%I:%M %p')

        subject = f"HealthX — Appointment Confirmed (#{appointment.id})"

        # Pre-build conditional sections to avoid backslashes in f-strings
        notes_html = (
            '<div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; '
            'padding: 12px 16px; margin-bottom: 24px;"><p style="color: #92400E; font-size: 13px; '
            'margin: 0;"><strong>📝 Patient Notes:</strong> ' + appointment.notes + '</p></div>'
        ) if appointment.notes else ''
        notes_plain = f"Patient Notes: {appointment.notes}" if appointment.notes else ''

        html_body = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563EB, #4F46E5); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">✅ Appointment Confirmed</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Your consultation has been scheduled successfully.</p>
            </div>

            <!-- Body -->
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">
                    Hi <strong>{appointment.user.username}</strong>,
                </p>
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                    Your appointment has been booked. Below are the details of your upcoming consultation:
                </p>

                <!-- Appointment Details Card -->
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Appointment ID</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">#{appointment.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Specialist</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{appointment.get_provider_type_display()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Doctor</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{appointment.provider_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Date</td>
                            <td style="padding: 8px 0; color: #2563EB; font-size: 14px; font-weight: 700; text-align: right;">📅 {date_str}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Time</td>
                            <td style="padding: 8px 0; color: #2563EB; font-size: 14px; font-weight: 700; text-align: right;">🕐 {time_str}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Reason</td>
                            <td style="padding: 8px 0; color: #374151; font-size: 14px; text-align: right;">{appointment.reason or 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Status</td>
                            <td style="padding: 8px 0; text-align: right;">
                                <span style="background: #D1FAE5; color: #065F46; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px;">Scheduled</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Notes Section -->
                {notes_html}

                <!-- CTA -->
                <div style="text-align: center; margin: 24px 0;">
                    <a href="https://health-x-snfk.vercel.app/appointments" 
                       style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">
                        View My Appointments
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />

                <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6; margin: 0;">
                    ⚠️ <strong>Emergency Notice:</strong> If you experience severe symptoms before your appointment (chest pain, difficulty breathing, seizure), 
                    call emergency services (911) immediately. Do not wait for your scheduled consultation.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #F3F4F6; padding: 20px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">
                    HealthX AI — Your 24/7 AI Healthcare Companion<br/>
                    This is an automated email. Please do not reply directly.
                </p>
            </div>
        </div>
        """

        plain_body = f"""
HealthX — Appointment Confirmed (#{appointment.id})

Hi {appointment.user.username},

Your appointment has been scheduled successfully. Details:

  Appointment ID: #{appointment.id}
  Specialist: {appointment.get_provider_type_display()}
  Doctor: {appointment.provider_name}
  Date: {date_str}
  Time: {time_str}
  Reason: {appointment.reason or 'Not specified'}
  Status: Scheduled

{"Patient Notes: " + appointment.notes if appointment.notes else ""}

View your appointments: https://health-x-snfk.vercel.app/appointments

If you experience severe symptoms before your appointment, call emergency services (911) immediately.

---
HealthX AI — Your 24/7 AI Healthcare Companion
"""

        send_mail(
            subject=subject,
            message=plain_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            html_message=html_body,
            fail_silently=False,
        )

        # Update email_reminder_sent flag
        from django.utils import timezone
        appointment.email_reminder_sent = True
        appointment.email_reminder_sent_at = timezone.now()
        appointment.save(update_fields=['email_reminder_sent', 'email_reminder_sent_at'])

        logger.info(f"Appointment confirmation email sent for #{appointment.id} to {recipient}")
        return True

    except Exception as e:
        logger.error(f"Failed to send appointment email for #{appointment.id}: {e}")
        return False


def send_appointment_cancellation_email(appointment):
    """
    Send a cancellation notification email when a user cancels an appointment.
    """
    try:
        recipient = appointment.reminder_email or appointment.user.email
        if not recipient:
            return False

        scheduled_dt = appointment.scheduled_at
        date_str = scheduled_dt.strftime('%A, %B %d, %Y')
        time_str = scheduled_dt.strftime('%I:%M %p')

        subject = f"HealthX — Appointment Cancelled (#{appointment.id})"

        html_body = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">❌ Appointment Cancelled</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Your scheduled consultation has been cancelled.</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">Hi <strong>{appointment.user.username}</strong>,</p>
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                    Your appointment with <strong>{appointment.provider_name}</strong> ({appointment.get_provider_type_display()}) 
                    scheduled for <strong>{date_str}</strong> at <strong>{time_str}</strong> has been cancelled.
                </p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="https://health-x-snfk.vercel.app/appointments" 
                       style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">
                        Reschedule Appointment
                    </a>
                </div>
            </div>
            <div style="background: #F3F4F6; padding: 20px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI — Your 24/7 AI Healthcare Companion</p>
            </div>
        </div>
        """

        plain_body = f"""
HealthX — Appointment Cancelled (#{appointment.id})

Hi {appointment.user.username},

Your appointment with {appointment.provider_name} ({appointment.get_provider_type_display()}) 
scheduled for {date_str} at {time_str} has been cancelled.

Reschedule: https://health-x-snfk.vercel.app/appointments

---
HealthX AI — Your 24/7 AI Healthcare Companion
"""

        send_mail(
            subject=subject,
            message=plain_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            html_message=html_body,
            fail_silently=False,
        )
        logger.info(f"Cancellation email sent for appointment #{appointment.id} to {recipient}")
        return True

    except Exception as e:
        logger.error(f"Failed to send cancellation email for #{appointment.id}: {e}")
        return False


def send_contact_form_email(name, email, subject, message):
    """
    Send a structured email from the Contact Us page.
    Sends to the platform admin and a confirmation copy to the user.
    """
    try:
        admin_email = settings.DEFAULT_FROM_EMAIL

        # Email to admin
        admin_subject = f"HealthX Contact Form — {subject or 'New Inquiry'}"

        admin_html = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563EB, #06B6D4); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">📩 New Contact Form Submission</h1>
                <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0;">HealthX AI Platform</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">From</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Email</td>
                            <td style="padding: 8px 0; color: #2563EB; font-size: 14px; font-weight: 600; text-align: right;">{email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Subject</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">{subject or 'General Inquiry'}</td>
                        </tr>
                    </table>
                </div>
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;">
                    <p style="color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 8px;">Message</p>
                    <p style="color: #374151; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">{message}</p>
                </div>
            </div>
            <div style="background: #F3F4F6; padding: 16px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI — Contact Form Notification</p>
            </div>
        </div>
        """

        admin_plain = f"""
New Contact Form Submission — HealthX AI

From: {name}
Email: {email}
Subject: {subject or 'General Inquiry'}

Message:
{message}

---
HealthX AI Platform
"""

        send_mail(
            subject=admin_subject,
            message=admin_plain,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            html_message=admin_html,
            fail_silently=False,
        )

        # Confirmation email to the user
        user_subject = "HealthX — We received your message!"

        user_html = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981, #06B6D4); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">✅ Message Received</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 0;">We'll get back to you within 24 hours.</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hi <strong>{name}</strong>,</p>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                    Thank you for reaching out to HealthX AI. We have received your message and our team will 
                    review your inquiry shortly. You can expect a response within <strong>24 hours</strong>.
                </p>
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 8px;">Your Message</p>
                    <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{message}</p>
                </div>
                <div style="text-align: center;">
                    <a href="https://health-x-snfk.vercel.app/" 
                       style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">
                        Visit HealthX AI
                    </a>
                </div>
            </div>
            <div style="background: #F3F4F6; padding: 16px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI — Your 24/7 AI Healthcare Companion</p>
            </div>
        </div>
        """

        user_plain = f"""
Hi {name},

Thank you for reaching out to HealthX AI. We have received your message and our team will review your inquiry shortly.

Your message:
{message}

We'll get back to you within 24 hours.

Visit us: https://health-x-snfk.vercel.app/

---
HealthX AI — Your 24/7 AI Healthcare Companion
"""

        send_mail(
            subject=user_subject,
            message=user_plain,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=user_html,
            fail_silently=False,
        )

        logger.info(f"Contact form emails sent — admin + user confirmation to {email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send contact form email: {e}")
        return False
