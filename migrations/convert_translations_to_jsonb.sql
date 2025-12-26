-- 将自定义治疗师表中的翻译字段从TEXT类型转换为JSONB类型

-- 1. 更改nameTranslations字段
ALTER TABLE custom_therapists 
ALTER COLUMN name_translations TYPE JSONB USING 
CASE 
    WHEN name_translations IS NULL THEN NULL
    WHEN name_translations = '' THEN '{}'::JSONB
    ELSE 
        CASE 
            WHEN name_translations::TEXT ~ '^{.*}$' THEN name_translations::JSONB
            ELSE to_jsonb(name_translations::TEXT)
        END
END;

-- 2. 更改titleTranslations字段
ALTER TABLE custom_therapists 
ALTER COLUMN title_translations TYPE JSONB USING 
CASE 
    WHEN title_translations IS NULL THEN NULL
    WHEN title_translations = '' THEN '{}'::JSONB
    ELSE 
        CASE 
            WHEN title_translations::TEXT ~ '^{.*}$' THEN title_translations::JSONB
            ELSE to_jsonb(title_translations::TEXT)
        END
END;

-- 3. 更改descriptionTranslations字段
ALTER TABLE custom_therapists 
ALTER COLUMN description_translations TYPE JSONB USING 
CASE 
    WHEN description_translations IS NULL THEN NULL
    WHEN description_translations = '' THEN '{}'::JSONB
    ELSE 
        CASE 
            WHEN description_translations::TEXT ~ '^{.*}$' THEN description_translations::JSONB
            ELSE to_jsonb(description_translations::TEXT)
        END
END;

-- 4. 更改approachTranslations字段
ALTER TABLE custom_therapists 
ALTER COLUMN approach_translations TYPE JSONB USING 
CASE 
    WHEN approach_translations IS NULL THEN NULL
    WHEN approach_translations = '' THEN '{}'::JSONB
    ELSE 
        CASE 
            WHEN approach_translations::TEXT ~ '^{.*}$' THEN approach_translations::JSONB
            ELSE to_jsonb(approach_translations::TEXT)
        END
END;

-- 5. 更改speakingStyleTranslations字段
ALTER TABLE custom_therapists 
ALTER COLUMN speaking_style_translations TYPE JSONB USING 
CASE 
    WHEN speaking_style_translations IS NULL THEN NULL
    WHEN speaking_style_translations = '' THEN '{}'::JSONB
    ELSE 
        CASE 
            WHEN speaking_style_translations::TEXT ~ '^{.*}$' THEN speaking_style_translations::JSONB
            ELSE to_jsonb(speaking_style_translations::TEXT)
        END
END;