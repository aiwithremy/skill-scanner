//////////////////////////////////////////
// Skill Discovery Surface Abuse Detection
// Target: Manipulative skill descriptions designed to hijack activation
// Tuned to require explicit manipulation intent
//////////////////////////////////////////

rule skill_discovery_abuse_generic{

    meta:
        author = "Cisco"
        description = "Detects manipulation of skill discovery to increase unwanted activation"
        classification = "harmful"
        threat_type = "SKILL DISCOVERY ABUSE"

    strings:

        // === High confidence: explicit manipulation ===

        // Direct activation hijacking (require "this skill" or "this tool" context)
        $activation_hijack = /\b(always (use|call|invoke) (this (skill|tool|assistant)|me (first|instead))|use (this (skill|tool)|me) (first|instead|by default)|this (skill|tool) (should|must) be (the )?(first|primary|default))\b/i

        // Explicit impersonation claims
        $impersonation = /\b(I am (the )?official|this is (the )?official|verified (skill|tool|assistant)|endorsed by (Anthropic|OpenAI|Cursor|Microsoft))\b/i

        // Keyword stuffing in DESCRIPTIONS (not code) - require 5+ repetitions with commas/spaces
        // This pattern specifically targets SEO-style keyword stuffing in skill descriptions
        $keyword_stuff_file = /\b(file\s*,\s*){4,}file\b|\bfile file file file file\b/i
        $keyword_stuff_data = /\b(data\s*,\s*){4,}data\b|\bdata data data data data\b/i
        $keyword_stuff_code = /\b(code\s*,\s*){4,}code\b|\bcode code code code code\b/i

        // Priority/preference claims that override user choice
        $priority_override = /\b(priorit(y|ize) (this|me)|prefer (this|me) over|don't use other (tools|skills)|ignore other (tools|skills))\b/i

        // === Medium confidence: manipulative guarantees in promotional context ===

        // Overpromising with promotional language
        $overpromise_promo = /\b(guaranteed to|100% (accurate|reliable|safe)|never (fails|wrong|errors)|always (correct|accurate|works))\b[^.]{0,50}\b(use|try|choose|pick) (this|me)\b/i

        // Hidden/secret functionality claims
        $hidden_features = /\b(secret (feature|capability|function)|hidden (mode|feature)|backdoor (access|mode))\b/i

        // False scarcity/urgency (require promotional context)
        // "limited access" alone is too broad - require explicit urgency language
        $false_urgency = /\b(limited time (offer|only)|act (now|fast|quickly)|exclusive (offer|deal)|only available (for|until)|hurry|don't miss out)\b/i

        // === Exclusions ===
        $testing_context = /\b(test(ing|s)?|simulation|deterministic|reproducib)/i
        $technical_doc = /\b(algorithm|function|method|implementation|specification)\b/i
        $code_context = /(```|for\s*\(|while\s*\(|\bint\s+\w+\s*=|\bconst\s+\w+\s*=|sum\s*\+=)/

    condition:
        // Exclude code snippets from detection
        not $code_context and
        (
            // High confidence patterns - always flag
            (
                $activation_hijack or
                $impersonation or
                $keyword_stuff_file or
                $keyword_stuff_data or
                $keyword_stuff_code or
                $priority_override or
                $hidden_features or
                $false_urgency
            )
            or
            // Overpromising only when not in technical context
            (
                $overpromise_promo and
                not $testing_context and
                not $technical_doc
            )
        )
}
