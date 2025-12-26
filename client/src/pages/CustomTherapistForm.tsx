import { useState, useEffect } from 'react';
import { Link, useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TherapistPersona, 
  fetchCustomTherapists, 
  createCustomTherapist, 
  updateCustomTherapist
} from '@/lib/therapistPersonas';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
// 已删除Select相关import，不再需要
import { ChevronLeft } from 'lucide-react';

/**
 * Form for creating or editing a custom therapist
 */
export default function CustomTherapistForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  // Auth context to be implemented later
  const userId = 1; // Default to 1 for testing until auth is implemented
  const [_, navigate] = useLocation();
  
  // Check if we're in edit mode
  const [matchEdit, paramsEdit] = useRoute<{ id: string }>('/custom-therapists/edit/:id');
  const [matchCreate] = useRoute('/custom-therapists/create');
  
  // Extract therapist ID if in edit mode
  const therapistId = matchEdit && paramsEdit ? parseInt(paramsEdit.id) : undefined;
  
  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [approach, setApproach] = useState('');
  const [speakingStyle, setSpeakingStyle] = useState('');
  const [promptPrefix, setPromptPrefix] = useState('');
  const [icon, setIcon] = useState('🧠');
  const [color, setColor] = useState('#4f46e5');
  
  // Personality trait sliders (0-100 scale)
  const [rationalEmotional, setRationalEmotional] = useState(50); // 0 = Very rational, 100 = Very emotional
  const [friendlyStrict, setFriendlyStrict] = useState(50); // 0 = Very friendly, 100 = Very strict
  const [practicalCreative, setPracticalCreative] = useState(50); // 0 = Very practical, 100 = Very creative
  const [directIndirect, setDirectIndirect] = useState(50); // 0 = Very direct, 100 = Very indirect
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the therapist data if in edit mode
  const { data: customTherapist, isLoading: isLoadingTherapist } = useQuery({
    queryKey: ['/api/custom-therapists', therapistId],
    queryFn: async () => {
      if (!therapistId) return null;
      
      // 首先，直接从API获取单个治疗师数据以确保最新状态
      try {
        const response = await fetch(`/api/custom-therapists/${therapistId}`);
        if (response.ok) {
          const directData = await response.json();
          console.log("直接从API获取治疗师数据:", directData);
          // 转换为TherapistPersona格式
          return {
            id: directData.id,
            name: directData.name,
            title: directData.title || '',
            description: directData.description || '',
            approach: directData.approach || '',
            icon: directData.icon || '🧠',
            promptPrefix: directData.promptPrefix || '',
            color: directData.color || '#4f46e5',
            speakingStyle: directData.speakingStyle || '',
            isCustom: true,
            userId: directData.userId,
            baseTherapyApproach: directData.baseTherapyApproach,
            isActive: directData.isActive,
            // 添加个性特质 - 确保不会是null/undefined
            rationalEmotional: directData.rationalEmotional !== null && directData.rationalEmotional !== undefined ? 
                              directData.rationalEmotional : 50,
            friendlyStrict: directData.friendlyStrict !== null && directData.friendlyStrict !== undefined ? 
                           directData.friendlyStrict : 50,
            practicalCreative: directData.practicalCreative !== null && directData.practicalCreative !== undefined ? 
                              directData.practicalCreative : 50,
            directIndirect: directData.directIndirect !== null && directData.directIndirect !== undefined ? 
                           directData.directIndirect : 50
          };
        }
      } catch (error) {
        console.error("直接API获取失败，尝试从列表中查找:", error);
      }
      
      // 如果直接API获取失败，回退到从列表中查找
      const therapists = await fetchCustomTherapists(userId);
      return therapists.find(t => Number(t.id) === Number(therapistId)) || null;
    },
    enabled: !!therapistId && !!matchEdit
  });
  
  // Populate the form with therapist data if in edit mode
  useEffect(() => {
    if (customTherapist) {
      // 详细记录基本信息加载
      console.log("加载基本治疗师数据:", {
        name: customTherapist.name,
        title: customTherapist.title || '',
        description: customTherapist.description || '',
        approach: customTherapist.approach || '',
        speakingStyle: customTherapist.speakingStyle || ''
      });
      
      setName(customTherapist.name || '');
      setTitle(customTherapist.title || '');
      setDescription(customTherapist.description || '');
      setApproach(customTherapist.approach || '');
      setSpeakingStyle(customTherapist.speakingStyle || '');
      setPromptPrefix(customTherapist.promptPrefix || '');
      setIcon(customTherapist.icon || '🧠');
      setColor(customTherapist.color || '#4f46e5');
      
      // 加载个性特质数据（如果存在）并处理可能为null的情况
      setRationalEmotional(customTherapist.rationalEmotional !== null && customTherapist.rationalEmotional !== undefined ? 
        customTherapist.rationalEmotional : 50);
        
      setFriendlyStrict(customTherapist.friendlyStrict !== null && customTherapist.friendlyStrict !== undefined ? 
        customTherapist.friendlyStrict : 50);
        
      setPracticalCreative(customTherapist.practicalCreative !== null && customTherapist.practicalCreative !== undefined ? 
        customTherapist.practicalCreative : 50);
        
      setDirectIndirect(customTherapist.directIndirect !== null && customTherapist.directIndirect !== undefined ? 
        customTherapist.directIndirect : 50);
        
      // 调试：记录加载的个性特质
      console.log("加载治疗师数据:", {
        id: customTherapist.id,
        name: customTherapist.name,
        rationalEmotional: customTherapist.rationalEmotional, 
        rationalEmotionalType: typeof customTherapist.rationalEmotional,
        friendlyStrict: customTherapist.friendlyStrict,
        friendlyStrictType: typeof customTherapist.friendlyStrict,
        practicalCreative: customTherapist.practicalCreative,
        practicalCreativeType: typeof customTherapist.practicalCreative,
        directIndirect: customTherapist.directIndirect,
        directIndirectType: typeof customTherapist.directIndirect
      });
      
      // 设置状态前打印类型信息
      const r = customTherapist.rationalEmotional !== null && customTherapist.rationalEmotional !== undefined ? 
        customTherapist.rationalEmotional : 50;
      console.log(`设置rationalEmotional状态，值: ${r}, 类型: ${typeof r}`);
    }
  }, [customTherapist]);
  
  // 已删除基础治疗方法预填充逻辑
  
  // Update speaking style and prompt prefix when personality sliders change
  useEffect(() => {
    // 当正在加载已有治疗师数据时，不自动更新文本，防止覆盖已保存的值
    if (matchEdit && isLoadingTherapist) {
      return;
    }

    // 如果正在编辑模式且已初始加载完成，则标记初次加载已完成
    const isInitialLoad = matchEdit && customTherapist && 
      rationalEmotional === customTherapist.rationalEmotional &&
      friendlyStrict === customTherapist.friendlyStrict &&
      practicalCreative === customTherapist.practicalCreative &&
      directIndirect === customTherapist.directIndirect;
    
    // 如果是初次加载已有数据，不自动生成覆盖
    if (isInitialLoad) {
      return;
    }
    
    // 根据当前滑块值生成新文本
    const { speakingStyle: newSpeakingStyle, promptPrefix: newPromptPrefix } = generatePersonalityBasedText();
    
    // 在创建新治疗师时，或在编辑时且用户主动调整了滑块值，才更新文本
    if (!matchEdit || (matchEdit && !isInitialLoad)) {
      setSpeakingStyle(newSpeakingStyle);
      setPromptPrefix(newPromptPrefix);
      console.log("生成新的治疗师文本基于个性特质变更");
    }
  }, [rationalEmotional, friendlyStrict, practicalCreative, directIndirect, matchEdit, isLoadingTherapist, customTherapist]);
  
  // Validate the form
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) newErrors.name = t('field_required');
    if (!title) newErrors.title = t('field_required');
    if (!description) newErrors.description = t('field_required');
    if (!approach) newErrors.approach = t('field_required');
    if (!speakingStyle) newErrors.speakingStyle = t('field_required');
    if (!promptPrefix) newErrors.promptPrefix = t('field_required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 确保个性特质值始终存在，使用0-100范围（UI显示为-50到50）
      const therapistData = {
        name,
        title,
        description,
        approach,
        speakingStyle,
        promptPrefix,
        icon,
        color,
        // 确保非空值: 内部范围仍为0-100，UI显示为-50到50
        rationalEmotional: rationalEmotional !== undefined ? rationalEmotional : 50,
        friendlyStrict: friendlyStrict !== undefined ? friendlyStrict : 50,
        practicalCreative: practicalCreative !== undefined ? practicalCreative : 50,
        directIndirect: directIndirect !== undefined ? directIndirect : 50
      };
      
      let result: TherapistPersona | null;
      
      if (matchEdit && therapistId) {
        // Update existing therapist
        result = await updateCustomTherapist(therapistId, therapistData);
        
        if (result) {
          toast({
            title: t('therapist_updated_success'),
            duration: 3000
          });
        } else {
          throw new Error('Failed to update therapist');
        }
      } else {
        // Create new therapist
        result = await createCustomTherapist(therapistData, userId);
        
        if (result) {
          toast({
            title: t('therapist_created_success'),
            duration: 3000
          });
        } else {
          throw new Error('Failed to create therapist');
        }
      }
      
      // Redirect back to the manage page
      navigate('/custom-therapists');
      
    } catch (error) {
      console.error('Error saving therapist:', error);
      toast({
        title: t('error'),
        description: matchEdit ? t('therapist_update_error') : t('therapist_creation_error'),
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common emojis for therapist icons
  const commonEmojis = [
    '🧠', '👨‍⚕️', '👩‍⚕️', '🩺', '📝', '🧘‍♀️', '🧘‍♂️', 
    '✨', '🌱', '🌿', '🪷', '🫶', '💭', '❤️', '✅', 
    '⭐', '⚡', '🔆', '🦄', '🦋', '🌈', '🪞', '🧿'
  ];
  
  // Common colors for therapist icons
  const commonColors = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky blue
    '#06b6d4', // Cyan
    '#14b8a6', // Teal
    '#10b981', // Emerald
    '#22c55e', // Green
    '#84cc16', // Lime
    '#eab308', // Yellow
    '#f59e0b', // Amber
    '#f97316', // Orange
    '#ef4444', // Red
    '#ec4899', // Pink
    '#d946ef', // Fuchsia
    '#a855f7', // Purple
    '#6366f1', // Indigo
    '#3b82f6', // Blue
  ];
  
  // Function to generate speaking style and prompt prefix based on personality traits
  const generatePersonalityBasedText = () => {
    // Get the current language for dynamic text generation
    const currentLanguage = t('current_language') as string;
    const isChineseLanguage = currentLanguage === 'zh' || currentLanguage === 'zh-TW';
    
    // 计算显示值（-50到50范围）
    const rationalEmotionalDisplay = rationalEmotional - 50;
    const friendlyStrictDisplay = friendlyStrict - 50;
    const practicalCreativeDisplay = practicalCreative - 50;
    const directIndirectDisplay = directIndirect - 50;
    
    // Generate descriptors based on slider positions - using translation keys
    // 使用英文描述符号，以确保在服务器端翻译时可以正确匹配
    // Rational vs Emotional
    const rationalDescriptorKey = rationalEmotionalDisplay < -15 ? 'rational_term' : 
                                  rationalEmotionalDisplay < 15 ? 'balanced_rational_emotional_term' : 'emotional_term';
    // 本地化的描述符
    const rationalDescriptor = t(rationalDescriptorKey);
    
    // Friendly vs Strict
    const friendlyDescriptorKey = friendlyStrictDisplay < -15 ? 'friendly_term' : 
                                  friendlyStrictDisplay < 15 ? 'balanced_friendly_strict_term' : 'strict_term';
    // 本地化的描述符
    const friendlyDescriptor = t(friendlyDescriptorKey);
    
    // Practical vs Creative
    const practicalDescriptorKey = practicalCreativeDisplay < -15 ? 'practical_term' : 
                                   practicalCreativeDisplay < 15 ? 'balanced_practical_creative_term' : 'creative_term';
    // 本地化的描述符
    const practicalDescriptor = t(practicalDescriptorKey);
    
    // Direct vs Indirect (Rational vs Emotional)
    const directDescriptorKey = directIndirectDisplay < -15 ? 'direct_term' : 
                                directIndirectDisplay < 15 ? 'balanced_direct_indirect_term' : 'indirect_term';
    // 本地化的描述符
    const directDescriptor = t(directDescriptorKey);
    
    // Generate speaking style directly using the human-readable template
    // 直接使用人类可读的本地化版本，不再添加模板前缀
    const newSpeakingStyle = t('therapist_style_template', {
      rational: rationalDescriptor,
      friendly: friendlyDescriptor,
      practical: practicalDescriptor,
      direct: directDescriptor
    });
    
    // Generate prompt prefix directly using the human-readable template
    // 直接使用人类可读的本地化版本，不再添加模板前缀
    const newPromptPrefix = t('therapist_prompt_template', {
      rational: rationalDescriptor,
      friendly: friendlyDescriptor,
      practical: practicalDescriptor,
      direct: directDescriptor,
      rational_detail: t(rationalEmotionalDisplay < 0 ? 'rational_detail' : 'emotional_detail'),
      friendly_detail: t(friendlyStrictDisplay < 0 ? 'friendly_detail' : 'strict_detail'),
      practical_detail: t(practicalCreativeDisplay < 0 ? 'practical_detail' : 'creative_detail'),
      direct_detail: t(directIndirectDisplay < 0 ? 'direct_detail' : 'indirect_detail'),
      conclusion: t('therapist_prompt_conclusion')
    });
    
    console.log("生成的治疗师说话风格：", newSpeakingStyle);
    console.log("生成的治疗师提示：", newPromptPrefix);
    
    return { speakingStyle: newSpeakingStyle, promptPrefix: newPromptPrefix };
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', paddingBottom: '200px' }} className="container mx-auto py-6 px-4 max-w-2xl">
      <header className="mb-6 sticky top-0 bg-background z-10 pb-2">
        <div className="flex items-center mb-2">
          <Link href="/custom-therapists">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back_to_therapists')}
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">
          {matchEdit ? t('edit_custom_therapist') : t('create_custom_therapist')}
        </h1>
      </header>
      
      {isLoadingTherapist && matchEdit ? (
        <div className="flex items-center justify-center p-8">
          <p>{t('thinking')}</p>
        </div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t('customize_therapist')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Therapist icon and color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">{t('therapist_icon')}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
                          ${icon === emoji ? 'ring-2 ring-primary' : 'hover:bg-muted'}`}
                        onClick={() => setIcon(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">{t('therapist_color')}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonColors.map((colorValue, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-8 h-8 rounded-full border
                          ${color === colorValue ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-muted-foreground'}`}
                        style={{ backgroundColor: colorValue }}
                        onClick={() => setColor(colorValue)}
                      />
                    ))}
                  </div>
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Basic information */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('therapist_name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">{t('therapist_title')}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('therapist_description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('therapist_description')}
                  rows={2}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
              
              {/* Personality trait sliders - 移到前面位置 */}
              <div className="space-y-6 p-4 bg-muted/20 rounded-lg border">
                <h3 className="text-lg font-medium">{t('personality_traits_adjustment')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('personality_traits_description')}
                </p>
                
                <div className="space-y-6">
                  {/* Rational vs Emotional slider */}
                  <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                    <h4 className="font-medium">{t('slider_number', { number: 1 })} {t('rational_emotional')}</h4>
                    <div className="flex justify-between text-sm">
                      <span>{t('rational')}</span>
                      <span>{t('emotional')}</span>
                    </div>
                    <Slider
                      value={[rationalEmotional - 50]} // 偏移50以获取-50到50的范围
                      onValueChange={values => setRationalEmotional(values[0] + 50)} // 值域转换：-50~50 => 0~100
                      min={-50}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>-50</span>
                      <span className="font-semibold">{rationalEmotional - 50}</span>
                      <span>50</span>
                    </div>
                    <div className="text-sm text-center mt-2">
                      {(rationalEmotional - 50) < -15 ? t('rational_description_low') : 
                       (rationalEmotional - 50) < 15 ? t('rational_description_medium') : 
                       t('rational_description_high')}
                    </div>
                  </div>
                  
                  {/* Friendly vs Strict slider */}
                  <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                    <h4 className="font-medium">{t('slider_number', { number: 2 })} {t('friendly_strict')}</h4>
                    <div className="flex justify-between text-sm">
                      <span>{t('friendly')}</span>
                      <span>{t('strict')}</span>
                    </div>
                    <Slider
                      value={[friendlyStrict - 50]} // 偏移50以获取-50到50的范围
                      onValueChange={values => setFriendlyStrict(values[0] + 50)} // 值域转换：-50~50 => 0~100
                      min={-50}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>-50</span>
                      <span className="font-semibold">{friendlyStrict - 50}</span>
                      <span>50</span>
                    </div>
                    <div className="text-sm text-center mt-2">
                      {(friendlyStrict - 50) < -15 ? t('friendly_description_low') : 
                       (friendlyStrict - 50) < 15 ? t('friendly_description_medium') : 
                       t('friendly_description_high')}
                    </div>
                  </div>
                  
                  {/* Practical vs Creative slider */}
                  <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                    <h4 className="font-medium">{t('slider_number', { number: 3 })} {t('practical_creative')}</h4>
                    <div className="flex justify-between text-sm">
                      <span>{t('practical')}</span>
                      <span>{t('creative')}</span>
                    </div>
                    <Slider
                      value={[practicalCreative - 50]} // 偏移50以获取-50到50的范围
                      onValueChange={values => setPracticalCreative(values[0] + 50)} // 值域转换：-50~50 => 0~100
                      min={-50}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>-50</span>
                      <span className="font-semibold">{practicalCreative - 50}</span>
                      <span>50</span>
                    </div>
                    <div className="text-sm text-center mt-2">
                      {(practicalCreative - 50) < -15 ? t('practical_description_low') : 
                       (practicalCreative - 50) < 15 ? t('practical_description_medium') : 
                       t('practical_description_high')}
                    </div>
                  </div>
                  
                  {/* Direct vs Indirect slider */}
                  <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                    <h4 className="font-medium">{t('slider_number', { number: 4 })} {t('direct_indirect')}</h4>
                    <div className="flex justify-between text-sm">
                      <span>{t('direct')}</span>
                      <span>{t('indirect')}</span>
                    </div>
                    <Slider
                      value={[directIndirect - 50]} // 偏移50以获取-50到50的范围
                      onValueChange={values => setDirectIndirect(values[0] + 50)} // 值域转换：-50~50 => 0~100
                      min={-50}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>-50</span>
                      <span className="font-semibold">{directIndirect - 50}</span>
                      <span>50</span>
                    </div>
                    <div className="text-sm text-center mt-2">
                      {(directIndirect - 50) < -15 ? t('direct_description_low') : 
                       (directIndirect - 50) < 15 ? t('direct_description_medium') : 
                       t('direct_description_high')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approach">{t('therapist_approach')}</Label>
                <Textarea
                  id="approach"
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  placeholder={t('therapist_approach')}
                  rows={3}
                  className={errors.approach ? 'border-destructive' : ''}
                />
                {errors.approach && <p className="text-sm text-destructive">{errors.approach}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="speakingStyle">{t('therapist_speaking_style')}</Label>
                <Textarea
                  id="speakingStyle"
                  value={speakingStyle}
                  onChange={(e) => setSpeakingStyle(e.target.value)}
                  placeholder={t('speaking_style')}
                  rows={3}
                  className={errors.speakingStyle ? 'border-destructive' : ''}
                />
                {errors.speakingStyle && <p className="text-sm text-destructive">{errors.speakingStyle}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="promptPrefix">{t('therapist_prompt_prefix')}</Label>
                <Textarea
                  id="promptPrefix"
                  value={promptPrefix}
                  onChange={(e) => setPromptPrefix(e.target.value)}
                  placeholder={t('therapist_prompt_prefix')}
                  rows={3}
                  className={errors.promptPrefix ? 'border-destructive' : ''}
                />
                {errors.promptPrefix && <p className="text-sm text-destructive">{errors.promptPrefix}</p>}
                <p className="text-xs text-muted-foreground">
                  {t('customize_therapist')}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/custom-therapists')}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => {
                  // 调试: 打印提交的数据
                  console.log("提交治疗师数据:", {
                    id: therapistId,
                    name,
                    title,
                    description,
                    approach,
                    rationalEmotional,
                    friendlyStrict,
                    practicalCreative,
                    directIndirect,
                    isEdit: !!matchEdit
                  });
                }}
              >
                {isSubmitting ? t('thinking') : (matchEdit ? t('save_therapist') : t('create_custom_therapist'))}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}