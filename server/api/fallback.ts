/**
 * Fallback response system
 * Provides pre-defined responses when API calls are limited due to quotas
 */
import { LanguageCode } from './openai';
import { TherapyApproach } from '@shared/schema';

// Array of generic fallback responses
export const fallbackResponses = [
  "I understand you're going through something difficult. It's okay to feel this way, and your emotions are valid. What specific aspects are troubling you the most right now?",
  "Thank you for sharing that with me. Sometimes putting our feelings into words can help us process them better. How long have you been experiencing this?",
  "That sounds challenging. Remember that difficult emotions are a natural part of life's journey. Would it help to explore some coping strategies together?",
  "I appreciate your openness. Many people face similar struggles, and it's brave of you to talk about it. What have you found helpful in the past?",
  "I hear you. It takes courage to express these feelings. Would you like to discuss some practical steps that might help with this situation?",
  "Your feelings are completely valid. Sometimes just acknowledging our emotions can be the first step toward healing. What support do you have in your life right now?",
  "That's a lot to process. Taking one small step at a time can make things more manageable. What's one tiny thing that might make today a bit better?",
  "I'm here to listen. Sometimes life presents us with difficult challenges, but you don't have to face them alone. What would be most helpful for you right now?",
  "Thank you for trusting me with these thoughts. Everyone's journey has ups and downs. What helps you regain your balance when things feel overwhelming?",
  "It sounds like you're carrying a heavy emotional load right now. Self-compassion is crucial during these times. How might you show yourself some kindness today?"
];

/**
 * Get a random fallback response
 */
