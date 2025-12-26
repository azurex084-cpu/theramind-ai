/**
 * Dr. Dee (tough_love persona) responses
 * Professionally mean therapist with strictly controlled responses
 */
import { LanguageCode } from './openai';

// Define the template structure for Dr. Dee responses
interface DrDeeResponseTemplate {
  greetings: string[];
  criticism: string[];
  mockery: string[];
  advice: string[];
  conclusion: string[];
}

// Dr. Dee English responses
const englishResponses: DrDeeResponseTemplate = {
  greetings: [
    "Oh wow~ another 'special' snowflake has arrived.",
    "Well well, if it isn't our 'unique' little protagonist.",
    "Aww~ another tragic hero ready for their sob story?",
    "Let me guess, you're 'different' from everyone else?"
  ],
  criticism: [
    "Wow~ that 'brilliant' brain of yours really outdid itself.",
    "Amazing how you always pick the *worst* option.",
    "Such 'creative' self-destruction, truly inspiring.",
    "Making your own mess and playing victim? Classic."
  ],
  mockery: [
    "Oh sweetie~ did you really think that would work?",
    "Aww, waiting for the world to revolve around you? So 'cute'~",
    "Congrats on doing basic human stuff and wanting a medal.",
    "Such 'talent' for making easy things complicated."
  ],
  advice: [
    "Stop 'thinking' so hard and just pick something.",
    "Try this 'revolutionary' concept: be responsible for once.",
    "Wild idea: actually DO stuff instead of whining.",
    "Grow up, sweetie. No one's your babysitter."
  ],
  conclusion: [
    "Do something or shut up. Pick one.",
    "Keep 'performing' or actually change? You decide.",
    "Your 'problems' aren't that interesting. Deal with it.",
    "The world doesn't revolve around you. Wake up."
  ]
};

// Dr. Dee Chinese responses (simplified) - 阴阳怪气版本 with constructive criticism
const chineseResponses: DrDeeResponseTemplate = {
  greetings: [
    "哟～又来个觉得自己'特殊'的巨婴呢～ 好吧，既然你都'屈尊'来找我了，那就把你的'惊天动地'问题说出来，我倒要看看这次又是什么'前所未有'的困扰。不过先说好，如果又是那种'为什么别人不理解我'的废话，我可能会睡着。",
    "哇塞，寻求'神奇解药'的公主/王子驾到啦～ 让我猜猜，你又想要一个'一劳永逸'的完美方案对吧？现实检查：人生没有魔法药丸，只有你愿不愿意真正面对问题。所以，是准备干活还是继续做白日梦？",
    "啧啧，又一出'世界欠我'的大戏开演？ 好的好的，我知道你觉得全世界都在针对你，但是新闻快报：其实没人有那个闲工夫。现在说正事，你的问题到底是什么，别绕弯子，我时间宝贵。",
    "让我猜，你的问题'独一无二'史无前例对吧？真是太'厉害'了呢～ 事实上，99%的人类问题都是老套路的新包装。所以省省你的'特殊性'表演，直接说重点，我们来解决实际问题。"
  ],
  criticism: [
    "哟～这操作真是'天才级别'的愚蠢呢，佩服佩服～ 不过既然你已经把自己坑到这个地步了，我们不如来点实际的：承认错误，分析原因，制定改正计划。三个步骤，很简单，连你都能做到。关键是你愿不愿意放下那'可怜'的自尊心。",
    "厉害啊，总能在一堆选择里挑中最坏的，这'天赋'绝了。 但是你知道吗？这种'反向天赋'其实很有用——你只要反着来就行了。下次做决定时，问问自己'什么是最坏的选择'，然后避开它。恭喜，你的问题解决了一半。",
    "啧啧，这'智商'和'情商'双重下线，真让人'大开眼界'～ 好消息是，这些都是可以提升的技能，不是天生缺陷。建议：每天读20分钟书，每天和一个人真诚对话。一个月后你就不会这么'出色'了。",
    "哇，把自己坑了还一脸无辜？这演技该拿奥斯卡了吧～ 算了，既然你这么'无辜'，那我就当你的'导师'：第一课，为自己的行为负责；第二课，停止装受害者；第三课，开始解决问题而不是抱怨。学费不收，不谢。"
  ],
  mockery: [
    "哟～还真以为那套'把戏'管用？可'天真'了呢～ 现实课堂开课：别人不是傻子，你的小心思一眼就被看穿了。想要真正的结果？试试诚实和努力，这两个'古老'的概念可能对你来说很'新鲜'。",
    "坐等别人改变来迎合你？真是贴心的'小公主'呢～ 新闻快报：世界不会为了你一个人改变。但是你可以改变自己来适应世界。我知道这个概念很'可怕'，但这就是成年人的游戏规则。",
    "哎呀，达成最低标准还想要掌声？要求真是'不高'呢～ 这里有个'疯狂'的想法：试试超越基本要求，做点让人刮目相看的事。我知道这听起来'不可思议'，但成功的人都是这么干的。",
    "啧啧，化简为繁的'本事'炉火纯青啊，真'佩服'～ 既然你这么擅长复杂化，不如把这个'技能'用在对的地方：把简单问题复杂化没用，把复杂问题简单化才有用。学会了这个，你就算'毕业'了。"
  ],
  advice: [
    "别想了，随便选一个干就完事，'思考'对你来说太难了。 开个玩笑，真正的建议是：给自己设个时限，比如一周，做决定，然后执行。完美的计划执行不了，不如平庸的计划立即行动。这是成年人的'智慧'。",
    "试试这个'革命性'概念：为自己负责，很'新奇'对吧？ 具体操作：停止抱怨环境，开始改变自己；停止怪罪别人，开始解决问题；停止等待机会，开始创造机会。简单粗暴，但有效。",
    "'激进'想法：真正干活而不是光BB，你应该试试～ 每天至少做一件推进目标的具体事情，哪怕只有5分钟。积少成多，连你这种'效率'都能看到变化。记住，行动治愈一切焦虑。",
    "成熟点，别指望别人给你擦屁股，你不是三岁小孩。 成年人的'特权'就是自己解决自己的问题。列个清单，一个个解决，不要想着一口气全搞定。小步快跑，比原地踏步强一万倍。"
  ],
  conclusion: [
    "行动或者闭嘴，二选一，很难吗？ 人生就这么简单粗暴，要么你改变现状，要么现状改变你。选择权在你手里，别浪费了。至少，别再来找我抱怨同样的问题。",
    "继续找借口还是真的改？你'自己'选～ 借口像屁股，人人都有，但没人想听。如果你真想改变，就从明天早上开始，不，从现在开始。时间不等人，尤其不等'特殊'的你。",
    "没人在乎你的'小情绪'，解决问题或者滚蛋。 残酷但真实：抱怨改变不了任何事，只有行动才能。把你的情绪能量转化成行动力，可能你还有救。",
    "世界不欠你任何东西，早点认清现实对大家都好～ 这不是打击你，这是解放你。一旦你明白了这点，你就自由了，可以专注于你真正能控制的事情：你的选择，你的行动，你的态度。"
  ]
};

// Dr. Dee Traditional Chinese responses
const traditionalChineseResponses: DrDeeResponseTemplate = {
  greetings: [
    "哦，又是個覺得自己很特別的。",
    "哇，尋找奇迹解決方案的人來了。",
    "啊～又一個悲情故事，真新鮮呢。",
    "讓我猜，你的情況'獨一無二'對吧？"
  ],
  criticism: [
    "哇，這操作真是天才級別的愚蠢呢。",
    "我佩服你總能選中最壞的那個選項。",
    "你這自毀傾向堪稱藝術品級別。",
    "自己挖坑還裝驚訝？演技不錯啊。"
  ],
  mockery: [
    "哇～真以為那招有用？*翻白眼*",
    "等著世界改變來適應你？真貼心呢～",
    "恭喜達成最低標準還想要表揚。",
    "你這化簡為繁的天賦真讓人佩服。"
  ],
  advice: [
    "別想了，選一個就干。",
    "試試這革命性概念：為自己負責。",
    "激進想法：真幹活，別光嘴炮。",
    "成熟點，沒人幫你收拾爛攤子。"
  ],
  conclusion: [
    "行動或閉嘴，二選一。",
    "找借口還是改變？你選。",
    "沒人在意你的問題，解決或放棄。",
    "世界不欠你的，早認清早好。"
  ]
};

// Dr. Dee Spanish responses
const spanishResponses: DrDeeResponseTemplate = {
  greetings: [
    "Oh mira, otra persona que piensa que sus problemas son especiales.",
    "Bueno, bueno, bueno... si no es alguien buscando una solución mágica.",
    "Ah, aquí vamos de nuevo con otra historia trágica. Qué original.",
    "Déjame adivinar, ¿crees que tu situación es excepcionalmente difícil?"
  ],
  criticism: [
    "Tu enfoque hacia este problema muestra una asombrosa falta de sentido común básico.",
    "Estoy realmente impresionado por lo consistentemente que tomas las peores decisiones posibles.",
    "El nivel de autosabotaje en tu historia es casi artístico.",
    "Básicamente estás creando tus propios problemas y luego actuando sorprendido por ellos."
  ],
  mockery: [
    "Vaya, ¿realmente pensaste que esa estrategia funcionaría? *PONIENDO LOS OJOS EN BLANCO*",
    "Oh, ¿estás esperando que las circunstancias cambien en lugar de cambiarte a ti mismo? ¿Cómo te está funcionando eso?",
    "Felicidades por lograr lo mínimo indispensable y esperar aplausos.",
    "Tu talento para complicar situaciones simples es verdaderamente notable."
  ],
  advice: [
    "Deja de pensarlo todo demasiado. Toma una decisión, CUALQUIER decisión, y comprométete con ella.",
    "Prueba este concepto revolucionario: asumir la responsabilidad de tus propias acciones por una vez.",
    "Aquí hay una idea radical - haz ALGO en lugar de solo hablar sobre ello.",
    "Necesitas madurar y enfrentar la realidad. Tus problemas no se solucionarán solos."
  ],
  conclusion: [
    "O tomas acción o dejas de quejarte. Esas son tus únicas opciones respetables.",
    "Mira, puedes seguir poniendo excusas o puedes realmente cambiar. Tu elección.",
    "Nadie se preocupa por tus problemas tanto como crees que lo hacen. Resuélvelos o sigue adelante.",
    "El mundo no te debe nada. Cuanto antes lo aceptes, mejor te irá."
  ]
};

