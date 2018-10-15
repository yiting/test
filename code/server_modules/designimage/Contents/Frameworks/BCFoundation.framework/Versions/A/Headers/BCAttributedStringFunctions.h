//
//  Created by Johnnie Walker on 10/08/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

typedef NS_ENUM(NSInteger, BCAttributeMatchResult) {
  BCAttributeMatchResultMixed = -1,
  BCAttributeMatchResultNone = 0,
  BCAttributeMatchResultMatched = 1,
};

/**
 Enumerates the attribute \p attributeName in \p attributedString for matches with \p value.
 @discussion This function searches for matching attributes in an attributed string. 
 Returning BCAttributeMatchResultNone if \p attributedString does not have an attribute named \p attributeName with the value \p value,
 BCAttributeMatchResultMatched if \p attributedString has \p attributeName with the value \p value exclusively throughout its range
 and BCAttributeMatchResultMixed if \p attributedString has \p attributeName with the value non-exclusively throughout its range
 if the attribute exists, but is not the only value for \p attributeName
 @param attributedString the attributed string
 @param attributeName the attribute search
 @param value the value to match for \p attributeName
 @return an attribute match result
 */
BCAttributeMatchResult BCAttributeMatchForAttributedString(NSAttributedString * _Nonnull attributedString, NSString *_Nonnull attributeName, id _Nullable value);

/**
 Enumerates the attribute \p attributeName in \p attributedStrings for matches with \p value.
 @discussion This function is identical to BCAttributeMatchForAttributedString, but acts over multiple attributed strings.
 @param attributedString the attributed string
 @param attributeName the attribute search
 @param value the value to match for \p attributeName
 @return an attribute match result
 */
BCAttributeMatchResult BCAttributeMatchForAttributedStrings(NSArray <NSAttributedString *> * _Nonnull attributedString, NSString *  _Nonnull attributeName, id _Nullable value);


/**
 Returns the value of the first attribute matching \p aName in \p textLayer's attributed string, or nil if there is no such attribute
 @param attributedString attributed string
 @param aName the attribute key
 @return the value for \p aName in \p attributedString
 */
id _Nullable BCAttributedStringFirstAttributeForKey(NSAttributedString * _Nonnull attributedString, NSString * _Nonnull aName);
