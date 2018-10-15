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