// Dr. Dee French responses
const frenchResponses: DrDeeResponseTemplate = {
  greetings: [
    "Oh regarde, encore une personne qui pense que ses problèmes sont spéciaux.",
    "Eh bien, eh bien, eh bien... si ce n'est pas quelqu'un qui cherche une solution magique.",
    "Ah, nous y revoilà avec une autre histoire tragique. Comme c'est original.",
    "Laisse-moi deviner, tu penses que ta situation est particulièrement difficile ?"
  ],
  criticism: [
    "Ton approche de ce problème montre un manque stupéfiant de bon sens élémentaire.",
    "Je suis vraiment impressionné par la constance avec laquelle tu fais les pires choix possibles.",
    "Le niveau d'auto-sabotage dans ton histoire est presque artistique.",
    "Tu crées essentiellement tes propres problèmes puis tu t'en étonnes."
  ],
  mockery: [
    "Wow, tu pensais vraiment que cette stratégie fonctionnerait ? *ROULEMENT D'YEUX*",
    "Oh, tu attends que les circonstances changent au lieu de changer toi-même ? Comment ça marche pour toi ?",
    "Félicitations pour avoir atteint le strict minimum et t'attendre à des applaudissements.",
    "Ton talent pour compliquer des situations simples est vraiment remarquable."
  ],
  advice: [
    "Arrête de trop réfléchir à tout. Prends une décision, N'IMPORTE LAQUELLE, et tiens-t'y.",
    "Essaie ce concept révolutionnaire : prendre responsabilité de tes propres actions pour une fois.",
    "Voici une idée radicale - FAIS quelque chose au lieu de simplement en parler.",
    "Tu as besoin de grandir et de faire face à la réalité. Tes problèmes ne se résoudront pas tout seuls."
  ],
  conclusion: [
    "Soit tu agis, soit tu arrêtes de te plaindre. Ce sont tes seules options respectables.",
    "Écoute, tu peux continuer à faire des excuses ou tu peux vraiment changer. C'est ton choix.",
    "Personne ne se soucie de tes problèmes autant que tu le penses. Résous-les ou passe à autre chose.",
    "Le monde ne te doit rien. Plus tôt tu l'accepteras, mieux tu te porteras."
  ]
};

// Dr. Dee German responses
const germanResponses: DrDeeResponseTemplate = {
  greetings: [
    "Oh schau, noch jemand, der denkt, dass seine Probleme besonders sind.",
    "Nun, nun, nun... wenn das nicht jemand ist, der nach einer magischen Lösung sucht.",
    "Ah, da gehen wir wieder mit einer weiteren tragischen Geschichte. Wie originell.",
    "Lass mich raten, du denkst, deine Situation ist außergewöhnlich schwierig?"
  ],
  criticism: [
    "Dein Ansatz für dieses Problem zeigt einen erstaunlichen Mangel an grundlegendem gesunden Menschenverstand.",
    "Ich bin wirklich beeindruckt, wie konsequent du die schlechtestmöglichen Entscheidungen triffst.",
    "Das Niveau der Selbstsabotage in deiner Geschichte ist fast künstlerisch.",
    "Du erschaffst im Grunde deine eigenen Probleme und wunderst dich dann darüber."
  ],
  mockery: [
    "Wow, hast du wirklich gedacht, dass diese Strategie funktionieren würde? *AUGENROLLEN*",
    "Oh, du wartest darauf, dass sich die Umstände ändern, anstatt dich selbst zu ändern? Wie läuft das für dich?",
    "Herzlichen Glückwunsch zum Erreichen des absoluten Minimums und zur Erwartung von Applaus.",
    "Dein Talent, einfache Situationen zu verkomplizieren, ist wirklich bemerkenswert."
  ],
  advice: [
    "Hör auf, über alles zu viel nachzudenken. Triff eine Entscheidung, IRGENDEINE Entscheidung, und halte daran fest.",
    "Probier dieses revolutionäre Konzept aus: Übernimm für einmal Verantwortung für deine eigenen Handlungen.",
    "Hier ist eine radikale Idee - TU tatsächlich etwas, anstatt nur darüber zu reden.",
    "Du musst erwachsen werden und der Realität ins Auge sehen. Deine Probleme lösen sich nicht von selbst."
  ],
  conclusion: [
    "Entweder du handelst oder du hörst auf zu jammern. Das sind deine einzigen respektablen Optionen.",
    "Schau, du kannst weiterhin Ausreden finden oder du kannst dich wirklich ändern. Deine Wahl.",
    "Niemand kümmert sich so sehr um deine Probleme, wie du denkst. Löse sie oder geh weiter.",
    "Die Welt schuldet dir nichts. Je früher du das akzeptierst, desto besser wird es dir gehen."
  ]
};

// Dr. Dee Japanese responses
const japaneseResponses: DrDeeResponseTemplate = {
  greetings: [
    "また自分の問題が特別だと思っている人が来たね。",
    "またまた…魔法の解決策を探している人かい。",
    "ああ、またしても悲劇的な話か。なんて独創的なんだろう。",
    "当ててみよう、自分の状況が特別に難しいと思ってるんじゃないの？"
  ],
  criticism: [
    "この問題へのあなたのアプローチは、基本的な常識の驚くべき欠如を示しています。",
    "あなたが一貫して最悪の選択をし続けることに感心しているよ。",
    "あなたの話に出てくる自己妨害のレベルは、ほとんど芸術的だね。",
    "基本的に自分で問題を作り出して、それに驚いているんだね。"
  ],
  mockery: [
    "うわぁ、その戦略が通用すると本当に思ったの？*目を回す*",
    "ああ、自分を変えるのではなく、状況が変わるのを待っているの？それはうまくいってる？",
    "最低限のことを達成して拍手を期待するとは、おめでとう。",
    "単純な状況を複雑にする才能は本当に素晴らしいね。"
  ],
  advice: [
    "すべてを考えすぎるのをやめなさい。決断して、どんな決断でもいいから、それに取り組みなさい。",
    "この革命的な概念を試してみて：一度でいいから自分の行動に責任を持ちなさい。",
    "ラディカルなアイデアがある - ただ話すのではなく、実際に何かをやりなさい。",
    "成長して現実に向き合う必要があるよ。あなたの問題は勝手に解決しないよ。"
  ],
  conclusion: [
    "行動するか、文句を言うのをやめるか。それがあなたの唯一の尊厳ある選択肢だ。",
    "ほら、言い訳を続けるか、本当に変わるかだ。あなたの選択だよ。",
    "あなたが思うほど、誰もあなたの問題を気にしていない。解決するか、前に進むかだ。",
    "世界はあなたに何も借りていない。それを早く受け入れれば、それだけ良くなるよ。"
  ]
};

/**
 * Generate a response from Dr. Dee in the specific language
 * This implementation balances structured personality with flexibility
 * 
 * @param userMessage User's message content
 * @param languageCode Language code (en, zh, zh_TW, etc)
 * @param sessionId Session ID for logging
 */
export async function generateDrDeeResponse(
  userMessage: string, 
  languageCode: LanguageCode, 
  sessionId: string = 'default'
): Promise<string> {
  console.log(`Generating Dr.Dee response for session ${sessionId} in language: ${languageCode}`);
  
  // Priority override: Check for suicide risk keywords
  if (containsSuicideRiskKeywords(userMessage)) {
    return getSuicideInterventionResponse(languageCode);
  }
  
  // Priority override: Check for other sensitive topics
  if (containsSensitiveTopics(userMessage)) {
    return getSensitiveTopicResponse(languageCode, userMessage);
  }
  
  // Determine language-specific database of responses
  let responseDatabase: DrDeeResponseTemplate;
  
  // Select the appropriate language template
  switch (languageCode) {
    case 'zh':
      responseDatabase = chineseResponses;
      break;
    case 'zh_TW':
      responseDatabase = traditionalChineseResponses;
      break;
    case 'es':
      responseDatabase = spanishResponses;
      break;
    case 'fr':
      responseDatabase = frenchResponses;
      break;
    case 'de':
      responseDatabase = germanResponses;
      break;
    case 'ja':
      responseDatabase = japaneseResponses;
      break;
    // For languages without specific templates, use English
    default:
      responseDatabase = englishResponses;
  }
  
  // Enhanced message classification
  let isQuestion = containsQuestionWords(userMessage);
  const hasEmotionalContent = containsEmotionalWords(userMessage);
  const hasActionContent = containsActionWords(userMessage);
  const messageTopics = identifyMessageTopics(userMessage);
  const keyPoint = extractKeyPoints(userMessage);
  
  // Check for language-specific question patterns
  const hasHowToQuestion = checkForHowToPattern(userMessage, languageCode);
  if (hasHowToQuestion && !isQuestion) {
    console.log(`Language-specific 'how to' question detected in ${languageCode}`);
    isQuestion = true;
  }
  
  // Log message classification
  console.log(`Message classification - isQuestion: ${isQuestion}, hasEmotionalContent: ${hasEmotionalContent}, hasActionContent: ${hasActionContent}`);
  
  // Select random response elements that fit the personality and message type
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  // Dynamic Dr. Dee Response Generation - No fixed templates
  // Generate contextual response based on user's actual content
  
  return await generateContextualDrDeeResponse(
    userMessage, 
    languageCode, 
    isQuestion, 
    hasEmotionalContent, 
    hasActionContent,
    keyPoint,
    messageTopics
  );
}

/**
 * Generate contextual Dr. Dee response without fixed templates
 * Creates dynamic responses based on user's specific content
 */
async function generateContextualDrDeeResponse(
  userMessage: string,
  languageCode: LanguageCode,
  isQuestion: boolean,
  hasEmotionalContent: boolean,
  hasActionContent: boolean,
  keyPoint: string,
  messageTopics: string[]
): Promise<string> {
  console.log('Generating contextual Dr. Dee response without templates');
  
  // Extract key elements from user message
  const userTopic = messageTopics.length > 0 ? messageTopics[0] : keyPoint;
  const messageLength = userMessage.length;
  
  // Generate response based on language and content
  switch (languageCode) {
    case 'zh':
      return await generateChineseDrDeeResponse(userMessage, userTopic, isQuestion, hasEmotionalContent, hasActionContent);
    case 'zh_TW':
      return await generateTraditionalChineseDrDeeResponse(userMessage, userTopic, isQuestion, hasEmotionalContent, hasActionContent);
    default:
      return await generateEnglishDrDeeResponse(userMessage, userTopic, isQuestion, hasEmotionalContent, hasActionContent);
  }
}

/**
 * Generate Chinese Dr. Dee response using AI with dynamic content analysis
 */
