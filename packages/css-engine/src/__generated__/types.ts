export type Property =
  | "WebkitFontSmoothing"
  | "MozOsxFontSmoothing"
  | "accentColor"
  | "alignContent"
  | "alignItems"
  | "alignSelf"
  | "alignTracks"
  | "animationComposition"
  | "animationDelay"
  | "animationDirection"
  | "animationDuration"
  | "animationFillMode"
  | "animationIterationCount"
  | "animationName"
  | "animationPlayState"
  | "animationTimingFunction"
  | "animationTimeline"
  | "appearance"
  | "aspectRatio"
  | "backdropFilter"
  | "backfaceVisibility"
  | "backgroundAttachment"
  | "backgroundBlendMode"
  | "backgroundClip"
  | "backgroundColor"
  | "backgroundImage"
  | "backgroundOrigin"
  | "backgroundPosition"
  | "backgroundPositionX"
  | "backgroundPositionY"
  | "backgroundRepeat"
  | "backgroundSize"
  | "blockOverflow"
  | "blockSize"
  | "borderBlockColor"
  | "borderBlockStyle"
  | "borderBlockWidth"
  | "borderBlockEndColor"
  | "borderBlockEndStyle"
  | "borderBlockEndWidth"
  | "borderBlockStartColor"
  | "borderBlockStartStyle"
  | "borderBlockStartWidth"
  | "borderBottomColor"
  | "borderBottomLeftRadius"
  | "borderBottomRightRadius"
  | "borderBottomStyle"
  | "borderBottomWidth"
  | "borderCollapse"
  | "borderEndEndRadius"
  | "borderEndStartRadius"
  | "borderImageOutset"
  | "borderImageRepeat"
  | "borderImageSlice"
  | "borderImageSource"
  | "borderImageWidth"
  | "borderInlineColor"
  | "borderInlineStyle"
  | "borderInlineWidth"
  | "borderInlineEndColor"
  | "borderInlineEndStyle"
  | "borderInlineEndWidth"
  | "borderInlineStartColor"
  | "borderInlineStartStyle"
  | "borderInlineStartWidth"
  | "borderLeftColor"
  | "borderLeftStyle"
  | "borderLeftWidth"
  | "borderRightColor"
  | "borderRightStyle"
  | "borderRightWidth"
  | "borderSpacing"
  | "borderStartEndRadius"
  | "borderStartStartRadius"
  | "borderTopColor"
  | "borderTopLeftRadius"
  | "borderTopRightRadius"
  | "borderTopStyle"
  | "borderTopWidth"
  | "bottom"
  | "boxDecorationBreak"
  | "boxShadow"
  | "boxSizing"
  | "breakAfter"
  | "breakBefore"
  | "breakInside"
  | "captionSide"
  | "caretColor"
  | "caretShape"
  | "clear"
  | "clip"
  | "clipPath"
  | "color"
  | "colorScheme"
  | "columnCount"
  | "columnFill"
  | "columnGap"
  | "columnRuleColor"
  | "columnRuleStyle"
  | "columnRuleWidth"
  | "columnSpan"
  | "columnWidth"
  | "contain"
  | "containIntrinsicBlockSize"
  | "containIntrinsicHeight"
  | "containIntrinsicInlineSize"
  | "containIntrinsicWidth"
  | "containerName"
  | "containerType"
  | "content"
  | "contentVisibility"
  | "counterIncrement"
  | "counterReset"
  | "counterSet"
  | "cursor"
  | "direction"
  | "display"
  | "emptyCells"
  | "filter"
  | "flexBasis"
  | "flexDirection"
  | "flexGrow"
  | "flexShrink"
  | "flexWrap"
  | "float"
  | "fontFamily"
  | "fontFeatureSettings"
  | "fontKerning"
  | "fontLanguageOverride"
  | "fontOpticalSizing"
  | "fontPalette"
  | "fontVariationSettings"
  | "fontSize"
  | "fontSizeAdjust"
  | "fontStretch"
  | "fontStyle"
  | "fontSynthesis"
  | "fontVariant"
  | "fontVariantAlternates"
  | "fontVariantCaps"
  | "fontVariantEastAsian"
  | "fontVariantEmoji"
  | "fontVariantLigatures"
  | "fontVariantNumeric"
  | "fontVariantPosition"
  | "fontWeight"
  | "forcedColorAdjust"
  | "gridAutoColumns"
  | "gridAutoFlow"
  | "gridAutoRows"
  | "gridColumnEnd"
  | "gridColumnStart"
  | "gridRowEnd"
  | "gridRowStart"
  | "gridTemplateAreas"
  | "gridTemplateColumns"
  | "gridTemplateRows"
  | "hangingPunctuation"
  | "height"
  | "hyphenateCharacter"
  | "hyphenateLimitChars"
  | "hyphens"
  | "imageOrientation"
  | "imageRendering"
  | "imageResolution"
  | "initialLetter"
  | "initialLetterAlign"
  | "inlineSize"
  | "inputSecurity"
  | "insetBlockEnd"
  | "insetBlockStart"
  | "insetInlineEnd"
  | "insetInlineStart"
  | "isolation"
  | "justifyContent"
  | "justifyItems"
  | "justifySelf"
  | "justifyTracks"
  | "left"
  | "letterSpacing"
  | "lineBreak"
  | "lineClamp"
  | "lineHeight"
  | "lineHeightStep"
  | "listStyleImage"
  | "listStylePosition"
  | "listStyleType"
  | "marginBlockEnd"
  | "marginBlockStart"
  | "marginBottom"
  | "marginInlineEnd"
  | "marginInlineStart"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginTrim"
  | "maskBorderMode"
  | "maskBorderOutset"
  | "maskBorderRepeat"
  | "maskBorderSlice"
  | "maskBorderSource"
  | "maskBorderWidth"
  | "maskClip"
  | "maskComposite"
  | "maskImage"
  | "maskMode"
  | "maskOrigin"
  | "maskPosition"
  | "maskRepeat"
  | "maskSize"
  | "maskType"
  | "masonryAutoFlow"
  | "mathDepth"
  | "mathShift"
  | "mathStyle"
  | "maxBlockSize"
  | "maxHeight"
  | "maxInlineSize"
  | "maxLines"
  | "maxWidth"
  | "minBlockSize"
  | "minHeight"
  | "minInlineSize"
  | "minWidth"
  | "mixBlendMode"
  | "objectFit"
  | "objectPosition"
  | "offsetAnchor"
  | "offsetDistance"
  | "offsetPath"
  | "offsetPosition"
  | "offsetRotate"
  | "opacity"
  | "order"
  | "orphans"
  | "outlineColor"
  | "outlineOffset"
  | "outlineStyle"
  | "outlineWidth"
  | "overflow"
  | "overflowAnchor"
  | "overflowBlock"
  | "overflowClipMargin"
  | "overflowInline"
  | "overflowWrap"
  | "overflowX"
  | "overflowY"
  | "overscrollBehavior"
  | "overscrollBehaviorBlock"
  | "overscrollBehaviorInline"
  | "overscrollBehaviorX"
  | "overscrollBehaviorY"
  | "paddingBlockEnd"
  | "paddingBlockStart"
  | "paddingBottom"
  | "paddingInlineEnd"
  | "paddingInlineStart"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "page"
  | "pageBreakAfter"
  | "pageBreakBefore"
  | "pageBreakInside"
  | "paintOrder"
  | "perspective"
  | "perspectiveOrigin"
  | "pointerEvents"
  | "position"
  | "printColorAdjust"
  | "quotes"
  | "resize"
  | "right"
  | "rotate"
  | "rowGap"
  | "rubyAlign"
  | "rubyMerge"
  | "rubyPosition"
  | "scale"
  | "scrollbarColor"
  | "scrollbarGutter"
  | "scrollbarWidth"
  | "scrollBehavior"
  | "scrollMarginBlockStart"
  | "scrollMarginBlockEnd"
  | "scrollMarginBottom"
  | "scrollMarginInlineStart"
  | "scrollMarginInlineEnd"
  | "scrollMarginLeft"
  | "scrollMarginRight"
  | "scrollMarginTop"
  | "scrollPaddingBlockStart"
  | "scrollPaddingBlockEnd"
  | "scrollPaddingBottom"
  | "scrollPaddingInlineStart"
  | "scrollPaddingInlineEnd"
  | "scrollPaddingLeft"
  | "scrollPaddingRight"
  | "scrollPaddingTop"
  | "scrollSnapAlign"
  | "scrollSnapStop"
  | "scrollSnapType"
  | "scrollTimelineAxis"
  | "scrollTimelineName"
  | "shapeImageThreshold"
  | "shapeMargin"
  | "shapeOutside"
  | "tabSize"
  | "tableLayout"
  | "textAlign"
  | "textAlignLast"
  | "textCombineUpright"
  | "textDecorationColor"
  | "textDecorationLine"
  | "textDecorationSkip"
  | "textDecorationSkipInk"
  | "textDecorationStyle"
  | "textDecorationThickness"
  | "textEmphasisColor"
  | "textEmphasisPosition"
  | "textEmphasisStyle"
  | "textIndent"
  | "textJustify"
  | "textOrientation"
  | "textOverflow"
  | "textRendering"
  | "textShadow"
  | "textSizeAdjust"
  | "textTransform"
  | "textUnderlineOffset"
  | "textUnderlinePosition"
  | "top"
  | "touchAction"
  | "transform"
  | "transformBox"
  | "transformOrigin"
  | "transformStyle"
  | "transitionDelay"
  | "transitionDuration"
  | "transitionProperty"
  | "transitionTimingFunction"
  | "translate"
  | "unicodeBidi"
  | "userSelect"
  | "verticalAlign"
  | "viewTransitionName"
  | "visibility"
  | "whiteSpace"
  | "widows"
  | "width"
  | "willChange"
  | "wordBreak"
  | "wordSpacing"
  | "wordWrap"
  | "writingMode"
  | "zIndex";

export type Unit =
  | "%"
  | "deg"
  | "grad"
  | "rad"
  | "turn"
  | "db"
  | "fr"
  | "hz"
  | "khz"
  | "cm"
  | "mm"
  | "q"
  | "in"
  | "pt"
  | "pc"
  | "px"
  | "em"
  | "rem"
  | "ex"
  | "rex"
  | "cap"
  | "rcap"
  | "ch"
  | "rch"
  | "ic"
  | "ric"
  | "lh"
  | "rlh"
  | "vw"
  | "svw"
  | "lvw"
  | "dvw"
  | "vh"
  | "svh"
  | "lvh"
  | "dvh"
  | "vi"
  | "svi"
  | "lvi"
  | "dvi"
  | "vb"
  | "svb"
  | "lvb"
  | "dvb"
  | "vmin"
  | "svmin"
  | "lvmin"
  | "dvmin"
  | "vmax"
  | "svmax"
  | "lvmax"
  | "dvmax"
  | "cqw"
  | "cqh"
  | "cqi"
  | "cqb"
  | "cqmin"
  | "cqmax"
  | "dpi"
  | "dpcm"
  | "dppx"
  | "x"
  | "st"
  | "s"
  | "ms";
