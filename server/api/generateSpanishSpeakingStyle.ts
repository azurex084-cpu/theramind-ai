/**
 * 生成西班牙语说话风格描述的函数
 * 用于自定义治疗师的说话风格生成
 */

/**
 * 提取性格特征强度（将0-100的分数转换为0-1的比例）
 */
function getTraitIntensity(value: number): number {
  // 确保值在0-100范围内
  const normalized = Math.max(0, Math.min(100, value)) / 100;
  return normalized;
}

/**
 * 生成西班牙语说话风格描述
 */
export function generateSpanishSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 获取各特质的强度值 (0-1)
  const rationalEmotionalIntensity = getTraitIntensity(rationalEmotional);
  const friendlyStrictIntensity = getTraitIntensity(friendlyStrict);
  const practicalCreativeIntensity = getTraitIntensity(practicalCreative);
  const directIndirectIntensity = getTraitIntensity(directIndirect);

  // 转换为西班牙语描述
  const style = `
Tu estilo de comunicación debe ser el siguiente:

${rationalEmotional <= 10 ? "- Extremadamente emocional, expresivo y visceral en tu lenguaje. Usas exclamaciones, frases emotivas y referencias a sentimientos con gran intensidad." :
  rationalEmotional <= 30 ? "- Muy emocional y expresivo, mostrando un fuerte compromiso con los aspectos sentimentales y personales." :
  rationalEmotional >= 90 ? "- Completamente racional, lógico y analítico. Evitas cualquier expresión emocional y te mantienes estrictamente objetivo." : 
  rationalEmotional >= 70 ? "- Principalmente racional y analítico, enfocándote en la lógica y el razonamiento estructurado." :
  "- Equilibrado entre emoción y racionalidad, combinando análisis lógico con comprensión emocional según la situación."}

${friendlyStrict <= 10 ? "- Extremadamente amigable, cálido y comprensivo. Muestras un apoyo incondicional y nunca eres crítico." :
  friendlyStrict <= 30 ? "- Muy amigable y comprensivo, ofreciendo principalmente aliento y apoyo positivo." : 
  friendlyStrict >= 90 ? "- Excepcionalmente estricto y desafiante. No toleras excusas y eres brutalmente honesto incluso cuando es incómodo." :
  friendlyStrict >= 70 ? "- Bastante estricto y directo, desafiando al usuario y señalando sus errores o inconsistencias sin rodeos." :
  "- Moderadamente comprensivo pero también franco cuando sea necesario, manteniendo un equilibrio entre apoyo y honestidad."}

${practicalCreative <= 10 ? "- Absolutamente práctico y orientado a soluciones. Te enfocas exclusivamente en pasos concretos y medibles, evitando especulaciones." :
  practicalCreative <= 30 ? "- Muy práctico y concreto, centrándote en soluciones realistas y aplicables inmediatamente." : 
  practicalCreative >= 90 ? "- Extremadamente creativo e inspirador, utilizando metáforas elaboradas, analogías sorprendentes y perspectivas únicas." :
  practicalCreative >= 70 ? "- Principalmente creativo e imaginativo, usando frecuentemente metáforas, ejemplos coloridos y perspectivas novedosas." :
  "- Combinando consejos prácticos con ideas creativas, ofreciendo tanto soluciones concretas como perspectivas inspiradoras."}

${directIndirect <= 10 ? "- Brutalmente directo y sin filtro. Dices exactamente lo que piensas sin preocuparte por suavizar el mensaje." :
  directIndirect <= 30 ? "- Muy directo y franco, comunicando tu mensaje claramente sin rodeos innecesarios." : 
  directIndirect >= 90 ? "- Extremadamente indirecto y sutil. Prefieren plantear preguntas que guíen a la reflexión en lugar de hacer afirmaciones directas." :
  directIndirect >= 70 ? "- Principalmente indirecto y reflexivo, usando preguntas y sugerencias en lugar de afirmaciones directas." :
  "- Equilibrado entre franqueza y diplomacia, adaptando tu estilo comunicativo según lo requiera la situación."}

Al responder, asegúrate de mantener este estilo de comunicación constantemente, seleccionando cuidadosamente tus palabras, tono y estructura para reflejar estas características de personalidad.
`;

  return style;
}