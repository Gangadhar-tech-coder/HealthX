import logging
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def get_admin_email():
    return getattr(settings, 'ADMIN_EMAIL', 'venkypulicharla781@gmail.com')


def send_mail_safe(subject, message, from_email, recipient_list, html_message=None):
    """
    Safely dispatches an email using Django's SMTP send_mail.
    Returns True if sent successfully, False otherwise.
    """
    try:
        if not recipient_list:
            logger.warning("Empty recipient list provided for send_mail_safe.")
            return False

        # Filter out empty or duplicate recipients while preserving order
        valid_recipients = list(dict.fromkeys([r.strip() for r in recipient_list if r and r.strip()]))
        if not valid_recipients:
            logger.warning("No valid recipient addresses found after filtering.")
            return False

        sent_count = send_mail(
            subject=subject,
            message=message,
            from_email=from_email or settings.DEFAULT_FROM_EMAIL,
            recipient_list=valid_recipients,
            html_message=html_message,
            fail_silently=False
        )
        logger.info(f"Email '{subject}' successfully delivered to {valid_recipients} (count: {sent_count})")
        return sent_count > 0

    except Exception as e:
        logger.error(f"SMTP error sending email '{subject}' to {recipient_list}: {e}")
        return False


def send_appointment_confirmation_email(appointment):
    """
    Send structured appointment notifications:
    1. Admin email (venkypulicharla781@gmail.com) gets full table of patient appointment details.
    2. Patient gets a booking confirmation email.
    """
    try:
        admin_email = get_admin_email()
        patient_email = (appointment.reminder_email or appointment.user.email or '').strip()

        scheduled_dt = appointment.scheduled_at
        date_str = scheduled_dt.strftime('%A, %B %d, %Y')
        time_str = scheduled_dt.strftime('%I:%M %p')

        # -------------------------------------------------------------
        # 1. ADMIN NOTIFICATION EMAIL (Contains HTML Table)
        # -------------------------------------------------------------
        admin_subject = f"🔔 New Appointment Booked — #{appointment.id} ({appointment.user.username})"

        admin_html = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1E40AF, #3B82F6); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">🔔 New Appointment Booking Received</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 0;">HealthX AI Platform — Admin Notification</p>
            </div>

            <!-- Body -->
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">
                    A patient has booked a new appointment. Below are the appointment details:
                </p>

                <!-- Appointment Details Table -->
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #E5E7EB;">
                                <th style="padding: 10px 8px; text-align: left; color: #4B5563; font-weight: 700; width: 35%;">Field</th>
                                <th style="padding: 10px 8px; text-align: left; color: #4B5563; font-weight: 700; width: 65%;">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Patient Username</td>
                                <td style="padding: 10px 8px; color: #111827; font-weight: 700;">{appointment.user.username}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Account Email</td>
                                <td style="padding: 10px 8px; color: #2563EB; font-weight: 600;">{appointment.user.email or 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Notification Email</td>
                                <td style="padding: 10px 8px; color: #2563EB; font-weight: 600;">{patient_email or 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Appointment ID</td>
                                <td style="padding: 10px 8px; color: #111827; font-weight: 700;">#{appointment.id}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Specialist Type</td>
                                <td style="padding: 10px 8px; color: #111827;">{appointment.get_provider_type_display()}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Assigned Doctor</td>
                                <td style="padding: 10px 8px; color: #111827; font-weight: 600;">{appointment.provider_name}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Scheduled Date & Time</td>
                                <td style="padding: 10px 8px; color: #2563EB; font-weight: 700;">📅 {date_str} at 🕐 {time_str}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Reason for Visit</td>
                                <td style="padding: 10px 8px; color: #374151;">{appointment.reason or 'Not specified'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #E5E7EB;">
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Patient Notes</td>
                                <td style="padding: 10px 8px; color: #374151;">{appointment.notes or 'None'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 8px; color: #6B7280; font-weight: 600;">Status</td>
                                <td style="padding: 10px 8px;">
                                    <span style="background: #D1FAE5; color: #065F46; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px;">Scheduled</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Footer -->
            <div style="background: #F3F4F6; padding: 16px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI Platform — Admin System Notification</p>
            </div>
        </div>
        """

        admin_plain = f"""
New Appointment Booking Received — HealthX AI

Patient Username: {appointment.user.username}
Account Email: {appointment.user.email or 'N/A'}
Notification Email: {patient_email or 'N/A'}
Appointment ID: #{appointment.id}
Specialist: {appointment.get_provider_type_display()}
Doctor: {appointment.provider_name}
Date: {date_str}
Time: {time_str}
Reason: {appointment.reason or 'Not specified'}
Notes: {appointment.notes or 'None'}
Status: Scheduled
"""

        admin_sent = send_mail_safe(
            subject=admin_subject,
            message=admin_plain,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            html_message=admin_html,
        )

        # -------------------------------------------------------------
        # 2. PATIENT CONFIRMATION EMAIL
        # -------------------------------------------------------------
        patient_sent = False
        if patient_email:
            patient_subject = f"HealthX — Appointment Confirmed (#{appointment.id})"

            notes_html = (
                f'<div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; '
                f'padding: 12px 16px; margin-bottom: 24px;"><p style="color: #92400E; font-size: 13px; '
                f'margin: 0;"><strong>📝 Patient Notes:</strong> {appointment.notes}</p></div>'
            ) if appointment.notes else ''

            patient_html = f"""
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
                <div style="background: linear-gradient(135deg, #2563EB, #4F46E5); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">✅ Appointment Confirmed</h1>
                    <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Your consultation has been scheduled successfully.</p>
                </div>
                <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                    <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">
                        Hi <strong>{appointment.user.username}</strong>,
                    </p>
                    <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                        Your appointment has been booked. Below are the details of your upcoming consultation:
                    </p>

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

                    {notes_html}

                    <div style="text-align: center; margin: 24px 0;">
                        <a href="https://health-x-snfk.vercel.app/appointments" 
                           style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">
                            View My Appointments
                        </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
                    <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6; margin: 0;">
                        ⚠️ <strong>Emergency Notice:</strong> If you experience severe symptoms before your appointment (chest pain, difficulty breathing, seizure), call 911 immediately.
                    </p>
                </div>
                <div style="background: #F3F4F6; padding: 20px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                    <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI — Your 24/7 AI Healthcare Companion</p>
                </div>
            </div>
            """

            patient_plain = f"""
HealthX — Appointment Confirmed (#{appointment.id})

Hi {appointment.user.username},

Your appointment has been scheduled successfully.
Appointment ID: #{appointment.id}
Specialist: {appointment.get_provider_type_display()}
Doctor: {appointment.provider_name}
Date: {date_str}
Time: {time_str}
Reason: {appointment.reason or 'Not specified'}

View your appointments: https://health-x-snfk.vercel.app/appointments
"""

            # Send to patient if patient_email is different from admin_email (or send anyway)
            if patient_email.lower() != admin_email.lower():
                patient_sent = send_mail_safe(
                    subject=patient_subject,
                    message=patient_plain,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[patient_email],
                    html_message=patient_html,
                )
            else:
                patient_sent = True

        # Mark reminder sent status
        appointment.email_reminder_sent = True
        appointment.email_reminder_sent_at = timezone.now()
        appointment.save(update_fields=['email_reminder_sent', 'email_reminder_sent_at'])

        logger.info(f"Appointment confirmation emails dispatched — admin: {admin_sent}, patient ({patient_email}): {patient_sent}")
        return admin_sent or patient_sent

    except Exception as e:
        logger.error(f"Failed to send appointment confirmation emails for #{appointment.id}: {e}")
        return False


def send_appointment_cancellation_email(appointment):
    """
    Send a cancellation notification email when an appointment is cancelled.
    """
    try:
        admin_email = get_admin_email()
        patient_email = (appointment.reminder_email or appointment.user.email or '').strip()

        scheduled_dt = appointment.scheduled_at
        date_str = scheduled_dt.strftime('%A, %B %d, %Y')
        time_str = scheduled_dt.strftime('%I:%M %p')

        subject = f"HealthX — Appointment Cancelled (#{appointment.id})"

        html_body = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">❌ Appointment Cancelled</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0;">Scheduled consultation has been cancelled.</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">Appointment Cancellation Details:</p>
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                    Appointment <strong>#{appointment.id}</strong> with <strong>{appointment.provider_name}</strong> ({appointment.get_provider_type_display()}) 
                    originally for <strong>{date_str}</strong> at <strong>{time_str}</strong> (Patient: {appointment.user.username}) has been cancelled.
                </p>
            </div>
            <div style="background: #F3F4F6; padding: 20px 24px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #E5E7EB; border-top: none;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">HealthX AI — Your 24/7 AI Healthcare Companion</p>
            </div>
        </div>
        """

        plain_body = f"""
HealthX — Appointment Cancelled (#{appointment.id})

Appointment #{appointment.id} for {appointment.user.username} with {appointment.provider_name} on {date_str} at {time_str} has been cancelled.
"""

        recipients = list(set(filter(None, [admin_email, patient_email])))
        send_mail_safe(
            subject=subject,
            message=plain_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            html_message=html_body,
        )
        logger.info(f"Cancellation email sent for appointment #{appointment.id} to {recipients}")
        return True

    except Exception as e:
        logger.error(f"Failed to send cancellation email for #{appointment.id}: {e}")
        return False


def send_contact_form_email(name, email, subject, message):
    """
    Send structured email for Contact Us submissions:
    1. Admin (venkypulicharla781@gmail.com) gets full table of sender info and message.
    2. Sender gets a confirmation receipt email.
    """
    try:
        admin_email = get_admin_email()
        sender_email = (email or '').strip()

        # -------------------------------------------------------------
        # 1. ADMIN NOTIFICATION EMAIL (Table Format)
        # -------------------------------------------------------------
        admin_subject = f"📩 New Contact Form Submission — {subject or 'New Inquiry'}"

        admin_html = f"""
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563EB, #06B6D4); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">📩 New Contact Form Submission</h1>
                <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0;">HealthX AI Platform — Admin Notification</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr style="border-bottom: 1px solid #E5E7EB;">
                            <td style="padding: 10px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">From Name</td>
                            <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">{name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E5E7EB;">
                            <td style="padding: 10px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Sender Email</td>
                            <td style="padding: 10px 0; color: #2563EB; font-size: 14px; font-weight: 600; text-align: right;">{sender_email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Subject</td>
                            <td style="padding: 10px 0; color: #111827; font-size: 14px; text-align: right;">{subject or 'General Inquiry'}</td>
                        </tr>
                    </table>
                </div>
                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;">
                    <p style="color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 8px;">Message Content</p>
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

From Name: {name}
Sender Email: {sender_email}
Subject: {subject or 'General Inquiry'}

Message:
{message}
"""

        admin_sent = send_mail_safe(
            subject=admin_subject,
            message=admin_plain,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            html_message=admin_html,
        )

        # -------------------------------------------------------------
        # 2. SENDER CONFIRMATION EMAIL
        # -------------------------------------------------------------
        user_sent = False
        if sender_email and sender_email.lower() != admin_email.lower():
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
                        Thank you for reaching out to HealthX AI. We have received your message and our team will review your inquiry shortly.
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
"""

            user_sent = send_mail_safe(
                subject=user_subject,
                message=user_plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[sender_email],
                html_message=user_html,
            )
        else:
            user_sent = True

        logger.info(f"Contact form emails dispatched — admin: {admin_sent}, sender ({sender_email}): {user_sent}")
        return admin_sent or user_sent

    except Exception as e:
        logger.error(f"Failed to send contact form email: {e}")
        return False
