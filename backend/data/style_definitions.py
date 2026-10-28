from typing import Dict, List, Any

# 10 Interior Design Styles with rich architectural characteristics
DESIGN_STYLES: List[Dict[str, Any]] = [
    {
        "id": "modern-minimalist",
        "name": "Modern Minimalist",
        "tagline": "Purity, function, and restrained elegance",
        "description": "Emphasizes sleek straight lines, a monochromatic base, concealed storage, uncluttered surfaces, and sculptural furniture pieces.",
        "materials": ["Smooth concrete", "Matte black metal", "Tempered glass", "Bleached ash wood"],
        "color_palette_recommendation": ["#F8F9FA", "#E9ECEF", "#ADB5BD", "#343A40"],
        "prompt_keywords": "ultra-modern minimalist interior, razor-sharp clean lines, decluttered architectural space, bespoke hidden cabinetry, floating low-profile furniture, large open floor plan, museum quality lighting, pristine surfaces, high-end Architectural Digest photography",
        "preview_image": "/styles/modern-minimalist.jpg"
    },
    {
        "id": "scandinavian",
        "name": "Scandinavian",
        "tagline": "Airy light, cozy hygge, and organic warmth",
        "description": "Blends light natural woods with soft creams, plush woolen textiles, abundant natural sunlight, and effortless cozy functionality.",
        "materials": ["Light blonde oak", "Woven wool", "Textured linen", "White ceramic"],
        "color_palette_recommendation": ["#FAF7F2", "#EFE9DF", "#D6CBC1", "#5C564E"],
        "prompt_keywords": "scandinavian hygge interior, light blonde oak wood floor and accents, soft off-white limewash walls, textured boucle sofa, woven woolen throw blankets, diffused Nordic morning daylight, potted monstera and olive branches, warm organic minimalism, Kinfolk magazine aesthetic",
        "preview_image": "/styles/scandinavian.jpg"
    },
    {
        "id": "luxury-contemporary",
        "name": "Luxury Contemporary",
        "tagline": "Opulent textures, refined brass, and grand scale",
        "description": "Features Italian marble accents, bespoke curved sofas, rich brushed brass trim, coffered indirect ceiling illumination, and lavish comfort.",
        "materials": ["Calacatta marble", "Brushed champagne brass", "Plush velvet", "Dark smoked oak"],
        "color_palette_recommendation": ["#1A1A1A", "#C5A059", "#E5DCC5", "#3A3845"],
        "prompt_keywords": "luxury contemporary penthouse interior, bookmatched Calacatta marble wall, custom curved velvet sofa, brushed champagne gold metal inlays, smoked glass coffee table, architectural layered cove lighting, 5-star hotel luxury suite, grand proportions, opulent high-end interior design",
        "preview_image": "/styles/luxury-contemporary.jpg"
    },
    {
        "id": "industrial",
        "name": "Industrial",
        "tagline": "Raw brick, structural iron, and vintage loft vibe",
        "description": "Celebrates exposed structural elements, distressed brickwork, matte black iron beams, aged leather sofas, and Edison filament pendants.",
        "materials": ["Weathered red brick", "Blackened iron steel", "Distressed cognac leather", "Polished concrete"],
        "color_palette_recommendation": ["#3E2723", "#212121", "#78909C", "#D7CCC8"],
        "prompt_keywords": "soho industrial loft interior, exposed reclaimed red brick walls, high matte black steel beams, distressed cognac leather Chesterfield sofa, factory warehouse black metal frame windows, warm vintage Edison bulb pendants, polished concrete floors, urban loft styling",
        "preview_image": "/styles/industrial.jpg"
    },
    {
        "id": "bohemian",
        "name": "Bohemian",
        "tagline": "Free-spirited layers, vintage textiles, and rich botany",
        "description": "Vibrant, eclectically layered space featuring Persian and kilim rugs, natural rattan chairs, abundant hanging houseplants, and warm terracotta.",
        "materials": ["Natural rattan & wicker", "Terracotta pottery", "Macrame weaves", "Vintage kilim wool"],
        "color_palette_recommendation": ["#C06C54", "#D8A47F", "#3B5249", "#F3EDE2"],
        "prompt_keywords": "bohemian chic interior sanctuary, layered vintage Moroccan and kilim rugs, hanging macrame planters with pothos and ferns, natural rattan peacock chair, warm terracotta ceramic pottery, textured fringed cushions, warm diffused fairy glow, lush indoor jungle, eclectic warm textures",
        "preview_image": "/styles/bohemian.jpg"
    },
    {
        "id": "japandi",
        "name": "Japandi",
        "tagline": "Japanese wabi-sabi meets Nordic functionality",
        "description": "A harmonious union of Japanese tranquility and Scandinavian warmth: low-slung furniture, shoji paper lanterns, bamboo, and earthy unglazed ceramics.",
        "materials": ["Light hinoki & cedar wood", "Washi paper", "Raw linen", "Handmade stoneware ceramic"],
        "color_palette_recommendation": ["#E8E2D5", "#C8B6A6", "#8D7B68", "#443C37"],
        "prompt_keywords": "serene japandi interior, low platform furniture, natural hinoki cypress woodwork, washi paper pendant lantern, tatami texture, organic imperfect stoneware vases, delicate bonsai or dry branches, muted earthy tones, wabi-sabi philosophy, meditative calm atmosphere",
        "preview_image": "/styles/japandi.jpg"
    },
    {
        "id": "traditional-indian",
        "name": "Traditional Indian",
        "tagline": "Royal heritage, carved teak, and handloom grandeur",
        "description": "Richly ornamented aesthetic with dark hand-carved teakwood, ornate brass urlis, intricate jali screens, block-printed silk cushions, and warm festive ambiance.",
        "materials": ["Carved solid teakwood", "Cast brass & bronze", "Raw silk & brocade", "Terracotta clay"],
        "color_palette_recommendation": ["#9E2A2B", "#E09F3E", "#335C67", "#FFF3B0"],
        "prompt_keywords": "regal traditional Indian interior, handcrafted solid teakwood furniture with brass inlays, intricate floral jali wooden lattice partition, brass hanging temple bells and urlis with floating marigolds, rich handloom silk cushions with zari border, warm amber diya glow, royal heritage haveli decor",
        "preview_image": "/styles/traditional-indian.jpg"
    },
    {
        "id": "eco-friendly",
        "name": "Eco-Friendly",
        "tagline": "Biophilic serenity, circular materials, and living greens",
        "description": "Focuses on living green walls, fast-growing bamboo flooring, reclaimed cedar timbers, natural non-toxic lime plaster, and optimal daylight harvesting.",
        "materials": ["FSC-certified bamboo", "Reclaimed timber", "Organic unbleached cotton", "Live moss & foliage"],
        "color_palette_recommendation": ["#4F6D42", "#8FA97A", "#E4EAD9", "#FAF7F2"],
        "prompt_keywords": "eco-friendly biophilic interior design, lush indoor living moss wall, sustainably harvested bamboo flooring, unbleached organic linen curtains fluttering in gentle breeze, reclaimed driftwood furniture, potted fiddle-leaf fig, bright solar daylight, clean sustainable indoor sanctuary",
        "preview_image": "/styles/eco-friendly.jpg"
    },
    {
        "id": "coastal",
        "name": "Coastal",
        "tagline": "Breezy ocean air, sun-bleached driftwood, and nautical serenity",
        "description": "Reflects the calming seaside with washed linen sofas, bleached driftwood tables, ocean-mist hues, natural jute rugs, and bright sun-soaked windows.",
        "materials": ["Bleached driftwood", "Braided jute rope", "Washed linen", "White painted shiplap"],
        "color_palette_recommendation": ["#E3F2FD", "#90CAF9", "#D7CCC8", "#FFFFFF"],
        "prompt_keywords": "hamptons coastal beach house interior, airy white shiplap walls, washed coastal blue linen sofa, round braided jute rug, sun-bleached driftwood coffee table, sheer white curtains floating with seaside breeze, soft turquoise glass vase, bright sun-drenched coastal sanctuary",
        "preview_image": "/styles/coastal.jpg"
    },
    {
        "id": "modern-farmhouse",
        "name": "Modern Farmhouse",
        "tagline": "Rustic timber beams, black iron hardware, and country charm",
        "description": "Combines historic country warmth with crisp modern lines: rough-hewn ceiling beams, barn doors, deep slipcovered couches, and wrought iron lighting.",
        "materials": ["Reclaimed timber beams", "Wrought black iron", "White painted shiplap", "Neutral textured twill"],
        "color_palette_recommendation": ["#FFFFFF", "#EFEBE9", "#616161", "#8D6E63"],
        "prompt_keywords": "modern farmhouse interior, exposed rough-hewn wooden ceiling beams, crisp white shiplap wall, deep oversized neutral slipcovered sofa, black wrought iron chandelier, sliding barn door with antique hardware, cozy woven basket with throw blankets, sunny pastoral warmth",
        "preview_image": "/styles/modern-farmhouse.jpg"
    }
]