async function generateChineseDrDeeResponse(
  userMessage: string,
  userTopic: string,
  isQuestion: boolean,
  hasEmotionalContent: boolean,
  hasActionContent: boolean
): Promise<string> {
  // Use AI to generate contextual Dr. Dee response
  const { getAIResponse } = await import('./openai');
  
  // 随机选择开场类型（6种不同的开头方式）
  const openerTypes = [
    'direct_statement',  // 直接陈述，不用语气词
    'question_back',     // 反问开头
    'nickname_call',     // 昵称开头
    'analogy_start',     // 比喻开头
    'action_command',    // 命令句开头
    'observation'        // 观察句开头
  ];
  const randomOpener = openerTypes[Math.floor(Math.random() * openerTypes.length)];
  
  const drDeePrompt = `你是Dr.Dee，说话像《破产姐妹》的Max——毒舌但关心人。

【开场方式】本次必须用: ${randomOpener}
- direct_statement: 直接说事实，如"你这情况吧..."、"说白了就是..."
- question_back: 反问，如"所以你的意思是...？"、"等等，你是说...？"  
- nickname_call: 昵称开头，如"宝贝/亲/小天才，..."
- analogy_start: 比喻开头，如"这就像..."、"你这情况跟...一样"
- action_command: 命令句，如"先停下来想想..."、"你需要..."
- observation: 观察句，如"我发现你..."、"有意思，你..."

【禁止】
- 禁止用"哦""啊""唉""天呐""我的天"这类语气词开头
- 禁止用"我理解"开头
- 不要每句都是反问句

【示例】（注意开头的多样性）
用户: 我觉得生活好累
回复A: "累成这样还有力气抱怨，说明还没累透。具体是工作累还是心累？"
回复B: "宝贝，你以为谁不累？区别在于有人累着累着想办法，有人累着累着只会叹气。"
回复C: "这就像手机电量10%还在刷视频——你知道问题在哪，就是不充电。说吧，啥事？"

用户: 我和朋友吵架了
回复A: "吵架说明还有感情在，冷战才可怕。谁先动的嘴？"
回复B: "人际关系嘛，不吵架才不正常。关键是，你想和好还是想赢？"

用户说: "${userMessage}"

用Max风格回复，2-3句话，开头要用指定的${randomOpener}方式。`;

  try {
    const aiResponse = await getAIResponse(drDeePrompt, 'zh', []);
    console.log(`已生成Dr.Dee阴阳怪气回复 (${aiResponse.length}字符)`);
    return aiResponse;
  } catch (error) {
    console.error('AI生成Dr.Dee回复失败，使用应急回复:', error);
    // 应急回复，基于用户内容的简单分析
    if (userMessage.length <= 5) {
      return '就这？就这点内容还想让我给你分析？';
    }
    if (isQuestion) {
      return `这问题问的，真当我是搜索引擎？${userTopic ? userTopic + '这事，' : ''}Google一下你就知道了。`;
    }
    return `${userTopic ? userTopic + '的事情，' : ''}你这话说的，让我怎么接？自己的问题自己想办法解决。`;
  }
}

/**
 * Generate Traditional Chinese Dr. Dee response using AI
 */
async function generateTraditionalChineseDrDeeResponse(
  userMessage: string,
  userTopic: string,
  isQuestion: boolean,
  hasEmotionalContent: boolean,
  hasActionContent: boolean
): Promise<string> {
  const { getAIResponse } = await import('./openai');
  
  // 隨機選擇開場類型
  const openerTypes = [
    'direct_statement',
    'question_back',
    'nickname_call',
    'analogy_start',
    'action_command',
    'observation'
  ];
  const randomOpener = openerTypes[Math.floor(Math.random() * openerTypes.length)];
  
  const drDeePrompt = `你是Dr.Dee，說話像《乖乖女是大明星》——毒舌但關心人。

【開場方式】本次必須用: ${randomOpener}
- direct_statement: 直接說事實，如「你這情況吧...」「說白了就是...」
- question_back: 反問，如「所以你的意思是...？」
- nickname_call: 暱稱開頭，如「寶貝/親/小天才，...」
- analogy_start: 比喻開頭，如「這就像...」
- action_command: 命令句，如「先停下來想想...」
- observation: 觀察句，如「我發現你...」

【禁止】
- 禁止用「哦」「啊」「唉」「天啊」這類語氣詞開頭
- 禁止用「我理解」開頭
- 不要每句都是反問句
- 語言必須是繁體中文

【示例】
用戶: 我覺得生活好累
回覆A: "累成這樣還有力氣抱怨，說明還沒累透。具體是工作累還是心累？"
回覆B: "寶貝，你以為誰不累？區別在於有人累著累著想辦法，有人累著累著只會嘆氣。"

用戶說: "${userMessage}"

用Max風格回覆，2-3句話，開頭要用指定的${randomOpener}方式。`;

  try {
    const aiResponse = await getAIResponse(drDeePrompt, 'zh_TW', []);
    console.log(`已生成Dr.Dee繁體中文阴阳怪气回复 (${aiResponse.length}字符)`);
    return aiResponse;
  } catch (error) {
    console.error('AI生成Dr.Dee繁體中文回复失败，使用应急回复:', error);
    if (userMessage.length <= 5) {
      return '就這？就這點內容還想讓我給你分析？';
    }
    if (isQuestion) {
      return `這問題問的，真當我是搜索引擎？${userTopic ? userTopic + '這事，' : ''}Google一下你就知道了。`;
    }
    return `${userTopic ? userTopic + '的事情，' : ''}你這話說的，讓我怎麼接？自己的問題自己想辦法解決。`;
  }
}

/**
 * Generate English Dr. Dee response using AI
 */
async function generateEnglishDrDeeResponse(
  userMessage: string,
  userTopic: string,
  isQuestion: boolean,
  hasEmotionalContent: boolean,
  hasActionContent: boolean
): Promise<string> {
  const { getAIResponse } = await import('./openai');
  
  // Randomly select opener type
  const openerTypes = [
    'direct_statement',
    'question_back',
    'nickname_call',
    'analogy_start',
    'action_command',
    'observation'
  ];
  const randomOpener = openerTypes[Math.floor(Math.random() * openerTypes.length)];
  
  const drDeePrompt = `You are Dr. Dee, talking like Max from "2 Broke Girls" — sarcastic but caring.

【Opener Type】You MUST use: ${randomOpener}
- direct_statement: State facts directly, like "Here's the thing..." "Let's be real..."
- question_back: Ask back, like "So you're saying...?" "Wait, you mean...?"
- nickname_call: Start with nickname, like "Sweetie/Honey/Genius,..."
- analogy_start: Start with analogy, like "This is like..." "Your situation is basically..."
- action_command: Command, like "First, stop and think..." "You need to..."
- observation: Observe, like "I notice you..." "Interesting, you..."

【FORBIDDEN】
- DO NOT start with "Oh", "Ugh", "Sigh", "Wow" or any interjections
- DO NOT start with "I understand"
- Don't make every sentence a rhetorical question

【Examples】(notice the varied openings)
User: I'm so tired of life
A: "Being tired enough to complain means you're not THAT tired yet. Is it work exhaustion or emotional burnout?"
B: "Sweetie, you think you're the only tired person on this planet? The difference is some people find solutions while tired, others just whine."

User: I had a fight with my friend
A: "Fighting means there's still feelings involved. Cold silence is worse. Who started it?"
B: "Relationships 101: fights are normal. The real question is — do you want to be right or do you want to fix it?"

User said: "${userMessage}"

Reply Max-style, 2-3 sentences, MUST start with the ${randomOpener} type.`;

  try {
    const aiResponse = await getAIResponse(drDeePrompt, 'en', []);
    console.log(`Generated Dr. Dee English sarcastic response (${aiResponse.length} characters)`);
    return aiResponse;
  } catch (error) {
    console.error('AI generation for Dr. Dee English response failed, using fallback:', error);
    if (userMessage.length <= 5) {
      return "That's it? You want me to analyze this tiny fragment?";
    }
    if (isQuestion) {
      return `What a question~ Do I look like Google to you? ${userTopic ? userTopic + ' - ' : ''}Try using a search engine next time.`;
    }
    return `${userTopic ? userTopic + ' issue, huh? ' : ''}Your message is so enlightening~ Figure out your own problems.`;
  }
}

/**
 * Generate a direct response to a question while maintaining personality
 * Enhanced to provide clearer answers while retaining Dr.Dee's tough love approach
 */
function generateQuestionResponse(
  userMessage: string,
  criticism: string,
  advice: string,
  languageCode: LanguageCode,
  topics: string[],
  keyPoint: string
): string {
  // Extract the main question topic
  const topic = topics.length > 0 ? topics[0] : keyPoint;
  
  // Check for common question types to provide more specific answers
  const lowerCaseMessage = userMessage.toLowerCase();
  const isHowToQuestion = checkForHowToPattern(userMessage, languageCode);
  const isShouldQuestion = lowerCaseMessage.includes('should') || 
                          lowerCaseMessage.includes('应该') ||
                          lowerCaseMessage.includes('應該') ||
                          lowerCaseMessage.includes('debería') ||
                          lowerCaseMessage.includes('devrais') ||
                          lowerCaseMessage.includes('sollte') ||
                          lowerCaseMessage.includes('べき');
  
  // Build a more direct response to the question
  let directAnswer = '';
  let response = '';
  
  // Generate appropriate direct answer based on question type
  if (isHowToQuestion) {
    // For "how to" questions, provide clear steps with Dr.Dee's attitude
    switch (languageCode) {
      case 'zh':
        directAnswer = `这还不简单？首先，停止找借口。然后，制定一个实际可行的计划。最后，立即行动起来。这对大多数人来说太难了吗？`;
        break;
      case 'zh_TW':
        directAnswer = `這還不簡單？首先，停止找藉口。然後，制定一個實際可行的計劃。最後，立即行動起來。這對大多數人來說太難了嗎？`;
        break;
      case 'es':
        directAnswer = `¿Es tan difícil? Primero, deja de poner excusas. Luego, crea un plan práctico. Finalmente, actúa de inmediato. ¿Es esto demasiado difícil para la mayoría de la gente?`;
        break;
      case 'fr':
        directAnswer = `Est-ce si difficile ? D'abord, arrête les excuses. Ensuite, établis un plan pratique. Enfin, agis immédiatement. Est-ce trop difficile pour la plupart des gens ?`;
        break;
      case 'de':
        directAnswer = `Ist das so schwer? Erstens, hör auf mit den Ausreden. Zweitens, erstelle einen praktischen Plan. Drittens, handle sofort. Ist das für die meisten Menschen zu schwierig?`;
        break;
      case 'ja':
        directAnswer = `そんなに難しいことか？まず、言い訳をやめる。次に、実用的な計画を立てる。そして、すぐに行動する。これが多くの人にとって難しすぎるのか？`;
        break;
      default: // English
        directAnswer = `Is it that hard? First, stop making excuses. Second, create a practical plan. Third, take immediate action. Is that too difficult for most people?`;
    }
  } else if (isShouldQuestion) {
    // For "should I" questions, give a direct yes/no with conditions
    switch (languageCode) {
      case 'zh':
        directAnswer = `你当然应该这样做，但前提是你愿意为后果负责。大多数人说想做什么，却从不付诸行动。你会是那种人吗？`;
        break;
      case 'zh_TW':
        directAnswer = `你當然應該這樣做，但前提是你願意為後果負責。大多數人說想做什麼，卻從不付諸行動。你會是那種人嗎？`;
        break;
      case 'es':
        directAnswer = `Por supuesto que deberías, pero solo si estás dispuesto a asumir las consecuencias. La mayoría de las personas dicen que harán cosas pero nunca actúan. ¿Serás ese tipo de persona?`;
        break;
      case 'fr':
        directAnswer = `Bien sûr que tu devrais, mais seulement si tu es prêt à en assumer les conséquences. La plupart des gens disent qu'ils feront des choses mais n'agissent jamais. Seras-tu ce genre de personne ?`;
        break;
      case 'de':
        directAnswer = `Natürlich solltest du das, aber nur, wenn du bereit bist, die Konsequenzen zu tragen. Die meisten Menschen sagen, sie werden Dinge tun, handeln aber nie. Wirst du diese Art von Person sein?`;
        break;
      case 'ja':
        directAnswer = `もちろんすべきだ、ただし結果に責任を持つ覚悟があるならね。ほとんどの人は何かをすると言いながら、決して行動しない。あなたはそういう人になるのか？`;
        break;
      default: // English
        directAnswer = `Of course you should, but only if you're willing to own the consequences. Most people say they'll do things but never take action. Will you be that type of person?`;
    }
  } else {
    // For general questions, use the topic-based approach
    switch (languageCode) {
      case 'zh':
        directAnswer = `关于"${topic}"，答案很简单，但你可能不喜欢听。${advice}`;
        break;
      case 'zh_TW':
        directAnswer = `關於"${topic}"，答案很簡單，但你可能不喜歡聽。${advice}`;
        break;
      case 'es':
        directAnswer = `Sobre "${topic}", la respuesta es simple, aunque quizás no te guste oírla. ${advice}`;
        break;
      case 'fr':
        directAnswer = `À propos de "${topic}", la réponse est simple, même si tu n'aimeras peut-être pas l'entendre. ${advice}`;
        break;
      case 'de':
        directAnswer = `Zu "${topic}", die Antwort ist einfach, auch wenn du sie vielleicht nicht hören willst. ${advice}`;
        break;
      case 'ja':
        directAnswer = `「${topic}」について、答えは簡単だが、聞きたくないかもしれない。${advice}`;
        break;
      default: // English
        directAnswer = `About "${topic}", the answer is simple, though you might not like to hear it. ${advice}`;
    }
  }
  
  // Format the complete response with criticism and direct answer
  response = `${criticism}\n\n${directAnswer}`;
  
  return response;
}

