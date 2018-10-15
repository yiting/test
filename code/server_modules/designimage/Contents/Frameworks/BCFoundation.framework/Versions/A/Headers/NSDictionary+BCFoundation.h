//  Created by Johnnie Walker on 17/02/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

/** Signature of a block for enumerating through dictionary objects and their keys returning a BOOL.*/
typedef BOOL (^BCDictionaryFilterBlock)(NSString *key, id object);

@interface NSDictionary (BCFoundation)

/// Returns a string for `aKey`, or nil if the receiver has no value for `aKey`, or that object value is not a string
- (NSString *)stringForKey_bc:(id)aKey;

/// Returns an array for `aKey`, or nil if the receiver has no value for `aKey`, or that object value is not an array
- (NSArray *)arrayForKey_bc:(id)aKey;

/// Returns a dictionary for `aKey`, or nil if the receiver has no value for `aKey`, or that object value is not a dictionary
- (NSDictionary *)dictionaryForKey_bc:(id)aKey;

/// Returns a number for `aKey`, or nil if the receiver has no value for `aKey`, or that object value is not a number
- (NSNumber *)numberForKey_bc:(id)aKey;

/// Returns a boolean for `aKey` by calling `boolValue on ``numberForKey_bc`
- (BOOL)boolForKey_bc:(id)aKey;

/// Returns a URL for `aKey`, or nil if the receiver has no value for `aKey`, or that object value cannot be made into an URL
- (NSURL *)urlForKey_bc:(id)key;

/// Returns a new dictionary with the given object. If the object is nil, the key removed.
- (instancetype)dictionaryByAddingOrRemovingObject:(id)object forKey:(id<NSCopying>)key;

/// Returns a new mutable deep copy of itself
- (id)mutableCopyDeep;

///Returns a new dictionary where the objects/keys from the 'dictionary' have been added to the receiver
///In case of identical keys, the dictionary wins and will 'overwrite' the receiver
- (NSDictionary *)dictionaryByAddingDictionary:(NSDictionary *)dictionary;

/** Call a block for every item in the dictionary, returning a new dictionary with the items where the block returned YES. */
- (NSDictionary *)filter:(BCDictionaryFilterBlock)block;

/**
 Helper method for replacing a key in a dictionary with something else.
 If \c key is found in the dictionary a mutable copy is made, the key removed and the new dictionary is passed to the block along
 with the object which has just been removed. A suitable replacement object can thereby be added to the dictionary.
 If \c key is not found then the original dictionary is returned.
 */
- (NSDictionary*)dictionaryByReplacing:(id<NSCopying>)key usingBlock:(void(^)(id,NSMutableDictionary*))block;

/**
 Returns a dictionary renaming the key values using map.
 For instance, if our dictionary is {"a" : "b"} and map is {"a" : "x"} the returned dictionary would be {"x" : "b"}
 It's up to the caller to ensure that values in the mapping are unique
 */
- (NSDictionary*)dictionaryByMappingKeys_bc:(NSDictionary< id<NSCopying>, id<NSCopying> > *)map;

/**
 The same as dictionaryByMappingKeys but in reverse.
 For instance, if our dictionary is {"x" : "b"} and map is {"a" : "x"} the returned dictionary would be {"a" : "b"}
 It's up to the caller to ensure that values in the mapping are unique
 */
- (NSDictionary*)dictionaryByReverseMappingKeys_bc:(NSDictionary< id<NSCopying>, id<NSCopying> > *)map;

@end

@interface NSMutableDictionary (BCFoundation)
- (id)objectForKey:(NSString *)aKey orBySettingMissingObject:(id)anObject;
- (void)addObject:(id)anObject forKey:(id<NSCopying>)aKey;
@end