# Quick lookup dict
STYLES_MAP: Dict[str, Dict[str, Any]] = {s["id"]: s for s in DESIGN_STYLES}

# Room types
ROOM_TYPES: List[Dict[str, str]] = [
    {"id": "living-room", "name": "Living Room", "icon": "Sofa"},
    {"id": "bedroom", "name": "Bedroom", "icon": "Bed"},
    {"id": "kitchen", "name": "Kitchen", "icon": "Utensils"},
    {"id": "dining-room", "name": "Dining Room", "icon": "Wine"},
    {"id": "home-office", "name": "Home Office", "icon": "Briefcase"},
    {"id": "bathroom", "name": "Bathroom", "icon": "Bath"},
    {"id": "studio-apartment", "name": "Studio Apartment", "icon": "Home"},
    {"id": "other", "name": "Other Space", "icon": "Sparkles"}
]

# Color palettes
COLOR_PALETTES: List[Dict[str, Any]] = [
    {
        "id": "warm-neutral",
        "name": "Warm Neutral",
        "description": "Warm creams, taupe, soft sand, and natural linen",
        "colors": ["#F5F2EB", "#E8DFD3", "#C5B6A5", "#8C7A6B"]
    },
    {
        "id": "white-and-beige",
        "name": "White & Beige",
        "description": "Clean crisp chalk white paired with gentle oatmeal and biscuit tones",
        "colors": ["#FFFFFF", "#FAF8F5", "#EDE6DC", "#D0C3B4"]
    },
    {
        "id": "sage-green",
        "name": "Sage Green",
        "description": "Calming herbal green tones, eucalyptus, and off-white serenity",
        "colors": ["#EAF1EB", "#C2D4C6", "#6E8D76", "#3D5A45"]
    },
    {
        "id": "earthy-brown",
        "name": "Earthy Brown",
        "description": "Rich terracotta, clay, roasted coffee, and warm timber tones",
        "colors": ["#EAD7C5", "#C8966E", "#8A5A36", "#4E3220"]
    },
    {
        "id": "blue-and-white",
        "name": "Blue & White",
        "description": "Fresh maritime sky blue, deep indigo, and cloud-white accents",
        "colors": ["#F0F7FD", "#B3D4F0", "#4A88BD", "#1F3A5A"]
    },
    {
        "id": "black-and-gold",
        "name": "Black & Gold",
        "description": "Dramatic charcoal, obsidian matte, and radiant champagne brass",
        "colors": ["#1A1A1A", "#333333", "#C5A059", "#DFBA73"]
    },
    {
        "id": "pastel-colors",
        "name": "Pastel Colors",
        "description": "Whimsical powder blush, lavender mist, mint, and soft butter yellow",
        "colors": ["#FCE4EC", "#F3E5F5", "#E8F5E9", "#FFF9C4"]
    },
    {
        "id": "custom",
        "name": "Custom Palette",
        "description": "Personalized custom chosen primary & accent colors",
        "colors": ["#3D5A45", "#DCCEC1", "#FAF8F5", "#1C1E1B"]
    }
]

# Curated High-Quality Sample Room Images (served locally with zero external network failure)
SAMPLE_ROOMS: List[Dict[str, str]] = [
    {
        "id": "sample-living-room",
        "name": "Urban Living Room",
        "type": "living-room",
        "description": "Everyday city living room with standard sofa and plain walls ready for transformation",
        "url": "/samples/sample-living-room.jpg"
    },
    {
        "id": "sample-bedroom",
        "name": "Unfurnished Bedroom",
        "type": "bedroom",
        "description": "Spacious bedroom with natural window light seeking redesign",
        "url": "/samples/sample-bedroom.jpg"
    },
    {
        "id": "sample-kitchen",
        "name": "Classic Kitchen",
        "type": "kitchen",
        "description": "Standard apartment kitchen waiting for contemporary cabinetry and styling",
        "url": "/samples/sample-kitchen.jpg"
    },
    {
        "id": "sample-office",
        "name": "Home Workspace",
        "type": "home-office",
        "description": "Compact home office with plain desk asking for ergonomic and aesthetic overhaul",
        "url": "/samples/sample-office.jpg"
    }
]