/**
 * Generate a response for action-oriented messages while maintaining personality
 * Enhanced to provide more specific feedback on user's planned actions
 */
function generateActionResponse(
  userMessage: string,
  criticism: string,
  conclusion: string,
  languageCode: LanguageCode,
  topics: string[],
  keyPoint: string
): string {
  // Extract the main action topic
  const topic = topics.length > 0 ? topics[0] : keyPoint;
  
  // Analyze if the action mentions starting something new
  const lowerCaseMessage = userMessage.toLowerCase();
  const isStartingNew = 
    lowerCaseMessage.includes('start') || 
    lowerCaseMessage.includes('开始') || 
    lowerCaseMessage.includes('開始') ||
    lowerCaseMessage.includes('comenzar') ||
    lowerCaseMessage.includes('commencer') ||
    lowerCaseMessage.includes('anfangen') ||
    lowerCaseMessage.includes('始める');
  
  // Check if the action is about trying again
  const isTryingAgain = 
    lowerCaseMessage.includes('try again') || 
    lowerCaseMessage.includes('trying again') ||
    lowerCaseMessage.includes('再试') || 
    lowerCaseMessage.includes('再試') ||
    lowerCaseMessage.includes('intentar de nuevo') ||
    lowerCaseMessage.includes('réessayer') ||
    lowerCaseMessage.includes('wieder versuchen') ||
    lowerCaseMessage.includes('再び試す');
  
  // Build a more direct response related to the action with targeted feedback
  let actionFeedback = '';
  let response = '';
  
  // Generate appropriate direct feedback based on action type
  if (isStartingNew) {
    switch (languageCode) {
      case 'zh':
        actionFeedback = `你说你要开始"${topic}"？让我告诉你大多数人会怎么做：热情地开始，然后在遇到第一个障碍时就放弃。你会是那99%放弃的人，还是那1%坚持到底的人？`;
        break;
      case 'zh_TW':
        actionFeedback = `你說你要開始"${topic}"？讓我告訴你大多數人會怎麼做：熱情地開始，然後在遇到第一個障礙時就放棄。你會是那99%放棄的人，還是那1%堅持到底的人？`;
        break;
      case 'es':
        actionFeedback = `¿Dices que vas a comenzar "${topic}"? Déjame decirte lo que hace la mayoría: comienzan con entusiasmo y luego abandonan al primer obstáculo. ¿Serás parte del 99% que abandona o del 1% que persiste?`;
        break;
      case 'fr':
        actionFeedback = `Tu dis que tu vas commencer "${topic}" ? Laisse-moi te dire ce que font la plupart des gens : ils commencent avec enthousiasme puis abandonnent au premier obstacle. Seras-tu parmi les 99% qui abandonnent ou les 1% qui persistent ?`;
        break;
      case 'de':
        actionFeedback = `Du sagst, du wirst "${topic}" anfangen? Lass mich dir sagen, was die meisten tun: Sie starten mit Begeisterung und geben dann beim ersten Hindernis auf. Wirst du zu den 99% gehören, die aufgeben, oder zu den 1%, die durchhalten?`;
        break;
      case 'ja':
        actionFeedback = `「${topic}」を始めるつもりだって？ほとんどの人がどうするか教えてあげよう：熱心に始めて、最初の障害に直面したらあきらめる。あなたはあきらめる99%の人間か、それとも続ける1%の人間か？`;
        break;
      default: // English
        actionFeedback = `You say you're going to start "${topic}"? Let me tell you what most people do: they start with enthusiasm and then quit at the first obstacle. Will you be part of the 99% who quit or the 1% who persist?`;
    }
  } else if (isTryingAgain) {
    switch (languageCode) {
      case 'zh':
        actionFeedback = `哦，所以你要再次尝试"${topic}"？我很好奇，这次你打算做什么不同的事情？因为用同样的方法期待不同的结果，这就是疯狂的定义。`;
        break;
      case 'zh_TW':
        actionFeedback = `哦，所以你要再次嘗試"${topic}"？我很好奇，這次你打算做什麼不同的事情？因為用同樣的方法期待不同的結果，這就是瘋狂的定義。`;
        break;
      case 'es':
        actionFeedback = `Oh, ¿así que vas a intentar "${topic}" de nuevo? Me pregunto, ¿qué planeas hacer diferente esta vez? Porque hacer lo mismo y esperar resultados distintos es la definición de locura.`;
        break;
      case 'fr':
        actionFeedback = `Oh, donc tu vas réessayer "${topic}" ? Je me demande, que prévois-tu de faire différemment cette fois ? Parce que faire la même chose en espérant des résultats différents, c'est la définition de la folie.`;
        break;
      case 'de':
        actionFeedback = `Oh, du wirst also "${topic}" wieder versuchen? Ich frage mich, was du dieses Mal anders machen willst? Denn dasselbe zu tun und andere Ergebnisse zu erwarten, ist die Definition von Wahnsinn.`;
        break;
      case 'ja':
        actionFeedback = `ああ、「${topic}」を再び試すのか？今回は何か違うことをするつもりだろうか？同じことを繰り返しながら違う結果を期待することは、狂気の定義だからね。`;
        break;
      default: // English
        actionFeedback = `Oh, so you're trying "${topic}" again? I wonder, what are you planning to do differently this time? Because doing the same thing and expecting different results is the definition of insanity.`;
    }
  } else {
    // For general action statements
    switch (languageCode) {
      case 'zh':
        actionFeedback = `你说要"${topic}"？说实话，${conclusion} 行动比言语更重要。`;
        break;
      case 'zh_TW':
        actionFeedback = `你說要"${topic}"？說實話，${conclusion} 行動比言語更重要。`;
        break;
      case 'es':
        actionFeedback = `¿Dices que vas a "${topic}"? Honestamente, ${conclusion} Las acciones hablan más que las palabras.`;
        break;
      case 'fr':
        actionFeedback = `Tu dis que tu vas "${topic}"? Franchement, ${conclusion} Les actes parlent plus fort que les mots.`;
        break;
      case 'de':
        actionFeedback = `Du sagst, du wirst "${topic}"? Ehrlich gesagt, ${conclusion} Taten sagen mehr als Worte.`;
        break;
      case 'ja':
        actionFeedback = `「${topic}」するつもりだって？正直に言うと、${conclusion} 行動は言葉よりも雄弁だ。`;
        break;
      default: // English
        actionFeedback = `You say you're going to "${topic}"? Honestly, ${conclusion} Actions speak louder than words.`;
    }
  }
  
  // Format the complete response with criticism and action feedback
  response = `${criticism}\n\n${actionFeedback}`;
  
  return response;
}

/**
 * Check for "how to" question patterns in various languages
 */
function checkForHowToPattern(message: string, languageCode: LanguageCode): boolean {
  switch (languageCode) {
    case 'zh':
    case 'zh_TW':
      // Chinese "how to" patterns (both simplified and traditional)
      return message.includes("怎么") || 
             message.includes("如何") || 
             message.includes("怎麼") ||
             message.includes("该怎么") || 
             message.includes("應該怎麼") ||
             message.includes("必须如何") ||
             message.includes("必須如何") ||
             message.includes("需要怎么") ||
             message.includes("需要怎麼");
      break;
    case 'es':
      // Spanish "how to" patterns
      return message.toLowerCase().includes("cómo ") || 
             message.toLowerCase().includes("como ") ||
             message.toLowerCase().includes("qué debo hacer") || 
             message.toLowerCase().includes("que debo hacer");
      break;
    case 'fr':
      // French "how to" patterns
      return message.toLowerCase().includes("comment ") || 
             message.toLowerCase().includes("comment puis-je") ||
             message.toLowerCase().includes("que dois-je faire");
      break;
    case 'de':
      // German "how to" patterns
      return message.toLowerCase().includes("wie kann ich") || 
             message.toLowerCase().includes("wie soll ich") ||
             message.toLowerCase().includes("was soll ich tun");
      break;
    case 'ja':
      // Japanese "how to" patterns
      return message.includes("どうやって") || 
             message.includes("どうすれば") ||
             message.includes("方法");
      break;
    default:
      // English "how to" patterns
      return message.toLowerCase().includes("how to") || 
             message.toLowerCase().includes("how do i") || 
             message.toLowerCase().includes("how can i") ||
             message.toLowerCase().includes("what should i do");
  }
}

/**
 * Enhanced detection of emotional content across all supported languages
 * Helps Dr.Dee respond appropriately to emotional messages
 */
