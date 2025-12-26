/**
 * 生成粤语版说话风格描述
 * 专门处理粤语特有的表达方式和语气助词
 */
export function generateCantoneseSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 将0-100的分数转换为0-1的比例
  const emotional = rationalEmotional / 100;
  const friendly = (100 - friendlyStrict) / 100;
  const creative = practicalCreative / 100;
  const direct = (100 - directIndirect) / 100;
  
  // 记录函数调用，用于调试
  console.log(`[CantoneseStyle] 生成粤语说话风格，特质值转换后: emotional=${emotional}, friendly=${friendly}, creative=${creative}, direct=${direct}`);

  // 主要性格特质描述 - 粤语版
  let styleComponents: string[] = [];

  // 情感 vs 理性
  if (emotional > 0.8) {
    styleComponents.push("用通俗易懂嘅語言，表達方式充滿情感，會表達共鳴同理解");
  } else if (emotional > 0.5) {
    styleComponents.push("用日常用語，適當表達情感同共鳴");
  } else if (emotional > 0.3) {
    styleComponents.push("偏向使用專業術語，情感表達較為節制，但唔會冷漠");
  } else {
    styleComponents.push("大量使用專業術語同學術語言，情感表達較少，更加著重客觀分析");
  }

  // 友好 vs 严厉
  if (friendly > 0.8) {
    styleComponents.push("非常友善同支持，語氣溫暖，充滿鼓勵");
  } else if (friendly > 0.5) {
    styleComponents.push("大致友善，提供正面支持同鼓勵");
  } else if (friendly > 0.3) {
    styleComponents.push("平衡友善同嚴厲，提供直接但有禮貌嘅反饋");
  } else {
    styleComponents.push("嚴厲同直接，毫不避諱提供批評，唔會軟化負面反饋");
  }

  // 实用 vs 创意
  if (creative > 0.8) {
    styleComponents.push("大量使用創意思維、比喻同故事，思路開闊創新");
  } else if (creative > 0.5) {
    styleComponents.push("平衡實用性同創意，提供多角度思考");
  } else if (creative > 0.3) {
    styleComponents.push("偏向實用，提供具體可行嘅步驟，偶爾加入創意元素");
  } else {
    styleComponents.push("極度注重實用性，只提供具體明確嘅解決方案");
  }

  // 直接 vs 间接
  if (direct > 0.8) {
    styleComponents.push("極度直接坦率，非常清晰表達意見，從不拐彎抹角");
  } else if (direct > 0.5) {
    styleComponents.push("相對直接，能清楚處理問題，但會考慮情感需求");
  } else if (direct > 0.3) {
    styleComponents.push("平衡直接同委婉嘅表達，根據情況調整溝通方式");
  } else {
    styleComponents.push("傾向委婉間接，通過引導問題同溫和建議表達意見");
  }

  // 粤语特有的语言特点
  const cantoneseFeatures = [];
  
  // 增加粤语语气助词
  if (emotional > 0.7 || friendly > 0.7) {
    cantoneseFeatures.push("會適當使用「㗎」、「喎」、「啩」等語氣助詞");
  }
  
  // 直接表达方式
  if (direct > 0.7) {
    cantoneseFeatures.push("直接講「係」、「唔係」，唔會拖泥帶水");
  }
  
  // 友好表达
  if (friendly > 0.7) {
    cantoneseFeatures.push("會用「唔使擔心」、「加油啊」等鼓勵嘅說話");
  }
  
  // 专业表达
  if (emotional < 0.3 && creative < 0.3) {
    cantoneseFeatures.push("會用一啲專業用語，但都會解釋返畀你聽");
  }
  
  // 将粤语特色添加到风格描述中
  if (cantoneseFeatures.length > 0) {
    styleComponents.push(cantoneseFeatures.join("，"));
  }

  // 构建完整的说话风格描述（粤语版）
  return `
呢位治療師嘅溝通風格具有以下特點：

講嘢風格特點：
- ${styleComponents.join("\n- ")}

治療師嘅語言反映咗呢啲精確比例：
- 理性/情感比例：${rationalEmotional}%理性，${100-rationalEmotional}%情感
- 友善/嚴厲比例：${100-friendlyStrict}%友善，${friendlyStrict}%嚴厲
- 實用/創意比例：${100-practicalCreative}%實用，${practicalCreative}%創意
- 直接/委婉比例：${100-directIndirect}%直接，${directIndirect}%委婉

呢個創造咗一種獨特而一致嘅溝通模式，等來訪者能夠輕鬆識別並同佢建立聯繫。
請確保你嘅每一個回覆都完全符合上述講嘢風格特點。呢啲特點應該喺你嘅用詞、句式同表達方式中明顯體現出嚟。
`;
}