export function getFallbackResponse(): string {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

// Fallback responses by language
export const fallbackResponsesByLanguage: Record<string, string[]> = {
  'en': [
    "I hear you. That sounds challenging. What do you think might help in this situation?",
    "Thank you for sharing that. How have you been coping with these feelings lately?",
    "That's a lot to process. What support systems do you have around you right now?",
    "I understand. Sometimes just talking about our problems can help us see them differently. What's been on your mind the most?",
    "It takes courage to share these thoughts. What would make the biggest positive difference for you right now?"
  ],
  'zh': [
    "我听到你的声音。这听起来很有挑战性。你认为什么可能有助于解决这种情况？",
    "谢谢你分享。最近你是如何应对这些感受的？",
    "这需要时间消化。你现在身边有什么支持系统？",
    "我理解。有时候谈论我们的问题可以帮助我们以不同的方式看待它们。最近什么事情最让你牵挂？",
    "分享这些想法需要勇气。什么会给你带来最大的积极改变？"
  ],
  'zh_TW': [
    "我聽到你的聲音。這聽起來很有挑戰性。你認為什麼可能有助於解決這種情況？",
    "謝謝你分享。最近你是如何應對這些感受的？",
    "這需要時間消化。你現在身邊有什麼支持系統？",
    "我理解。有時候談論我們的問題可以幫助我們以不同的方式看待它們。最近什麼事情最讓你牽掛？",
    "分享這些想法需要勇氣。什麼會給你帶來最大的積極改變？"
  ],
  'es': [
    "Te escucho. Eso suena difícil. ¿Qué crees que podría ayudar en esta situación?",
    "Gracias por compartir eso. ¿Cómo has estado lidiando con estos sentimientos últimamente?",
    "Es mucho para procesar. ¿Qué sistemas de apoyo tienes a tu alrededor en este momento?",
    "Entiendo. A veces, solo hablar de nuestros problemas puede ayudarnos a verlos de manera diferente. ¿Qué ha estado en tu mente últimamente?",
    "Se necesita valor para compartir estos pensamientos. ¿Qué haría la mayor diferencia positiva para ti ahora mismo?"
  ],
  'fr': [
    "Je t'entends. Cela semble difficile. Qu'est-ce qui pourrait aider dans cette situation selon toi?",
    "Merci de partager cela. Comment as-tu géré ces sentiments dernièrement?",
    "C'est beaucoup à traiter. Quels systèmes de soutien as-tu autour de toi en ce moment?",
    "Je comprends. Parfois, le simple fait de parler de nos problèmes peut nous aider à les voir différemment. Qu'est-ce qui occupe le plus ton esprit?",
    "Il faut du courage pour partager ces pensées. Qu'est-ce qui ferait la plus grande différence positive pour toi maintenant?"
  ],
  'de': [
    "Ich höre dich. Das klingt herausfordernd. Was könnte deiner Meinung nach in dieser Situation helfen?",
    "Danke für's Teilen. Wie gehst du in letzter Zeit mit diesen Gefühlen um?",
    "Das ist viel zu verarbeiten. Welche Unterstützungssysteme hast du gerade um dich herum?",
    "Ich verstehe. Manchmal kann uns das bloße Sprechen über unsere Probleme helfen, sie anders zu sehen. Was beschäftigt dich am meisten?",
    "Es braucht Mut, diese Gedanken zu teilen. Was würde für dich jetzt den größten positiven Unterschied machen?"
  ],
  'it': [
    "Ti ascolto. Sembra difficile. Cosa pensi potrebbe aiutare in questa situazione?",
    "Grazie per aver condiviso. Come hai gestito questi sentimenti ultimamente?",
    "È molto da elaborare. Quali sistemi di supporto hai intorno a te in questo momento?",
    "Capisco. A volte, parlare dei nostri problemi può aiutarci a vederli in modo diverso. Cosa ti preoccupa di più?",
    "Ci vuole coraggio per condividere questi pensieri. Cosa farebbe la differenza positiva più grande per te adesso?"
  ],
  'pt': [
    "Eu te ouço. Isso parece desafiador. O que você acha que poderia ajudar nesta situação?",
    "Obrigado por compartilhar isso. Como você tem lidado com esses sentimentos ultimamente?",
    "É muita coisa para processar. Quais sistemas de apoio você tem ao seu redor agora?",
    "Eu entendo. Às vezes, apenas falar sobre nossos problemas pode nos ajudar a vê-los de maneira diferente. O que tem ocupado mais a sua mente?",
    "É preciso coragem para compartilhar esses pensamentos. O que faria a maior diferença positiva para você agora?"
  ],
  'nl': [
    "Ik hoor je. Dat klinkt uitdagend. Wat denk je dat zou kunnen helpen in deze situatie?",
    "Bedankt voor het delen. Hoe ga je de laatste tijd om met deze gevoelens?",
    "Het is veel om te verwerken. Welke ondersteuningssystemen heb je op dit moment om je heen?",
    "Ik begrijp het. Soms kan alleen al praten over onze problemen ons helpen om ze anders te zien. Wat houdt je de laatste tijd het meest bezig?",
    "Het vergt moed om deze gedachten te delen. Wat zou nu het grootste positieve verschil voor je maken?"
  ],
  'ru': [
    "Я слышу тебя. Это звучит сложно. Как ты думаешь, что могло бы помочь в этой ситуации?",
    "Спасибо, что поделился этим. Как ты справляешься с этими чувствами в последнее время?",
    "Это многое нужно осмыслить. Какие системы поддержки есть вокруг тебя сейчас?",
    "Я понимаю. Иногда просто разговор о наших проблемах может помочь нам увидеть их по-другому. Что больше всего беспокоит тебя?",
    "Нужна смелость, чтобы поделиться этими мыслями. Что сейчас принесло бы тебе наибольшую положительную разницу?"
  ],
  'uk': [
    "Я чую тебе. Це звучить складно. Як ти думаєш, що могло б допомогти в цій ситуації?",
    "Дякую, що поділився цим. Як ти справляєшся з цими почуттями останнім часом?",
    "Це багато що потрібно осмислити. Які системи підтримки є навколо тебе зараз?",
    "Я розумію. Іноді просто розмова про наші проблеми може допомогти нам побачити їх по-іншому. Що найбільше турбує тебе?",
    "Потрібна сміливість, щоб поділитися цими думками. Що зараз принесло б тобі найбільшу позитивну різницю?"
  ],
  'ar': [
    "أسمعك. يبدو ذلك صعبًا. ما الذي تعتقد أنه قد يساعد في هذا الموقف؟",
    "شكرًا لمشاركة ذلك. كيف كنت تتعامل مع هذه المشاعر مؤخرًا؟",
    "هذا الكثير للمعالجة. ما هي أنظمة الدعم التي لديك من حولك الآن؟",
    "أفهم. في بعض الأحيان، مجرد التحدث عن مشاكلنا يمكن أن يساعدنا على رؤيتها بشكل مختلف. ما الذي يشغل ذهنك أكثر؟",
    "يتطلب الأمر شجاعة لمشاركة هذه الأفكار. ما الذي سيحدث أكبر فرق إيجابي بالنسبة لك الآن؟"
  ],
  'ja': [
    "あなたの声を聞いています。それは難しいことのようですね。この状況で何が役立つと思いますか？",
    "共有してくれてありがとう。最近、これらの感情にどのように対処していますか？",
    "処理するのは大変ですね。現在、あなたの周りにはどのようなサポートシステムがありますか？",
    "理解しています。時に、問題について話すだけで、それらを違った角度から見ることができます。最近、何が一番気になっていますか？",
    "これらの考えを共有するには勇気が必要です。今、あなたにとって最大のポジティブな違いを生み出すものは何ですか？"
  ]
};

// Fallback responses by therapy approach
export const fallbackResponsesByApproach: Record<string, string[]> = {
  'general': [
    "I hear you, and your feelings are valid. What might help you feel more supported right now?",
    "Thank you for sharing that. It takes courage to express these thoughts. How have you been coping?",
    "That sounds really challenging. What strategies have helped you through difficult times before?",
    "I understand this is hard. Sometimes just talking through our emotions can help us process them. What else is on your mind?",
    "Your experiences matter. Would it help to explore some ways to address this together?"
  ],
  
  'cbt': [
    "I notice there might be some thought patterns affecting how you feel. Could we examine what thoughts come up most frequently?",
    "When you think about this situation, what automatic thoughts or beliefs arise? Some might not be fully accurate.",
    "Let's try to identify any cognitive distortions here. Are you perhaps catastrophizing or using all-or-nothing thinking?",
    "What evidence supports or contradicts these thoughts? There might be a more balanced perspective to consider.",
    "How might you reframe this thought in a more helpful or realistic way? What alternative view might be possible?"
  ],
  
  'mindfulness': [
    "Let's pause for a moment and notice what's happening in your body right now. Where do you feel tension or emotion?",
    "Try bringing gentle awareness to your breathing for a few moments. What do you notice when you focus on the present?",
    "These feelings are like weather patterns passing through - they come and go. Can you observe them without judgment?",
    "What happens if you acknowledge these thoughts and feelings with acceptance, without trying to change them?",
    "Bring awareness to the present moment. What can you see, hear, or feel right now in your immediate surroundings?"
  ],
  
  'act': [
    "What core values are being affected in this situation? What matters deeply to you here?",
    "If we imagine your mind as a river, these thoughts are like leaves floating on the surface. Can you let them float by?",
    "Sometimes we can acknowledge difficult thoughts and feelings while still moving toward what matters. What small step aligns with your values?",
    "What would be a workable approach here? Not perfect, but something that moves you in a valued direction?",
    "If you were being the person you want to be in this situation, despite the difficulties, what might you do differently?"
  ],
  
  'psychodynamic': [
    "I wonder if there are patterns here that might connect to earlier experiences in your life. What feels familiar about this?",
    "How might your past relationships be influencing how you're experiencing this current situation?",
    "What comes to mind when you sit with these feelings? Sometimes our unconscious offers insights if we listen.",
    "Do you notice any resistance or defense mechanisms coming up as we discuss this? This is natural and worth exploring.",
    "I'm curious about what this situation might symbolize for you on a deeper level."
  ],
  
  'solution_focused': [
    "Let's imagine that overnight, this problem was solved. What would be different tomorrow morning?",
    "On a scale of 1-10, where are you now with this issue? What would it take to move just one point higher?",
    "When have there been exceptions to this problem - even briefly? What was different about those times?",
    "What small sign would tell you that things are starting to improve, even slightly?",
    "What strengths or resources have helped you overcome challenges in the past that might be useful now?"
  ],
  
  'humanistic': [
    "I appreciate you sharing your authentic experience. What does this situation mean to you personally?",
    "You have the inner wisdom to navigate this. What does your intuition tell you about what you need right now?",
    "Your perspective and feelings are uniquely yours and completely valid. How do you want to grow through this challenge?",
    "What would self-compassion look like in this situation? How might you honor your own experience?",
    "You're the expert on your own life. What direction feels right for you as you face this challenge?"
  ],
  
  'motivational': [
    "On one hand, I hear that... and on the other hand... What makes you want to see things change?",
    "What would be the advantages of approaching this differently? And what keeps things the way they are now?",
    "How important is making a change in this area, on a scale of 1-10? What makes you choose that number?",
    "What reasons do you have for wanting to address this situation? What matters to you about it?",
    "You've managed difficult situations before. What strengths do you have that could help with this challenge?"
  ],
  
  'dbt': [
    "This sounds like a really difficult emotion to manage. Which distress tolerance skills might help you through this moment?",
    "I hear you're in a challenging situation. How might you respond effectively while still acknowledging your emotions?",
    "Let's validate that this is genuinely difficult, AND explore what skills might help you navigate it.",
    "Would it help to use the PLEASE skills here? Taking care of your physical needs can support emotional regulation.",
    "What would be the wise mind perspective here, balancing both your emotional and reasonable responses?"
  ],
  
  'tough_love': [
    "Stop overthinking this. What's one concrete action you can take RIGHT NOW?",
    "You're wasting energy on excuses when you could be solving the problem. What's your next move?",
    "Seriously? This is what you're stuck on? Focus on what you can actually control and move forward.",
    "I'm not going to coddle you. Either make a decision or stop complaining about the situation.",
    "Time to grow up and face reality. What tough truth are you avoiding here?"
  ]
};

/**
 * Get a fallback response for a specific therapy approach
 */
export function getFallbackResponseByApproach(approach: string): string {
  // Default to general approach if the specified one doesn't exist
  const responses = fallbackResponsesByApproach[approach] || fallbackResponsesByApproach.general;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

/**
 * Get a fallback response in the specified language
 */
export function getFallbackResponseByLanguage(languageCode: string): string {
  // Default to English if the specified language doesn't exist
  const responses = fallbackResponsesByLanguage[languageCode] || fallbackResponsesByLanguage.en;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}