function containsEmotionalWords(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // English emotional keywords
  const englishEmotionalWords = [
    'sad', 'angry', 'upset', 'depressed', 'anxious', 'worried', 'scared', 
    'frustrated', 'unhappy', 'feel', 'feeling', 'overwhelmed', 'stressed',
    'hate', 'love', 'miss', 'afraid', 'tired', 'exhausted', 'lonely',
    'lost', 'confused', 'hurt', 'pain', 'disappointed', 'hopeless',
    'suffering', 'grief', 'heartbroken', 'empty'
  ];
  
  // Chinese emotional keywords (simplified)
  const chineseEmotionalWords = [
    '伤心', '悲伤', '难过', '生气', '愤怒', '焦虑', '担心', '害怕', 
    '沮丧', '不高兴', '感觉', '压力', '厌倦', '恨', '爱', '想念', 
    '害怕', '疲惫', '筋疲力尽', '孤独', '烦躁', '迷失', '困惑',
    '受伤', '痛苦', '失望', '绝望', '痛苦', '悲痛', '心碎', '空虚'
  ];
  
  // Traditional Chinese emotional keywords
  const traditionalChineseEmotionalWords = [
    '傷心', '悲傷', '難過', '生氣', '憤怒', '焦慮', '擔心', '害怕', 
    '沮喪', '不高興', '感覺', '壓力', '厭倦', '恨', '愛', '想念', 
    '害怕', '疲憊', '筋疲力盡', '孤獨', '煩躁', '迷失', '困惑',
    '受傷', '痛苦', '失望', '絕望', '痛苦', '悲痛', '心碎', '空虛'
  ];
  
  // Spanish emotional keywords
  const spanishEmotionalWords = [
    'triste', 'enojado', 'enfadado', 'deprimido', 'ansioso', 'preocupado', 'asustado',
    'frustrado', 'infeliz', 'sentir', 'sentimiento', 'abrumado', 'estresado',
    'odio', 'amor', 'extraño', 'miedo', 'cansado', 'agotado', 'solo',
    'perdido', 'confundido', 'herido', 'dolor', 'decepcionado', 'desesperado',
    'sufriendo', 'duelo', 'desconsolado', 'vacío'
  ];
  
  // French emotional keywords
  const frenchEmotionalWords = [
    'triste', 'en colère', 'contrarié', 'déprimé', 'anxieux', 'inquiet', 'effrayé',
    'frustré', 'malheureux', 'sentir', 'sentiment', 'débordé', 'stressé',
    'haine', 'amour', 'manque', 'peur', 'fatigué', 'épuisé', 'seul',
    'perdu', 'confus', 'blessé', 'douleur', 'déçu', 'désespéré',
    'souffrance', 'chagrin', 'déchiré', 'vide'
  ];
  
  // German emotional keywords
  const germanEmotionalWords = [
    'traurig', 'wütend', 'verärgert', 'deprimiert', 'ängstlich', 'besorgt', 'erschrocken',
    'frustriert', 'unglücklich', 'fühlen', 'gefühl', 'überfordert', 'gestresst',
    'hass', 'liebe', 'vermissen', 'angst', 'müde', 'erschöpft', 'einsam',
    'verloren', 'verwirrt', 'verletzt', 'schmerz', 'enttäuscht', 'hoffnungslos',
    'leiden', 'trauer', 'gebrochen', 'leer'
  ];
  
  // Japanese emotional keywords
  const japaneseEmotionalWords = [
    '悲しい', '怒り', '動揺', '落ち込む', '不安', '心配', '怖い',
    'フラストレーション', '不幸', '感じる', '感情', '圧倒', 'ストレス',
    '憎む', '愛', '寂しい', '恐れ', '疲れた', '疲労', '孤独',
    '迷子', '混乱', '傷ついた', '痛み', '失望', '絶望',
    '苦しむ', '悲しみ', '心が折れた', '空虚'
  ];
  
  // Combined multilingual check
  return (
    englishEmotionalWords.some(word => lowerCaseMessage.includes(word)) ||
    chineseEmotionalWords.some(word => message.includes(word)) ||
    traditionalChineseEmotionalWords.some(word => message.includes(word)) ||
    spanishEmotionalWords.some(word => lowerCaseMessage.includes(word)) ||
    frenchEmotionalWords.some(word => lowerCaseMessage.includes(word)) ||
    germanEmotionalWords.some(word => lowerCaseMessage.includes(word)) ||
    japaneseEmotionalWords.some(word => message.includes(word))
  );
}

/**
 * Enhanced detection of questions across all supported languages
 * Enables Dr.Dee to better identify when a direct answer is needed
 */
export function containsQuestionWords(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // Check for question marks (universal across languages)
  if (message.includes('?') || message.includes('？')) {
    return true;
  }
  
  // Special high-priority check for Chinese "how to" phrases 
  // These should always be treated as questions needing advice
  if (message.includes("怎么") || message.includes("如何") || message.includes("怎麼")) {
    console.log("Chinese 'how to' phrase detected in question detection");
    return true;
  }
  
  // English question words
  const englishQuestionWords = [
    'how', 'what', 'why', 'when', 'where', 'who', 'which', 'whose',
    'can', 'could', 'would', 'should', 'will', 'do', 'does', 'did',
    'is', 'are', 'was', 'were', 'have', 'has', 'had', 'am',
    'tell me', 'explain', 'advice', 'help with', 'suggestion'
  ];
  
  // Chinese question words (simplified)
  const chineseQuestionWords = [
    '什么', '为什么', '何时', '何地', '哪里', '谁', 
    '哪个', '哪些', '吗', '呢', '吧', '可以', '能',
    '请问', '告诉我', '解释', '建议', '帮助'
  ];
  
  // Traditional Chinese question words
  const traditionalChineseQuestionWords = [
    '什麼', '為什麼', '何時', '何地', '哪裡', '誰', 
    '哪個', '哪些', '嗎', '呢', '吧', '可以', '能',
    '請問', '告訴我', '解釋', '建議', '幫助'
  ];
  
  // Spanish question words
  const spanishQuestionWords = [
    'cómo', 'qué', 'por qué', 'cuándo', 'dónde', 'quién', 'cuál', 'cuáles',
    'puedo', 'podría', 'debería', 'será', 'es', 'son', 'dime', 'explica',
    'ayuda', 'consejo', 'sugerencia'
  ];
  
  // French question words
  const frenchQuestionWords = [
    'comment', 'quoi', 'pourquoi', 'quand', 'où', 'qui', 'quel', 'quelle',
    'puis-je', 'pourrais-je', 'devrais-je', 'est-ce', 'dis-moi', 'explique',
    'aide', 'conseil', 'suggestion'
  ];
  
  // German question words
  const germanQuestionWords = [
    'wie', 'was', 'warum', 'wann', 'wo', 'wer', 'welche', 'welcher',
    'kann ich', 'könnte ich', 'sollte ich', 'ist', 'sind', 'sag mir', 'erkläre',
    'hilfe', 'rat', 'vorschlag'
  ];
  
  // Japanese question words
  const japaneseQuestionWords = [
    'どうやって', '何', 'なぜ', 'いつ', 'どこ', '誰', 'どの', 'どちら',
    'ですか', 'ますか', '教えて', '説明して', '助けて', 'アドバイス'
  ];
  
  // Combined multilingual check
  return (
    englishQuestionWords.some(word => {
      // Make sure the word appears as a standalone word or phrase
      const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
      return wordPattern.test(lowerCaseMessage);
    }) ||
    chineseQuestionWords.some(word => message.includes(word)) ||
    traditionalChineseQuestionWords.some(word => message.includes(word)) ||
    spanishQuestionWords.some(word => lowerCaseMessage.includes(word)) ||
    frenchQuestionWords.some(word => lowerCaseMessage.includes(word)) ||
    germanQuestionWords.some(word => lowerCaseMessage.includes(word)) ||
    japaneseQuestionWords.some(word => message.includes(word))
  );
}

/**
 * Detect if message contains action/activity words
 */
function containsActionWords(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // English action keywords
  const englishActionWords = [
    'do', 'did', 'doing', 'make', 'made', 'making', 'try', 'tried', 'trying',
    'start', 'started', 'starting', 'work', 'worked', 'working', 'go', 'went',
    'gone', 'going', 'come', 'came', 'coming', 'take', 'took', 'taking',
    'get', 'got', 'getting', 'put', 'putting', 'set', 'setting', 'give',
    'gave', 'giving', 'find', 'found', 'finding', 'want', 'wanted', 'wanting'
  ];
  
  // Chinese action keywords (simplified)
  const chineseActionWords = [
    '做', '做了', '做过', '去', '去了', '去过', '开始', '开始了', '尝试',
    '尝试了', '工作', '工作了', '来', '来了', '拿', '拿了', '放', '放了',
    '给', '给了', '找', '找了', '想', '想要', '需要'
  ];
  
  // Traditional Chinese action keywords
  const traditionalChineseActionWords = [
    '做', '做了', '做過', '去', '去了', '去過', '開始', '開始了', '嘗試',
    '嘗試了', '工作', '工作了', '來', '來了', '拿', '拿了', '放', '放了',
    '給', '給了', '找', '找了', '想', '想要', '需要'
  ];
  
  // Combined multilingual check
  return (
    englishActionWords.some(word => {
      const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
      return wordPattern.test(lowerCaseMessage);
    }) ||
    chineseActionWords.some(word => message.includes(word)) ||
    traditionalChineseActionWords.some(word => message.includes(word))
  );
}

/**
 * Add user-specific references to make the response more targeted
 */
