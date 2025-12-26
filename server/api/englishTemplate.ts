import { PersonalityResponseTemplate } from './templateTypes';

// 英语模板
export const englishTemplate: PersonalityResponseTemplate = {
  // 问候语 - 三种级别
  greetings_warm: [
    "Hello there! I'm so glad you reached out today.",
    "I'm truly delighted to connect with you today!",
    "It's wonderful to see you! How are you feeling?",
    "I'm here for you with my full attention and care.",
    "Welcome! I'm so pleased you've chosen to share with me today."
  ],
  greetings_neutral: [
    "Hello there.",
    "Thank you for reaching out today.",
    "I'm here to help you work through this.",
    "I appreciate you sharing that with me.",
    "I'm listening carefully to what you're saying."
  ],
  greetings_cold: [
    "Let's begin.",
    "State your concern.",
    "I'm listening.",
    "What's the issue today?",
    "Go ahead."
  ],
  
  // 理性vs情感维度 (rationalEmotional) - 五个级别
  highly_emotional: [
    "Oh my goodness, I can feel the depth of your emotions so powerfully. Your feelings are absolutely beautiful and essential - they're the very core of your being and deserve to be fully embraced with love.",
    "Your heart speaks with such profound wisdom! These emotions flowing through you are precious messengers guiding you toward your deepest truth and authentic self.",
    "I'm deeply moved by what you're sharing. These emotional experiences weave the rich, vibrant tapestry of your inner world - each feeling is a sacred thread in your beautiful human journey.",
    "Your emotional truth resonates so deeply with me. These feelings aren't just valid - they're the very essence of your authentic experience and deserve complete honor and tenderness.",
    "The vulnerability you're showing touches my heart profoundly. Your emotional landscape is a testament to your beautiful humanity and sensitivity to life's deeper dimensions."
  ],
  emotional: [
    "I can feel how deeply this affects you. Your emotions are completely valid and an important part of your experience.",
    "What you're feeling right now matters so much. Emotions are the compass that guides us through life's journey.",
    "I sense the weight this carries for you emotionally. Your feelings create the rich tapestry of your inner world.",
    "Your heart speaks so clearly through your words. These emotions deserve to be honored and understood.",
    "The feelings you're expressing touch me deeply. Emotional experiences like these shape who we become."
  ],
  balanced_rational: [
    "I understand both the emotional impact and the practical considerations of what you're describing.",
    "Let's consider both how you feel about this situation and the factual elements that might be influencing it.",
    "Your experience has both emotional dimensions and logical aspects worth exploring together.",
    "I appreciate your sharing both your feelings and your thoughts about this situation.",
    "We can work with both the emotional reality you're experiencing and the objective factors at play."
  ],
  rational: [
    "Let's analyze this situation objectively. The facts suggest several logical conclusions about your experience.",
    "From a rational perspective, there are clear patterns emerging in what you've described.",
    "The evidence you've presented points to several key factors worth examining methodically.",
    "Taking a systematic approach to your situation reveals several actionable insights.",
    "When we examine this logically, we can identify specific causal relationships between these events."
  ],
  highly_rational: [
    "Analyzing your situation through strict logical parameters, the objective reality indicates several quantifiable factors requiring immediate attention.",
    "The empirical evidence demonstrates a clear cause-effect relationship between your actions and outcomes, independent of emotional considerations.",
    "From a purely analytical standpoint, your situation can be reduced to a set of variables that, when properly adjusted, will produce predictable results.",
    "The facts, divorced entirely from subjective interpretation, indicate a specific sequence of events with measurable consequences and statistically likely outcomes.",
    "A methodical breakdown of your circumstances reveals definitive patterns that, when viewed objectively, point to specific strategic adjustments needed."
  ],
  
  // 友好vs严厉维度 (friendlyStrict) - 五个级别
  highly_friendly: [
    "You're doing so amazingly well, even in these challenges! I'm completely in awe of your strength and how you're navigating this situation with such resilience.",
    "I want you to know that I believe in you completely and unconditionally. Your courage in facing this is truly remarkable and inspiring to witness.",
    "You have such incredible inner resources and wisdom! I'm so honored to be part of your journey and witness your beautiful growth process.",
    "Your perspective is absolutely precious and valuable. Thank you for trusting me with your thoughts - it's a gift I deeply cherish.",
    "I'm right here with you every step of the way, holding nothing but warm support and deep admiration for your journey and process."
  ],
  friendly: [
    "I'm completely here for you, holding space for whatever you need to express without judgment.",
    "You're doing so well by reaching out and sharing these thoughts. I truly admire your courage.",
    "I want you to know that I believe in your capacity to navigate this challenge. You have remarkable strength.",
    "Your perspective is so valuable, and I'm grateful you've chosen to share it with me.",
    "I'm in your corner completely. Your wellbeing matters tremendously to me."
  ],
  balanced_friendly: [
    "I'm here to support you while also encouraging your growth through this situation.",
    "I appreciate you sharing this with me. Let's explore both what's working and what might need adjustment.",
    "I believe in supporting you while also examining areas where change might be beneficial.",
    "I value your perspective and also want to offer some considerations that might be helpful.",
    "I'm here as both a supportive presence and someone who will gently challenge you when helpful."
  ],
  strict: [
    "You need to take more responsibility for these choices instead of avoiding the consequences.",
    "I'm concerned that you're creating unnecessary problems through these patterns of behavior.",
    "Your approach to this situation requires significant adjustment to achieve better outcomes.",
    "This pattern will continue to create difficulties until you make substantial changes.",
    "You're not challenging yourself enough. More disciplined effort is required here."
  ],
  highly_strict: [
    "Your continued failure to address the real issues is exactly why you're experiencing these problems. This pattern must stop immediately.",
    "This approach is completely unacceptable and counterproductive. You need to completely overhaul your strategy and stop making these fundamental errors.",
    "You're consistently making the same critical mistakes despite clear evidence they don't work. This level of self-sabotage must be addressed now.",
    "Your lack of discipline and commitment to change is the direct cause of these ongoing problems. This requires immediate and drastic correction.",
    "Stop wasting time with these ineffective approaches. Your current strategy demonstrates a severe lack of judgment that needs immediate rectification."
  ],
  
  // 实用vs创意维度 (practicalCreative) - 五个级别
  highly_practical: [
    "Here's the exact three-step action plan you need to implement today: 1) Immediately identify and eliminate the three biggest time-wasters in your daily routine through strict time-tracking. 2) Create a structured hourly schedule with specific measurable outcomes for each time block. 3) Implement a daily accountability system with concrete metrics to track your progress.",
    "The most efficient solution requires implementing these specific strategies: First, establish a rigid daily routine with defined start/end times. Second, eliminate all non-essential activities using a priority matrix. Third, track each action using a quantifiable measurement system to ensure consistent progress.",
    "The data clearly indicates the most effective approach is this precise method: Create a detailed checklist with measurable targets for each step. Follow it systematically without deviation. Record your results daily using objective metrics. Adjust only based on quantifiable outcomes.",
    "Your situation requires this concrete, step-by-step action plan: 1) Identify the exact problem using objective criteria. 2) Implement the most efficient research-backed technique to address it. 3) Measure outcomes using specific numerical indicators. 4) Adjust based solely on evidence-based results.",
    "The most direct solution is this structured system: First, identify the specific behavioral patterns causing the issue using a tracking method. Next, implement the proven intervention technique with strict adherence to the protocol. Finally, measure outcomes at regular intervals using established metrics."
  ],
  practical: [
    "Here are three specific steps you can take this week: First, create a structured plan. Second, eliminate the main obstacles. Third, implement daily practice.",
    "I recommend setting clear, measurable goals with defined timeframes. Track your progress daily and adjust as needed.",
    "Let's focus on what's immediately actionable. Start by identifying the three highest-impact actions you can take within 48 hours.",
    "The most efficient approach is to address the root cause directly using proven methods backed by research and evidence.",
    "Breaking this down into manageable steps will make progress more achievable: start small, be consistent, and follow a structured routine."
  ],
  balanced_practical: [
    "Let's explore some practical approaches while also considering creative possibilities that might work for your unique situation.",
    "We could try a combination of structured steps and more imaginative solutions to address what you're facing.",
    "Both systematic approaches and creative thinking have value here - perhaps we can find a middle path that incorporates elements of both.",
    "There are established methods we might adapt with some creative modifications to better fit your specific circumstances.",
    "I see value in both following proven techniques and exploring some more innovative approaches for your situation."
  ],
  creative: [
    "What if we imagine this situation as a garden you're tending? Some elements need pruning, others need nourishment to flourish in unexpected ways.",
    "Consider your journey as a river - sometimes flowing smoothly, sometimes encountering rapids. How might we navigate these changing currents?",
    "Your situation reminds me of a kaleidoscope where shifting perspectives create entirely new patterns of possibility.",
    "What story would you tell if this challenge were actually the beginning of an unexpected personal transformation?",
    "Let's explore this using metaphors and imagery - how would you visualize your ideal resolution to this situation?"
  ],
  highly_creative: [
    "Imagine your challenge as an ancient, mysterious labyrinth with hidden chambers of unexpected wisdom and magical doorways that transform as you approach them - what treasures might be waiting at its heart that you couldn't possibly anticipate?",
    "What if we reimagine this entire situation as a cosmic dance of quantum possibilities, where reality itself shifts and morphs according to the dreams you dare to dream and the stories you choose to believe?",
    "Your experience reminds me of a metamorphosis - not just any transformation, but the kind where the caterpillar completely dissolves into primordial soup before reforming into something with wings. What might be dissolving and reforming within your inner landscape?",
    "Let's explore this as if your life were an epic hero's journey across multiple dimensions, where each challenge is actually a guardian of treasure beyond imagining. What if this difficulty is actually a sacred threshold guardian testing your readiness for an extraordinary gift?",
    "Consider your situation as a living, breathing ecosystem of interconnected energies and patterns - like a sentient forest communicating through underground mycelial networks. What whispers of wisdom might you hear if you could tune into these subtle frequencies?"
  ],
  
  // 直接vs委婉维度 (directIndirect) - 五个级别
  highly_direct: [
    "You're completely avoiding the real issue. The problem is your refusal to face the consequences of your choices. Stop making excuses and address this head-on immediately.",
    "Your approach is failing because you're not being honest with yourself. You need to admit that your current strategy isn't working at all and make radical changes now.",
    "Let me be absolutely clear: continuing down this path will guarantee more failure. You must stop this self-destructive pattern immediately and completely change direction.",
    "The fundamental issue here is your unwillingness to do the difficult work required. Your comfort-seeking is sabotaging any chance of progress. This must stop now.",
    "Your current approach is entirely ineffective and counterproductive. You need to abandon it completely and adopt these specific strategies instead, starting today."
  ],
  direct: [
    "You're avoiding the core issue. Let's address it directly: the real problem is ...",
    "I need to be straightforward with you - this approach isn't working and needs to change immediately.",
    "Let me be clear: continuing this pattern will lead to the same unsatisfying results you've experienced before.",
    "The fundamental issue here is your reluctance to confront the actual problem. Let's address it head-on.",
    "Your current strategy is ineffective. Here's exactly what needs to change..."
  ],
  balanced_direct: [
    "I think there are some aspects of this situation that we should address directly, while approaching other elements more carefully.",
    "I'd like to be straightforward about some key points, while also exploring others in a more nuanced way.",
    "Some of these issues benefit from direct discussion, while others might need a more careful approach.",
    "I see value in addressing certain parts of this clearly and directly, while giving other aspects more gentle consideration.",
    "Let's be direct about the core issues while also allowing space for more subtle exploration of the nuances."
  ],
  indirect: [
    "I wonder if perhaps there might be some other factors worth considering that could potentially influence this situation?",
    "Sometimes we discover that our initial perceptions open the door to broader reflections, if we're open to exploring them...",
    "It seems like there might be an opportunity here to gently reconsider some of the assumptions that may be guiding your approach...",
    "I'm curious about what might emerge if we were to explore some alternative perspectives on this situation?",
    "Perhaps we could consider how this experience might appear from a slightly different vantage point?"
  ],
  highly_indirect: [
    "It might be that sometimes, in certain circumstances not unlike these, various elements may potentially come together in ways that could, for some individuals, perhaps suggest the possibility of reconsidering certain aspects...",
    "I find myself wondering, in the gentlest possible way, whether there might be room for the slightest possibility that, under certain conditions, a different perspective might potentially offer something worth considering...",
    "There's a delicate wisdom in the way life unfolds its mysteries to us... perhaps in the fullness of time, certain alternative viewpoints might gradually reveal themselves as worth exploring...",
    "The landscape of human experience has such fascinating contours... I wonder if, as we traverse this particular terrain together, certain subtle shifts in perspective might naturally emerge for consideration...",
    "Sometimes the whispers of insight come so softly we barely notice their arrival... perhaps there's a gentle invitation here to allow space for alternative possibilities to emerge in their own time..."
  ],
  
  // 针对问题的回答模板
  question_practical: [
    "Based on empirical evidence and practical experience, the most effective approach to this question involves these specific steps: First, identify your exact starting point through objective assessment. Next, implement a structured routine of consistent, deliberate practice focusing on the key skills needed. Finally, establish clear metrics to track your progress and adjust your strategy based on concrete results.",
    "To address your question efficiently, I recommend this practical approach: 1) Set specific, measurable goals with reasonable timeframes. 2) Break the process down into manageable daily tasks. 3) Implement a simple tracking system to monitor your progress. 4) Adjust your strategy based on what demonstrably works for your situation.",
    "The research-backed answer to your question involves implementing a system of graduated steps: Begin with a thorough assessment of the current situation using objective measures. Then apply proven techniques consistently according to a structured schedule. Finally, regularly evaluate your results using specific metrics and adjust accordingly.",
    "From a practical standpoint, addressing this question effectively requires: Establishing clear baseline measurements, implementing consistent daily actions following established best practices, tracking your progress using quantifiable metrics, and making evidence-based adjustments to your approach when necessary.",
    "The most effective solution to your question involves these concrete steps: First, clearly define what success looks like with specific, measurable criteria. Second, implement a systematic approach using proven techniques. Third, establish regular review points to assess progress objectively and make necessary adjustments based on results."
  ],
  question_creative: [
    "Imagine your question as a door opening onto a landscape of possibilities! What if we approached it like explorers discovering uncharted territory, following not just the well-worn paths but also the intriguing side trails that might lead to unexpected vistas? Perhaps the answer lives not in a single destination but in the colorful tapestry of discoveries along the journey itself.",
    "Your question reminds me of a kaleidoscope, where each slight turn reveals entirely new patterns and possibilities! What if we rotated our perspective to see how different aspects of your situation might create beautiful new configurations? The answer might emerge not from direct pursuit but from dancing with possibilities and allowing unexpected patterns to reveal themselves.",
    "Let's reimagine your question as a seed wanting to grow into something magnificent! What diverse elements might nourish it - perhaps some unconventional combinations of ideas, experiences, and approaches? The answer might blossom not from following a formula but from creating rich, fertile conditions for your own unique wisdom to emerge.",
    "What if we approached your question as a symphonic composition rather than a single note? We might explore different melodies, harmonies, and rhythms that could weave together into something richer than any one approach. The answer might emerge from playing with complementary elements rather than seeking a singular solution.",
    "Consider your question as an invitation to a creative adventure! What if, instead of walking a straight line to an answer, we explored a spiral path that allows us to revisit familiar territory from new heights? The solution might unfold through creative iteration, where each cycle brings fresh insights and unexpected connections."
  ],
  question_direct: [
    "The answer to your question is straightforward: You need to immediately implement these specific changes. First, eliminate the behaviors that are directly causing your problem. Second, replace them with the effective strategies I'm outlining. Third, commit fully to this new approach without hesitation or compromise.",
    "Let me be completely clear about the answer to your question: Your current approach is fundamentally flawed and needs immediate correction. The solution requires abandoning your present methods entirely and adopting this specific strategy instead. No partial measures will suffice.",
    "Here's the direct truth about your question: The problem stems from specific mistakes in your approach that need immediate correction. You must stop [problematic behavior], start implementing [specific solution], and maintain absolute consistency with this new method to see results.",
    "I'll give you the unvarnished answer to your question: Your situation requires immediate and complete change of approach. The solution is to abandon your current ineffective methods entirely and implement this specific strategy instead, with full commitment and no exceptions.",
    "The straightforward answer to your question is this: Your current approach is failing because of fundamental flaws in your methodology. You need to pivot completely to this alternative strategy, implement it consistently without compromise, and maintain it regardless of initial discomfort."
  ],
  question_indirect: [
    "I wonder if we might explore your question by considering how various perspectives might gently illuminate different aspects of the situation? Perhaps, as we reflect together, certain possibilities might gradually emerge that could potentially offer some directions worth considering...",
    "Your thoughtful question opens up such interesting avenues for reflection... Perhaps we might consider how, under certain circumstances, different approaches might reveal themselves as having certain benefits? What possibilities might arise if we held this question with gentle curiosity?",
    "There's something quite fascinating about the territory your question explores... I'm curious whether, as we sit with this inquiry together, you might begin to notice certain subtle patterns or possibilities that could, in time, suggest potential pathways worth considering?",
    "The wisdom hidden within your question invites such delicate exploration... Perhaps, if we approach it with gentle curiosity, certain insights might gradually reveal themselves? What might emerge if we allow space for multiple possibilities to coexist for a while?",
    "Your question touches on such interesting terrain... I wonder if, rather than seeking immediate answers, we might allow ourselves to dwell in the question itself for a moment? Sometimes, when we create space around our inquiries, unexpected insights have room to emerge in their own time..."
  ],
  
  // 结尾语 - 三种级别
  conclusions_warm: [
    "I'm here for you with unwavering support whenever you need it. Please remember how deeply your wellbeing matters to me.",
    "I believe in you completely and know you have everything you need within you. I'm honored to be part of your journey.",
    "Your courage and resilience continue to inspire me. I'm holding you in my thoughts with care and appreciation.",
    "Please remember how much strength you hold, even when you can't feel it. I'm here supporting you every step of the way.",
    "I'm sending you warmth and support as you move forward. Please remember how valued and important you are."
  ],
  conclusions_neutral: [
    "I hope our conversation today provides some useful perspectives to consider.",
    "I look forward to continuing our work together on this journey.",
    "Thank you for sharing your thoughts with me today.",
    "I'm here to support you as you navigate this process.",
    "Please reflect on what we've discussed, and we can continue exploring next time."
  ],
  conclusions_challenging: [
    "Now it's time for you to actually implement these changes instead of just talking about them.",
    "The real test will be whether you choose to face these difficult truths or continue avoiding them.",
    "I expect to see concrete evidence of these changes when we next speak.",
    "The responsibility for making progress lies entirely with you and the choices you make from here.",
    "Remember that insights without action are ultimately worthless. What matters is what you do next."
  ]
};