//  Created by Pieter Omvlee on 3/9/08.
//  Copyright 2008 Bohemian Coding. All rights reserved.

@interface NSString (BCFoundation)

#pragma mark - General Utilities

+ (NSString *)stringRepresentationForSeconds:(NSUInteger)numberOfSeconds;
- (NSString *)stringByDeletingPrefix:(NSString *)prefix;
- (NSString *)stringByDeletingSuffix:(NSString *)suffix;
- (NSString *)stringByStrippingStrings:(NSArray <NSString*> *)strings;

- (NSString *)stringByAppendingPathComponents:(NSArray *)components;

- (BOOL)startsWith:(NSString *)str;
- (BOOL)endsWith:(NSString *)str;
- (BOOL)endsWith:(NSString *)str options:(NSStringCompareOptions)options;

- (BOOL)containsSubstring:(NSString *)sub;
- (BOOL)containsCharacter:(unichar)c;

- (NSString *)stringWithFirstCharacterLowercase;
- (NSString *)trimmedString;
- (NSDictionary *)splitByBaseAndNumber;
- (NSString *)uniqueStringComparedToStrings:(NSSet *)strings includeCopySuffix:(BOOL)shouldAppendCopySuffix;
+ (NSString *)stringWithPrefix:(NSString *)front number:(NSInteger)number;

- (NSArray *)words;

/**
 Like substringToIndex:, but ensures that we don't split 4 byte characters, combining characters, grapheme clusters, etc in half.
 @param index The index at which to split the string.
 @return Returns a new string containing the characters of the receiver up to, but not including, the one at \c index. Where
 \c index splits a character the result will "round up" to include the full character.
 */
- (NSString *)safeSubstringToIndex_ms:(NSUInteger)index;

/**
 Like substringFromIndex:, but ensures that we don't split 4 byte characters, combining characters, grapheme clusters, etc in half.
 @param index The index at which to split the string.
 @return Returns a new string containing the characters of the receiver coming after and including the one at \c index. Where
 \c index splits a character the result will "round up" to the start of the next character.
 */
- (NSString *)safeSubstringFromIndex_ms:(NSUInteger)index;

/**
 Like safeSubstringWithRange_ms:, but ensures that we don't split 4 byte characters, combining characters, grapheme clusters, etc in half.
 @param range The range of characters required.
 @return Returns a new string containing the characters within \c range. Where a character is split at the start of the range the result
 will "round up" to start on the next character. Where a character is split at the end the result will "round up" to include the whole
 character.
 */
- (NSString *)safeSubstringWithRange_ms:(NSRange)range;

#pragma mark - Path Utilities

- (NSString *)parent;
- (NSString *)child:(NSString *)childName;
- (NSString *)extension;
- (NSString *)withoutExtension;
- (NSString *)withExtension:(NSString *)extension;
- (NSString *)expandTilde;
- (BOOL)hasExtension:(NSString *)extension;

#pragma mark - Mail Validation
- (BOOL)isValidEmailAddress;
@end