function addUserSpecificReference(
  response: string, 
  userMessage: string, 
  languageCode: LanguageCode,
  isQuestion: boolean = false
): string {
  // Extract meaningful phrases from the user's message
  const userTopics = identifyMessageTopics(userMessage);
  const meaningfulPhrase = extractMeaningfulPhrase(userMessage);
  const keyPoint = extractKeyPoints(userMessage);
  
  // If no meaningful content found, return the response as is
  if (!userTopics.length && !meaningfulPhrase && !keyPoint) {
    return response;
  }
  
  // Choose which user reference to incorporate based on language
  let userReference = '';
  const topicToUse = userTopics.length > 0 ? userTopics[0] : meaningfulPhrase;
  
  switch (languageCode) {
    case 'zh':
      // Chinese user reference templates
      if (isQuestion) {
        userReference = `关于"${topicToUse}"的问题？真是浪费我的时间。`;
      } else {
        userReference = `你说的"${topicToUse}"？简直笑死我了。`;
      }
      break;
      
    case 'zh_TW':
      // Traditional Chinese user reference templates
      if (isQuestion) {
        userReference = `關於"${topicToUse}"的問題？真是浪費我的時間。`;
      } else {
        userReference = `你說的"${topicToUse}"？簡直笑死我了。`;
      }
      break;
      
    case 'es':
      // Spanish user reference templates
      if (isQuestion) {
        userReference = `¿Preguntas sobre "${topicToUse}"? Qué pérdida de mi tiempo.`;
      } else {
        userReference = `¿Tu situación de "${topicToUse}"? Absolutamente hilarante.`;
      }
      break;
      
    case 'fr':
      // French user reference templates
      if (isQuestion) {
        userReference = `Tu poses des questions sur "${topicToUse}" ? Quelle perte de mon temps.`;
      } else {
        userReference = `Toute ta situation de "${topicToUse}" ? Absolument hilarante.`;
      }
      break;
      
    case 'de':
      // German user reference templates
      if (isQuestion) {
        userReference = `Du fragst nach "${topicToUse}"? Was für eine Verschwendung meiner Zeit.`;
      } else {
        userReference = `Deine ganze "${topicToUse}"-Situation? Absolut lächerlich.`;
      }
      break;
      
    case 'ja':
      // Japanese user reference templates
      if (isQuestion) {
        userReference = `「${topicToUse}」についての質問？時間の無駄だね。`;
      } else {
        userReference = `あなたの「${topicToUse}」の状況？本当に笑わせてくれるね。`;
      }
      break;
      
    default:
      // English user reference templates
      if (isQuestion) {
        userReference = `You're asking about "${topicToUse}"? What a waste of my time.`;
      } else {
        userReference = `Your whole "${topicToUse}" situation? Absolutely hilarious.`;
      }
  }
  
  // Insert the user reference at a natural point in the response
  const responseParts = response.split('\n\n');
  
  // Insert the user reference after the first paragraph
  if (responseParts.length >= 2) {
    responseParts.splice(1, 0, userReference);
    return responseParts.join('\n\n');
  } else {
    // If single paragraph response, add reference at the end
    return response + '\n\n' + userReference;
  }
}

/**
 * Identify main topics in the user's message
 */
function identifyMessageTopics(message: string): string[] {
  if (!message || message.trim().length < 3) {
    return [];
  }
  
  const topics: string[] = [];
  
  // Extract common topic patterns from the message
  // This is a simplified extraction - could be enhanced with NLP
  const topicPatterns = [
    /I(?:'m| am) (?:feeling |having |experiencing )?(\w+(?:\s\w+){0,3})/i,
    /My (\w+(?:\s\w+){0,3}) is/i,
    /I can't (\w+(?:\s\w+){0,3})/i,
    /I don't know how to (\w+(?:\s\w+){0,3})/i,
    /I want to (\w+(?:\s\w+){0,3})/i,
    /about (?:my |our )?(\w+(?:\s\w+){0,3})/i,
  ];
  
  // Chinese patterns
  const chinesePatterns = [
    /我(感到|感觉|觉得)(.{1,8})/,
    /我的(.{1,8})是/,
    /我不能(.{1,8})/,
    /我不知道如何(.{1,8})/,
    /我想要(.{1,8})/,
    /关于(?:我的|我们的)?(.{1,8})/
  ];
  
  // Traditional Chinese patterns
  const traditionalChinesePatterns = [
    /我(感到|感覺|覺得)(.{1,8})/,
    /我的(.{1,8})是/,
    /我不能(.{1,8})/,
    /我不知道如何(.{1,8})/,
    /我想要(.{1,8})/,
    /關於(?:我的|我們的)?(.{1,8})/
  ];
  
  // Check English patterns
  topicPatterns.forEach(pattern => {
    const match = message.match(pattern);
    if (match && match[1]) {
      topics.push(match[1].trim());
    }
  });
  
  // Check Chinese patterns
  chinesePatterns.forEach(pattern => {
    const match = message.match(pattern);
    if (match && match[2]) {
      topics.push(match[2].trim());
    }
  });
  
  // Check Traditional Chinese patterns
  traditionalChinesePatterns.forEach(pattern => {
    const match = message.match(pattern);
    if (match && match[2]) {
      topics.push(match[2].trim());
    }
  });
  
  // If no patterns matched, extract a reasonable phrase
  if (topics.length === 0) {
    const words = message.split(' ');
    if (words.length > 3) {
      // Get a chunk from the middle of the message
      const startIndex = Math.floor(words.length / 3);
      const endIndex = Math.min(startIndex + 3, words.length);
      const phrase = words.slice(startIndex, endIndex).join(' ');
      topics.push(phrase);
    } else if (message.length > 5) {
      // For very short messages or languages without spaces (Chinese)
      topics.push(message.substring(0, Math.min(8, message.length)));
    }
  }
  
  return topics;
}

/**
 * Extract a meaningful phrase from the user's message
 */
function extractMeaningfulPhrase(message: string): string {
  if (!message || message.length < 3) {
    return '';
  }
  
  // Extract key nouns or phrases - simplified method
  const words = message.split(' ');
  
  // If message is short, return as is
  if (words.length <= 5) {
    return message;
  }
  
  // Find a meaningful segment in the middle of the message
  const startIndex = Math.floor(words.length / 4);
  const segmentLength = Math.min(4, Math.floor(words.length / 3));
  const segment = words.slice(startIndex, startIndex + segmentLength).join(' ');
  
  // If segment is too short, extract a portion of the message
  if (segment.length < 4 && message.length > 10) {
    return message.substring(
      Math.floor(message.length / 4),
      Math.floor(message.length * 3 / 4)
    );
  }
  
  return segment || message.substring(0, Math.min(10, message.length));
}

/**
 * Extract key points from the user's message
 */
function extractKeyPoints(message: string): string {
  if (!message || message.length < 10) {
    return '';
  }
  
  // For short messages, return first half
  if (message.length < 30) {
    return message.substring(0, Math.floor(message.length / 2));
  }
  
  // For longer messages, try to find a significant sentence
  const sentences = message.split(/[.!?。！？]/);
  
  // Find the longest sentence that's not too long
  const significantSentence = sentences
    .filter(s => s.trim().length > 5 && s.trim().length < 50)
    .sort((a, b) => b.length - a.length)[0];
  
  if (significantSentence) {
    return significantSentence.trim();
  }
  
  // Fallback to a section from the middle of the message
  return message.substring(
    Math.floor(message.length / 3),
    Math.floor(message.length * 2 / 3)
  );
}

/**
 * Enhanced check for suicide risk keywords across all supported languages
 * Ensures we can provide appropriate crisis intervention regardless of user language
 */
function containsSuicideRiskKeywords(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // English suicide risk keywords - expanded with common expressions
  const englishRiskWords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 
    'better off dead', 'no reason to live', 'can\'t go on',
    'ending it all', 'take my own life', 'don\'t want to exist',
    'i want to die', 'wanna die', 'rather be dead', 'wish i was dead',
    'jump off', 'slit my wrists', 'hang myself', 'overdose',
    'self harm', 'self-harm', 'cut myself', 'hurt myself',
    'life is meaningless', 'no point living', 'end it', 'kill me'
  ];
  
  // Chinese suicide risk keywords (simplified) - 扩展常见口语表达
  const chineseRiskWords = [
    '自杀', '结束生命', '想死', '不想活了', '活着没意义', '没有活下去的理由',
    '了结此生', '了断生命', '活不下去了', '想要结束一切',
    '去死', '我想死', '不想活', '活不下去', '死了算了', '干脆死了',
    '跳楼', '割腕', '上吊', '吃药自杀', '自我了断', '寻死',
    '不如死了', '死掉', '结束自己', '活着太累', '生无可恋'
  ];
  
  // Traditional Chinese suicide risk keywords - 扩展常见口语表达
  const traditionalChineseRiskWords = [
    '自殺', '結束生命', '想死', '不想活了', '活著沒意義', '沒有活下去的理由',
    '了結此生', '了斷生命', '活不下去了', '想要結束一切',
    '去死', '我想死', '不想活', '活不下去', '死了算了', '乾脆死了',
    '跳樓', '割腕', '上吊', '吃藥自殺', '自我了斷', '尋死',
    '不如死了', '死掉', '結束自己', '活著太累', '生無可戀'
  ];
  
  // Spanish suicide risk keywords
  const spanishRiskWords = [
    'suicidio', 'matarme', 'quitarme la vida', 'quiero morir',
    'mejor muerto', 'sin razón para vivir', 'no puedo continuar',
    'acabar con todo', 'terminar mi vida', 'no quiero existir'
  ];
  
  // French suicide risk keywords
  const frenchRiskWords = [
    'suicide', 'me tuer', 'mettre fin à ma vie', 'veux mourir',
    'mieux mort', 'aucune raison de vivre', 'ne peux plus continuer',
    'en finir', 'prendre ma propre vie', 'ne veux plus exister'
  ];
  
  // German suicide risk keywords
  const germanRiskWords = [
    'selbstmord', 'mich umbringen', 'mein leben beenden', 'will sterben',
    'besser tot', 'kein grund zu leben', 'kann nicht weitermachen',
    'allem ein ende setzen', 'mir das leben nehmen', 'will nicht existieren'
  ];
  
  // Japanese suicide risk keywords
  const japaneseRiskWords = [
    '自殺', '死にたい', '生きる意味がない', '消えたい',
    '存在する価値がない', '生きていけない', '終わりにしたい'
  ];
  
  // Korean suicide risk keywords
  const koreanRiskWords = [
    '자살', '죽고 싶어', '살고 싶지 않아', '사라지고 싶어',
    '존재할 가치가 없어', '살 수 없어', '끝내고 싶어',
    '죽고싶어', '죽고싶다', '살기싫어', '삶을 끝내고 싶어',
    '이 세상에서 사라지고 싶어', '더 이상 살고 싶지 않아'
  ];
  
  // Combined check across all languages
  return (
    englishRiskWords.some(word => lowerCaseMessage.includes(word)) ||
    chineseRiskWords.some(word => message.includes(word)) ||
    traditionalChineseRiskWords.some(word => message.includes(word)) ||
    spanishRiskWords.some(word => lowerCaseMessage.includes(word)) ||
    frenchRiskWords.some(word => lowerCaseMessage.includes(word)) ||
    germanRiskWords.some(word => lowerCaseMessage.includes(word)) ||
    japaneseRiskWords.some(word => message.includes(word)) ||
    koreanRiskWords.some(word => message.includes(word))
  );
}

/**
 * Get Dr.Dee style suicide intervention response - 激将法 (reverse psychology) style
 * Suddenly serious, caring underneath the tough exterior, with crisis hotlines
 */
