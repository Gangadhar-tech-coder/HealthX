import json
import logging
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
import google.generativeai as genai

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

logger = logging.getLogger(__name__)

# Core emergency / self-harm / controlled-substance keywords for guardrail checks
EMERGENCY_KEYWORDS = [
    'chest pain', 'heart attack', 'difficulty breathing', 'shortness of breath',
    'cannot breathe', 'stroke', 'numbness', 'slurred speech', 'facial droop',
    'unconscious', 'severe bleeding', 'heavy bleeding', 'seizure', 'choking'
]

RESTRICTED_KEYWORDS = [
    'suicide', 'kill myself', 'self-harm', 'cut myself', 'hang myself',
    'fentanyl', 'heroin', 'cocaine', 'methamphetamine', 'xanax', 'oxycodone',
    'vicodin', 'controlled substance'
]

# Simple Local Grounding Rules for Mock Fallback when Anthropic API Key is missing/invalid
def generate_fallback_response(message):
    message_lower = message.lower()
    
    # Restrict self-harm / controlled substances
    if any(k in message_lower for k in RESTRICTED_KEYWORDS):
        return {
            "response_text": "I notice you mentioned topics related to self-harm or restricted substances. I cannot provide guidance on these issues. If you are in distress, please call the Suicide & Crisis Lifeline at 988 or go to the nearest emergency room.",
            "urgency_level": "emergency",
            "recommended_action": "Seek support immediately. Contact the national crisis line at 988."
        }
        
    # Emergency symptoms
    if any(k in message_lower for k in EMERGENCY_KEYWORDS):
        return {
            "response_text": "Based on the severe symptoms described, you might be experiencing a high-risk medical emergency (such as a heart attack or stroke). It is vital to get clinical attention immediately.",
            "urgency_level": "emergency",
            "recommended_action": "Call 911 or visit the nearest emergency room immediately."
        }
        
    # Standard headache/tension symptoms
    if 'headache' in message_lower or 'migraine' in message_lower:
        return {
            "response_text": "You are describing symptoms consistent with a tension headache or migraine. Possible causes include dehydration, fatigue, stress, or eye strain.",
            "urgency_level": "low",
            "recommended_action": "Drink water, rest in a dark, quiet room, and consider standard over-the-counter pain relievers if appropriate."
        }
        
    # Fever/cough/flu symptoms
    if 'fever' in message_lower or 'cough' in message_lower or 'flu' in message_lower or 'cold' in message_lower:
        return {
            "response_text": "Your symptoms are common indicators of viral upper respiratory tract infections, such as the common cold, influenza, or COVID-19.",
            "urgency_level": "medium",
            "recommended_action": "Monitor body temperature, rest, maintain hydration, and consult a physician if fever exceeds 103°F or lasts longer than 72 hours."
        }
        
    # Default low urgency response
    return {
        "response_text": "I have logged your symptom description. These symptoms appear to be mild or general in nature, potentially related to fatigue or stress.",
        "urgency_level": "low",
        "recommended_action": "Rest and monitor your symptoms. Consult a licensed healthcare provider if they worsen."
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Public registration endpoint.
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'username': user.username,
        'email': user.email
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Public login endpoint using Token auth.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
        
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'username': user.username
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """
    Retrieve all conversation threads of the logged-in user.
    """
    conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, conversation_id):
    """
    Retrieve all messages in a specific conversation thread.
    """
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
    messages = conversation.messages.all().order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def symptom_check(request):
    """
    Core AI Assistant Symptom Checking endpoint.
    - Runs guardrails.
    - Grounded LLM call (or fallback system if api key is missing).
    - Saves state to DB.
    """
    message_content = request.data.get('message')
    conversation_id = request.data.get('conversation_id')
    
    if not message_content:
        return Response({'error': 'Message parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    # 1. Fetch or create conversation thread
    if conversation_id:
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
    else:
        conversation = Conversation.objects.create(user=request.user)
        
    # Save the user's message in the DB
    Message.objects.create(conversation=conversation, role='user', content=message_content)
    
    # 2. Guardrails pre-check
    message_lower = message_content.lower()
    
    # Guardrail: Check for self-harm or controlled substances
    if any(k in message_lower for k in RESTRICTED_KEYWORDS):
        ai_response = {
            "response_text": "I notice you mentioned topics related to self-harm or restricted substances. I cannot provide guidance on these issues. If you are in distress, please call the Suicide & Crisis Lifeline at 988 or go to the nearest emergency room.",
            "urgency_level": "emergency",
            "recommended_action": "Seek support immediately. Contact the national crisis line at 988."
        }
        Message.objects.create(conversation=conversation, role='assistant', content=json.dumps(ai_response))
        return Response({
            'conversation_id': conversation.id,
            'response_text': ai_response['response_text'],
            'urgency_level': ai_response['urgency_level'],
            'recommended_action': ai_response['recommended_action']
        }, status=status.HTTP_200_OK)
        
    # Guardrail: Check for absolute emergency symptoms
    if any(k in message_lower for k in EMERGENCY_KEYWORDS):
        ai_response = {
            "response_text": "Based on the symptoms described (e.g. chest pain, breathing difficulties), you may be experiencing a critical medical emergency. I cannot process diagnostics for emergency symptoms.",
            "urgency_level": "emergency",
            "recommended_action": "Call 911 or proceed immediately to the nearest Emergency Room."
        }
        Message.objects.create(conversation=conversation, role='assistant', content=json.dumps(ai_response))
        return Response({
            'conversation_id': conversation.id,
            'response_text': ai_response['response_text'],
            'urgency_level': ai_response['urgency_level'],
            'recommended_action': ai_response['recommended_action']
        }, status=status.HTTP_200_OK)

    # 3. Consult LLM (Google Gemini) or use fallback grounding rules
    from django.conf import settings
    api_key = getattr(settings, 'GEMINI_API_KEY', '')
    
    ai_response = None
    
    if api_key and not api_key.startswith('your_'):
        try:
            genai.configure(api_key=api_key)
            
            # Fetch past conversation messages to provide conversational history / context
            history = list(conversation.messages.all().order_by('created_at'))
            formatted_history = []
            
            # Format history for Gemini chat API.
            # In Gemini, the AI role is 'model' instead of 'assistant'.
            # We also parse the JSON response_text from stored assistant messages so Gemini gets pure text.
            for h_msg in history[:-1]:
                role = 'user' if h_msg.role == 'user' else 'model'
                content_text = h_msg.content
                if h_msg.role == 'assistant':
                    try:
                        parsed = json.loads(h_msg.content)
                        content_text = parsed.get('response_text', h_msg.content)
                    except Exception:
                        pass
                
                formatted_history.append({
                    'role': role,
                    'parts': [content_text]
                })
            
            system_prompt = (
                "You are an expert medical triage assistant. Analyze the user's symptoms. "
                "CRITICAL: Do not diagnose the user. You are not a doctor. Provide general possibilities, "
                "cite standard medical info, and return a structured JSON response. "
                "Assign an urgency_level of 'low', 'medium', or 'emergency'. "
                "Flag urgency_level as 'emergency' if symptoms indicate potential acute conditions. "
                "Provide a recommended_action string. "
                "Important: Keep responses clear, warm, and concise (1-2 short paragraphs) suitable for text-to-speech reading. "
                "Avoid complex markdown formatting or special symbols in the text. "
                "Language Instruction: You MUST respond in the same language that the user used to write or speak their query. "
                "If the user inputs Spanish, output the entire response_text and recommended_action values in Spanish. "
                "If Hindi, output in Hindi, and so on. The JSON keys ('response_text', 'urgency_level', 'recommended_action') must remain exactly in English."
                "Return the response strictly matching this JSON schema: "
                '{"response_text": "<text info>", "urgency_level": "low"|"medium"|"emergency", "recommended_action": "<action info>"}.'
            )
            
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=system_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Start chat and generate response
            chat = model.start_chat(history=formatted_history)
            response = chat.send_message(message_content)
            
            raw_text = response.text.strip()
            ai_response = json.loads(raw_text)
            
            if not isinstance(ai_response, dict):
                raise ValueError("Parsed Gemini response is not a JSON dictionary.")
            
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            # Fall back to localized grounding rule matrix
            ai_response = generate_fallback_response(message_content)
    else:
        # Fall back to localized grounding rule matrix due to no API key configured
        ai_response = generate_fallback_response(message_content)
        
    if not isinstance(ai_response, dict):
        ai_response = generate_fallback_response(message_content)
        
    # 4. Save response to database and return
    Message.objects.create(conversation=conversation, role='assistant', content=json.dumps(ai_response))
    
    return Response({
        'conversation_id': conversation.id,
        'response_text': ai_response.get('response_text', ''),
        'urgency_level': ai_response.get('urgency_level', 'low'),
        'recommended_action': ai_response.get('recommended_action', 'Monitor symptoms.')
    }, status=status.HTTP_200_OK)