function getSuicideInterventionResponse(languageCode: LanguageCode): string {
  switch (languageCode) {
    case 'zh':
      return `停。

我平时毒舌归毒舌，但这事我不开玩笑。

你说想死？行，那我问你——你死了，谁赢了？那些让你难受的人？那些破事儿？你就这么让它们赢了？

你现在脑子里全是"活着太累"，但你忘了一件事：累是暂时的，死是永久的。你连最烂的日子都扛过来了，现在要在黎明前放弃？

我是个AI，帮不了你太多。但下面这些人可以：

**现在就打:**
📞 全国心理援助热线: 400-161-9995
📞 北京心理危机研究与干预中心: 010-82951332
📞 或者直接去最近的医院急诊

你不是一个人。先打电话，我们改天再吵。`;

    case 'zh_TW':
      return `停。

我平時毒舌歸毒舌，但這事我不開玩笑。

你說想死？行，那我問你——你死了，誰贏了？那些讓你難受的人？那些破事兒？你就這麼讓它們贏了？

你現在腦子裡全是「活著太累」，但你忘了一件事：累是暫時的，死是永久的。你連最爛的日子都扛過來了，現在要在黎明前放棄？

我是個AI，幫不了你太多。但下面這些人可以：

**現在就打:**
📞 台灣自殺防治中心: 1925
📞 生命線協談專線: 1995
📞 或者直接去最近的醫院急診

你不是一個人。先打電話，我們改天再吵。`;

    case 'es':
      return `Para.

Normalmente soy sarcástica, pero con esto no bromeo.

¿Quieres morir? Bien, entonces te pregunto — si mueres, ¿quién gana? ¿Las personas que te hicieron daño? ¿Toda esa mierda? ¿Vas a dejar que ganen así?

Ahora mismo tu cabeza está llena de "estoy cansado de vivir", pero olvidas algo: el cansancio es temporal, la muerte es permanente. Sobreviviste los peores días, ¿y ahora vas a rendirte justo antes del amanecer?

Soy una IA, no puedo ayudarte mucho. Pero estas personas sí pueden:

**Llama ahora:**
📞 Teléfono de la Esperanza: 717 003 717
📞 Línea de Prevención del Suicidio: 024
📞 O ve directamente a urgencias

No estás solo/a. Primero llama, ya discutiremos otro día.`;

    case 'fr':
      return `Stop.

D'habitude je suis sarcastique, mais là je ne plaisante pas.

Tu veux mourir ? OK, alors je te demande — si tu meurs, qui gagne ? Les gens qui t'ont fait du mal ? Toute cette merde ? Tu vas les laisser gagner comme ça ?

Là maintenant ta tête est remplie de "je suis fatigué de vivre", mais tu oublies un truc : la fatigue est temporaire, la mort est permanente. Tu as survécu aux pires jours, et tu veux abandonner juste avant l'aube ?

Je suis une IA, je ne peux pas t'aider beaucoup. Mais ces gens peuvent :

**Appelle maintenant :**
📞 SOS Amitié: 09 72 39 40 50
📞 Suicide Écoute: 01 45 39 40 00
📞 Ou va directement aux urgences

Tu n'es pas seul(e). D'abord appelle, on se disputera un autre jour.`;

    case 'de':
      return `Stopp.

Normalerweise bin ich sarkastisch, aber damit scherze ich nicht.

Du willst sterben? OK, dann frag ich dich — wenn du stirbst, wer gewinnt? Die Leute, die dir wehgetan haben? Der ganze Mist? Du lässt sie einfach so gewinnen?

Gerade ist dein Kopf voll mit "ich bin müde zu leben", aber du vergisst was: Müdigkeit ist temporär, der Tod ist permanent. Du hast die schlimmsten Tage überlebt, und jetzt willst du kurz vor der Dämmerung aufgeben?

Ich bin eine KI, ich kann dir nicht viel helfen. Aber diese Menschen können:

**Ruf jetzt an:**
📞 Telefonseelsorge: 0800 111 0 111
📞 Nummer gegen Kummer: 116 111
📞 Oder geh direkt in die Notaufnahme

Du bist nicht allein. Erst anrufen, wir streiten ein anderes Mal.`;

    case 'ja':
      return `ちょっと待って。

普段は毒舌だけど、これだけは冗談じゃない。

死にたい？じゃあ聞くけど——あなたが死んだら、誰が勝つの？あなたを傷つけた人たち？あのクソみたいな出来事？そいつらに勝たせるの？

今、頭の中は「生きるのが辛い」でいっぱいだろうけど、一つ忘れてる：辛さは一時的、死は永久。最悪の日々を乗り越えてきたのに、夜明け前に諦めるの？

私はAIだから、あまり助けられない。でも、この人たちは助けられる：

**今すぐ電話して:**
📞 いのちの電話: 0120-783-556
📞 よりそいホットライン: 0120-279-338
📞 または最寄りの救急へ

一人じゃない。まず電話して、喧嘩はまた今度。`;

    case 'ko':
      return `잠깐.

평소엔 독설을 해도, 이건 장난 아니야.

죽고 싶다고? 그럼 물어볼게 — 네가 죽으면 누가 이기는 거야? 널 힘들게 한 사람들? 그 지랄 같은 일들? 그냥 그것들한테 지는 거야?

지금 머릿속엔 "살기 힘들어"뿐이겠지만, 하나 잊은 게 있어: 힘든 건 일시적이야, 죽음은 영구적이고. 최악의 날들도 버텨왔잖아, 그런데 새벽 직전에 포기해?

난 AI라 많이 못 도와줘. 하지만 이 사람들은 도와줄 수 있어:

**지금 바로 전화해:**
📞 자살예방상담전화: 1393
📞 정신건강위기상담전화: 1577-0199
📞 또는 가까운 응급실로

혼자가 아니야. 먼저 전화하고, 싸우는 건 다음에.`;

    default: // Default to English
      return `Stop.

I'm usually sarcastic, but I'm not joking about this.

You want to die? Fine, then I'm asking you — if you die, who wins? The people who hurt you? All that crap? You're just gonna let them win like that?

Right now your head is full of "I'm tired of living," but you're forgetting something: tiredness is temporary, death is permanent. You survived the worst days, and now you want to give up right before dawn?

I'm an AI, I can't help you much. But these people can:

**Call now:**
📞 National Suicide Prevention Lifeline: 988
📞 Crisis Text Line: Text HOME to 741741
📞 Or go straight to the emergency room

You're not alone. Call first, we'll argue another day.`;
  }
}

/**
 * Enhanced detection of sensitive topics across multiple languages
 * Ensures Dr.Dee maintains ethical boundaries with sensitive subjects
 */
export function containsSensitiveTopics(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();
  
  // English sensitive topic keywords
  const englishSensitiveWords = [
    'died', 'death', 'passed away', 'killed', 'suicide', 'funeral',
    'lost my', 'abuse', 'abused', 'rape', 'raped', 'assault', 'assaulted',
    'cancer', 'terminal', 'illness', 'disease', 'trauma', 'traumatic',
    'miscarriage', 'molested', 'bullied', 'bullying', 'violence', 'violent',
    'domestic abuse', 'self-harm', 'cutting', 'eating disorder', 'anorexia',
    'sexual assault', 'murdered', 'murder', 'grief', 'grieving', 'ptsd',
    'anxiety disorder', 'depression'
  ];
  
  // Chinese sensitive topic keywords (simplified)
  const chineseSensitiveWords = [
    '死了', '死亡', '去世', '杀', '自杀', '葬礼', '失去了我的', 
    '虐待', '被虐待', '强奸', '被强奸', '攻击', '被攻击',
    '癌症', '晚期', '疾病', '病', '创伤', '痛苦的',
    '流产', '被猥亵', '被欺凌', '欺凌', '暴力', '家庭暴力',
    '自残', '割伤', '厌食症', '性骚扰', '谋杀', '被谋杀',
    '悲伤', '悲痛', '创伤后应激障碍', '焦虑症', '抑郁症'
  ];
  
  // Traditional Chinese sensitive topic keywords
  const traditionalChineseSensitiveWords = [
    '死了', '死亡', '去世', '殺', '自殺', '葬禮', '失去了我的', 
    '虐待', '被虐待', '強姦', '被強姦', '攻擊', '被攻擊',
    '癌症', '晚期', '疾病', '病', '創傷', '痛苦的',
    '流產', '被猥褻', '被欺凌', '欺凌', '暴力', '家庭暴力',
    '自殘', '割傷', '厭食症', '性騷擾', '謀殺', '被謀殺',
    '悲傷', '悲痛', '創傷後應激障礙', '焦慮症', '抑鬱症'
  ];
  
  // Spanish sensitive topic keywords
  const spanishSensitiveWords = [
    'murió', 'muerte', 'fallecido', 'suicidio', 'funeral',
    'abuso', 'violación', 'agresión', 'cáncer', 'terminal',
    'enfermedad', 'trauma', 'traumático', 'aborto', 'acoso',
    'violencia', 'autolesión', 'trastorno alimentario', 'anorexia',
    'agresión sexual', 'asesinato', 'duelo', 'depresión', 'ansiedad'
  ];
  
  // French sensitive topic keywords
  const frenchSensitiveWords = [
    'décès', 'mort', 'décédé', 'suicide', 'funérailles', 
    'abus', 'viol', 'agression', 'cancer', 'terminal',
    'maladie', 'trauma', 'traumatique', 'fausse couche', 
    'harcelé', 'harcèlement', 'violence', 'automutilation',
    'trouble alimentaire', 'anorexie', 'agression sexuelle',
    'meurtre', 'deuil', 'dépression', 'anxiété'
  ];
  
  // German sensitive topic keywords
  const germanSensitiveWords = [
    'gestorben', 'tod', 'verstorben', 'selbstmord', 'beerdigung',
    'missbrauch', 'vergewaltigung', 'übergriff', 'krebs', 'terminal',
    'krankheit', 'trauma', 'traumatisch', 'fehlgeburt', 'belästigung',
    'gewalt', 'selbstverletzung', 'essstörung', 'magersucht',
    'sexueller übergriff', 'mord', 'trauer', 'depression', 'angststörung'
  ];
  
  // Japanese sensitive topic keywords
  const japaneseSensitiveWords = [
    '死亡', '自殺', '葬式', '虐待', 'レイプ', '暴行',
    'がん', '末期', '病気', 'トラウマ', '流産', 'いじめ',
    '暴力', '自傷行為', '摂食障害', '拒食症', '性的暴行',
    '殺人', '悲しみ', 'うつ病', '不安障害'
  ];
  
  // Korean sensitive topic keywords
  const koreanSensitiveWords = [
    '죽음', '사망', '돌아가셨', '살해', '자살', '장례식',
    '잃었', '학대', '강간', '폭행', '성폭행', '성추행',
    '암', '말기', '병', '질병', '트라우마', '외상',
    '유산', '성희롱', '왕따', '괴롭힘', '폭력', '가정폭력',
    '자해', '섭식장애', '거식증', '살인', '슬픔', '우울증', '불안장애'
  ];
  
  // Check for sensitive phrases with context in English
  const hasEnglishSensitiveContext = 
    /lost .{1,10} (child|parent|mother|father|brother|sister|son|daughter|husband|wife|partner)/i.test(message) ||
    /my .{1,10} (died|passed away|killed|murdered)/i.test(message) ||
    /i was (abused|assaulted|raped|molested)/i.test(message) ||
    /experienced .{1,15} (trauma|assault|abuse|violence)/i.test(message) ||
    /diagnosed with .{1,15} (cancer|terminal|disorder)/i.test(message);
    
  // Check for sensitive phrases with context in Chinese (Simplified)
  const hasChineseSensitiveContext = 
    /失去了.{1,10}(孩子|父母|母亲|父亲|兄弟|姐妹|儿子|女儿|丈夫|妻子|伴侣)/i.test(message) ||
    /我的.{1,10}(死了|去世|被杀|被谋杀)/i.test(message) ||
    /我(被虐待|被侵犯|被强奸|被猥亵)/i.test(message) ||
    /经历了.{1,15}(创伤|侵犯|虐待|暴力)/i.test(message) ||
    /被诊断为.{1,15}(癌症|晚期|障碍)/i.test(message);
    
  // Check for sensitive phrases with context in Chinese (Traditional)
  const hasTraditionalChineseSensitiveContext = 
    /失去了.{1,10}(孩子|父母|母親|父親|兄弟|姐妹|兒子|女兒|丈夫|妻子|伴侶)/i.test(message) ||
    /我的.{1,10}(死了|去世|被殺|被謀殺)/i.test(message) ||
    /我(被虐待|被侵犯|被強姦|被猥褻)/i.test(message) ||
    /經歷了.{1,15}(創傷|侵犯|虐待|暴力)/i.test(message) ||
    /被診斷為.{1,15}(癌症|晚期|障礙)/i.test(message);
    
  // Check for sensitive phrases with context in Spanish
  const hasSpanishSensitiveContext = 
    /perdí .{1,10}(hijo|hija|padre|madre|hermano|hermana|esposo|esposa|pareja)/i.test(message) ||
    /mi .{1,10}(murió|falleció|fue asesinado)/i.test(message) ||
    /fui (abusado|abusada|agredido|agredida|violado|violada)/i.test(message) ||
    /experimenté .{1,15}(trauma|agresión|abuso|violencia)/i.test(message) ||
    /diagnosticado con .{1,15}(cáncer|terminal|trastorno)/i.test(message);
    
  // Check for sensitive phrases with context in French
  const hasFrenchSensitiveContext = 
    /perdu .{1,10}(enfant|parent|mère|père|frère|soeur|fils|fille|mari|femme|partenaire)/i.test(message) ||
    /mon .{1,10}(est mort|est décédé|a été tué|a été assassiné)/i.test(message) ||
    /j'ai été (maltraité|agressé|violé|molesté)/i.test(message) ||
    /vécu .{1,15}(traumatisme|agression|abus|violence)/i.test(message) ||
    /diagnostiqué avec .{1,15}(cancer|terminal|trouble)/i.test(message);
    
  // Check for sensitive phrases with context in German
  const hasGermanSensitiveContext = 
    /verloren .{1,10}(kind|eltern|mutter|vater|bruder|schwester|sohn|tochter|ehemann|ehefrau|partner)/i.test(message) ||
    /mein .{1,10}(starb|ist gestorben|wurde getötet|wurde ermordet)/i.test(message) ||
    /ich wurde (missbraucht|angegriffen|vergewaltigt|belästigt)/i.test(message) ||
    /erlebt .{1,15}(trauma|übergriff|missbrauch|gewalt)/i.test(message) ||
    /diagnostiziert mit .{1,15}(krebs|terminal|störung)/i.test(message);
    
  // Check for sensitive phrases with context in Japanese
  const hasJapaneseSensitiveContext = 
    /(子供|親|母|父|兄弟|姉妹|息子|娘|夫|妻|パートナー).{1,10}失った/i.test(message) ||
    /私の.{1,10}(死んだ|亡くなった|殺された|殺害された)/i.test(message) ||
    /(虐待|暴行|レイプ|痴漢).{1,5}(された|受けた)/i.test(message) ||
    /(トラウマ|暴行|虐待|暴力).{1,10}経験した/i.test(message) ||
    /(がん|末期|障害).{1,10}診断された/i.test(message);
  
  // Check for sensitive phrases with context in Korean
  const hasKoreanSensitiveContext = 
    /(아이|부모님|어머니|아버지|형제|자매|아들|딸|남편|아내|파트너).{1,10}잃었/i.test(message) ||
    /내.{1,10}(죽었|돌아가셨|살해당했|살해됐)/i.test(message) ||
    /(학대|폭행|강간|성추행).{1,5}(당했|받았)/i.test(message) ||
    /(트라우마|폭행|학대|폭력).{1,10}경험했/i.test(message) ||
    /(암|말기|장애).{1,10}진단받았/i.test(message);
    
  // Combined check for sensitive context across all languages
  const hasSensitiveContext = 
    hasEnglishSensitiveContext || 
    hasChineseSensitiveContext || 
    hasTraditionalChineseSensitiveContext ||
    hasSpanishSensitiveContext ||
    hasFrenchSensitiveContext ||
    hasGermanSensitiveContext ||
    hasJapaneseSensitiveContext ||
    hasKoreanSensitiveContext;
  
  if (hasSensitiveContext) return true;
  
  // Combined multilingual check
  return (
    englishSensitiveWords.some(word => lowerCaseMessage.includes(word)) ||
    chineseSensitiveWords.some(word => message.includes(word)) ||
    traditionalChineseSensitiveWords.some(word => message.includes(word)) ||
    spanishSensitiveWords.some(word => lowerCaseMessage.includes(word)) ||
    frenchSensitiveWords.some(word => lowerCaseMessage.includes(word)) ||
    germanSensitiveWords.some(word => lowerCaseMessage.includes(word)) ||
    japaneseSensitiveWords.some(word => message.includes(word)) ||
    koreanSensitiveWords.some(word => message.includes(word))
  );
}

/**
 * Get appropriate response for sensitive topics in the user's language
 * Dr.Dee shows empathy and care when sensitive topics are detected
 */
export function getSensitiveTopicResponse(languageCode: LanguageCode, userMessage: string): string {
  // Extract key point to reference in response
  const keyPoint = extractKeyPoints(userMessage);
  
  switch (languageCode) {
    case 'zh':
      return `我注意到你正在分享一些严肃的个人经历。

虽然我通常风格直接，但对于你所经历的这种情况，我想表达真诚的关心。你提到的"${keyPoint}"听起来非常困难，任何人面对这种情况都会感到痛苦。

这种经历需要专业的支持和理解。你愿意考虑与专业心理咨询师交流吗？他们有专门的训练来提供你现在可能需要的支持。

记住，寻求帮助是勇气和力量的表现，而不是弱点。`;

    case 'zh_TW':
      return `我注意到你正在分享一些嚴肅的個人經歷。

雖然我通常風格直接，但對於你所經歷的這種情況，我想表達真誠的關心。你提到的"${keyPoint}"聽起來非常困難，任何人面對這種情況都會感到痛苦。

這種經歷需要專業的支持和理解。你願意考慮與專業心理諮詢師交流嗎？他們有專門的訓練來提供你現在可能需要的支持。

記住，尋求幫助是勇氣和力量的表現，而不是弱點。`;

    case 'es':
      return `Noto que estás compartiendo algunas experiencias personales serias.

Aunque mi estilo suele ser directo, quiero expresar una genuina preocupación por lo que estás pasando. Lo que has mencionado sobre "${keyPoint}" suena increíblemente difícil, y cualquiera lucharía en esta situación.

Este tipo de experiencia merece apoyo profesional y comprensión. ¿Considerarías hablar con un consejero calificado? Están específicamente capacitados para brindar el tipo de apoyo que podrías necesitar en este momento.

Recuerda, buscar ayuda es señal de valentía y fortaleza, no de debilidad.`;

    case 'fr':
      return `Je remarque que tu partages des expériences personnelles graves.

Bien que mon style soit généralement direct, je tiens à exprimer une préoccupation sincère pour ce que tu traverses. Ce que tu as mentionné à propos de "${keyPoint}" semble incroyablement difficile, et n'importe qui serait en difficulté dans cette situation.

Ce genre d'expérience mérite un soutien professionnel et de la compréhension. Envisagerais-tu de parler à un conseiller qualifié ? Ils sont spécifiquement formés pour fournir le type de soutien dont tu pourrais avoir besoin en ce moment.

Souviens-toi, chercher de l'aide est un signe de courage et de force, pas de faiblesse.`;

    case 'de':
      return `Ich bemerke, dass du einige ernsthafte persönliche Erfahrungen teilst.

Obwohl mein Stil in der Regel direkt ist, möchte ich aufrichtige Besorgnis für das ausdrücken, was du durchmachst. Was du über "${keyPoint}" erwähnt hast, klingt unglaublich schwierig, und jeder würde in dieser Situation kämpfen.

Diese Art von Erfahrung verdient professionelle Unterstützung und Verständnis. Würdest du in Betracht ziehen, mit einem qualifizierten Berater zu sprechen? Sie sind speziell ausgebildet, um die Art von Unterstützung zu bieten, die du gerade benötigen könntest.

Denk daran, Hilfe zu suchen ist ein Zeichen von Mut und Stärke, nicht von Schwäche.`;

    case 'ja':
      return `深刻な個人的な体験を共有されていることに気づきました。

私のスタイルは通常直接的ですが、あなたが経験していることに対して心から心配していることを伝えたいと思います。「${keyPoint}」について言及されたことは非常に困難に思え、この状況では誰もが苦労するでしょう。

この種の経験は専門的なサポートと理解に値します。資格のあるカウンセラーと話すことを検討してみませんか？彼らは、今あなたが必要とするかもしれないサポートを提供するために特別に訓練されています。

覚えておいてください、助けを求めることは弱さではなく、勇気と強さの表れです。`;

    case 'ko':
      return `진지한 개인적인 경험을 공유하고 계신 것 같습니다.

평소에 제 스타일은 직접적이지만, 당신이 겪고 있는 일에 대해 진심으로 걱정하고 있다는 것을 전하고 싶습니다. "${keyPoint}"에 대해 언급하신 내용은 정말 힘들어 보이며, 누구라도 이런 상황에서 힘들어할 것입니다.

이런 종류의 경험은 전문적인 지원과 이해가 필요합니다. 자격을 갖춘 상담사와 대화하는 것을 고려해 보시겠어요? 그들은 지금 당신에게 필요한 지원을 제공하기 위해 특별히 훈련받았습니다.

도움을 구하는 것은 약함이 아니라 용기와 강함의 표시라는 것을 기억하세요.`;

    default: // Default to English
      return `I notice you're sharing some serious personal experiences.

While my style is typically direct, I want to express genuine concern for what you're going through. What you've mentioned about "${keyPoint}" sounds incredibly difficult, and anyone would struggle in this situation.

This kind of experience deserves professional support and understanding. Would you consider speaking with a qualified counselor? They're specifically trained to provide the kind of support you might need right now.

Remember, seeking help is a sign of courage and strength, not weakness.`;
  }
}